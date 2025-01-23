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
          <Card className="p-6 cursor-help transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <h3 className="text-2xl font-bold text-medical-primary mt-2">
                  {value}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  <span
                    className={change.startsWith("+") ? "text-green-500" : change.startsWith("-") ? "text-red-500" : "text-gray-500"}
                  >
                    {change}
                  </span>{" "}
                  from last hour
                </p>
              </div>
              <Icon className="w-8 h-8 text-medical-secondary" />
            </div>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <p>{aiInsight}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}