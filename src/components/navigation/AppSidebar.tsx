
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Ambulance, Activity, BarChart3, Database, 
  CreditCard, Users, FileText, Clock, Shield,
  Brain, FilePlus2, UserCog, Home
} from "lucide-react";

const sidebarItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: Ambulance, label: "Dispatch", href: "/dispatch" },
  { icon: Activity, label: "Monitoring", href: "/monitoring" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Database, label: "Data", href: "/data" },
  { icon: Shield, label: "Insurance", href: "/insurance" },
  { icon: Users, label: "Patients", href: "/patients" },
  { icon: FileText, label: "Invoices", href: "/invoices" },
  { icon: CreditCard, label: "Billing", href: "/billing" },
  { icon: UserCog, label: "Employees", href: "/employees" },
  { icon: FilePlus2, label: "PCR", href: "/pcr" },
  { icon: Clock, label: "Shifts", href: "/shifts" },
  { icon: Brain, label: "QA System", href: "/qa" }
];

interface AppSidebarProps {
  className?: string;
}

export function AppSidebar({ className }: AppSidebarProps) {
  return (
    <div className={cn("pb-12 w-full", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <ScrollArea className="h-[calc(100vh-120px)] px-1">
              {sidebarItems.map((item) => (
                <Link key={item.href} to={item.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start mb-1 hover:bg-white/5"
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
