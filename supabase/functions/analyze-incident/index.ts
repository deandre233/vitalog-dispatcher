
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const openaiApiKey = Deno.env.get("OPENAI_API_KEY") || "";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request body
    const { incidentType, description, severity, vehicleInvolved, shiftData } = await req.json();
    
    if (!incidentType || !description) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    console.log(`Analyzing incident of type ${incidentType}`);
    
    // Call OpenAI API
    let analysis = {
      summary: "Incident analysis not available.",
      riskLevel: "medium",
      recommendedActions: ["Document the incident", "Follow up with supervisor"],
      similarIncidents: "No similar incidents detected",
      preventionTips: ["Follow standard protocols", "Ensure proper training"]
    };
    
    if (openaiApiKey) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${openaiApiKey}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "You are an expert in EMS incident analysis. Analyze the provided incident information and provide a risk assessment, recommended actions, and prevention tips."
              },
              {
                role: "user",
                content: `Analyze this EMS incident:
                Type: ${incidentType}
                Description: ${description}
                Severity: ${severity}
                Vehicle Involved: ${vehicleInvolved ? 'Yes' : 'No'}
                Shift Information: ${JSON.stringify(shiftData || {})}
                
                Provide:
                1. A brief summary
                2. Risk level (low, medium, high)
                3. 3-5 specific recommended actions
                4. Similar incident patterns if any
                5. 3-5 prevention tips tailored to this incident type`
              }
            ],
            max_tokens: 500
          })
        });
        
        const aiResult = await response.json();
        
        if (aiResult.choices && aiResult.choices[0] && aiResult.choices[0].message) {
          const content = aiResult.choices[0].message.content;
          
          // Extract sections from the AI response
          const summaryMatch = content.match(/(?:summary|brief summary):\s*(.*?)(?:\n\n|\n\d|$)/is);
          const riskMatch = content.match(/(?:risk level|risk assessment):\s*(low|medium|high)/i);
          const actionsMatch = content.match(/(?:recommended actions|specific recommended actions):\s*([\s\S]*?)(?:\n\n|\n\d|$)/i);
          const patternsMatch = content.match(/(?:similar incident patterns|similar incidents):\s*([\s\S]*?)(?:\n\n|\n\d|$)/i);
          const preventionMatch = content.match(/(?:prevention tips):\s*([\s\S]*?)(?:\n\n|$)/i);
          
          // Parse actions and prevention tips into arrays
          const parseList = (text) => {
            if (!text) return [];
            return text.split(/\n/).map(item => 
              item.replace(/^[-*\d.)\s]+/, '').trim()
            ).filter(item => item.length > 0);
          };
          
          analysis = {
            summary: summaryMatch ? summaryMatch[1].trim() : "Analysis completed.",
            riskLevel: riskMatch ? riskMatch[1].toLowerCase() : "medium",
            recommendedActions: actionsMatch ? parseList(actionsMatch[1]) : analysis.recommendedActions,
            similarIncidents: patternsMatch ? patternsMatch[1].trim() : analysis.similarIncidents,
            preventionTips: preventionMatch ? parseList(preventionMatch[1]) : analysis.preventionTips
          };
        }
      } catch (error) {
        console.error("Error calling OpenAI API:", error);
      }
    } else {
      console.log("OpenAI API key not configured, using simulated analysis");
      
      // Customize simulated analysis based on incident type
      if (incidentType.toLowerCase().includes("vehicle")) {
        analysis.recommendedActions = [
          "Document all vehicle damage with photos",
          "Obtain witness statements",
          "Complete vehicle inspection report",
          "Notify fleet management"
        ];
        analysis.preventionTips = [
          "Follow defensive driving techniques",
          "Complete vehicle pre-checks before shifts",
          "Maintain safe following distance",
          "Use spotters when backing up"
        ];
      } else if (incidentType.toLowerCase().includes("patient")) {
        analysis.recommendedActions = [
          "Complete detailed patient care documentation",
          "Notify medical director",
          "Request patient outcome follow-up",
          "Review case with clinical supervisor"
        ];
        analysis.preventionTips = [
          "Follow established clinical protocols",
          "Maintain proper patient handling techniques",
          "Ensure clear communication with patients",
          "Complete regular skills refreshers"
        ];
      }
      
      // Adjust risk level based on severity
      if (severity && severity.toLowerCase().includes("critical")) {
        analysis.riskLevel = "high";
      } else if (severity && severity.toLowerCase().includes("minor")) {
        analysis.riskLevel = "low";
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Incident analyzed successfully", 
        analysis 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
