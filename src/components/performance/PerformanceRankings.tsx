import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Award, 
  ArrowUp, 
  ArrowDown, 
  Minus, 
  Filter, 
  Crown, 
  Clock, 
  FileText, 
  BookOpen,
  Calendar,
  Star,
  TrendingUp,
  TrendingDown,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EmployeeRanking {
  id: string;
  name: string;
  avatar: string;
  position: string;
  overallScore: number;
  change: 'up' | 'down' | 'none';
  changeAmount: number;
  skillScores: {
    pcrCompletion: number;
    pcrQuality: number;
    punctuality: number;
    inserviceAttendance: number;
    patientFeedback: number;
    protocolAdherence: number;
    teamwork: number;
    certification: number;
  };
  gradeLevel: 'A' | 'B' | 'C' | 'D' | 'F';
  rank: number;
}

export function PerformanceRankings() {
  const [timeRange, setTimeRange] = useState<string>("quarter");
  const [activeCategory, setActiveCategory] = useState<string>("overall");

  // Mock data - in a real app this would come from an API
  const rankingData: EmployeeRanking[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: "",
      position: "Paramedic",
      overallScore: 94,
      change: 'up',
      changeAmount: 3,
      gradeLevel: 'A',
      rank: 1,
      skillScores: {
        pcrCompletion: 98,
        pcrQuality: 95,
        punctuality: 92,
        inserviceAttendance: 100,
        patientFeedback: 91,
        protocolAdherence: 97,
        teamwork: 93,
        certification: 95
      }
    },
    {
      id: "2",
      name: "Michael Chen",
      avatar: "",
      position: "EMT",
      overallScore: 92,
      change: 'up',
      changeAmount: 1,
      gradeLevel: 'A',
      rank: 2,
      skillScores: {
        pcrCompletion: 94,
        pcrQuality: 93,
        punctuality: 96,
        inserviceAttendance: 90,
        patientFeedback: 95,
        protocolAdherence: 89,
        teamwork: 97,
        certification: 92
      }
    },
    {
      id: "3",
      name: "David Rodriguez",
      avatar: "",
      position: "Paramedic",
      overallScore: 89,
      change: 'down',
      changeAmount: 2,
      gradeLevel: 'B',
      rank: 3,
      skillScores: {
        pcrCompletion: 87,
        pcrQuality: 90,
        punctuality: 85,
        inserviceAttendance: 95,
        patientFeedback: 92,
        protocolAdherence: 88,
        teamwork: 91,
        certification: 84
      }
    },
    {
      id: "4",
      name: "Emily Taylor",
      avatar: "",
      position: "EMT-Advanced",
      overallScore: 87,
      change: 'none',
      changeAmount: 0,
      gradeLevel: 'B',
      rank: 4,
      skillScores: {
        pcrCompletion: 90,
        pcrQuality: 86,
        punctuality: 88,
        inserviceAttendance: 85,
        patientFeedback: 93,
        protocolAdherence: 84,
        teamwork: 89,
        certification: 80
      }
    },
    {
      id: "5",
      name: "James Wilson",
      avatar: "",
      position: "EMT",
      overallScore: 78,
      change: 'up',
      changeAmount: 4,
      gradeLevel: 'C',
      rank: 5,
      skillScores: {
        pcrCompletion: 75,
        pcrQuality: 76,
        punctuality: 89,
        inserviceAttendance: 70,
        patientFeedback: 84,
        protocolAdherence: 79,
        teamwork: 83,
        certification: 70
      }
    }
  ];

  const getChangeIcon = (change: 'up' | 'down' | 'none', amount: number) => {
    if (change === 'up') {
      return (
        <Badge variant="success" className="flex items-center gap-1 px-2 py-1">
          <ArrowUp className="h-3 w-3" />
          <span>{amount}</span>
        </Badge>
      );
    } else if (change === 'down') {
      return (
        <Badge variant="destructive" className="flex items-center gap-1 px-2 py-1">
          <ArrowDown className="h-3 w-3" />
          <span>{amount}</span>
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
        <Minus className="h-3 w-3" />
        <span>0</span>
      </Badge>
    );
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pcrCompletion': return <FileText className="h-4 w-4 mr-1" />;
      case 'pcrQuality': return <Star className="h-4 w-4 mr-1" />;
      case 'punctuality': return <Clock className="h-4 w-4 mr-1" />;
      case 'inserviceAttendance': return <Calendar className="h-4 w-4 mr-1" />;
      case 'patientFeedback': return <TrendingUp className="h-4 w-4 mr-1" />;
      case 'protocolAdherence': return <BookOpen className="h-4 w-4 mr-1" />;
      case 'teamwork': return <Users className="h-4 w-4 mr-1" />;
      case 'certification': return <Award className="h-4 w-4 mr-1" />;
      default: return <Award className="h-4 w-4 mr-1" />;
    }
  };

  const renderEmployeeScore = (employee: EmployeeRanking, category: string) => {
    let score: number;
    
    if (category === 'overall') {
      score = employee.overallScore;
    } else {
      score = employee.skillScores[category as keyof typeof employee.skillScores];
    }
    
    return (
      <div className="flex flex-col items-center gap-1">
        <div className={`text-lg font-semibold ${getScoreColor(score)}`}>
          {score}
        </div>
      </div>
    );
  };

  // Sort employees based on active category
  const getSortedEmployees = () => {
    return [...rankingData].sort((a, b) => {
      if (activeCategory === 'overall') {
        return b.overallScore - a.overallScore;
      }
      return b.skillScores[activeCategory as keyof typeof b.skillScores] - 
             a.skillScores[activeCategory as keyof typeof a.skillScores];
    });
  };

  const sortedEmployees = getSortedEmployees();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-6 w-6 text-amber-500" />
            <div>
              <CardTitle>AI Performance Rankings</CardTitle>
              <CardDescription>Employee grades and rankings across key performance areas</CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
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
            <TabsTrigger value="certification" className="text-xs">Certification</TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent>
          <div className="space-y-4">
            <div className="border-b border-gray-200 mb-4 pb-2 flex items-center justify-between text-sm font-medium text-gray-500">
              <div className="w-1/2">Employee</div>
              <div className="w-1/6 text-center">Rank</div>
              <div className="w-1/6 text-center">Grade</div>
              <div className="w-1/6 text-center">Score</div>
            </div>
            
            {sortedEmployees.map((employee, index) => (
              <div 
                key={employee.id} 
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/10 transition-colors"
              >
                <div className="flex items-center gap-4 w-1/2">
                  <Avatar className="h-10 w-10 border">
                    <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    {employee.avatar && <AvatarImage src={employee.avatar} alt={employee.name} />}
                  </Avatar>
                  <div>
                    <div className="font-medium">{employee.name}</div>
                    <div className="text-sm text-muted-foreground">{employee.position}</div>
                  </div>
                </div>
                
                <div className="w-1/6 flex justify-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground font-bold">
                    {index === 0 ? (
                      <Crown className="h-5 w-5 text-amber-500" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                </div>
                
                <div className="w-1/6 flex justify-center">
                  <div className={`text-center px-3 py-1 rounded-md border font-bold ${getGradeColor(employee.gradeLevel)}`}>
                    {employee.gradeLevel}
                  </div>
                </div>
                
                <div className="w-1/6 flex justify-center items-center gap-2">
                  {renderEmployeeScore(employee, activeCategory)}
                  {activeCategory === 'overall' && getChangeIcon(employee.change, employee.changeAmount)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 border-t pt-4">
            <h3 className="font-medium mb-2 flex items-center">
              {getCategoryIcon(activeCategory)}
              {activeCategory === 'overall' ? 'Overall Performance Metrics' : 
                activeCategory === 'pcrCompletion' ? 'PCR Completion Metrics' :
                activeCategory === 'pcrQuality' ? 'PCR Quality Metrics' :
                activeCategory === 'punctuality' ? 'Punctuality Metrics' :
                activeCategory === 'inserviceAttendance' ? 'Inservice Attendance Metrics' :
                activeCategory === 'patientFeedback' ? 'Patient Feedback Metrics' :
                activeCategory === 'protocolAdherence' ? 'Protocol Adherence Metrics' :
                activeCategory === 'certification' ? 'Certification Metrics' : 'Performance Metrics'
              }
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="font-medium mb-1">
                  {activeCategory === 'overall' ? 'Evaluation Criteria' : 
                   activeCategory === 'pcrCompletion' ? 'PCR Submission Rate' :
                   activeCategory === 'pcrQuality' ? 'Narrative Quality' :
                   activeCategory === 'punctuality' ? 'Shift Arrival Time' :
                   activeCategory === 'inserviceAttendance' ? 'Attendance Rate' :
                   activeCategory === 'patientFeedback' ? 'Patient Satisfaction' :
                   activeCategory === 'protocolAdherence' ? 'Protocol Compliance' :
                   activeCategory === 'certification' ? 'CE Hours Completed' : 'Key Metrics'
                  }
                </p>
                <p className="text-gray-600">
                  {activeCategory === 'overall' ? 'Based on combined scores across all categories' :
                   activeCategory === 'pcrCompletion' ? '% of PCRs completed within 24 hours' :
                   activeCategory === 'pcrQuality' ? 'Quality scoring from QA reviews' :
                   activeCategory === 'punctuality' ? 'On-time arrival percentage' :
                   activeCategory === 'inserviceAttendance' ? '% of required inservice hours attended' :
                   activeCategory === 'patientFeedback' ? 'Average patient satisfaction score' :
                   activeCategory === 'protocolAdherence' ? '% adherence to clinical protocols' :
                   activeCategory === 'certification' ? '% of required CE hours completed' : 'Key performance indicators'
                  }
                </p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="font-medium mb-1">Performance Trend</p>
                <div className="flex items-center">
                  {activeCategory === 'overall' ? (
                    <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                  ) : activeCategory === 'pcrQuality' ? (
                    <TrendingDown className="h-4 w-4 text-amber-600 mr-2" />
                  ) : (
                    <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                  )}
                  <span className="text-gray-600">
                    {activeCategory === 'overall' ? 'Overall scores improving by 2.4% this quarter' :
                     activeCategory === 'pcrCompletion' ? 'PCR completion time improved by 14% this quarter' :
                     activeCategory === 'pcrQuality' ? 'Minor decline in documentation quality (1.2%)' :
                     activeCategory === 'punctuality' ? 'On-time arrival improved by 3.8%' :
                     activeCategory === 'inserviceAttendance' ? 'Attendance increased 4.7% from last quarter' :
                     activeCategory === 'patientFeedback' ? 'Patient satisfaction up by 2.1%' :
                     activeCategory === 'protocolAdherence' ? 'Protocol compliance improved by 1.8%' :
                     activeCategory === 'certification' ? 'CE completion rate up 5.3%' : 'Performance trending upward'
                    }
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="font-medium mb-1">Department Average</p>
                <div className="flex items-center space-x-2">
                  <Progress value={
                    activeCategory === 'overall' ? 84 :
                    activeCategory === 'pcrCompletion' ? 82 :
                    activeCategory === 'pcrQuality' ? 80 :
                    activeCategory === 'punctuality' ? 87 :
                    activeCategory === 'inserviceAttendance' ? 79 :
                    activeCategory === 'patientFeedback' ? 83 :
                    activeCategory === 'protocolAdherence' ? 85 :
                    activeCategory === 'certification' ? 81 : 84
                  } className="h-2 flex-1" />
                  <span className={getScoreColor(
                    activeCategory === 'overall' ? 84 :
                    activeCategory === 'pcrCompletion' ? 82 :
                    activeCategory === 'pcrQuality' ? 80 :
                    activeCategory === 'punctuality' ? 87 :
                    activeCategory === 'inserviceAttendance' ? 79 :
                    activeCategory === 'patientFeedback' ? 83 :
                    activeCategory === 'protocolAdherence' ? 85 :
                    activeCategory === 'certification' ? 81 : 84
                  )}>
                    {activeCategory === 'overall' ? "84%" :
                     activeCategory === 'pcrCompletion' ? "82%" :
                     activeCategory === 'pcrQuality' ? "80%" :
                     activeCategory === 'punctuality' ? "87%" :
                     activeCategory === 'inserviceAttendance' ? "79%" :
                     activeCategory === 'patientFeedback' ? "83%" :
                     activeCategory === 'protocolAdherence' ? "85%" :
                     activeCategory === 'certification' ? "81%" : "84%"
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Tabs>
    </Card>
  );
}
