
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  change: string;
  aiInsight: string;
}

export function MetricCard({ title, value, icon: Icon, change, aiInsight }: MetricCardProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="futuristic-card p-6 cursor-help group hover-glow transition-all duration-300">
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">{title}</p>
                  <h3 className="text-2xl font-bold text-gradient-purple mt-2">
                    {value}
                  </h3>
                  <p className="text-sm mt-2">
                    <span
                      className={change.startsWith("+") ? "text-green-400" : change.startsWith("-") ? "text-red-400" : "text-gray-400"}
                    >
                      {change}
                    </span>{" "}
                    <span className="text-gray-500">from last hour</span>
                  </p>
                </div>
                <div className="p-2 rounded-full purple-glass">
                  <Icon className="w-8 h-8 text-purple-400 pulse-glow" />
                </div>
              </div>
            </div>
          </Card>
        </TooltipTrigger>
        <TooltipContent className="blue-glass">
          <p className="text-shadow-sm">{aiInsight}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
