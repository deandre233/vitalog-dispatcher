import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { payerDatabase } from './payerDatabase.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { payerId } = await req.json()
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // First check our dynamic database
    const { data: dbMatch, error: dbError } = await supabase
      .from('payer_database')
      .select('*')
      .eq('payer_id', payerId)
      .order('confidence', { ascending: false })
      .limit(1)
      .single()
    
    if (dbMatch) {
      return new Response(JSON.stringify({
        carrier_type: dbMatch.carrier_type,
        carrier_name: dbMatch.carrier_name,
        policy_type: dbMatch.policy_type,
        confidence: dbMatch.confidence
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Then check our static database
    const staticMatch = payerDatabase.find(p => p.payerId === payerId)
    if (staticMatch) {
      // Store this in our dynamic database with high confidence
      await supabase
        .from('payer_database')
        .insert({
          payer_id: payerId,
          carrier_type: staticMatch.carrierType,
          carrier_name: staticMatch.carrierName,
          policy_type: staticMatch.policyType,
          confidence: 1.0,
          last_verified: new Date().toISOString()
        })

      return new Response(JSON.stringify({
        carrier_type: staticMatch.carrierType,
        carrier_name: staticMatch.carrierName,
        policy_type: staticMatch.policyType,
        confidence: 1.0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // If no exact match, use OpenAI to analyze
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set')
    }

    // Get similar payer IDs from both databases to help GPT
    const { data: similarDbPayers } = await supabase
      .from('payer_database')
      .select('*')
      .order('confidence', { ascending: false })
      .limit(5)

    const similarStaticPayers = payerDatabase
      .filter(p => p.payerId.startsWith(payerId.substring(0, 2)))
      .slice(0, 5)

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert in healthcare insurance payer IDs. Analyze the given payer ID and return carrier information.
            Here are some similar payer IDs from our databases for reference:
            Dynamic database entries:
            ${JSON.stringify(similarDbPayers, null, 2)}
            Static database entries:
            ${JSON.stringify(similarStaticPayers, null, 2)}`
          },
          {
            role: "user",
            content: `Analyze this payer ID and return insurance information: ${payerId}`
          }
        ],
        temperature: 0.3,
      }),
    })

    const data = await response.json()
    const aiResponse = JSON.parse(data.choices[0].message.content)
    
    // Store AI's analysis in our database with lower confidence
    await supabase
      .from('payer_database')
      .insert({
        payer_id: payerId,
        carrier_type: aiResponse.carrier_type,
        carrier_name: aiResponse.carrier_name,
        policy_type: aiResponse.policy_type,
        confidence: 0.7, // Lower confidence for AI-generated entries
        last_verified: new Date().toISOString()
      })

    return new Response(JSON.stringify({
      ...aiResponse,
      confidence: 0.7
    }), {
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