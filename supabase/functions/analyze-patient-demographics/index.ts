import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import "https://deno.land/x/xhr@0.1.0/mod.ts"

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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch all patients
    const { data: patients, error: patientError } = await supabaseClient
      .from('patients')
      .select(`
        *,
        medical_records (count),
        appointments (count)
      `)

    if (patientError) throw patientError

    // Analyze patient demographics and patterns
    const analysis = {
      totalPatients: patients.length,
      activePatients: patients.filter(p => {
        const lastYear = new Date()
        lastYear.setFullYear(lastYear.getFullYear() - 1)
        return p.last_physical && new Date(p.last_physical) > lastYear
      }).length,
      missingInfo: patients.filter(p => !p.phone || !p.email || !p.address).length,
      noRecentVisit: patients.filter(p => !p.last_physical).length,
    }

    // Generate insights based on analysis
    const insights = []
    
    if (analysis.missingInfo > 0) {
      insights.push({
        message: `${analysis.missingInfo} patients have incomplete contact information`,
        confidence_score: 1.0,
        prediction: 'data_quality_issue',
        recommendation: 'Consider implementing a data completion campaign'
      })
    }

    if (analysis.noRecentVisit > 0) {
      insights.push({
        message: `${analysis.noRecentVisit} patients haven't had a recent check-up`,
        confidence_score: 0.9,
        prediction: 'retention_risk',
        recommendation: 'Implement a patient re-engagement program'
      })
    }

    const activeRatio = analysis.activePatients / analysis.totalPatients
    if (activeRatio < 0.7) {
      insights.push({
        message: `Only ${Math.round(activeRatio * 100)}% of patients are actively engaged`,
        confidence_score: 0.85,
        prediction: 'engagement_issue',
        recommendation: 'Review patient engagement strategy'
      })
    }

    // Store insights in the database
    for (const insight of insights) {
      const { error: insertError } = await supabaseClient
        .from('ai_analysis_results')
        .insert({
          analysis_type: 'patient_demographics',
          suggestions: [insight.message],
          confidence_score: insight.confidence_score,
          prediction: insight.prediction,
          recommendation: insight.recommendation,
          metadata: analysis
        })

      if (insertError) throw insertError
    }

    return new Response(
      JSON.stringify({ success: true, insights }),
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