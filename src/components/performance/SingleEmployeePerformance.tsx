<lov-code>
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Award, 
  FileText, 
  Clock, 
  Calendar,
  Star,
  BookOpen,
  Users2,
  TrendingUp,
  Zap,
  AlertCircle,
  FileUp
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface EmployeePerformanceProps {
  employeeId: string;
  employeeName: string;
}

interface PerformanceMetric {
  category: string;
  score: number;
  description: string;
  trend: string;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  departmentAvg: number;
  icon: React.ReactNode;
}

export function SingleEmployeePerformance({ employeeId, employeeName }: EmployeePerformanceProps) {
  const [activeCategory, setActiveCategory] = useState<string>("overall");
  const [timeRange, setTimeRange] = useState<string>("quarter");
  const [isGeneratingWriteUp, setIsGeneratingWriteUp] = useState(false);
  const [generatedWriteUp, setGeneratedWriteUp] = useState<string>("");
  const [writeUpSeverity, setWriteUpSeverity] = useState<string>("warning");
  const [writeUpSubject, setWriteUpSubject] = useState<string>("general");
  const [writeUpDialogOpen, setWriteUpDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [customNotes, setCustomNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const performanceMetrics: Record<string, PerformanceMetric> = {
    overall: {
      category: "Overall Performance",
      score: 89,
      description: "Combined performance across all categories",
      trend: "Improved by 2.4% this quarter",
      grade: 'B',
      departmentAvg: 84,
      icon: <Award className="h-5 w-5 text-primary" />
    },
    pcrCompletion: {
      category: "PCR Completion",
      score: 93,
      description: "% of PCRs completed within 24 hours",
      trend: "Improved by 5.2% this quarter",
      grade: 'A',
      departmentAvg: 82,
      icon: <FileText className="h-5 w-5 text-primary" />
    },
    pcrQuality: {
      category: "PCR Quality",
      score: 87,
      description: "Quality scoring from QA reviews",
      trend: "Stable (+0.3%) this quarter",
      grade: 'B',
      departmentAvg: 80,
      icon: <Star className="h-5 w-5 text-primary" />
    },
    punctuality: {
      category: "Punctuality",
      score: 92,
      description: "On-time arrival percentage",
      trend: "Improved by 3.1% this quarter",
      grade: 'A',
      departmentAvg: 87,
      icon: <Clock className="h-5 w-5 text-primary" />
    },
    inserviceAttendance: {
      category: "Inservice Attendance",
      score: 85,
      description: "% of required inservice hours attended",
      trend: "Declined by 2.5% this quarter",
      grade: 'B',
      departmentAvg: 79,
      icon: <Calendar className="h-5 w-5 text-primary" />
    },
    patientFeedback: {
      category: "Patient Feedback",
      score: 90,
      description: "Average patient satisfaction score",
      trend: "Improved by 4.2% this quarter",
      grade: 'A',
      departmentAvg: 83,
      icon: <TrendingUp className="h-5 w-5 text-primary" />
    },
    protocolAdherence: {
      category: "Protocol Adherence",
      score: 88,
      description: "% adherence to clinical protocols",
      trend: "Improved by 1.7% this quarter",
      grade: 'B',
      departmentAvg: 85,
      icon: <BookOpen className="h-5 w-5 text-primary" />
    },
    teamwork: {
      category: "Teamwork",
      score: 91,
      description: "Peer and supervisor evaluations",
      trend: "Improved by 3.8% this quarter",
      grade: 'A',
      departmentAvg: 80,
      icon: <Users2 className="h-5 w-5 text-primary" />
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-amber-600";
    return "text-red-600";
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return "bg-green-100 text-green-800 border-green-300";
      case 'B': return "bg-blue-100 text-blue-800 border-blue-300";
      case 'C': return "bg-amber-100 text-amber-800 border-amber-300";
      case 'D': return "bg-orange-100 text-orange-800 border-orange-300";
      case 'F': return "bg-red-100 text-red-800 border-red-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getTrendBadge = (trend: string) => {
    if (trend.includes("Improved")) {
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 ml-2">{trend}</Badge>;
    } else if (trend.includes("Declined")) {
      return <Badge variant="destructive" className="ml-2">{trend}</Badge>;
    } else {
      return <Badge variant="outline" className="ml-2">{trend}</Badge>;
    }
  };

  const handleGenerateWriteUp = async () => {
    setIsGeneratingWriteUp(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const metric = performanceMetrics[activeCategory];
      
      let writeUpTemplate = "";
      
      // Get subject-specific content
      const subjectContent = getSubjectSpecificContent(writeUpSubject, metric.score, metric.category);
      
      if (metric.score < 70) {
        writeUpTemplate = `PERFORMANCE IMPROVEMENT PLAN\n\nEmployee: ${employeeName}\nSubject: ${getSubjectDisplayName(writeUpSubject)}\nCategory: ${metric.category}\nCurrent Score: ${metric.score}/100 (Grade: ${metric.grade})\nDepartment Average: ${metric.departmentAvg}/100\n\nConcern:\n${subjectContent.concern}\n\nExpectations:\n${subjectContent.expectations}\n\nConsequences if not improved:\nFailure to show significant improvement may result in further disciplinary action up to and including termination of employment.`;
      } else if (metric.score < 80) {
        writeUpTemplate = `PERFORMANCE WARNING\n\nEmployee: ${employeeName}\nSubject: ${getSubjectDisplayName(writeUpSubject)}\nCategory: ${metric.category}\nCurrent Score: ${metric.score}/100 (Grade: ${metric.grade})\nDepartment Average: ${metric.departmentAvg}/100\n\nConcern:\n${subjectContent.concern}\n\nExpectations:\n${subjectContent.expectations}\n\nThis warning will be placed in your employment file. Please take this opportunity to improve your performance.`;
      } else if (metric.score < 85) {
        writeUpTemplate = `PERFORMANCE ADVISORY\n\nEmployee: ${employeeName}\nSubject: ${getSubjectDisplayName(writeUpSubject)}\nCategory: ${metric.category}\nCurrent Score: ${metric.score}/100 (Grade: ${metric.grade})\nDepartment Average: ${metric.departmentAvg}/100\n\nObservation:\n${subjectContent.observation}\n\nRecommendations:\n${subjectContent.recommendations}\n\nThis is not a disciplinary action but an opportunity for professional growth.`;
      } else {
        writeUpTemplate = `PERFORMANCE RECOGNITION\n\nEmployee: ${employeeName}\nSubject: ${getSubjectDisplayName(writeUpSubject)}\nCategory: ${metric.category}\nCurrent Score: ${metric.score}/100 (Grade: ${metric.grade})\nDepartment Average: ${metric.departmentAvg}/100\n\nRecognition:\n${subjectContent.recognition}\n\nContinued Growth Opportunities:\n${subjectContent.growthOpportunities}\n\nThank you for your outstanding contribution to our organization.`;
      }
      
      setGeneratedWriteUp(writeUpTemplate);
      setWriteUpDialogOpen(true);
    } catch (error) {
      console.error("Error generating write-up:", error);
      toast({
        title: "Error",
        description: "Failed to generate performance write-up",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingWriteUp(false);
    }
  };

  const getSubjectDisplayName = (subject: string): string => {
    const subjectMap: Record<string, string> = {
      "general": "General Performance",
      "missed-punches": "Missed Time Clock Punches",
      "tardiness": "Tardiness",
      "inservice": "Inservice Attendance",
      "pcr-completion": "PCR Completion Time",
      "pcr-quality": "PCR Documentation Quality",
      "protocol-adherence": "Protocol Adherence",
      "vehicle-inspections": "Vehicle Inspection Compliance",
      "uniform-compliance": "Uniform Compliance",
      "attendance": "Shift Attendance",
      "patient-care": "Patient Care Quality"
    };
    
    return subjectMap[subject] || "General Performance";
  };

  const getSubjectSpecificContent = (subject: string, score: number, category: string) => {
    const isBelowAvg = score < 80;
    const isAverage = score >= 80 && score < 90;
    const isAboveAvg = score >= 90;
    
    let content = {
      concern: `Your performance in ${category.toLowerCase()} is below expected standards.`,
      expectations: "1. Increase your score to at least 85 points within 60 days\n2. Review department protocols related to this area\n3. Bi-weekly check-ins with your supervisor",
      observation: `Your performance in ${category.toLowerCase()} meets minimum standards but has room for improvement.`,
      recommendations: "1. Target increasing your score to 90+ points\n2. Consider additional training opportunities\n3. Monthly review of your progress in this area",
      recognition: `Your performance in ${category.toLowerCase()} exceeds organizational standards.`,
      growthOpportunities: "1. Consider mentoring other team members in this area\n2. Explore advanced training to further enhance your skills\n3. Participate in developing department best practices"
    };
    
    switch (subject) {
      case "missed-punches":
        if (isBelowAvg) {
          content.concern = `You have had ${Math.floor(10 - score/10)} missed time clock punches in the past 30 days. This pattern of missed punches creates payroll inaccuracies and administrative burden.`;
          content.expectations = "1. Zero missed punches for the next 30 days\n2. Set reminders on your mobile device for shift start/end\n3. Contact supervisor immediately if you forget to punch in/out";
        } else if (isAverage) {
          content.observation = `You've had ${Math.floor(5 - score/20)} missed time clock punches in the past 30 days. While this is close to department average, there's room for improvement.`;
          content.recommendations = "1. Set up mobile alerts 5 minutes before shift start/end\n2. Practice consistent punch-in/out routine\n3. Review your timecard weekly to catch any issues";
        } else {
          content.recognition = "You've maintained excellent time clock punch compliance with perfect or near-perfect punch record.";
          content.growthOpportunities = "1. Share your time management strategies with new employees\n2. Consider helping with timecard auditing processes\n3. Maintain your excellent compliance record";
        }
        break;
        
      case "tardiness":
        if (isBelowAvg) {
          content.concern = `You've arrived late to ${Math.floor(10 - score/10)} shifts in the past 30 days. Tardiness impacts crew readiness, vehicle checkout procedures, and overall operational efficiency.`;
          content.expectations = "1. Arrive 10 minutes before shift start for the next 15 shifts\n2. Develop a backup transportation plan\n3. Notify supervisor in advance if delay is unavoidable";
        } else if (isAverage) {
          content.observation = `You've had ${Math.floor(4 - score/20)} late arrivals in the past 30 days. While occasional tardiness happens, consistent punctuality is important.`;
          content.recommendations = "1. Plan to arrive 15 minutes before shift start\n2. Identify factors that may contribute to delays\n3. Consider adjusting your pre-work routine";
        } else {
          content.recognition = "Your punctuality record is excellent with consistent on-time or early arrivals to shifts.";
          content.growthOpportunities = "1. Maintain your excellent punctuality record\n2. Consider mentoring others who struggle with time management\n3. Share your pre-shift preparation strategies";
        }
        break;
        
      case "inservice":
        if (isBelowAvg) {
          content.concern = `You've missed ${Math.floor(3 - score/30)} required inservice training sessions this quarter. This affects your continuing education requirements and department compliance.`;
          content.expectations = "1. Attend all remaining inservice sessions this quarter\n2. Complete make-up sessions for missed trainings\n3. Provide advance notice if unable to attend scheduled training";
        } else if (isAverage) {
          content.observation = `Your inservice attendance is generally good but you missed ${Math.floor(2 - score/45)} session this quarter. Consistent attendance ensures you stay current with protocols and education requirements.`;
          content.recommendations = "1. Review the quarterly inservice schedule and block time on your calendar\n2. Consider signing up for extra sessions when available\n3. Utilize online options when in-person attendance is difficult";
        } else {
          content.recognition = "Your inservice attendance is excellent with 100% attendance record this quarter.";
          content.growthOpportunities = "1. Consider pursuing additional certification opportunities\n2. Volunteer to help develop or present training materials\n3. Identify advanced education topics that interest you";
        }
        break;
        
      case "pcr-completion":
        if (isBelowAvg) {
          content.concern = `Your PCR completion rate within 24 hours is at ${score}%, significantly below department standard of 90%. Delayed documentation affects billing, QA processes, and continuity of care.`;
          content.expectations = "1. Complete all PCRs before end of shift when possible\n2. Achieve 90%+ on-time completion within 30 days\n3. Allocate specific time after each call for documentation";
        } else if (isAverage) {
          content.observation = `Your PCR completion rate of ${score}% is near department average but below our target of 95%. Timely documentation is crucial for billing and clinical continuity.`;
          content.recommendations = "1. Develop strategies to complete PCRs immediately after calls\n2. Set aside 10 minutes at end of shift for PCR review\n3. Utilize mobile documentation when appropriate";
        } else {
          content.recognition = `Your PCR completion rate of ${score}% exceeds department standards, demonstrating excellent documentation habits.`;
          content.growthOpportunities = "1. Share your documentation efficiency strategies with peers\n2. Consider participating in PCR quality improvement initiatives\n3. Explore advanced documentation techniques";
        }
        break;
        
      case "pcr-quality":
        if (isBelowAvg) {
          content.concern = `Your PCR quality score of ${score}% is below department standards. Recent QA reviews identified issues with narrative completeness, vital signs documentation, and medical decision making documentation.`;
          content.expectations = "1. Schedule a review session with the QA manager\n2. Review PCR writing guidelines and department templates\n3. Submit 5 PCRs for pre-review in the next 30 days";
        } else if (isAverage) {
          content.observation = `Your PCR quality score of ${score}% meets basic standards but has room for improvement in narrative detail, differential diagnosis documentation, and intervention rationale.`;
          content.recommendations = "1. Review examples of high-quality PCRs\n2. Focus on improving your narrative structure and detail\n3. Document clear medical decision making rationales";
        } else {
          content.recognition = `Your PCR quality score of ${score}% demonstrates excellent documentation practices, with thorough narratives and clear medical decision making.`;
          content.growthOpportunities = "1. Consider participating in documentation training for new employees\n2. Submit examples of your PCRs for teaching purposes\n3. Explore advanced medical narrative techniques";
        }
        break;
        
      case "protocol-adherence":
        if (isBelowAvg) {
          content.concern = `Your protocol adherence score of ${score}% indicates significant deviations from established clinical protocols. This creates patient safety risks and liability concerns.`;
          content.expectations = "1. Review all current clinical protocols within 14 days\n2. Complete protocol review session with medical director\n3. Document protocol justification for all treatments";
        } else if (isAverage) {
          content.observation = `Your protocol adherence score of ${score}% shows general compliance but occasional deviations. Consistent protocol adherence ensures standardized, evidence-based care.`;
          content.recommendations = "1. Review protocol updates from the last quarter\n2. Document clearly when deviating from protocols and why\n3. Participate in monthly protocol review sessions";
        } else {
          content.recognition = `Your protocol adherence score of ${score}% demonstrates excellent compliance with clinical guidelines while maintaining appropriate clinical judgment.`;
          content.growthOpportunities = "1. Participate in protocol development committees\n2. Help identify protocol improvements based on field experience\n3. Consider becoming a protocol trainer for new employees";
        }
        break;
        
      // Default case for general performance and other categories
      default:
        // Use the default messages defined above
        break;
    }
    
    return content;
  };

  const handleUploadWriteUp = async () => {
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const finalWriteUp = customNotes || generatedWriteUp;
      
      const { error } = await supabase
        .from('corrective_actions')
        .insert({
          employee_id: employeeId,
          action_type: writeUpSeverity,
          description: finalWriteUp,
          improvement_plan: `Improvement plan for ${getSubjectDisplayName(writeUpSubject)}`,
          issue_date: new Date().toISOString(),
          follow_up_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        });
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Performance write-up has been saved to employee record",
      });
      
      setWriteUpDialogOpen(false);
      setCustomNotes("");
      setGeneratedWriteUp("");
    } catch (error) {
      console.error("Error saving write-up:", error);
      toast({
        title: "Error",
        description: "Failed to save performance write-up",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentMetric = performanceMetrics[activeCategory];

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border">
              <AvatarFallback>{employeeName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              <AvatarImage src="" alt={employeeName} />
            </Avatar>
            <div>
              <CardTitle className="text-lg">{employeeName}</CardTitle>
              <p className="text-muted-foreground text-sm">Performance Assessment</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`text-center px-4 py-2 rounded-md border font-bold ${getGradeColor(currentMetric.grade)}`}>
              Overall Grade: {currentMetric.grade}
            </div>
            <div className={`text-center px-4 py-2 rounded-md border font-bold ${getScoreColor(performanceMetrics.overall.score)}`}>
              Score: {performanceMetrics.overall.score}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <Tabs defaultValue="overall" value={activeCategory} onValueChange={setActiveCategory}>
        <div className="px-6">
          <TabsList className="w-full mb-4 grid grid-cols-4 md:grid-cols-8">
            <TabsTrigger value="overall" className="text-xs">Overall</TabsTrigger>
            <TabsTrigger value="pcrCompletion" className="text-xs">PCR Completion</TabsTrigger>
            <TabsTrigger value="pcrQuality" className="text-xs">PCR Quality</TabsTrigger>
            <TabsTrigger value="punctuality" className="text-xs">Punctuality</TabsTrigger>
            <TabsTrigger value="inserviceAttendance" className="text-xs">Inservice</TabsTrigger>
            <TabsTrigger value="patientFeedback" className="text-xs">Patient Feedback</TabsTrigger>
            <TabsTrigger value="protocolAdherence" className="text-xs">Protocol</TabsTrigger>
            <TabsTrigger value="teamwork" className="text-xs">Teamwork</TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3 mb-2">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleGenerateWriteUp}
                disabled={isGeneratingWriteUp}
              >
                {isGeneratingWriteUp ? (
                  <div className="h-4 w-4 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
                ) : (
                  <Zap className="h-4 w-4 text-amber-500" />
                )}
                {isGeneratingWriteUp ? "Generating..." : "Generate AI Write-up"}
              </Button>
              <Select 
                value={writeUpSubject} 
                onValueChange={setWriteUpSubject}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Performance</SelectItem>
                  <SelectItem value="missed-punches">Missed Punches</SelectItem>
                  <SelectItem value="tardiness">Tardiness</SelectItem>
                  <SelectItem value="inservice">Inservice Attendance</SelectItem>
                  <SelectItem value="pcr-completion">PCR Completion Time</SelectItem>
                  <SelectItem value="pcr-quality">PCR Documentation Quality</SelectItem>
                  <SelectItem value="protocol-adherence">Protocol Adherence</SelectItem>
                  <SelectItem value="vehicle-inspections">Vehicle Inspections</SelectItem>
                  <SelectItem value="uniform-compliance">Uniform Compliance</SelectItem>
                  <SelectItem value="attendance">Shift Attendance</SelectItem>
                  <SelectItem value="patient-care">Patient Care Quality</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setUploadDialogOpen(true)}
              >
                <FileUp className="h-4 w-4 text-blue-500" />
                Upload Document
              </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 bg-accent/40 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  {currentMetric.icon}
                  <h3 className="text-xl font-semibold">{currentMetric.category}</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Performance Score</span>
                      <span className={`font-bold ${getScoreColor(currentMetric.score)}`}>{currentMetric.score}/100</span>
                    </div>
                    <Progress value={currentMetric.score} className="h-2.5" />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-background rounded-md p-4">
                      <h4 className="font-medium mb-2">Performance Trend</h4>
                      <div className="flex items-center">
                        <span className="text-muted-foreground">{currentMetric.trend}</span>
                      </div>
                    </div>
                    
                    <div className="bg-background rounded-md p-4">
                      <h4 className="font-medium mb-2">Department Comparison</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-muted-foreground">Department Average:</span>
                        <span className={getScoreColor(currentMetric.departmentAvg)}>{currentMetric.departmentAvg}/100</span>
                        <span className="text-muted-foreground mx-2">|</span>
                        <span className="text-muted-foreground">Your Performance:</span>
                        <span className={`font-semibold ${getScoreColor(currentMetric.score)}`}>{currentMetric.score > currentMetric.departmentAvg ? `${currentMetric.score - currentMetric.departmentAvg}% above avg` : `${currentMetric.departmentAvg - currentMetric.score}% below avg`}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/3 space-y-6">
                <div className="bg-accent/40 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Performance Highlights</h3>
                  <div className="space-y-3">
                    {activeCategory === "overall" ? (
                      <>
                        <div className="flex justify-between items-center">
                          <span>Strongest Area</span>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">PCR Completion (93%)</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Improvement Area</span>
                          <Badge variant="destructive">Inservice (85%)</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Department Rank</span>
                          <Badge variant="outline">Top 15%</Badge>
                        </div>
                      </>
                    ) : activeCategory === "pcrCompletion" ? (
                      <>
                        <div className="flex justify-between items-center">
                          <span>24hr Completion Rate</span>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">96%</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Avg Completion Time</span>
                          <Badge variant="outline">3.5 hours</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Late Submissions</span>
                          <Badge variant="destructive">4%</Badge>
                        </div>
                      </>
                    ) : activeCategory === "punctuality" ? (
                      <>
                        <div className="flex justify-between items-center">
                          <span>On-Time Arrival</span>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">94%</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Avg Early Arrival</span>
                          <Badge variant="outline">12 minutes</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Late Incidents</span>
                          <Badge variant="destructive">3 this quarter</Badge>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between items-center">
                          <span>Strong Points</span>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Above Average</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Improvement Areas</span>
                          <Badge variant="outline">Consistency</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Trend</span>
                          <Badge variant="outline">Positive</Badge>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="bg-accent/40 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Improvement Plan</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    {activeCategory === "overall" ? (
                      <>
                        <li>Focus on increasing inservice attendance</li>
                        <li>Maintain high PCR completion standards</li>
                        <li>Continue improving protocol adherence</li>
                      </>
                    ) : activeCategory === "pcrCompletion" ? (
                      <>
                        <li>Maintain excellent completion rate</li>
                        <li>Reduce late submissions by 2%</li>
                        <li>Consider mentoring other team members</li>
                      </>
                    ) : activeCategory === "punctuality" ? (
                      <>
                        <li>Maintain excellent on-time record</li>
                        <li>Consider adjusting commute to avoid traffic</li>
                        <li>Current performance is exceeding expectations</li>
                      </>
                    ) : activeCategory === "inserviceAttendance" ? (
                      <>
                        <li>Improve attendance by 5% next quarter</li>
                        <li>Schedule attendance in advance</li>
                        <li>Consider online options when in-person is difficult</li>
                      </>
                    ) : (
                      <>
                        <li>Continue current improvement trajectory</li>
                        <li>Schedule quarterly review of progress</li>
                        <li>Consider additional training opportunities</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-accent/40 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Detailed Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-background p-4 rounded-md">
                    <h4 className="font-medium mb-2">Strengths</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {activeCategory === "overall" ? (
                        <>
                          <li>Consistently high PCR completion rate</li>
                          <li>Excellent punctuality record</li>
                          <li>Strong patient feedback ratings</li>
                        </>
                      ) : activeCategory === "pcrCompletion" ? (
                        <>
                          <li>96% completion within 24 hours</li>
                          <li>Detailed and accurate documentation</li>
                          <li>Minimal revision requests from QA</li>
                        </>
                      ) : (
                        <>
                          <li>Performance above department average</li>
                          <li>Consistent improvement over time</li>
                          <li>Positive feedback from supervisors</li>
                        </>
                      )}
                    </ul>
                  </div>
                  
                  <div className="bg-background p-4 rounded-md">
                    <h4 className="font-medium mb-2">Areas for Growth</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {activeCategory === "overall" ? (
                        <>
                          <li>Inservice attendance could be improved</li>
                          <li>Protocol adherence has room for improvement</li>
                          <li>PCR quality good but could be more detailed</li>
                        </>
                      ) : activeCategory === "inserviceAttendance" ? (
                        <>
                          <li>Attendance rate below personal target</li>
                          <li>Missing 2 required sessions this quarter</li>
                          <li>Schedule conflicts identified as main issue</li>
                        </>
                      ) : (
                        <>
                          <li>Some inconsistency in performance</li>
                          <li>Minor areas of improvement identified</li>
                          <li>Additional training may be beneficial</li>
                        </>
                      )}
                    </ul>
                  </div>
                  
                  <div className="bg-background p-4 rounded-md">
                    <h4 className="font-medium mb-2">Recommendations</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {activeCategory === "overall" ? (
                        <>
                          <li>Schedule inservice sessions in advance</li>
                          <li>Review clinical protocols quarterly</li>
                          <li>Consider additional CE opportunities</li>
                        </>
                      ) : activeCategory === "protocolAdherence" ? (
                        <>
                          <li>Review updated cardiac protocols</li>
                          <li>Attend advanced clinical sessions</li>
                          <li>Consider protocol update study group</li>
