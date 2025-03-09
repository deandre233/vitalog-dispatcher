
import { PageLayout } from "@/components/layout/PageLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DispatchBoard } from "@/components/dashboard/DispatchBoard";
import { AlertTriangle, Ambulance } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTheme } from "@/components/theme/ThemeProvider";

const ActiveDispatches = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <PageLayout>
      <DashboardHeader />
      <main className="p-2 fade-in">
        <div className="mb-6 px-6 pt-2 pb-0">
          <div className="flex items-center gap-3 mb-2">
            <Ambulance className="h-6 w-6 text-purple-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
              Active Dispatches
            </h1>
          </div>
          <Alert className={`${isDark ? 'glass-panel border-purple-500/20 bg-purple-950/20' : 'purple-glass bg-purple-50/70'} mb-4`}>
            <AlertTriangle className={`h-4 w-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            <AlertDescription className={isDark ? 'text-white' : 'text-gray-800'}>
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
