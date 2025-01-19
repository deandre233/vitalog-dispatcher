import { Card } from "@/components/ui/card";
import { Ambulance, Clock, Users, Brain } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const metrics = [
  {
    title: "Active Dispatches",
    value: "12",
    icon: Ambulance,
    change: "+2",
    aiInsight: "20% higher than usual for this time",
  },
  {
    title: "Average Response Time",
    value: "8.5 min",
    icon: Clock,
    change: "-0.5",
    aiInsight: "Improved by 15% with new route optimization",
  },
  {
    title: "Available Crews",
    value: "8",
    icon: Users,
    change: "0",
    aiInsight: "Optimal crew distribution for current demand",
  },
  {
    title: "AI Efficiency Score",
    value: "92%",
    icon: Brain,
    change: "+5",
    aiInsight: "Routes optimized for current traffic conditions",
  },
];

export function DashboardMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
      {metrics.map((metric) => (
        <TooltipProvider key={metric.title}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="p-6 cursor-help transition-all hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{metric.title}</p>
                    <h3 className="text-2xl font-bold text-medical-primary mt-2">
                      {metric.value}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      <span
                        className={metric.change.startsWith("+") ? "text-green-500" : metric.change.startsWith("-") ? "text-red-500" : "text-gray-500"}
                      >
                        {metric.change}
                      </span>{" "}
                      from last hour
                    </p>
                  </div>
                  <metric.icon className="w-8 h-8 text-medical-secondary" />
                </div>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p>{metric.aiInsight}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}