
import { PageLayout } from "@/components/layout/PageLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DispatchBoard } from "@/components/dashboard/DispatchBoard";
import { AlertTriangle, Ambulance } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ActiveDispatches = () => {
  return (
    <PageLayout>
      <DashboardHeader />
      <main className="p-2">
        <div className="mb-6 px-6 pt-2 pb-0">
          <div className="flex items-center gap-3 mb-2">
            <Ambulance className="h-6 w-6 text-purple-400" />
            <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
              Active Dispatches
            </h1>
          </div>
          <Alert className="glass-panel border-purple-500/20 bg-purple-950/20 mb-4">
            <AlertTriangle className="h-4 w-4 text-purple-400" />
            <AlertDescription className="text-white">
              Monitor and manage all ongoing dispatches from this central dashboard. High-priority cases are flagged automatically.
            </AlertDescription>
          </Alert>
        </div>
        <DispatchBoard />
      </main>
    </PageLayout>
  );
};

export default ActiveDispatches;
