
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
}

const StatusCard = ({ title, value, icon, className, textColor }: StatusCardProps) => (
  <Card className={cn("overflow-hidden", className)}>
    <CardContent className="p-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h2 className={cn("text-3xl font-bold mt-1", textColor)}>
            {value}
          </h2>
        </div>
        <div className="p-2 bg-white/20 rounded-full">
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
        title="On Duty"
        value={data.onDuty}
        icon={<Clock className="h-6 w-6 text-white" />}
        className="bg-[#004b8d] text-white"
      />
      <StatusCard
        title="On Call"
        value={data.onCall}
        icon={<Phone className="h-6 w-6 text-white" />}
        className="bg-[#5d2e8c] text-white"
      />
      <StatusCard
        title="Incidents Open"
        value={data.incidentsOpen}
        icon={<Flag className="h-6 w-6 text-white" />}
        className="bg-[#8c2e3a] text-white"
      />
      <StatusCard
        title="Schedule Requests"
        value={data.scheduleRequests}
        icon={<Calendar className="h-6 w-6 text-white" />}
        className="bg-[#0a6e4e] text-white"
      />
      <StatusCard
        title="Employees Stale"
        value={data.employeesStale}
        icon={<Users className="h-6 w-6 text-white" />}
        className="bg-[#53565a] text-white"
      />
    </div>
  );
}
