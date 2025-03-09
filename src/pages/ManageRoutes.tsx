
import { PageLayout } from "@/components/layout/PageLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/components/theme/ThemeProvider";

const ManageRoutes = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <PageLayout>
      <DashboardHeader />
      <main className="p-6 fade-in">
        <Card className={`p-6 ${
          isDark 
            ? 'bg-[#1e293b] border-[#334155]/50' 
            : 'bg-white border-gray-200'
        }`}>
          <h2 className={`text-2xl font-semibold mb-6 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>Route Management</h2>
          <p className={`${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>Route optimization implementation coming in next iteration</p>
        </Card>
      </main>
    </PageLayout>
  );
};

export default ManageRoutes;
