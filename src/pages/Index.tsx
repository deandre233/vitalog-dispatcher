import { Button } from "@/components/ui/button";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { HospitalStatus } from "@/components/dashboard/HospitalStatus";
import { DispatchBoard } from "@/components/dashboard/DispatchBoard";

const Index = () => {
  return (
    <div className="p-6 space-y-6">
      <WelcomeBanner />
      <DashboardMetrics />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DispatchBoard />
        </div>
        <div>
          <HospitalStatus />
        </div>
      </div>
    </div>
  );
};

export default Index;