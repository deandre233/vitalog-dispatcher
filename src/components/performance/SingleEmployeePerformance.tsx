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
import { PerformanceWriteUpSubject } from "@/types/incidents";

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
  writeUpSubject: PerformanceWriteUpSubject;
}

export function SingleEmployeePerformance({ employeeId, employeeName }: EmployeePerformanceProps) {
  const [activeCategory, setActiveCategory] = useState<string>("overall");
  const [timeRange, setTimeRange] = useState<string>("quarter");
  const [isGeneratingWriteUp, setIsGeneratingWriteUp] = useState(false);
  const [generatedWriteUp, setGeneratedWriteUp] = useState<string>("");
  const [writeUpSeverity, setWriteUpSeverity] = useState<string>("warning");
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
      icon: <Award className="h-5 w-5 text-primary" />,
      writeUpSubject: "overall_performance"
    },
    pcrCompletion: {
      category: "PCR Completion",
      score: 93,
      description: "% of PCRs completed within 24 hours",
      trend: "Improved by 5.2% this quarter",
      grade: 'A',
      departmentAvg: 82,
      icon: <FileText className="h-5 w-5 text-primary" />,
      writeUpSubject: "pcr_completion"
    },
    pcrQuality: {
      category: "PCR Quality",
      score: 87,
      description: "Quality scoring from QA reviews",
      trend: "Stable (+0.3%) this quarter",
      grade: 'B',
      departmentAvg: 80,
      icon: <Star className="h-5 w-5 text-primary" />,
      writeUpSubject: "pcr_quality"
    },
    punctuality: {
      category: "Punctuality",
      score: 92,
      description: "On-time arrival percentage",
      trend: "Improved by 3.1% this quarter",
      grade: 'A',
      departmentAvg: 87,
      icon: <Clock className="h-5 w-5 text-primary" />,
      writeUpSubject: "tardiness"
    },
    inserviceAttendance: {
      category: "Inservice Attendance",
      score: 85,
      description: "% of required inservice hours attended",
      trend: "Declined by 2.5% this quarter",
      grade: 'B',
      departmentAvg: 79,
      icon: <Calendar className="h-5 w-5 text-primary" />,
      writeUpSubject: "inservice_attendance"
    },
    patientFeedback: {
      category: "Patient Feedback",
      score: 90,
      description: "Average patient satisfaction score",
      trend: "Improved by 4.2% this quarter",
      grade: 'A',
      departmentAvg: 83,
      icon: <TrendingUp className="h-5 w-5 text-primary" />,
      writeUpSubject: "patient_feedback"
    },
    protocolAdherence: {
      category: "Protocol Adherence",
      score: 88,
      description: "% adherence to clinical protocols",
      trend: "Improved by 1.7% this quarter",
      grade: 'B',
      departmentAvg: 85,
      icon: <BookOpen className="h-5 w-5 text-primary" />,
      writeUpSubject: "protocol_adherence"
    },
    teamwork: {
      category: "Teamwork",
      score: 91,
      description: "Peer and supervisor evaluations",
      trend: "Improved by 3.8% this quarter",
      grade: 'A',
      departmentAvg: 80,
      icon: <Users2 className="h-5 w-5 text-primary" />,
      writeUpSubject: "teamwork"
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
      const subject = metric.writeUpSubject;
      
      if (metric.score < 70) {
        writeUpTemplate = `PERFORMANCE IMPROVEMENT PLAN\n\nEmployee: ${employeeName}\nCategory: ${metric.category}\nCurrent Score: ${metric.score}/100 (Grade: ${metric.grade})\nDepartment Average: ${metric.departmentAvg}/100\n\nConcern:\nYour performance in ${metric.category.toLowerCase()} is significantly below organizational standards. Recent analysis shows ${metric.trend.toLowerCase()}. This requires immediate and substantial improvement.\n\nExpectations:\n1. Increase your score to at least 80 points within 30 days\n2. Complete additional training in this area\n3. Weekly check-ins with your supervisor\n\nConsequences if not improved:\nFailure to show significant improvement may result in further disciplinary action up to and including termination of employment.`;
      } else if (metric.score < 80) {
        writeUpTemplate = `PERFORMANCE WARNING\n\nEmployee: ${employeeName}\nCategory: ${metric.category}\nCurrent Score: ${metric.score}/100 (Grade: ${metric.grade})\nDepartment Average: ${metric.departmentAvg}/100\n\nConcern:\nYour performance in ${metric.category.toLowerCase()} is below expected standards. Recent analysis shows ${metric.trend.toLowerCase()}. This requires attention and improvement.\n\nExpectations:\n1. Increase your score to at least 85 points within 60 days\n2. Review departmental protocols related to this area\n3. Bi-weekly check-ins with your supervisor\n\nThis warning will be placed in your employment file. Please take this opportunity to improve your performance.`;
      } else if (metric.score < 85) {
        writeUpTemplate = `PERFORMANCE ADVISORY\n\nEmployee: ${employeeName}\nCategory: ${metric.category}\nCurrent Score: ${metric.score}/100 (Grade: ${metric.grade})\nDepartment Average: ${metric.departmentAvg}/100\n\nObservation:\nYour performance in ${metric.category.toLowerCase()} meets minimum standards but has room for improvement. Recent analysis shows ${metric.trend.toLowerCase()}.\n\nRecommendations:\n1. Target increasing your score to 90+ points\n2. Consider additional training opportunities\n3. Monthly review of your progress in this area\n\nThis is not a disciplinary action but an opportunity for professional growth.`;
      } else {
        writeUpTemplate = `PERFORMANCE RECOGNITION\n\nEmployee: ${employeeName}\nCategory: ${metric.category}\nCurrent Score: ${metric.score}/100 (Grade: ${metric.grade})\nDepartment Average: ${metric.departmentAvg}/100\n\nRecognition:\nYour performance in ${metric.category.toLowerCase()} exceeds organizational standards. Recent analysis shows ${metric.trend.toLowerCase()}. This level of excellence contributes significantly to our team's success.\n\nContinued Growth Opportunities:\n1. Consider mentoring other team members in this area\n2. Explore advanced training to further enhance your skills\n3. Participate in developing department best practices\n\nThank you for your outstanding contribution to our organization.`;
      }
      
      switch (subject) {
        case "missed_punch":
          writeUpTemplate += "\n\nSpecific to Missed Punches:\n• Ensure you are using the timeclock app correctly\n• Set reminders at the beginning and end of shifts\n• Report any technical issues immediately to your supervisor";
          break;
        case "tardiness":
          writeUpTemplate += "\n\nSpecific to Punctuality:\n• Plan to arrive 10-15 minutes before shift start\n• Consider alternate routes during high traffic periods\n• Communicate with dispatch if delays are unavoidable";
          break;
        case "pcr_completion":
          writeUpTemplate += "\n\nSpecific to PCR Completion:\n• Allocate time after each call to complete documentation\n• Use mobile documentation when possible\n• Review documentation requirements for common call types";
          break;
        case "pcr_quality":
          writeUpTemplate += "\n\nSpecific to PCR Quality:\n• Focus on narrative completeness and accuracy\n• Document all assessment findings completely\n• Review QA feedback carefully and implement suggestions";
          break;
        case "inservice_attendance":
          writeUpTemplate += "\n\nSpecific to Inservice Attendance:\n• Schedule inservice sessions in your calendar\n• Explore online options when in-person attendance is difficult\n• Complete make-up sessions promptly";
          break;
        case "protocol_adherence":
          writeUpTemplate += "\n\nSpecific to Protocol Adherence:\n• Review updated protocols monthly\n• Attend protocol update sessions\n• Use decision support tools when available";
          break;
        case "patient_feedback":
          writeUpTemplate += "\n\nSpecific to Patient Feedback:\n• Focus on clear communication with patients\n• Address comfort issues proactively\n• Practice empathetic care techniques";
          break;
        case "teamwork":
          writeUpTemplate += "\n\nSpecific to Teamwork:\n• Communicate clearly with partners and colleagues\n• Participate actively in team meetings\n• Support colleagues during high-stress situations";
          break;
        case "overall_performance":
          writeUpTemplate += "\n\nOverall Development Plan:\n• Focus on continuous improvement in all areas\n• Identify personal strengths and leverage them\n• Address performance gaps with targeted training";
          break;
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
          improvement_plan: `Improvement plan for ${performanceMetrics[activeCategory].category.toLowerCase()}`,
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
                        </>
                      ) : (
                        <>
                          <li>Continue current improvement path</li>
                          <li>Share best practices with team members</li>
                          <li>Schedule quarterly performance review</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-accent/40 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Historical Performance</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Last 12 Months Trend</h4>
                    <p className="text-sm text-muted-foreground">
                      {activeCategory === "overall" ? 
                        "Overall score improved from 82 to 89 points over the past year. Most significant improvements in patient feedback and punctuality." :
                        `Performance in ${currentMetric.category} has shown steady improvement over the past year, with scores rising from approximately ${currentMetric.score - 7} to the current ${currentMetric.score}.`
                      }
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Quarterly Comparison</h4>
                    <div className="grid grid-cols-4 gap-2 text-center text-sm">
                      <div>
                        <div className="font-medium">Q1</div>
                        <div className={getScoreColor(currentMetric.score - 5)}>{currentMetric.score - 5}</div>
                      </div>
                      <div>
                        <div className="font-medium">Q2</div>
                        <div className={getScoreColor(currentMetric.score - 3)}>{currentMetric.score - 3}</div>
                      </div>
                      <div>
                        <div className="font-medium">Q3</div>
                        <div className={getScoreColor(currentMetric.score - 1)}>{currentMetric.score - 1}</div>
                      </div>
                      <div>
                        <div className="font-medium">Q4</div>
                        <div className={getScoreColor(currentMetric.score)}>{currentMetric.score}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-accent/40 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Achievement Goals</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Next Quarter Target</span>
                      <span className="text-sm font-medium">{Math.min(currentMetric.score + 3, 100)}/100</span>
                    </div>
                    <Progress value={(currentMetric.score / (currentMetric.score + 3)) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.min(currentMetric.score + 3 - currentMetric.score, 10)} point improvement goal
                    </p>
                  </div>
                  
                  <div className="text-sm space-y-2">
                    <h4 className="font-medium">Action Items</h4>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      {activeCategory === "overall" ? (
                        <>
                          <li>Complete all scheduled inservice training</li>
                          <li>Maintain PCR completion excellence</li>
                          <li>Review protocol updates monthly</li>
                        </>
                      ) : activeCategory === "pcrQuality" ? (
                        <>
                          <li>Attend documentation best practices session</li>
                          <li>Implement narrative improvements</li>
                          <li>Review QA feedback promptly</li>
                        </>
                      ) : activeCategory === "teamwork" ? (
                        <>
                          <li>Volunteer for at least one committee</li>
                          <li>Participate in mentorship program</li>
                          <li>Contribute to team knowledge sharing</li>
                        </>
                      ) : (
                        <>
                          <li>Set specific improvement targets</li>
                          <li>Schedule regular progress check-ins</li>
                          <li>Complete recommended training</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Tabs>

      <Dialog open={writeUpDialogOpen} onOpenChange={setWriteUpDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              AI-Generated Performance Write-up
            </DialogTitle>
            <DialogDescription>
              Based on performance data for {employeeName} in {currentMetric.category}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium">Write-up Severity</h4>
              <Select value={writeUpSeverity} onValueChange={setWriteUpSeverity}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recognition">Recognition</SelectItem>
                  <SelectItem value="advisory">Advisory</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="p-4 border rounded-md bg-gray-50 whitespace-pre-line font-mono text-sm">
              {generatedWriteUp}
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Additional Notes or Edits</h4>
              <Textarea 
                value={customNotes} 
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="Add your own notes or edit the AI-generated content..."
                className="min-h-[150px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setWriteUpDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUploadWriteUp} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-t-2 border-b-2 border-primary-foreground rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : (
                "Save to Employee Record"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileUp className="h-5 w-5" />
              Upload Performance Document
            </DialogTitle>
            <DialogDescription>
              Attach performance-related documents to {employeeName}'s record
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Document Type</label>
                <Select defaultValue="write-up">
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="write-up">Performance Write-up</SelectItem>
                    <SelectItem value="review">Performance Review</SelectItem>
                    <SelectItem value="improvement">Improvement Plan</SelectItem>
                    <SelectItem value="recognition">Recognition</SelectItem>
                    <SelectItem value="certification">Certification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Related Area</label>
                <Select defaultValue={activeCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select related area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overall">Overall Performance</SelectItem>
                    <SelectItem value="pcrCompletion">PCR Completion</SelectItem>
                    <SelectItem value="pcrQuality">PCR Quality</SelectItem>
                    <SelectItem value="punctuality">Punctuality</SelectItem>
                    <SelectItem value="inserviceAttendance">Inservice Attendance</SelectItem>
                    <SelectItem value="patientFeedback">Patient Feedback</SelectItem>
                    <SelectItem value="protocolAdherence">Protocol Adherence</SelectItem>
                    <SelectItem value="teamwork">Teamwork</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Document Description</label>
              <Textarea placeholder="Enter a description of this document..." className="min-h-[80px]" />
            </div>
            
            <div className="border-2 border-dashed rounded-md p-8 text-center">
              <FileUp className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">Drag & drop files here, or click to browse</p>
              <Button variant="outline" className="mt-4">Select File</Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
            <Button>Upload Document</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
