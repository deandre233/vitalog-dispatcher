
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
          <Card className="relative overflow-hidden p-6 cursor-help group hover:shadow-purple-500/20 hover:shadow-lg transition-shadow duration-300 border-[#334155] bg-[#1e293b]">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-800/10 to-indigo-800/10 opacity-50" />
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">{title}</p>
                  <h3 className="text-2xl font-bold text-white mt-2 group-hover:text-purple-400 transition-colors">
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
                <div className="p-2 rounded-full bg-purple-900/30 group-hover:bg-purple-800/40 transition-colors">
                  <Icon className="w-8 h-8 text-purple-400" />
                </div>
              </div>
            </div>
          </Card>
        </TooltipTrigger>
        <TooltipContent className="bg-[#1e293b] border-[#334155] text-white">
          <p>{aiInsight}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
