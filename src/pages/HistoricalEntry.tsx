
import { PageLayout } from "@/components/layout/PageLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card } from "@/components/ui/card";
import { BackdatedDispatchForm } from "@/components/historical-entry/BackdatedDispatchForm";
import { AlertTriangle } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";

export const HistoricalEntry = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <PageLayout>
      <DashboardHeader />
      <main className="p-6 fade-in">
        <Card className={`p-6 mb-6 ${
          isDark 
            ? 'bg-amber-900/30 border-amber-500/30' 
            : 'bg-gradient-to-br from-yellow-50 to-yellow-100/50 border-yellow-200'
        }`}>
          <div className={`flex items-center gap-2 ${
            isDark ? 'text-amber-300' : 'text-yellow-800'
          }`}>
            <AlertTriangle className="h-5 w-5" />
            <p className="text-sm">
              You are creating a historical (backdated) dispatch entry. This should only be used for record-keeping purposes.
            </p>
          </div>
        </Card>
        
        <BackdatedDispatchForm />
      </main>
    </PageLayout>
  );
};

export default HistoricalEntry;
