
import { Progress } from "@/components/ui/progress";
import { BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DispatchStatsProps {
  statsVisible: boolean;
  setStatsVisible: (visible: boolean) => void;
  stats: {
    totalActive: number;
    unassigned: number;
    inProgress: number;
    highPriority: number;
    averageResponse: number;
    systemEfficiency: string;
  };
}

export function DispatchStats({ statsVisible, setStatsVisible, stats }: DispatchStatsProps) {
  if (!statsVisible) return null;

  return (
    <div className="glass-panel mb-4 p-4 border border-white/10 rounded-lg bg-white/5 backdrop-blur-lg animate-fade-in">
      <div className="grid grid-cols-6 gap-4">
        <div className="flex flex-col items-center">
          <span className="text-xs text-white/60">Total</span>
          <span className="text-xl font-bold text-white">{stats.totalActive}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-white/60">Unassigned</span>
          <span className="text-xl font-bold text-red-400">{stats.unassigned}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-white/60">In Progress</span>
          <span className="text-xl font-bold text-green-400">{stats.inProgress}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-white/60">High Priority</span>
          <span className="text-xl font-bold text-yellow-400">{stats.highPriority}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-white/60">Avg Response</span>
          <span className="text-xl font-bold text-blue-400">{stats.averageResponse}m</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-white/60">Efficiency</span>
          <span className="text-xl font-bold text-purple-400">{stats.systemEfficiency}%</span>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between text-xs text-white/60 mb-1">
          <span>System Efficiency</span>
          <span>{stats.systemEfficiency}%</span>
        </div>
        <Progress value={parseFloat(stats.systemEfficiency)} className="h-1 bg-white/10">
          <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
        </Progress>
      </div>
    </div>
  );
}
