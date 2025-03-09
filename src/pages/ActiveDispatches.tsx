
import { DispatchBoard } from "@/components/dashboard/DispatchBoard";
import { MainLayout } from "@/components/layout/MainLayout";
import { AIDispatchInsights } from "@/components/dispatch/ai/AIDispatchInsights";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ActiveDispatches = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimizeOperations = () => {
    setIsOptimizing(true);
    // Simulate AI optimization process
    setTimeout(() => {
      setIsOptimizing(false);
      toast.success("Operations optimized by AI", {
        description: "Dispatch order and crew assignments have been optimized",
      });
    }, 2000);
  };

  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DispatchBoard />
        </div>
        
        <div className="space-y-6">
          <Card className="p-4 shadow-md border border-medical-secondary/20 bg-gradient-to-br from-white to-blue-50/30">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-5 w-5 text-medical-primary" />
              <h3 className="font-semibold text-lg text-medical-primary">Operations AI</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Use AI to optimize your active dispatches for maximum efficiency and reduced response times.
            </p>
            <Button 
              onClick={handleOptimizeOperations} 
              disabled={isOptimizing} 
              className="w-full bg-gradient-to-r from-medical-gradient-start to-medical-gradient-end text-white"
            >
              {isOptimizing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Optimize Operations
                </>
              )}
            </Button>
          </Card>
          
          <AIDispatchInsights />
        </div>
      </div>
    </MainLayout>
  );
};

export default ActiveDispatches;
