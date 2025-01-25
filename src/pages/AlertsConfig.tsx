import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function AlertsConfig() {
  return (
    <div className="flex-1 bg-medical-accent/5 backdrop-blur-sm overflow-auto">
      <DashboardHeader />
      <main className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-medical-primary mb-6">
          Alerts Configuration
        </h1>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-medical-primary mb-4">System Alerts</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Emergency Notifications</label>
                <input type="checkbox" className="toggle toggle-primary" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Dispatch Updates</label>
                <input type="checkbox" className="toggle toggle-primary" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Route Changes</label>
                <input type="checkbox" className="toggle toggle-primary" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-medical-primary mb-4">Email Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Daily Summary</label>
                <input type="checkbox" className="toggle toggle-primary" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Weekly Report</label>
                <input type="checkbox" className="toggle toggle-primary" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Critical Alerts</label>
                <input type="checkbox" className="toggle toggle-primary" defaultChecked />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-medical-primary mb-4">Mobile Alerts</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Push Notifications</label>
                <input type="checkbox" className="toggle toggle-primary" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">SMS Alerts</label>
                <input type="checkbox" className="toggle toggle-primary" />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Location Updates</label>
                <input type="checkbox" className="toggle toggle-primary" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-medical-primary mb-4">Alert Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Sound Enabled</label>
                <input type="checkbox" className="toggle toggle-primary" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Desktop Notifications</label>
                <input type="checkbox" className="toggle toggle-primary" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Do Not Disturb</label>
                <input type="checkbox" className="toggle toggle-primary" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}