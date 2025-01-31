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
    const { partnerData } = await req.json()
    const openAIKey = Deno.env.get('OPENAI_API_KEY')

    if (!openAIKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Analyze partner data using GPT-4
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
            content: 'You are an AI business analyst specializing in partner relationship management. Analyze the partner data and provide insights.'
          },
          {
            role: 'user',
            content: `Analyze this partner data and provide insights about performance, risks, and recommendations: ${JSON.stringify(partnerData)}`
          }
        ],
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    const analysis = data.choices[0].message.content

    // Structure the analysis
    const structuredAnalysis = {
      recommendations: analysis.split('\n').filter(line => line.includes('Recommendation:')),
      riskAssessment: analysis.includes('high risk') ? 'high' : analysis.includes('medium risk') ? 'medium' : 'low',
      partnershipScore: calculatePartnershipScore(partnerData),
      nextReviewDate: calculateNextReviewDate(partnerData),
    }

    return new Response(JSON.stringify(structuredAnalysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in analyze-partner function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

function calculatePartnershipScore(partnerData: any): number {
  // Implement scoring logic based on various factors
  let score = 80 // Base score
  
  // Adjust based on interaction recency
  if (partnerData.last_interaction) {
    const daysSinceLastInteraction = (new Date().getTime() - new Date(partnerData.last_interaction).getTime()) / (1000 * 60 * 60 * 24)
    score -= Math.min(20, daysSinceLastInteraction / 30 * 20) // Reduce score by up to 20 points based on interaction recency
  }

  // Adjust based on contract status
  if (partnerData.contract_end_date) {
    const daysUntilContractEnd = (new Date(partnerData.contract_end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    if (daysUntilContractEnd < 30) {
      score -= 15 // Contract ending soon
    }
  }

  return Math.max(0, Math.min(100, score)) // Ensure score is between 0 and 100
}

function calculateNextReviewDate(partnerData: any): string {
  const today = new Date()
  let reviewDate = new Date(today)

  // Set review date based on risk level and last review
  if (partnerData.risk_assessment === 'high') {
    reviewDate.setDate(today.getDate() + 30) // Review high-risk partners monthly
  } else if (partnerData.risk_assessment === 'medium') {
    reviewDate.setDate(today.getDate() + 90) // Review medium-risk partners quarterly
  } else {
    reviewDate.setDate(today.getDate() + 180) // Review low-risk partners semi-annually
  }

  return reviewDate.toISOString().split('T')[0]
}