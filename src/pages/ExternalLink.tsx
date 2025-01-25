import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export function ExternalLink() {
  return (
    <div className="flex-1 bg-medical-accent/5 backdrop-blur-sm overflow-auto">
      <DashboardHeader />
      <main className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-medical-primary mb-6">
          External Link
        </h1>
        <div className="grid gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-medical-primary mb-4">
              External System Links
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-medical-accent/5 transition-colors">
                <div>
                  <h3 className="font-medium text-medical-primary">EMR System</h3>
                  <p className="text-sm text-gray-500">Access patient records</p>
                </div>
                <a
                  href="https://emr-system.example.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-medical-primary hover:text-medical-accent"
                >
                  Open →
                </a>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-medical-accent/5 transition-colors">
                <div>
                  <h3 className="font-medium text-medical-primary">Billing Portal</h3>
                  <p className="text-sm text-gray-500">Manage billing and payments</p>
                </div>
                <a
                  href="https://billing.example.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-medical-primary hover:text-medical-accent"
                >
                  Open →
                </a>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-medical-accent/5 transition-colors">
                <div>
                  <h3 className="font-medium text-medical-primary">Training Portal</h3>
                  <p className="text-sm text-gray-500">Access training materials</p>
                </div>
                <a
                  href="https://training.example.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-medical-primary hover:text-medical-accent"
                >
                  Open →
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}