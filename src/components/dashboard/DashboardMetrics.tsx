import { Ambulance, Clock, Users, Brain } from "lucide-react";
import { MetricCard } from "./MetricCard";

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
        <MetricCard key={metric.title} {...metric} />
      ))}
    </div>
  );
}