
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Phone, Flag, Calendar, Users, Activity, Briefcase, Shield, FileCheck, UserCog } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

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
  gradientFrom: string;
  gradientTo: string;
  showAnimation?: boolean;
  subtitle?: string;
}

const StatusCard = ({ title, value, icon, gradientFrom, gradientTo, showAnimation = false, subtitle }: StatusCardProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (showAnimation) {
      const timer = setTimeout(() => setIsAnimating(true), 300);
      return () => clearTimeout(timer);
    }
  }, [showAnimation]);

  return (
    <Card className={cn(
      "overflow-hidden border-none shadow-lg transition-all duration-300 hover:shadow-xl",
      `bg-gradient-to-br from-${gradientFrom} to-${gradientTo}`
    )}>
      <CardContent className="p-0">
        <div className="relative h-full">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 -mr-10 -mt-10 rounded-full bg-white/10 blur-xl"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 -ml-8 -mb-8 rounded-full bg-white/5 blur-lg"></div>
          
          <div className="relative p-5 z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
                  {title}
                </p>
                {subtitle && (
                  <p className="text-xs text-white/60 mt-1">{subtitle}</p>
                )}
              </div>
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                {icon}
              </div>
            </div>
            
            <div className={cn(
              "transition-all duration-700 transform",
              isAnimating ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            )}>
              <h2 className="text-3xl font-bold text-white">
                {value}
              </h2>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function HRStatusCards({ data }: HRStatusCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <StatusCard
        title="Personnel Active"
        value={data.onDuty}
        icon={<Briefcase className="h-5 w-5 text-white" />}
        gradientFrom="emerald-500"
        gradientTo="teal-700"
        showAnimation={true}
        subtitle="Currently on shift"
      />
      <StatusCard
        title="On Standby"
        value={data.onCall}
        icon={<Activity className="h-5 w-5 text-white" />}
        gradientFrom="indigo-500"
        gradientTo="violet-700"
        showAnimation={true}
        subtitle="Available for emergencies"
      />
      <StatusCard
        title="Critical Alerts"
        value={data.incidentsOpen}
        icon={<Shield className="h-5 w-5 text-white" />}
        gradientFrom="rose-500"
        gradientTo="red-700"
        showAnimation={true}
        subtitle="Require immediate attention"
      />
      <StatusCard
        title="Pending Approvals"
        value={data.scheduleRequests}
        icon={<FileCheck className="h-5 w-5 text-white" />}
        gradientFrom="amber-500"
        gradientTo="orange-700"
        showAnimation={true}
        subtitle="Awaiting review"
      />
      <StatusCard
        title="Profile Updates"
        value={data.employeesStale}
        icon={<UserCog className="h-5 w-5 text-white" />}
        gradientFrom="slate-500"
        gradientTo="slate-800"
        showAnimation={true}
        subtitle="Need verification"
      />
    </div>
  );
}
