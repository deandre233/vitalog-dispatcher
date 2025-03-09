
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
          { name: "Critical Care Specialist", description: "Complete 25 critical care transports with excellent documentation", difficulty: "hard" },
          { name: "MVA Response Expert", description: "Attain expertise in responding to motor vehicle accidents with complex extrications", difficulty: "medium" },
          { name: "Cardiac Management Pro", description: "Demonstrate excellent care in cardiac emergencies with positive patient outcomes", difficulty: "hard" },
          { name: "Field Diagnostics Ace", description: "Develop exceptional field diagnosis skills with high accuracy", difficulty: "medium" }
        ];
        break;
      case 'education':
        achievementIdeas = [
          { name: "Knowledge Sharer", description: "Conduct 5 training sessions for team members", difficulty: "medium" },
          { name: "Continuous Learner", description: "Complete 50 hours of continuing education beyond requirements", difficulty: "medium" },
          { name: "Certification Champion", description: "Obtain 3 additional certifications relevant to your role", difficulty: "hard" },
          { name: "Protocol Innovator", description: "Contribute to the improvement of clinical protocols based on latest research", difficulty: "hard" },
          { name: "Field Training Excellence", description: "Achieve excellence ratings as a field training officer for new employees", difficulty: "medium" },
          { name: "Public Education Leader", description: "Lead 10 public health or safety education sessions in the community", difficulty: "medium" }
        ];
        break;
      case 'leadership':
        achievementIdeas = [
          { name: "Mentor Excellence", description: "Successfully mentor 5 new team members", difficulty: "medium" },
          { name: "Crisis Leader", description: "Lead team effectively during 10 mass casualty or high-stress situations", difficulty: "hard" },
          { name: "Innovation Initiator", description: "Implement 3 process improvements that enhance team efficiency", difficulty: "medium" },
          { name: "Team Morale Champion", description: "Initiate programs or activities that measurably improve team morale", difficulty: "medium" },
          { name: "Operational Excellence Leader", description: "Lead initiatives resulting in measurable improvements to operational metrics", difficulty: "hard" },
          { name: "Quality Improvement Specialist", description: "Spearhead quality improvement projects with documented success", difficulty: "medium" }
        ];
        break;
      case 'operational':
        achievementIdeas = [
          { name: "Fleet Management Specialist", description: "Contribute to improved vehicle maintenance and readiness standards", difficulty: "medium" },
          { name: "Supply Chain Optimizer", description: "Implement improvements to inventory management or supply chain processes", difficulty: "medium" },
          { name: "Response Time Champion", description: "Achieve exceptional response times consistently for 6 months", difficulty: "hard" },
          { name: "Resource Efficiency Expert", description: "Develop methods to improve resource utilization and reduce waste", difficulty: "medium" },
          { name: "Documentation Ace", description: "Achieve perfect documentation scores on 100 consecutive reports", difficulty: "hard" },
          { name: "Route Optimization Specialist", description: "Develop more efficient routing systems for improved response times", difficulty: "medium" }
        ];
        break;
      case 'teamwork':
        achievementIdeas = [
          { name: "Shift Coverage Hero", description: "Provide coverage for 15 shifts on short notice to support the team", difficulty: "medium" },
          { name: "Cross-Team Collaborator", description: "Successfully collaborate with 5 different departments on improvement initiatives", difficulty: "medium" },
          { name: "Team Building Champion", description: "Lead 3 successful team building events that improve team cohesion", difficulty: "easy" },
          { name: "Conflict Resolution Expert", description: "Successfully mediate team conflicts resulting in positive outcomes", difficulty: "medium" },
          { name: "Peer Support Specialist", description: "Provide outstanding peer support during difficult situations or critical incidents", difficulty: "medium" },
          { name: "New Member Integration Pro", description: "Help new team members integrate successfully with high satisfaction ratings", difficulty: "easy" }
        ];
        break;
      case 'community':
        achievementIdeas = [
          { name: "Community Outreach Leader", description: "Organize and lead community health or safety initiatives", difficulty: "medium" },
          { name: "Public Relations Ambassador", description: "Represent the organization positively in 5 public or media events", difficulty: "medium" },
          { name: "Community Partnership Builder", description: "Develop partnerships with community organizations that enhance service delivery", difficulty: "medium" },
          { name: "School Education Program Leader", description: "Develop or lead educational programs in local schools", difficulty: "medium" },
          { name: "Vulnerable Population Advocate", description: "Implement programs to better serve vulnerable populations in the community", difficulty: "hard" },
          { name: "Disaster Preparedness Educator", description: "Conduct community disaster preparedness training reaching 100+ people", difficulty: "medium" }
        ];
        break;
      default:
        // General achievement ideas for "all" category
        achievementIdeas = [
          { name: "Documentation Expert", description: "Achieve 95% accuracy in PCR documentation for 6 months", difficulty: "medium" },
          { name: "Community Hero", description: "Participate in 10 community health events or educational outreach programs", difficulty: "easy" },
          { name: "Team Player", description: "Receive 5 peer recognitions for exceptional teamwork", difficulty: "medium" },
          { name: "Professional Development Star", description: "Complete 3 professional development courses or certifications", difficulty: "medium" },
          { name: "Patient Care Excellence", description: "Receive 10 positive patient feedback comments or surveys", difficulty: "medium" },
          { name: "Innovation Champion", description: "Submit 3 ideas that improve patient care or operational efficiency", difficulty: "medium" }
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
