
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Award, ArrowUp, ArrowDown, Minus, Filter, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface EmployeeRanking {
  id: string;
  name: string;
  avatar: string;
  position: string;
  score: number;
  change: 'up' | 'down' | 'none';
  changeAmount: number;
  skillScores: {
    communication: number;
    technical: number;
    reliability: number;
    teamwork: number;
  };
}

export function PerformanceRankings() {
  const [timeRange, setTimeRange] = useState<string>("month");
  const [rankingType, setRankingType] = useState<string>("overall");

  // Mock data - in a real app this would come from an API
  const rankingData: EmployeeRanking[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: "",
      position: "Paramedic",
      score: 94,
      change: 'up',
      changeAmount: 3,
      skillScores: {
        communication: 92,
        technical: 96,
        reliability: 95,
        teamwork: 93
      }
    },
    {
      id: "2",
      name: "Michael Chen",
      avatar: "",
      position: "EMT",
      score: 92,
      change: 'up',
      changeAmount: 1,
      skillScores: {
        communication: 90,
        technical: 94,
        reliability: 92,
        teamwork: 91
      }
    },
    {
      id: "3",
      name: "David Rodriguez",
      avatar: "",
      position: "Paramedic",
      score: 89,
      change: 'down',
      changeAmount: 2,
      skillScores: {
        communication: 88,
        technical: 90,
        reliability: 87,
        teamwork: 92
      }
    },
    {
      id: "4",
      name: "Emily Taylor",
      avatar: "",
      position: "EMT-Advanced",
      score: 87,
      change: 'none',
      changeAmount: 0,
      skillScores: {
        communication: 89,
        technical: 85,
        reliability: 88,
        teamwork: 90
      }
    },
    {
      id: "5",
      name: "James Wilson",
      avatar: "",
      position: "EMT",
      score: 85,
      change: 'up',
      changeAmount: 4,
      skillScores: {
        communication: 83,
        technical: 86,
        reliability: 89,
        teamwork: 84
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

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-6 w-6 text-amber-500" />
            <div>
              <CardTitle>AI Performance Rankings</CardTitle>
              <CardDescription>Employee performance based on AI analysis</CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={rankingType} onValueChange={setRankingType}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Ranking Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overall">Overall</SelectItem>
                <SelectItem value="technical">Technical Skills</SelectItem>
                <SelectItem value="communication">Communication</SelectItem>
                <SelectItem value="reliability">Reliability</SelectItem>
                <SelectItem value="teamwork">Teamwork</SelectItem>
              </SelectContent>
            </Select>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Filter Rankings</h4>
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Position</h5>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Positions</SelectItem>
                        <SelectItem value="paramedic">Paramedic</SelectItem>
                        <SelectItem value="emt">EMT</SelectItem>
                        <SelectItem value="emt-advanced">EMT-Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Performance Trend</h5>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Select trend" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Trends</SelectItem>
                        <SelectItem value="improving">Improving</SelectItem>
                        <SelectItem value="declining">Declining</SelectItem>
                        <SelectItem value="stable">Stable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end">
                    <Button size="sm">Apply Filters</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rankingData.map((employee, index) => (
            <div key={employee.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground font-semibold">
                  {index === 0 ? (
                    <Crown className="h-5 w-5 text-amber-500" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <Avatar className="h-10 w-10 border">
                  <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  {employee.avatar && <AvatarImage src={employee.avatar} alt={employee.name} />}
                </Avatar>
                <div>
                  <div className="font-medium">{employee.name}</div>
                  <div className="text-sm text-muted-foreground">{employee.position}</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="hidden md:block w-48">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Performance Score</span>
                    <span className={getScoreColor(employee.score)}>{employee.score}%</span>
                  </div>
                  <Progress value={employee.score} className="h-2" />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className={`text-lg font-semibold ${getScoreColor(employee.score)}`}>
                    {employee.score}
                  </div>
                  {getChangeIcon(employee.change, employee.changeAmount)}
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">Details</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-96">
                    <div className="space-y-4">
                      <h4 className="font-medium text-lg">{employee.name}</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Communication</span>
                            <span className={getScoreColor(employee.skillScores.communication)}>
                              {employee.skillScores.communication}%
                            </span>
                          </div>
                          <Progress value={employee.skillScores.communication} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Technical Skills</span>
                            <span className={getScoreColor(employee.skillScores.technical)}>
                              {employee.skillScores.technical}%
                            </span>
                          </div>
                          <Progress value={employee.skillScores.technical} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Reliability</span>
                            <span className={getScoreColor(employee.skillScores.reliability)}>
                              {employee.skillScores.reliability}%
                            </span>
                          </div>
                          <Progress value={employee.skillScores.reliability} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Teamwork</span>
                            <span className={getScoreColor(employee.skillScores.teamwork)}>
                              {employee.skillScores.teamwork}%
                            </span>
                          </div>
                          <Progress value={employee.skillScores.teamwork} className="h-2" />
                        </div>
                      </div>
                      <div className="border-t pt-2">
                        <h5 className="text-sm font-medium mb-1">AI Recommendations</h5>
                        <p className="text-sm text-muted-foreground">
                          {index === 0 
                            ? "Continue mentoring junior team members. Consider advanced leadership training."
                            : "Focus on improving technical skills with additional training sessions. Communication skills are strong."}
                        </p>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
