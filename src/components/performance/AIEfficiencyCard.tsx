
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, TrendingUp, Clock, Zap, BarChart } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AIEfficiencyCard() {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-semibold">AI Efficiency Insights</h2>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">AI Efficiency Score</p>
                <p className="text-xl font-semibold text-green-600">92%</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Response Time</p>
                <p className="text-xl font-semibold">8.5 minutes</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Productivity Index</p>
                <p className="text-xl font-semibold text-purple-600">7.8/10</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Top Recommendations</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Consider adding more crew during morning peak hours
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Optimize route planning to reduce delays
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Implement additional training for new EMTs to improve response efficiency
              </li>
            </ul>
          </div>
        </TabsContent>
        
        <TabsContent value="detailed">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Performance Breakdown</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Response Time Efficiency</span>
                    <span className="text-sm font-medium">94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Documentation Accuracy</span>
                    <span className="text-sm font-medium">88%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Resource Utilization</span>
                    <span className="text-sm font-medium">91%</span>
                  </div>
                  <Progress value={91} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Patient Satisfaction</span>
                    <span className="text-sm font-medium">96%</span>
                  </div>
                  <Progress value={96} className="h-2" />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Areas for Improvement</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 border-amber-200 bg-amber-50">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart className="h-5 w-5 text-amber-600" />
                    <h4 className="font-medium">Documentation Time</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">Average time to complete documentation is 15% above target. Consider streamlined forms.</p>
                </Card>
                
                <Card className="p-4 border-blue-200 bg-blue-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium">Shift Change Efficiency</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">Handoffs during shift changes taking longer than necessary. Implement standardized process.</p>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="recommendations">
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-green-50 border-green-100">
              <h3 className="text-lg font-semibold text-green-700 mb-2">High Impact Recommendations</h3>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <div className="mt-0.5 text-green-600">•</div>
                  <div>
                    <p className="font-medium">Implement dynamic scheduling</p>
                    <p className="text-sm text-muted-foreground">Use AI to predict high-demand periods and adjust staffing automatically.</p>
                    <p className="text-sm text-green-600 mt-1">Expected improvement: 12-15% in response time</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="mt-0.5 text-green-600">•</div>
                  <div>
                    <p className="font-medium">Enhanced navigation integration</p>
                    <p className="text-sm text-muted-foreground">Upgrade the GPS system to include real-time traffic and construction data.</p>
                    <p className="text-sm text-green-600 mt-1">Expected improvement: 8-10% in transport efficiency</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="p-4 border rounded-lg bg-blue-50 border-blue-100">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">Medium Impact Recommendations</h3>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <div className="mt-0.5 text-blue-600">•</div>
                  <div>
                    <p className="font-medium">Cross-training program</p>
                    <p className="text-sm text-muted-foreground">Implement cross-training to increase flexibility in staff assignments.</p>
                    <p className="text-sm text-blue-600 mt-1">Expected improvement: 7-9% in team performance</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="mt-0.5 text-blue-600">•</div>
                  <div>
                    <p className="font-medium">Digital documentation improvements</p>
                    <p className="text-sm text-muted-foreground">Update mobile forms with smart defaults and voice-to-text capabilities.</p>
                    <p className="text-sm text-blue-600 mt-1">Expected improvement: 15-20% in documentation time</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Continuous Improvement Suggestions</h3>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <div className="mt-0.5 text-gray-600">•</div>
                  <div>
                    <p className="font-medium">Monthly performance reviews</p>
                    <p className="text-sm text-muted-foreground">Conduct data-driven performance reviews with concrete improvement goals.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="mt-0.5 text-gray-600">•</div>
                  <div>
                    <p className="font-medium">Quarterly skills assessment</p>
                    <p className="text-sm text-muted-foreground">Implement regular skills assessments with targeted training follow-ups.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
