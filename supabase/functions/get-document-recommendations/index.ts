
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
    const { employeeId } = await req.json();

    if (!employeeId) {
      return new Response(
        JSON.stringify({ error: "Employee ID is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // In a real implementation, this would analyze the employee's role, certifications,
    // and existing documents to make smart recommendations
    const recommendations = [
      {
        type: "Certification Documentation",
        reason: "Based on your role, you should keep certifications up to date",
        priority: "high"
      },
      {
        type: "Performance Review",
        reason: "Regular performance documentation helps track career progress",
        priority: "medium"
      },
      {
        type: "Training Completion",
        reason: "Document completed trainings to showcase skills development",
        priority: "medium"
      },
      {
        type: "Medical Clearance",
        reason: "Annual medical clearance may be required for your role",
        priority: "high"
      }
    ];

    return new Response(
      JSON.stringify({ recommendations }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in get-document-recommendations function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
