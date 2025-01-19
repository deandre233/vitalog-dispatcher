import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { field, value, patientData } = await req.json()

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check for duplicates
    if (field === 'phone' || field === 'email') {
      const { data: duplicates } = await supabase
        .from('patients')
        .select('id, first_name, last_name')
        .eq(field, value)
        .neq('id', patientData.id)
        .limit(1)

      if (duplicates?.length > 0) {
        return new Response(
          JSON.stringify({
            type: 'warning',
            message: `Possible duplicate found: ${duplicates[0].first_name} ${duplicates[0].last_name} has the same ${field}`
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Validate phone number format
    if (field === 'phone') {
      const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/
      if (!phoneRegex.test(value)) {
        return new Response(
          JSON.stringify({
            type: 'error',
            message: 'Phone number should be in format (XXX) XXX-XXXX'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Validate zip code and fetch location data
    if (field === 'zip') {
      const zipRegex = /^\d{5}$/
      if (!zipRegex.test(value)) {
        return new Response(
          JSON.stringify({
            type: 'error',
            message: 'ZIP code should be 5 digits'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Here you could integrate with a ZIP code API to get city/state
      // For now, returning mock data
      return new Response(
        JSON.stringify({
          type: 'success',
          data: {
            city: 'Atlanta',
            state: 'GA',
            county: 'Fulton'
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check for missing critical information
    const criticalFields = ['phone', 'email', 'address', 'emergency_contact_name', 'emergency_contact_phone']
    const missingFields = criticalFields.filter(field => !patientData[field])
    
    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({
          type: 'warning',
          message: `Missing critical information: ${missingFields.join(', ')}`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ type: 'success' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in analyze-demographics:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})