import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
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
    
    // First try exact match in our database
    const exactMatch = payerDatabase.find(p => p.payerId === payerId)
    if (exactMatch) {
      return new Response(JSON.stringify({
        carrier_type: exactMatch.carrierType,
        carrier_name: exactMatch.carrierName,
        policy_type: exactMatch.policyType
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // If no exact match, use OpenAI to analyze
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set')
    }

    // Use similar payer IDs from our database to help GPT make better predictions
    const similarPayers = payerDatabase
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
            Here are some similar payer IDs from our database for reference:
            ${JSON.stringify(similarPayers, null, 2)}`
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

    return new Response(JSON.stringify(aiResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})