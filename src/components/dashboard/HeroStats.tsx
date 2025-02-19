
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface StatItem {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface HeroStatsProps {
  stats: StatItem[];
}

export function HeroStats({ stats }: HeroStatsProps) {
  const handleNewDispatch = () => {
    toast.success("Creating new dispatch...", {
      description: "Initializing dispatch form",
    });
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl" />
      <div className="relative bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
              Command Center
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl">
              Advanced dispatch management system with real-time monitoring and AI-powered insights
            </p>
            <Button onClick={handleNewDispatch} 
              className="relative group bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition" />
              <div className="relative flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                New Dispatch
              </div>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full lg:w-auto">
            {stats.map((stat, index) => (
              <div key={index} className="bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-${stat.color}-500/20 flex items-center justify-center`}>
                    <stat.icon className={`w-4 h-4 text-${stat.color}-400`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-gray-400">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
