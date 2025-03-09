
import { PageLayout } from "@/components/layout/PageLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DispatchBoard } from "@/components/dashboard/DispatchBoard";

const ActiveDispatches = () => {
  return (
    <PageLayout>
      <DashboardHeader />
      <main className="p-6">
        <DispatchBoard />
      </main>
    </PageLayout>
  );
};

export default ActiveDispatches;
