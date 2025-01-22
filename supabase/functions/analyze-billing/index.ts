import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    const { metrics } = await req.json();
    console.log('Analyzing metrics:', metrics);

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
            content: `You are an advanced medical billing AI analyst. Analyze billing metrics and provide insights in this structured format:
            1. Key Performance Indicators (KPIs)
            2. Workflow Efficiency Analysis
            3. Revenue Cycle Insights
            4. Risk Alerts
            5. Optimization Recommendations
            
            Keep insights concise and actionable. Focus on patterns, anomalies, and opportunities for improvement.`
          },
          {
            role: "user",
            content: `Analyze these billing metrics and provide structured insights: ${JSON.stringify(metrics)}`
          }
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    console.log('AI Analysis Response:', data);

    // Process the response to ensure it's properly structured
    const insights = data.choices[0].message.content;
    const sections = insights.split('\n\n').map(section => section.trim());

    return new Response(JSON.stringify({ 
      insights,
      sections,
      timestamp: new Date().toISOString(),
      metrics_analyzed: Object.keys(metrics).length,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-billing function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});