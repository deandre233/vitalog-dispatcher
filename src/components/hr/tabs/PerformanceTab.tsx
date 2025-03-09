
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, LineChart, Clock, Zap, Award, User, BarChart, Activity } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useParams } from "react-router-dom";
import { StatisticsSection } from "./performance/StatisticsSection";
import { PCRCompletenessSection } from "./performance/PCRCompletenessSection";
import { useEmployeeDetails } from "@/hooks/useEmployeeDetails";

export function PerformanceTab() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { employee } = useEmployeeDetails(employeeId);

  const employeeName = `${employee?.first_name || ''} ${employee?.last_name || ''}`;

  return (
    <TabsContent value="performance" className="mt-0 animate-in fade-in-50">
      <div className="p-6 space-y-6">
        {/* Performance Summary */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Award className="h-6 w-6 text-amber-500" />
              <div>
                <CardTitle>Performance Summary</CardTitle>
                <p className="text-sm text-muted-foreground">Performance metrics for {employeeName}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Overall Score</span>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-green-600">92.5</span>
                    <span className="text-sm text-muted-foreground mb-1">/ 100</span>
                  </div>
                  <span className="text-xs text-green-600">↑ 2.3 from last period</span>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Team Rank</span>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-blue-600">#3</span>
                    <span className="text-sm text-muted-foreground mb-1">of 12</span>
                  </div>
                  <span className="text-xs text-blue-600">Same as last period</span>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Response Time</span>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">7.8</span>
                    <span className="text-sm text-muted-foreground mb-1">min</span>
                  </div>
                  <span className="text-xs text-green-600">↓ 0.5 from last period</span>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Documentation</span>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-green-600">97.3</span>
                    <span className="text-sm text-muted-foreground mb-1">%</span>
                  </div>
                  <span className="text-xs text-green-600">↑ 1.2% from last period</span>
                </div>
              </Card>
            </div>

            {/* Skills Breakdown */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Skills Breakdown for {employeeName}</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Technical Skills</span>
                    <span className="text-sm font-medium">94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Communication</span>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Reliability</span>
                    <span className="text-sm font-medium">95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Teamwork</span>
                    <span className="text-sm font-medium">90%</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Section */}
        <StatisticsSection />

        {/* PCR Completeness Section */}
        <PCRCompletenessSection />

        {/* Performance Details */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle>Performance Details</CardTitle>
                <p className="text-sm text-muted-foreground">Detailed metrics for {employeeName}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="metrics">
              <TabsList className="mb-6">
                <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="goals">Goals</TabsTrigger>
              </TabsList>
              
              <TabsContent value="metrics">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-100 rounded-md">
                          <Clock className="h-5 w-5 text-blue-600" />
                        </div>
                        <h3 className="font-medium">Response Metrics</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Average Response Time</span>
                          <span className="text-sm font-medium">7.8 min</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Protocol Adherence</span>
                          <span className="text-sm font-medium">98.2%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Response Quality Score</span>
                          <span className="text-sm font-medium">9.1/10</span>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-100 rounded-md">
                          <LineChart className="h-5 w-5 text-purple-600" />
                        </div>
                        <h3 className="font-medium">Efficiency Metrics</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Tasks Completed</span>
                          <span className="text-sm font-medium">142</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Completion Rate</span>
                          <span className="text-sm font-medium">97.9%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Resource Utilization</span>
                          <span className="text-sm font-medium">91.5%</span>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-amber-100 rounded-md">
                          <User className="h-5 w-5 text-amber-600" />
                        </div>
                        <h3 className="font-medium">Patient Care</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Patient Satisfaction</span>
                          <span className="text-sm font-medium">94.8%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Care Quality Index</span>
                          <span className="text-sm font-medium">9.3/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Follow-up Completion</span>
                          <span className="text-sm font-medium">100%</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">{employeeName}'s Recent Achievements</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 rounded-md bg-amber-50 border border-amber-200">
                        <Award className="h-4 w-4 text-amber-600" />
                        <span className="text-sm">Top Performer - Q3 2023</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-md bg-blue-50 border border-blue-200">
                        <Badge className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">100% Documentation Accuracy - August 2023</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-md bg-green-50 border border-green-200">
                        <Zap className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Response Time Improvement Award - July 2023</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="history">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-3">{employeeName}'s Performance History</h3>
                  <div className="h-[300px] flex items-center justify-center border rounded-lg bg-muted/20">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <LineChart className="h-10 w-10" />
                      <p>Performance trend chart will be implemented here</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mt-6">
                    <h4 className="font-medium">Quarterly Performance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                          <span className="font-medium">Q3 2023</span>
                          <div className="text-sm text-muted-foreground">July - September</div>
                        </div>
                        <Badge className="bg-green-600">92.5</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                          <span className="font-medium">Q2 2023</span>
                          <div className="text-sm text-muted-foreground">April - June</div>
                        </div>
                        <Badge className="bg-green-600">90.2</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                          <span className="font-medium">Q1 2023</span>
                          <div className="text-sm text-muted-foreground">January - March</div>
                        </div>
                        <Badge className="bg-blue-600">88.7</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                          <span className="font-medium">Q4 2022</span>
                          <div className="text-sm text-muted-foreground">October - December</div>
                        </div>
                        <Badge className="bg-blue-600">86.5</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="goals">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-3">Personal Performance Goals for {employeeName}</h3>
                  
                  <Card className="p-4 border-green-200 bg-green-50">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-green-600" />
                      Current Goals
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Reduce average response time to 7.5 minutes</span>
                          <span className="font-medium">80%</span>
                        </div>
                        <Progress value={80} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Complete advanced trauma certification</span>
                          <span className="font-medium">50%</span>
                        </div>
                        <Progress value={50} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Achieve 100% documentation compliance</span>
                          <span className="font-medium">97%</span>
                        </div>
                        <Progress value={97} className="h-2" />
                      </div>
                    </div>
                  </Card>
                  
                  <div className="space-y-3 mt-6">
                    <h4 className="font-medium">AI Recommendations for {employeeName}</h4>
                    <div className="space-y-2">
                      <div className="p-3 border rounded-md">
                        <div className="flex items-center gap-2 mb-1">
                          <Brain className="h-4 w-4 text-purple-600" />
                          <span className="font-medium">Training Suggestion</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Consider enrolling in the Advanced Leadership for Medical Response course to strengthen team coordination skills.</p>
                      </div>
                      <div className="p-3 border rounded-md">
                        <div className="flex items-center gap-2 mb-1">
                          <Brain className="h-4 w-4 text-purple-600" />
                          <span className="font-medium">Performance Insight</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Morning shifts show higher efficiency (95%) compared to night shifts (89%). Consider optimizing night routines.</p>
                      </div>
                      <div className="p-3 border rounded-md">
                        <div className="flex items-center gap-2 mb-1">
                          <Brain className="h-4 w-4 text-purple-600" />
                          <span className="font-medium">Career Path</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Based on current performance, this employee would excel as a Field Training Officer or Shift Supervisor within 6-12 months.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
}
