import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from '../_shared/cors.ts'

const openAIApiKey = Deno.env.get('OPENAI_API_KEY')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { fileContent, documentType } = await req.json()

    const systemPrompt = documentType === 'facesheet' 
      ? `You are a medical document analyzer specialized in facesheets. Extract medical conditions, medications, allergies, and vital information from the facesheet.`
      : `You are a medical document analyzer. Extract relevant medical information from ${documentType}.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `${systemPrompt}
                     Format the response as JSON with the following structure:
                     {
                       "medicalConditions": string[],
                       "medications": string[],
                       "allergies": string[],
                       "vitalSigns": {
                         "height": string?,
                         "weight": string?,
                         "bloodPressure": string?,
                         "pulse": string?,
                         "temperature": string?,
                         "respiratoryRate": string?
                       },
                       "additionalNotes": string[],
                       "confidence": number
                     }`
          },
          {
            role: 'user',
            content: fileContent
          }
        ],
      }),
    })

    const data = await response.json()
    console.log('AI Analysis Response:', data)
    
    const analysis = JSON.parse(data.choices[0].message.content)
    return new Response(JSON.stringify(analysis), {
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