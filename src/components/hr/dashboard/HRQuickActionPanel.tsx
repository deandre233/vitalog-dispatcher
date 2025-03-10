
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QuickAction } from "./quick-actions/QuickAction";
import { getQuickActionsData } from "./quick-actions/quickActionsData";

export function HRQuickActionPanel() {
  const { toast } = useToast();
  
  const handleToast = (title: string, description: string) => {
    toast({ title, description });
  };

  const actions = getQuickActionsData(handleToast);

  return (
    <Card className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center font-semibold text-blue-700">
          <Zap className="mr-2 h-5 w-5 text-blue-500" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-4 p-2">
          {actions.map((action, index) => (
            <QuickAction key={index} {...action} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
