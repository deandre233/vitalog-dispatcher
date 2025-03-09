
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, FileUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EmployeePerformanceProps } from "./types/performanceTypes";
import { getScoreColor, getGradeColor } from "./utils/performanceUtils";
import { generateWriteUp } from "./utils/writeUpGenerator";
import { getPerformanceMetrics } from "./data/performanceMetricsData";
import { MetricCard } from "./components/MetricCard";
import { PerformanceHighlights } from "./components/PerformanceHighlights";
import { ImprovementPlan } from "./components/ImprovementPlan";
import { DetailedAnalysis } from "./components/DetailedAnalysis";
import { WriteUpDialog } from "./components/WriteUpDialog";
import { UploadDocumentDialog } from "./components/UploadDocumentDialog";

export function SingleEmployeePerformance({ employeeId, employeeName }: EmployeePerformanceProps) {
  const [activeCategory, setActiveCategory] = useState<string>("overall");
  const [timeRange, setTimeRange] = useState<string>("quarter");
  const [isGeneratingWriteUp, setIsGeneratingWriteUp] = useState(false);
  const [generatedWriteUp, setGeneratedWriteUp] = useState<string>("");
  const [writeUpSeverity, setWriteUpSeverity] = useState<string>("warning");
  const [writeUpSubject, setWriteUpSubject] = useState<string>("general");
  const [writeUpDialogOpen, setWriteUpDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const { toast } = useToast();

  const performanceMetrics = getPerformanceMetrics();
  const currentMetric = performanceMetrics[activeCategory];

  const handleGenerateWriteUp = async () => {
    setIsGeneratingWriteUp(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const metric = performanceMetrics[activeCategory];
      
      // Generate the write-up using our utility function
      const writeUpTemplate = generateWriteUp({
        employeeName,
        writeUpSubject,
        activeCategory,
        metric
      });
      
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
              <MetricCard metric={currentMetric} getScoreColor={getScoreColor} />
              
              <div className="md:w-1/3 space-y-6">
                <PerformanceHighlights activeCategory={activeCategory} />
                <ImprovementPlan activeCategory={activeCategory} />
              </div>
            </div>
            
            <DetailedAnalysis activeCategory={activeCategory} />
          </div>
        </CardContent>
      </Tabs>
      
      <WriteUpDialog
        open={writeUpDialogOpen}
        onOpenChange={setWriteUpDialogOpen}
        employeeId={employeeId}
        generatedWriteUp={generatedWriteUp}
        writeUpSeverity={writeUpSeverity}
        writeUpSubject={writeUpSubject}
        onWriteUpSeverityChange={setWriteUpSeverity}
      />
      
      <UploadDocumentDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        employeeId={employeeId}
      />
    </Card>
  );
}
