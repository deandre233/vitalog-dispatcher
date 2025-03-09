
import { Card } from "@/components/ui/card";
import { AlertsConfig as AlertsConfigComponent } from "@/components/dashboard/AlertsConfig";
import { MainLayout } from "@/components/layout/MainLayout";

const AlertsConfig = () => {
  return (
    <MainLayout>
      <Card className="max-w-3xl mx-auto p-6 shadow-lg border-l-4 border-l-medical-secondary">
        <AlertsConfigComponent />
      </Card>
    </MainLayout>
  );
};

export default AlertsConfig;
