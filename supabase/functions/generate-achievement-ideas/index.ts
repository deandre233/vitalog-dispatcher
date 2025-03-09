
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { employeeId, category } = await req.json();

    if (!employeeId) {
      return new Response(
        JSON.stringify({ error: "Employee ID is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // In a real implementation, this would analyze the employee's data to make personalized suggestions
    let achievementIdeas = [];
    
    switch (category) {
      case 'clinical':
        achievementIdeas = [
          { name: "Advanced Life Support Mastery", description: "Successfully perform 50 ALS interventions with positive outcomes", difficulty: "hard" },
          { name: "Protocol Perfect", description: "Demonstrate 100% adherence to clinical protocols for 3 consecutive months", difficulty: "medium" },
          { name: "Critical Care Specialist", description: "Complete 25 critical care transports with excellent documentation", difficulty: "hard" }
        ];
        break;
      case 'education':
        achievementIdeas = [
          { name: "Knowledge Sharer", description: "Conduct 5 training sessions for team members", difficulty: "medium" },
          { name: "Continuous Learner", description: "Complete 50 hours of continuing education beyond requirements", difficulty: "medium" },
          { name: "Certification Champion", description: "Obtain 3 additional certifications relevant to your role", difficulty: "hard" }
        ];
        break;
      case 'leadership':
        achievementIdeas = [
          { name: "Mentor Excellence", description: "Successfully mentor 5 new team members", difficulty: "medium" },
          { name: "Crisis Leader", description: "Lead team effectively during 10 mass casualty or high-stress situations", difficulty: "hard" },
          { name: "Innovation Initiator", description: "Implement 3 process improvements that enhance team efficiency", difficulty: "medium" }
        ];
        break;
      default:
        achievementIdeas = [
          { name: "Documentation Expert", description: "Achieve 95% accuracy in PCR documentation for 6 months", difficulty: "medium" },
          { name: "Community Hero", description: "Participate in 10 community health events or educational outreach programs", difficulty: "easy" },
          { name: "Team Player", description: "Receive 5 peer recognitions for exceptional teamwork", difficulty: "medium" }
        ];
    }

    return new Response(
      JSON.stringify({ achievementIdeas }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in generate-achievement-ideas function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
