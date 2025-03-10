
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Phone, Flag, Calendar, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface HRStatusCardsProps {
  data: {
    onDuty: number;
    onCall: number;
    incidentsOpen: number;
    scheduleRequests: number;
    employeesStale: number;
  };
}

interface StatusCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  className?: string;
  textColor?: string;
  bgGradient?: string;
}

const StatusCard = ({ title, value, icon, className, textColor, bgGradient }: StatusCardProps) => (
  <Card className={cn(
    "overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300",
    className
  )}>
    <div className={cn(
      "absolute inset-0 opacity-90",
      bgGradient || "bg-gradient-to-br from-blue-500 to-blue-600"
    )} />
    <CardContent className="p-6 relative z-10">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-white/80">{title}</p>
          <h2 className={cn(
            "text-3xl font-bold mt-1 text-white",
            textColor
          )}>
            {value}
          </h2>
        </div>
        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

export function HRStatusCards({ data }: HRStatusCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <StatusCard
        title="On Duty Personnel"
        value={data.onDuty}
        icon={<Clock className="h-6 w-6 text-white" />}
        bgGradient="bg-gradient-to-br from-indigo-500 to-indigo-700"
      />
      <StatusCard
        title="On Call Staff"
        value={data.onCall}
        icon={<Phone className="h-6 w-6 text-white" />}
        bgGradient="bg-gradient-to-br from-purple-500 to-purple-700"
      />
      <StatusCard
        title="Active Incidents"
        value={data.incidentsOpen}
        icon={<Flag className="h-6 w-6 text-white" />}
        bgGradient="bg-gradient-to-br from-rose-500 to-rose-700"
      />
      <StatusCard
        title="Schedule Requests"
        value={data.scheduleRequests}
        icon={<Calendar className="h-6 w-6 text-white" />}
        bgGradient="bg-gradient-to-br from-emerald-500 to-emerald-700"
      />
      <StatusCard
        title="Missing HR Data"
        value={data.employeesStale}
        icon={<Users className="h-6 w-6 text-white" />}
        bgGradient="bg-gradient-to-br from-slate-600 to-slate-800"
      />
    </div>
  );
}
