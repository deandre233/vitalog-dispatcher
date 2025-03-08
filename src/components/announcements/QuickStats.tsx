
import { Activity, LineChart, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function QuickStats() {
  return (
    <Card className="bg-white/50 backdrop-blur-md border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-700">Quick Stats</CardTitle>
        <CardDescription>Real-time metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Active Broadcasts</span>
          </div>
          <span className="text-xl font-bold text-green-600">12</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-3">
            <LineChart className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Read Rate</span>
          </div>
          <span className="text-xl font-bold text-blue-600">85%</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Pending</span>
          </div>
          <span className="text-xl font-bold text-purple-600">3</span>
        </div>
      </CardContent>
    </Card>
  );
}
