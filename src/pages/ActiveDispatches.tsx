import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DispatchBoard } from "@/components/dashboard/DispatchBoard";

export default function ActiveDispatches() {
  return (
    <div className="flex-1 bg-medical-accent/5 backdrop-blur-sm overflow-auto">
      <DashboardHeader />
      <main className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-medical-primary mb-6">
          Active Dispatches
        </h1>
        <DispatchBoard />
      </main>
    </div>
  );
}