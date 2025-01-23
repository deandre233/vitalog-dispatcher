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
          <Card className="futuristic-card p-6 cursor-help group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-medical-primary/80">{title}</p>
                <h3 className="text-2xl font-bold text-medical-primary mt-2 group-hover:text-medical-secondary transition-colors">
                  {value}
                </h3>
                <p className="text-sm mt-2">
                  <span
                    className={change.startsWith("+") ? "text-green-600" : change.startsWith("-") ? "text-red-600" : "text-medical-primary/60"}
                  >
                    {change}
                  </span>{" "}
                  <span className="text-medical-primary/60">from last hour</span>
                </p>
              </div>
              <div className="p-2 rounded-full bg-medical-accent group-hover:bg-medical-highlight transition-colors">
                <Icon className="w-8 h-8 text-medical-secondary" />
              </div>
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