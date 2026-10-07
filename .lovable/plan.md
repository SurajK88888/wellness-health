# Personalized wellness reading plan

## Goal
Let signed-in readers describe their wellness goals and interests, then create a reading plan grounded only in public Health Guide content.

## Planned changes
- Add a goals and interests form to the existing Profile page, with saved inputs and plan stored in the reader's existing private profile preferences.
- Add an authenticated Supabase Edge Function that verifies the caller, reads available public guide records, validates and bounds the submitted goal data, and streams a structured plan from Lovable AI before returning it.
- Show the generated plan with guide titles, practical sequence, and links that open the referenced guide; preserve helpful loading, empty, and safe error states.
- Keep existing sign-in, profile fields, Health Guide catalog, and theme unchanged; use existing RLS for private profile storage and public guide reads.

## Technical details
- Reuse `profiles.preferences` instead of adding a table or storing health goals in browser storage; update preferences without overwriting existing wellness interests.
- Use the Classic project's Supabase Edge Function boundary for all prompts and gateway secrets. Verify the user from the incoming Supabase session and query only catalog content the user is permitted to read.
- Use the assigned `openai/gpt-6-astra` model through the Lovable AI Gateway; never expose its key or prompts in client code.
- Treat reader-entered text and stored guide content as untrusted, cap input and source lengths, require plan references to match the supplied guides, and present the result as educational content rather than medical advice.

## Verification
- Confirm the generated plan is tied to the signed-in user, references only fetched guide IDs, and can be opened from the Health Guide page.
- Run relevant tests and inspect preview/build diagnostics; an actual gateway response can only be verified when the gateway key and Edge Function deployment are available.