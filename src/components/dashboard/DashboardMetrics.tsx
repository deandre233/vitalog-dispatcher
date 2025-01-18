import { Card } from "@/components/ui/card";
import { Ambulance, Clock, Users } from "lucide-react";

const metrics = [
  {
    title: "Active Dispatches",
    value: "12",
    icon: Ambulance,
    change: "+2",
  },
  {
    title: "Average Response Time",
    value: "8.5 min",
    icon: Clock,
    change: "-0.5",
  },
  {
    title: "Available Crews",
    value: "8",
    icon: Users,
    change: "0",
  },
];

export function DashboardMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {metrics.map((metric) => (
        <Card key={metric.title} className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{metric.title}</p>
              <h3 className="text-2xl font-bold text-medical-primary mt-2">
                {metric.value}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                <span className={metric.change.startsWith("+") ? "text-green-500" : metric.change.startsWith("-") ? "text-red-500" : "text-gray-500"}>
                  {metric.change}
                </span>{" "}
                from last hour
              </p>
            </div>
            <metric.icon className="w-8 h-8 text-medical-secondary" />
          </div>
        </Card>
      ))}
    </div>
  );
}