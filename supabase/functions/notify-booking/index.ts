import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userName, meetingDate, platform, notes } = await req.json()

    if (!userName || !meetingDate) {
      return new Response(
        JSON.stringify({ error: 'userName and meetingDate are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const resendKey = Deno.env.get('RESEND_API_KEY')
    const fromAddress = Deno.env.get('RESEND_FROM') || 'Verdant <onboarding@resend.dev>'

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    // Collect admin emails
    const { data: adminRoles } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin')

    const adminEmails: string[] = []
    if (adminRoles) {
      for (const role of adminRoles) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', role.user_id)
          .single()
        if (profile?.email) adminEmails.push(profile.email)
      }
    }

    const formattedDate = new Date(meetingDate).toLocaleString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })

    const subject = `New Consultation Booking - ${userName}`
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background: #ffffff; color: #1a1a1a;">
        <h2 style="font-family: Georgia, serif; color: #2d4a2b; margin: 0 0 16px;">New Consultation Booking</h2>
        <p style="font-size: 14px; line-height: 1.6;">A new consultation has been booked on Verdant.</p>
        <table style="width:100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding:8px 0; color:#666; width:120px;">Client</td><td style="padding:8px 0; font-weight:bold;">${userName}</td></tr>
          <tr><td style="padding:8px 0; color:#666;">Date &amp; Time</td><td style="padding:8px 0; font-weight:bold;">${formattedDate}</td></tr>
          <tr><td style="padding:8px 0; color:#666;">Platform</td><td style="padding:8px 0;">${platform || 'Not specified'}</td></tr>
          <tr><td style="padding:8px 0; color:#666; vertical-align:top;">Notes</td><td style="padding:8px 0;">${notes || '—'}</td></tr>
        </table>
        <p style="font-size: 12px; color:#888; margin-top: 24px;">Manage this booking in the Verdant admin dashboard.</p>
      </div>
    `

    let emailResult: any = { skipped: true, reason: 'No RESEND_API_KEY or no admin emails' }

    if (resendKey && adminEmails.length > 0) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromAddress,
          to: adminEmails,
          subject,
          html,
        }),
      })
      emailResult = await res.json()
      if (!res.ok) {
        console.error('Resend error:', emailResult)
        return new Response(
          JSON.stringify({ success: false, error: emailResult, adminCount: adminEmails.length }),
          { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      console.log('Resend email sent:', emailResult)
    } else {
      console.log('Email skipped:', emailResult.reason, 'admins:', adminEmails.length)
    }

    return new Response(
      JSON.stringify({ success: true, adminCount: adminEmails.length, emailResult }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in notify-booking:', error)
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
