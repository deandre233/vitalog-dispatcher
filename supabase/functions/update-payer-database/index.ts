import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { payerId, carrierType, carrierName, policyType, confidence } = await req.json()
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Check if this payer ID already exists in our database
    const { data: existingEntry, error: fetchError } = await supabase
      .from('payer_database')
      .select('*')
      .eq('payer_id', payerId)
      .single()
    
    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found" error
      throw fetchError
    }

    if (existingEntry) {
      // Update confidence if the new entry has higher confidence
      if (confidence > existingEntry.confidence) {
        const { error: updateError } = await supabase
          .from('payer_database')
          .update({
            carrier_type: carrierType,
            carrier_name: carrierName,
            policy_type: policyType,
            confidence: confidence,
            last_verified: new Date().toISOString()
          })
          .eq('payer_id', payerId)

        if (updateError) throw updateError
      }
    } else {
      // Insert new entry
      const { error: insertError } = await supabase
        .from('payer_database')
        .insert({
          payer_id: payerId,
          carrier_type: carrierType,
          carrier_name: carrierName,
          policy_type: policyType,
          confidence: confidence,
          last_verified: new Date().toISOString()
        })

      if (insertError) throw insertError
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})