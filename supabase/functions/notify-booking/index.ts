import { corsHeaders } from '@supabase/supabase-js/cors'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    const supabase = createClient(supabaseUrl, serviceRoleKey)

    // Get all admin user IDs
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

    // ─────────────────────────────────────────────
    // EMAIL SETUP INSTRUCTIONS
    // ─────────────────────────────────────────────
    // To enable actual email delivery:
    //
    // 1. Set up a custom email domain in Lovable Cloud → Emails
    //    (e.g., notify.yourdomain.com)
    //
    // 2. Configure DNS records as instructed by Lovable
    //
    // 3. Once the domain is verified, use Lovable's
    //    scaffold_transactional_email tool to create
    //    a proper email template and sending pipeline.
    //
    // 4. For now, this function logs the email details
    //    and creates in-app notifications instead.
    //
    // DEMO EMAIL DOMAIN: notify.demo-verdant.com
    // (Replace with your actual domain when ready)
    // ─────────────────────────────────────────────

    const formattedDate = new Date(meetingDate).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    // Log the email that would be sent (for demo purposes)
    console.log('=== BOOKING EMAIL ALERT ===')
    console.log(`To: ${adminEmails.join(', ') || 'No admin emails found'}`)
    console.log(`Subject: New Consultation Booking - ${userName}`)
    console.log(`Body:`)
    console.log(`  A new consultation has been booked:`)
    console.log(`  - Client: ${userName}`)
    console.log(`  - Date: ${formattedDate}`)
    console.log(`  - Platform: ${platform || 'Not specified'}`)
    console.log(`  - Notes: ${notes || 'None'}`)
    console.log(`  - Admin Dashboard: ${supabaseUrl?.replace('.supabase.co', '')}/admin`)
    console.log('==========================')

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Booking notification processed',
        adminCount: adminEmails.length,
        // When email domain is set up, actual emails will be sent here
        emailPreview: {
          to: adminEmails,
          subject: `New Consultation Booking - ${userName}`,
          body: `Client: ${userName}\nDate: ${formattedDate}\nPlatform: ${platform}\nNotes: ${notes || 'None'}`,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in notify-booking:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
