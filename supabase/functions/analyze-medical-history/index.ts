import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { searchTerm } = await req.json()
    const openAIKey = Deno.env.get('OPENAI_API_KEY')

    if (!openAIKey) {
      throw new Error('Missing OpenAI API key')
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a medical coding assistant. When given a medical condition or procedure, return the top 10 most relevant ICD-10 codes with their descriptions. Format the response as a JSON array with objects containing code and description fields.'
          },
          {
            role: 'user',
            content: `Find relevant ICD-10 codes for: ${searchTerm}`
          }
        ],
      }),
    })

    const aiResponse = await response.json()
    const suggestions = JSON.parse(aiResponse.choices[0].message.content)

    console.log(`Medical history search completed for term: ${searchTerm}, found ${suggestions.length} results`)

    return new Response(
      JSON.stringify({ results: suggestions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('Error in analyze-medical-history:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      },
    )
  }
})