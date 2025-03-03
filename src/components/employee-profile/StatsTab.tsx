
import React from "react";
import { Card } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";

export const StatsTab: React.FC = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Statistics & Metrics</h2>
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Response Time</h3>
            <div className="text-2xl font-bold">4.2 min</div>
            <p className="text-xs text-muted-foreground mt-1">-12% from last month</p>
          </Card>
          
          <Card className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Transports</h3>
            <div className="text-2xl font-bold">78</div>
            <p className="text-xs text-green-600 mt-1">+8% from last month</p>
          </Card>
          
          <Card className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Patient Satisfaction</h3>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-green-600 mt-1">+2% from last month</p>
          </Card>
        </div>
        
        <div className="mt-8">
          <h3 className="font-semibold mb-4">Performance Trends</h3>
          <div className="h-64 bg-muted/30 rounded-md flex items-center justify-center">
            <p className="text-muted-foreground">Chart visualization coming soon</p>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="font-semibold mb-4">AI Performance Insights</h3>
          <Card className="bg-blue-50 p-4 border-blue-200">
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <BarChart2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-blue-800">Consistent High Performance</h4>
                <p className="text-sm text-blue-700 mt-1">This employee consistently shows excellent response times and patient care metrics, placing them in the top 10% of the team.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Card>
  );
};
