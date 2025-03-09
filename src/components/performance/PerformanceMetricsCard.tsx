
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, Activity, Users, Clock, Zap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function PerformanceMetricsCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-blue-600" />
          <CardTitle>Performance Metrics</CardTitle>
        </div>
        <Select defaultValue="30days">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="quarter">This quarter</SelectItem>
            <SelectItem value="year">This year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="response">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="response">Response Time</TabsTrigger>
            <TabsTrigger value="utilization">Unit Utilization</TabsTrigger>
            <TabsTrigger value="completion">Task Completion</TabsTrigger>
          </TabsList>
          
          <TabsContent value="response">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="p-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Average Response</span>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">8.2</span>
                    <span className="text-sm text-muted-foreground mb-1">min</span>
                  </div>
                  <span className="text-xs text-green-600">↓ 0.3 from last period</span>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">90th Percentile</span>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">12.7</span>
                    <span className="text-sm text-muted-foreground mb-1">min</span>
                  </div>
                  <span className="text-xs text-green-600">↓ 0.5 from last period</span>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Target Compliance</span>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">94.2</span>
                    <span className="text-sm text-muted-foreground mb-1">%</span>
                  </div>
                  <span className="text-xs text-green-600">↑ 2.1% from last period</span>
                </div>
              </Card>
            </div>
            
            <div className="h-[300px] flex items-center justify-center border rounded-lg bg-muted/20">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <LineChart className="h-10 w-10" />
                <p>Response time trend chart will be implemented here</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="utilization">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="p-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Unit Utilization</span>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">72.5</span>
                    <span className="text-sm text-muted-foreground mb-1">%</span>
                  </div>
                  <span className="text-xs text-green-600">↑ 3.2% from last period</span>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Calls Per Unit</span>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">5.8</span>
                    <span className="text-sm text-muted-foreground mb-1">daily</span>
                  </div>
                  <span className="text-xs text-amber-600">↑ 0.3 from last period</span>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Idle Time</span>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">126</span>
                    <span className="text-sm text-muted-foreground mb-1">min/day</span>
                  </div>
                  <span className="text-xs text-green-600">↓ 14 from last period</span>
                </div>
              </Card>
            </div>
            
            <div className="h-[300px] flex items-center justify-center border rounded-lg bg-muted/20">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <BarChart className="h-10 w-10" />
                <p>Unit utilization charts will be implemented here</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="completion">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="p-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Documentation</span>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">96.3</span>
                    <span className="text-sm text-muted-foreground mb-1">%</span>
                  </div>
                  <span className="text-xs text-green-600">↑ 1.2% from last period</span>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Task Completion</span>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">94.7</span>
                    <span className="text-sm text-muted-foreground mb-1">%</span>
                  </div>
                  <span className="text-xs text-green-600">↑ 0.8% from last period</span>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Protocol Adherence</span>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">98.2</span>
                    <span className="text-sm text-muted-foreground mb-1">%</span>
                  </div>
                  <span className="text-xs text-green-600">↑ 0.5% from last period</span>
                </div>
              </Card>
            </div>
            
            <div className="h-[300px] flex items-center justify-center border rounded-lg bg-muted/20">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Zap className="h-10 w-10" />
                <p>Task completion metrics will be implemented here</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
