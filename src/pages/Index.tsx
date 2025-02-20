
import { useState } from "react";
import { 
  Ambulance, Activity, BarChart3, Database, 
  CreditCard, Users, FileText, Clock, Shield, 
  Brain, FilePlus2, UserCog, StethoscopeIcon 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ModuleGrid } from "@/components/dashboard/ModuleGrid";

const modules = [
  {
    title: "Live Dispatch Board",
    description: "AI-powered dispatch management and real-time tracking",
    icon: Ambulance,
    gradient: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/20",
    iconClass: "text-blue-400",
    link: "/dispatch"
  },
  {
    title: "Live EKG Monitoring",
    description: "Real-time patient vitals and EKG monitoring",
    icon: Activity,
    gradient: "from-red-500/20 to-pink-500/20",
    border: "border-red-500/20",
    iconClass: "text-red-400",
    link: "/monitoring"
  },
  {
    title: "Performance Analytics",
    description: "AI-driven insights and performance metrics",
    icon: BarChart3,
    gradient: "from-purple-500/20 to-indigo-500/20",
    border: "border-purple-500/20",
    iconClass: "text-purple-400",
    link: "/analytics"
  },
  {
    title: "Data Management",
    description: "AI-powered data organization and retrieval",
    icon: Database,
    gradient: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/20",
    iconClass: "text-emerald-400",
    link: "/data"
  },
  {
    title: "Insurance Verification",
    description: "Real-time insurance eligibility verification",
    icon: Shield,
    gradient: "from-amber-500/20 to-yellow-500/20",
    border: "border-amber-500/20",
    iconClass: "text-amber-400",
    link: "/insurance"
  },
  {
    title: "Patient Database",
    description: "Comprehensive patient history and management",
    icon: Users,
    gradient: "from-sky-500/20 to-blue-500/20",
    border: "border-sky-500/20",
    iconClass: "text-sky-400",
    link: "/patients"
  },
  {
    title: "Invoice Processing",
    description: "AI-assisted invoice generation and tracking",
    icon: FileText,
    gradient: "from-lime-500/20 to-green-500/20",
    border: "border-lime-500/20",
    iconClass: "text-lime-400",
    link: "/invoices"
  },
  {
    title: "Auto Billing System",
    description: "Automated billing and payment tracking",
    icon: CreditCard,
    gradient: "from-orange-500/20 to-red-500/20",
    border: "border-orange-500/20",
    iconClass: "text-orange-400",
    link: "/billing"
  },
  {
    title: "Employee Management",
    description: "AI-driven staff scheduling and management",
    icon: UserCog,
    gradient: "from-violet-500/20 to-purple-500/20",
    border: "border-violet-500/20",
    iconClass: "text-violet-400",
    link: "/employees"
  },
  {
    title: "PCR System",
    description: "Smart patient care reporting system",
    icon: FilePlus2,
    gradient: "from-rose-500/20 to-pink-500/20",
    border: "border-rose-500/20",
    iconClass: "text-rose-400",
    link: "/pcr"
  },
  {
    title: "Shift Management",
    description: "AI-optimized shift scheduling",
    icon: Clock,
    gradient: "from-cyan-500/20 to-teal-500/20",
    border: "border-cyan-500/20",
    iconClass: "text-cyan-400",
    link: "/shifts"
  },
  {
    title: "QA System",
    description: "AI-powered quality assurance analysis",
    icon: Brain,
    gradient: "from-fuchsia-500/20 to-pink-500/20",
    border: "border-fuchsia-500/20",
    iconClass: "text-fuchsia-400",
    link: "/qa"
  }
];

export function Index() {
  const [activeModule, setActiveModule] = useState<string | null>(null);

  const handleAction = (action: string) => {
    setActiveModule(action);
    toast.success(`Initializing ${action}`, {
      description: "Please wait while we set up your workspace..."
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 p-6 md:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl" />
          <Card className="relative bg-black/40 backdrop-blur-xl border-white/10 p-6 md:p-8 lg:p-10 rounded-3xl overflow-hidden">
            <div className="flex items-center gap-4 mb-6">
              <StethoscopeIcon className="w-8 h-8 text-blue-400" />
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
                AI-Enhanced EMS Management System
              </h1>
            </div>
            <p className="text-gray-400 max-w-3xl mb-6">
              Advanced dispatch, PCR, and shift management powered by artificial intelligence. 
              Streamline your operations with smart automation and real-time insights.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={() => handleAction('Smart Dispatch')}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                <Ambulance className="mr-2 h-4 w-4" />
                Smart Dispatch
              </Button>
              <Button 
                variant="outline" 
                className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                onClick={() => handleAction('Live Monitoring')}
              >
                <Activity className="mr-2 h-4 w-4" />
                Live Monitoring
              </Button>
            </div>
          </Card>
        </div>

        <ModuleGrid modules={modules} columns={4} />
      </div>
    </div>
  );
}

export default Index;
