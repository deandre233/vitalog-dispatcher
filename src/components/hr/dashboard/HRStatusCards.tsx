
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Clock, Phone, Flag, Calendar, Users, Briefcase, Shield, FileCheck, UserCog } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

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
  subtitle: string;
  value: number;
  icon: React.ReactNode;
  className?: string;
  textColor?: string;
  gradientFrom: string;
  gradientTo: string;
}

const StatusCard = ({ 
  title, 
  subtitle,
  value, 
  icon, 
  className, 
  textColor,
  gradientFrom,
  gradientTo
}: StatusCardProps) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setCount(value);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [value]);
  
  return (
    <Card className={cn(
      "overflow-hidden glass-panel transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl", 
      className
    )}>
      <CardContent className="p-6 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-80" 
          style={{
            background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
            borderRadius: 'inherit',
          }}
        />
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-white/80">{title}</p>
            <p className="text-xs text-white/60 mt-0.5">{subtitle}</p>
            <h2 className={cn("text-3xl font-bold mt-2", textColor || "text-white")}>
              {count}
            </h2>
          </div>
          <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
            {icon}
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
        title="Personnel On Shift"
        subtitle="Active staff members"
        value={data.onDuty}
        icon={<Briefcase className="h-6 w-6 text-white" />}
        gradientFrom="#1a6fc7"
        gradientTo="#38bdf8"
        textColor="text-white"
      />
      <StatusCard
        title="On-Call Staff"
        subtitle="Emergency response team"
        value={data.onCall}
        icon={<Phone className="h-6 w-6 text-white" />}
        gradientFrom="#7e3aed"
        gradientTo="#c084fc"
        textColor="text-white"
      />
      <StatusCard
        title="Active Incidents"
        subtitle="Requiring attention"
        value={data.incidentsOpen}
        icon={<Shield className="h-6 w-6 text-white" />}
        gradientFrom="#dc2626"
        gradientTo="#f87171"
        textColor="text-white"
      />
      <StatusCard
        title="Schedule Changes"
        subtitle="Pending approvals"
        value={data.scheduleRequests}
        icon={<Calendar className="h-6 w-6 text-white" />}
        gradientFrom="#059669"
        gradientTo="#34d399"
        textColor="text-white"
      />
      <StatusCard
        title="Credential Updates"
        subtitle="Needing review"
        value={data.employeesStale}
        icon={<FileCheck className="h-6 w-6 text-white" />}
        gradientFrom="#475569"
        gradientTo="#94a3b8"
        textColor="text-white"
      />
    </div>
  );
}
