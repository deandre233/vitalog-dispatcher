import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export function ShiftRecords() {
  return (
    <div className="flex-1 bg-medical-accent/5 backdrop-blur-sm overflow-auto">
      <DashboardHeader />
      <main className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-medical-primary mb-6">
          Shift Records
        </h1>
        {/* Add content for shift records */}
      </main>
    </div>
  );
}
