import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const { insuranceData, patientInfo } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get similar insurance records for context
    const { data: similarRecords } = await supabase
      .from('insurance_records')
      .select(`
        *,
        carrier:insurance_carriers(*),
        policy:policy_types(*),
        group:insurance_groups(*)
      `)
      .limit(5);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an expert in healthcare insurance analysis. Analyze the provided insurance information and patient data to:
            1. Validate insurance information completeness and accuracy
            2. Suggest improvements or missing information
            3. Identify potential coverage gaps
            4. Recommend optimal insurance configurations
            5. Flag any compliance issues
            
            Similar records for context:
            ${JSON.stringify(similarRecords, null, 2)}
            
            Return a JSON object with these fields:
            {
              "validation": { "status": "valid|incomplete|invalid", "issues": [] },
              "suggestions": [],
              "coverage_gaps": [],
              "optimization": { "recommendations": [], "potential_savings": string },
              "compliance": { "flags": [], "required_actions": [] }
            }`
          },
          {
            role: "user",
            content: `Analyze this insurance setup:
            Patient Info: ${JSON.stringify(patientInfo, null, 2)}
            Insurance Data: ${JSON.stringify(insuranceData, null, 2)}`
          }
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    console.log('OpenAI Response:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    const analysis = JSON.parse(data.choices[0].message.content);

    // Store the analysis in the database for future reference
    const { error: insertError } = await supabase
      .from('insurance_analysis')
      .insert({
        patient_id: patientInfo.id,
        analysis_data: analysis,
        created_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Error storing analysis:', insertError);
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});