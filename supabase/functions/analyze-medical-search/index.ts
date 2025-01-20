import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
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
    const { searchTerm, type } = await req.json()
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const openAIKey = Deno.env.get('OPENAI_API_KEY')

    if (!supabaseUrl || !supabaseKey || !openAIKey) {
      throw new Error('Missing environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get existing medications from the database
    const { data: medications, error: dbError } = await supabase
      .from('medications')
      .select('*')

    if (dbError) {
      throw dbError
    }

    // Use OpenAI to analyze the search term and find relevant matches
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
            content: type === 'medication' 
              ? 'You are a medical assistant helping to find relevant medications based on search terms. Return only medication names that match the search criteria.'
              : 'You are a medical assistant helping to find relevant medical conditions based on search terms. Return only condition names that match the search criteria.'
          },
          {
            role: 'user',
            content: `Search term: "${searchTerm}". Available ${type === 'medication' ? 'medications' : 'conditions'}: ${
              type === 'medication' 
                ? medications.map(m => m.generic_name).join(', ')
                : 'All standard ICD-10 codes and conditions'
            }`
          }
        ],
      }),
    })

    const aiResponse = await response.json()
    const suggestions = aiResponse.choices[0].message.content.split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0)

    // If searching for medications, get full details for suggested medications
    let results = []
    if (type === 'medication') {
      results = medications.filter(med => 
        suggestions.some(s => 
          med.generic_name.toLowerCase().includes(s.toLowerCase()) ||
          (med.brand_names || []).some(b => b.toLowerCase().includes(s.toLowerCase()))
        )
      )
    } else {
      results = suggestions
    }

    console.log(`Search completed for term: ${searchTerm}, type: ${type}, found ${results.length} results`)

    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('Error in analyze-medical-search:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      },
    )
  }
})