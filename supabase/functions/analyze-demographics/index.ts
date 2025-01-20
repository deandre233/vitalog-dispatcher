import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { patientId } = await req.json()
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch patient data
    const { data: patient, error: patientError } = await supabaseClient
      .from('patients')
      .select(`
        *,
        medical_history (
          id,
          type,
          description,
          date
        ),
        insurance_records (
          id,
          type,
          carrier_name,
          policy_number
        )
      `)
      .eq('id', patientId)
      .single()

    if (patientError) throw patientError

    // Analyze patient data for completeness and suggestions
    const suggestions = []
    const warnings = []

    // Check for missing critical information
    if (!patient.phone) warnings.push('Missing contact phone number')
    if (!patient.email) warnings.push('Missing email address')
    if (!patient.emergency_contact_name) warnings.push('Missing emergency contact')
    
    // Check medical history
    const lastVisit = patient.medical_history?.[0]?.date
    if (!lastVisit) {
      warnings.push('No medical history records found')
    } else {
      const daysSinceLastVisit = Math.floor((Date.now() - new Date(lastVisit).getTime()) / (1000 * 60 * 60 * 24))
      if (daysSinceLastVisit > 365) {
        suggestions.push(`Last visit was ${daysSinceLastVisit} days ago. Consider scheduling a check-up.`)
      }
    }

    // Check insurance information
    if (!patient.insurance_records?.length) {
      warnings.push('No insurance records found')
    } else {
      const primaryInsurance = patient.insurance_records.find(r => r.type === 'primary')
      if (!primaryInsurance) {
        suggestions.push('Consider adding primary insurance information')
      }
    }

    // Format response
    const analysis = {
      patientId,
      completeness: {
        demographic: patient.dob && patient.gender ? 'complete' : 'incomplete',
        contact: patient.phone && patient.email ? 'complete' : 'incomplete',
        insurance: patient.insurance_records?.length > 0 ? 'complete' : 'incomplete',
        medical: patient.medical_history?.length > 0 ? 'complete' : 'incomplete'
      },
      suggestions,
      warnings
    }

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})