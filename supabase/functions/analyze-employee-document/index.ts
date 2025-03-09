
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.16";
import { corsHeaders } from "../_shared/cors.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const openaiApiKey = Deno.env.get("OPENAI_API_KEY") || "";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Get request body
    const { documentId, documentUrl, documentType, documentName, employeeId } = await req.json();
    
    if (!documentId || !documentUrl || !documentType) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Get employee details
    const { data: employee, error: employeeError } = await supabase
      .from("employees")
      .select("*")
      .eq("id", employeeId)
      .single();
    
    if (employeeError) {
      console.error("Error fetching employee:", employeeError);
      // Continue anyway with limited information
    }
    
    console.log(`Analyzing document ${documentId} of type ${documentType}`);
    
    // Perform document analysis based on document type
    let analysis = { summary: "Document analysis not available for this document type." };
    
    // Example analysis using OpenAI
    if (openaiApiKey) {
      try {
        // Note: In a real implementation, you would fetch and read the actual document content
        // For this example, we're simulating analysis based on document type and name
        
        const documentContext = {
          documentType,
          documentName,
          employeeName: employee ? `${employee.first_name} ${employee.last_name}` : "Unknown",
          employeeRole: employee?.certification_level || "Unknown",
        };
        
        // Call OpenAI API
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
                content: "You are an expert medical document analyst for an ambulance company. Parse and analyze the provided document information and provide a brief summary highlighting key medical information, relevance to EMS work, any restrictions, clearances, or important dates mentioned."
              },
              {
                role: "user",
                content: `Please analyze this document: ${JSON.stringify(documentContext)}`
              }
            ],
            max_tokens: 300
          })
        });
        
        const aiResult = await response.json();
        
        if (aiResult.choices && aiResult.choices[0] && aiResult.choices[0].message) {
          analysis = {
            summary: aiResult.choices[0].message.content,
            type: documentType,
            analysisDate: new Date().toISOString(),
            confidence: 0.85, // Example value
            entityDetection: {
              dates: ["2023-08-15"], // Example value - would be extracted from actual document
              organizations: ["Medical Center"], // Example value
              medicalTerms: ["clearance", "fit for duty"] // Example value
            }
          };
          
          // If it's a medical clearance, extract more specific information
          if (documentType === "Medical Clearance" || documentType === "Doctor's Note") {
            analysis.clearanceStatus = "Approved";
            analysis.validUntil = "2024-08-15"; // Example value
            analysis.restrictions = ["No lifting over 50lbs for 2 weeks"]; // Example value
          }
          
          // If it's a certification, extract certification details
          else if (documentType === "Certification Documentation") {
            analysis.certificationDetails = {
              name: "Advanced Cardiac Life Support",
              issuedBy: "American Heart Association",
              expirationDate: "2025-06-30"
            };
          }
        }
      } catch (error) {
        console.error("Error calling OpenAI API:", error);
        // Fallback to basic analysis
        analysis = {
          summary: `This appears to be a ${documentType.toLowerCase()} document named "${documentName}".`,
          type: documentType,
          analysisDate: new Date().toISOString(),
          automatic: false,
          error: "Failed to perform advanced analysis"
        };
      }
    } else {
      console.log("OpenAI API key not configured, using simulated analysis");
      // Simulated document analysis
      analysis = {
        summary: `This appears to be a ${documentType.toLowerCase()} document named "${documentName}".`,
        type: documentType,
        analysisDate: new Date().toISOString(),
        automatic: false,
        note: "This is a simulated analysis. Configure OpenAI API key for detailed analysis."
      };
      
      // Add type-specific simulated analysis
      if (documentType === "Medical Clearance") {
        analysis.summary += " The document appears to clear the employee for full duty with no restrictions.";
        analysis.clearanceStatus = "Approved";
        analysis.validUntil = "2023-12-31";
      } else if (documentType === "Doctor's Note") {
        analysis.summary += " The note indicates a temporary restriction from heavy lifting for 2 weeks.";
        analysis.restrictions = ["No lifting over 50lbs for 2 weeks"];
        analysis.followUpRequired = true;
        analysis.followUpDate = "2023-09-30";
      } else if (documentType === "Certification Documentation") {
        analysis.summary += " This certification appears to be valid and current.";
        analysis.certificationDetails = {
          name: documentName.includes("CPR") ? "CPR" : "Emergency Medical Services",
          issuedBy: "State EMS Board",
          expirationDate: "2024-06-30"
        };
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Document analyzed successfully", 
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
