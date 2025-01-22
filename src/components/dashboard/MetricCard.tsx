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
          <Card className="relative overflow-hidden p-6 cursor-help group hover:shadow-glow transition-shadow duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-medical-card-start to-medical-card-end opacity-50" />
            <div className="relative z-10">
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