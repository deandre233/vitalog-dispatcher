import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Button } from "@/components/ui/button";
import { 
  ClipboardList, 
  Users, 
  FileText, 
  Building2, 
  Clock, 
  AlertCircle,
  Upload,
  FileCheck,
  Send,
  AlertTriangle,
  Building,
  UserSquare
} from "lucide-react";

const Billing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-medical-accent">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1 overflow-auto">
            <DashboardHeader />
            <main className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-medical-primary">Billing Dashboard</h2>
                <div className="space-x-2">
                  <Button variant="outline">
                    <Clock className="w-4 h-4 mr-2" />
                    Last Updated: 5 mins ago
                  </Button>
                  <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Claims
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Prior Auth Queue"
                  value="10"
                  icon={ClipboardList}
                  change="+2"
                  aiInsight="2 new prior authorizations require immediate attention"
                />
                <MetricCard
                  title="Missing Demographics"
                  value="43"
                  icon={Users}
                  change="+5"
                  aiInsight="Patient information needs to be updated for billing"
                />
                <MetricCard
                  title="QA Review Queue"
                  value="124"
                  icon={FileCheck}
                  change="-12"
                  aiInsight="Quality assurance review backlog reduced by 12 since yesterday"
                />
                <MetricCard
                  title="Master Queue"
                  value="239"
                  icon={AlertCircle}
                  change="+15"
                  aiInsight="15 new items added to master review queue"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Review Queue"
                  value="65"
                  icon={FileText}
                  change="-3"
                  aiInsight="Claims ready for review"
                />
                <MetricCard
                  title="Filing Queue"
                  value="136"
                  icon={Send}
                  change="+24"
                  aiInsight="Claims prepared for submission"
                />
                <MetricCard
                  title="Transmission Queue"
                  value="4,527"
                  icon={Upload}
                  change="+204"
                  aiInsight="Claims pending electronic transmission"
                />
                <MetricCard
                  title="Exception Queue"
                  value="1"
                  icon={AlertTriangle}
                  change="0"
                  aiInsight="Critical exceptions requiring attention"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Facility Invoicing"
                  value="1"
                  icon={Building}
                  change="0"
                  aiInsight="Facility invoices pending review"
                />
                <MetricCard
                  title="Affiliate Invoicing"
                  value="0"
                  icon={Building2}
                  change="0"
                  aiInsight="No pending affiliate invoices"
                />
                <MetricCard
                  title="Patient Invoicing"
                  value="36"
                  icon={UserSquare}
                  change="+12"
                  aiInsight="New patient invoices ready for processing"
                />
                <MetricCard
                  title="Open Invoices"
                  value="363"
                  icon={FileText}
                  change="+25"
                  aiInsight="Total outstanding invoices pending payment"
                />
              </div>

              <div className="flex gap-2 mt-6">
                <Button variant="outline" className="flex-1">General</Button>
                <Button variant="outline" className="flex-1">Claims</Button>
                <Button variant="outline" className="flex-1">Receivables</Button>
                <Button variant="outline" className="flex-1">Invoicing</Button>
                <Button variant="outline" className="flex-1">Facility</Button>
                <Button variant="outline" className="flex-1">Compliance</Button>
              </div>
            </main>
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
};

export default Billing;