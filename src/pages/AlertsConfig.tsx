
import { PageLayout } from "@/components/layout/PageLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card } from "@/components/ui/card";
import { AlertsConfig as AlertsConfigComponent } from "@/components/dashboard/AlertsConfig";
import { useTheme } from "@/components/theme/ThemeProvider";

const AlertsConfig = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <PageLayout>
      <DashboardHeader />
      <main className="p-6 fade-in">
        <Card className={`max-w-3xl mx-auto p-6 ${
          isDark 
            ? 'bg-[#1e293b] border-[#334155]/50' 
            : 'bg-white border-gray-200'
        }`}>
          <AlertsConfigComponent />
        </Card>
      </main>
    </PageLayout>
  );
};

export default AlertsConfig;
