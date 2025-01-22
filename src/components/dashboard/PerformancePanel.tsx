import { Card } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, Clock, Brain, AlertTriangle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  description: string;
}

const MetricCard = ({ title, value, change, icon: Icon, description }: MetricCardProps) => {
  const isPositive = change.startsWith('+');
  const isNegative = change.startsWith('-');
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="p-6 relative overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-medical-accent/10 to-medical-highlight/10" />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Icon className="w-5 h-5 text-medical-secondary" />
                  <h3 className="text-sm font-medium text-medical-primary">{title}</h3>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-medical-primary">{value}</p>
                <p className="text-sm">
                  <span className={`font-medium ${
                    isPositive ? 'text-green-600' : 
                    isNegative ? 'text-red-600' : 
                    'text-medical-primary/60'
                  }`}>
                    {change}
                  </span>
                  <span className="text-medical-primary/60 ml-1">from last month</span>
                </p>
              </div>
            </div>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <p>{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const metrics = [
  {
    title: "Profit Margin",
    value: "32.5%",
    change: "+2.1%",
    icon: DollarSign,
    description: "Overall profit margin across all services"
  },
  {
    title: "Crew Efficiency",
    value: "94%",
    change: "+3%",
    icon: Users,
    description: "Average crew performance rating"
  },
  {
    title: "Response Time",
    value: "8.2 min",
    change: "-0.5 min",
    icon: Clock,
    description: "Average emergency response time"
  },
  {
    title: "AI Optimization",
    value: "97%",
    change: "+4%",
    icon: Brain,
    description: "Route optimization efficiency"
  },
  {
    title: "Revenue Growth",
    value: "$142K",
    change: "+12.3%",
    icon: TrendingUp,
    description: "Monthly revenue compared to last period"
  },
  {
    title: "Incident Rate",
    value: "0.5%",
    change: "-0.2%",
    icon: AlertTriangle,
    description: "Service-related incident frequency"
  }
];

export function PerformancePanel() {
  return (
    <Card className="p-6 m-6 bg-gradient-to-br from-medical-accent/5 to-white">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-medical-primary">Performance Analytics</h2>
        <p className="text-sm text-medical-primary/60">Real-time business insights and metrics</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>
    </Card>
  );
}