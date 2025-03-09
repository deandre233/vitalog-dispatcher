
import { Card } from "@/components/ui/card";
import { AlertsConfig as AlertsConfigComponent } from "@/components/dashboard/AlertsConfig";
import { MainLayout } from "@/components/layout/MainLayout";
import { Brain, Zap, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

const AlertsConfig = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimizeAlerts = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      toast.success("Alerts optimized by AI", {
        description: "Thresholds and trigger conditions have been optimized based on historical data",
      });
    }, 2000);
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="p-6 shadow-lg border-l-4 border-l-medical-secondary bg-gradient-to-br from-white to-blue-50/30">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-medical-primary mb-2 flex items-center gap-2">
              <Zap className="h-6 w-6 text-medical-secondary" />
              Alerts Configuration
            </h2>
            <p className="text-gray-600">
              Configure your dispatch system alerts and notifications
            </p>
          </div>
          
          <AlertsConfigComponent />
        </Card>
        
        <Card className="p-6 shadow-md border border-medical-secondary/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-medical-primary" />
              <h3 className="font-semibold text-lg text-medical-primary">AI Alert Optimization</h3>
            </div>
            <Button 
              onClick={handleOptimizeAlerts} 
              disabled={isOptimizing} 
              className="bg-gradient-to-r from-medical-gradient-start to-medical-gradient-end text-white"
            >
              {isOptimizing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Optimize Alerts
                </>
              )}
            </Button>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Our AI can analyze your historical data to suggest optimal alert thresholds 
            that reduce false positives while ensuring critical situations are detected.
          </p>
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium text-medical-primary mb-2">AI Insights</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="inline-block h-5 w-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center">
                  1
                </span>
                Your "high traffic delay" alert triggers too frequently (92% of dispatches). 
                Consider increasing the threshold from 10 to 15 minutes.
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block h-5 w-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center">
                  2
                </span>
                Weather alerts are most effective when set at "moderate" sensitivity 
                for your region's typical conditions.
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block h-5 w-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center">
                  3
                </span>
                Hospital overcrowding alerts should be configured differently for 
                weekdays vs. weekends based on historical patterns.
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AlertsConfig;
