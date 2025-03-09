import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { AlertsConfig as AlertsConfigComponent } from "@/components/dashboard/AlertsConfig";

const AlertsConfig = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1">
        <div className="flex h-full">
          <div className="flex-1 bg-[#f4f7fc] overflow-auto">
            <DashboardHeader />
            <main className="p-6">
              <Card className="max-w-3xl mx-auto p-6">
                <AlertsConfigComponent />
              </Card>
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AlertsConfig;