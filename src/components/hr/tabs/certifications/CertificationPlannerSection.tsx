
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useEmployeeDetails } from "@/hooks/useEmployeeDetails";
import { useEmployeeCertifications } from "@/hooks/useEmployeeCertifications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Brain, CalendarDays, CalendarRange, Clock, FileText, GraduationCap, LifeBuoy, Lightbulb, Smile, Star, Wand2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { format, addMonths, differenceInDays } from "date-fns";

export function CertificationPlannerSection() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { employee } = useEmployeeDetails(employeeId);
  const { certificates, isLoading } = useEmployeeCertifications(employeeId);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [planGenerated, setPlanGenerated] = useState(false);
  
  const handleGeneratePlan = () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      setPlanGenerated(true);
    }, 1500);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch {
      return dateString;
    }
  };
  
  // Calculate the upcoming renewal dates based on current certifications
  const getUpcomingRenewals = () => {
    const today = new Date();
    
    return certificates.map(cert => {
      const expiryDate = new Date(cert.expires);
      const daysRemaining = differenceInDays(expiryDate, today);
      
      return {
        id: cert.id,
        certType: cert.cert_type,
        expiryDate: cert.expires,
        daysRemaining,
        renewalWindowOpen: daysRemaining <= 90,
        renewalDue: format(addMonths(expiryDate, -1), "MMMM d, yyyy")
      };
    }).sort((a, b) => a.daysRemaining - b.daysRemaining);
  };
  
  const upcomingRenewals = getUpcomingRenewals();
  
  // Career path suggestions based on current level
  const getCareerPathSuggestions = () => {
    const currentLevel = employee?.certification_level || "";
    
    if (currentLevel.includes("Basic") || currentLevel.includes("EMT")) {
      return {
        nextSteps: ["Advanced EMT (AEMT)", "Paramedic"],
        timeframe: "12-24 months",
        description: "Advancing to AEMT requires approximately 150-250 additional training hours, while Paramedic certification typically requires 1,200+ hours of training over 1-2 years."
      };
    } else if (currentLevel.includes("Paramedic")) {
      return {
        nextSteps: ["Critical Care Paramedic", "Flight Paramedic", "EMS Educator"],
        timeframe: "6-12 months",
        description: "With your Paramedic certification, you can specialize in critical care (FP-C or CCP-C) or flight medicine (FP-C) with additional certifications that typically require 100-200 hours of training."
      };
    } else {
      return {
        nextSteps: ["EMT-Basic", "Emergency Medical Responder"],
        timeframe: "3-6 months",
        description: "Starting with an EMT-Basic certification requires approximately 120-150 hours of training and is the foundation for emergency medical services career paths."
      };
    }
  };
  
  const careerPath = getCareerPathSuggestions();

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Brain className="mr-2 h-5 w-5 text-blue-600" />
            AI Certification Career Planner
          </CardTitle>
          <Button 
            disabled={isGenerating} 
            onClick={handleGeneratePlan}
          >
            {isGenerating ? (
              <>Generating Plan...</>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Custom Career Plan
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-md font-semibold mb-4 flex items-center">
              <CalendarRange className="mr-2 h-5 w-5 text-amber-500" />
              Upcoming Certification Renewals
            </h3>
            
            {upcomingRenewals.length === 0 ? (
              <div className="bg-gray-50 border rounded-md p-4 text-center text-gray-500">
                No certifications requiring renewal
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingRenewals.map(renewal => (
                  <div key={renewal.id} className="border rounded-md p-4">
                    <div className="flex justify-between mb-2">
                      <div className="font-medium">{renewal.certType}</div>
                      <Badge variant={
                        renewal.daysRemaining < 30 ? "destructive" :
                        renewal.daysRemaining < 90 ? "warning" : "outline"
                      }>
                        {renewal.daysRemaining} days remaining
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-500 mb-2">
                      Expires on {formatDate(renewal.expiryDate)}
                    </div>
                    
                    <Progress value={Math.min(100, (1 - renewal.daysRemaining/365) * 100)} className="h-2 mb-1" />
                    
                    {renewal.renewalWindowOpen && (
                      <div className="text-sm text-amber-600 mt-2 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Renewal window is now open. Recommended action by {renewal.renewalDue}.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <h3 className="text-md font-semibold mt-6 mb-4 flex items-center">
              <GraduationCap className="mr-2 h-5 w-5 text-blue-500" />
              Career Path Options
            </h3>
            
            <div className="border rounded-md p-4">
              <div className="mb-4">
                <p className="text-sm">Based on your current level: <strong>{employee?.certification_level}</strong></p>
              </div>
              
              <div className="mb-4">
                <p className="font-medium">Recommended next steps:</p>
                <ul className="list-disc ml-5 mt-1 space-y-1">
                  {careerPath.nextSteps.map((step, index) => (
                    <li key={index} className="text-sm">{step}</li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-3">
                <p className="font-medium">Estimated timeframe:</p>
                <p className="text-sm">{careerPath.timeframe}</p>
              </div>
              
              <div>
                <p className="font-medium">What's involved:</p>
                <p className="text-sm">{careerPath.description}</p>
              </div>
            </div>
          </div>
          
          <div>
            {planGenerated ? (
              <div>
                <h3 className="text-md font-semibold mb-4 flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-green-500" />
                  Your Personalized Certification Plan
                </h3>
                
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-center mb-4">
                    <p className="font-medium">Plan generated for {employee?.first_name} {employee?.last_name}</p>
                    <Badge className="bg-green-50 text-green-700 border-green-200">AI Generated</Badge>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-medium mb-2">Immediate Actions (0-3 months)</h4>
                    <ul className="list-disc ml-5 space-y-2">
                      {upcomingRenewals.length > 0 && upcomingRenewals[0].daysRemaining < 90 ? (
                        <li className="text-sm">
                          Renew <strong>{upcomingRenewals[0].certType}</strong> certificate 
                          (expires in {upcomingRenewals[0].daysRemaining} days)
                        </li>
                      ) : (
                        <li className="text-sm">
                          Complete ACLS (Advanced Cardiac Life Support) certification
                        </li>
                      )}
                      <li className="text-sm">Sign up for a PALS (Pediatric Advanced Life Support) course</li>
                      <li className="text-sm">Log 10 hours of continuing education</li>
                    </ul>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-medium mb-2">Short-Term Goals (3-6 months)</h4>
                    <ul className="list-disc ml-5 space-y-2">
                      <li className="text-sm">
                        {employee?.certification_level.includes("EMT") ? 
                          "Begin AEMT coursework (minimum 150 hours)" :
                          "Complete Critical Care training modules (50 hours)"
                        }
                      </li>
                      <li className="text-sm">Obtain PHTLS (Prehospital Trauma Life Support) certification</li>
                      <li className="text-sm">Complete 20 additional CE hours focused on {
                        employee?.certification_level.includes("EMT") ? 
                        "emergency medicine and trauma" : 
                        "advanced assessment and interventions"
                      }</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Long-Term Goals (6-12 months)</h4>
                    <ul className="list-disc ml-5 space-y-2">
                      <li className="text-sm">
                        {employee?.certification_level.includes("EMT") ? 
                          "Complete AEMT certification" :
                          "Obtain Critical Care Paramedic certification"
                        }
                      </li>
                      <li className="text-sm">
                        {employee?.certification_level.includes("EMT") ? 
                          "Begin paramedic program application process" :
                          "Apply for specialty positions within the organization"
                        }
                      </li>
                      <li className="text-sm">Achieve a total of 50 CE hours for the year</li>
                    </ul>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex items-center">
                      <Lightbulb className="h-5 w-5 text-amber-500 mr-2" />
                      <h4 className="font-medium">AI Insights</h4>
                    </div>
                    <p className="text-sm mt-2">
                      Based on {employee?.first_name}'s current certifications and experience level, 
                      focusing on {
                        employee?.certification_level.includes("EMT") ? 
                        "advanced airway management and cardiac emergencies" : 
                        "critical care transport and advanced pharmacology"
                      } will maximize career advancement opportunities within the next 12 months.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4 space-x-2">
                  <Button variant="outline">
                    <Clock className="mr-1 h-4 w-4" />
                    Schedule Review
                  </Button>
                  <Button>
                    <Star className="mr-1 h-4 w-4" />
                    Apply Plan
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full border rounded-md p-8">
                <Brain className="h-16 w-16 text-blue-200 mb-4" />
                <h3 className="text-lg font-medium mb-2">AI Certification Planner</h3>
                <p className="text-center text-gray-500 mb-6">
                  Generate a personalized certification career plan based on {employee?.first_name}'s 
                  current qualifications, experience, and career goals.
                </p>
                <Button 
                  disabled={isGenerating} 
                  onClick={handleGeneratePlan}
                  size="lg"
                >
                  {isGenerating ? (
                    <>Generating Plan...</>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate Career Plan
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper component
function Badge({ children, variant = "default", className = "" }) {
  const variantStyles = {
    default: "bg-gray-100 text-gray-800",
    outline: "bg-transparent border border-gray-200 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-amber-100 text-amber-800",
    destructive: "bg-red-100 text-red-800",
    secondary: "bg-gray-100 text-gray-800"
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
