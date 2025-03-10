
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
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
    const { text, operation, recipient, topic } = await req.json()
    const openAIKey = Deno.env.get('OPENAI_API_KEY')

    if (!openAIKey) {
      throw new Error('OpenAI API key not configured')
    }

    let prompt = ""
    if (operation === "autocorrect") {
      prompt = `Correct any spelling, grammar, or punctuation errors in the following text while preserving its meaning. Only make necessary corrections: "${text}"`
    } else if (operation === "generate") {
      prompt = `Generate a professional message to ${recipient || "a colleague"} about ${topic || "a work-related topic"}. Keep it concise, friendly, and professional.`
    } else {
      throw new Error('Invalid operation. Use "autocorrect" or "generate".')
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
            content: 'You are a helpful assistant that helps with message composition and correction. For corrections, only fix actual errors while preserving the original meaning and tone. For message generation, create professional workplace messages.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: operation === "autocorrect" ? 0.2 : 0.7,
      }),
    })

    const data = await response.json()
    const result = data.choices[0].message.content.trim()

    return new Response(
      JSON.stringify({ text: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('Error in message-ai function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      },
    )
  }
})
