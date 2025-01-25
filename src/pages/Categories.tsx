import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export function Categories() {
  return (
    <div className="flex-1 bg-medical-accent/5 backdrop-blur-sm overflow-auto">
      <DashboardHeader />
      <main className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-medical-primary mb-6">
          Categories
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-medical-primary mb-4">Emergency</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active Cases</span>
                <span className="font-medium text-medical-primary">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Response Time</span>
                <span className="font-medium text-medical-primary">4.2 min</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-medical-primary mb-4">Non-Emergency</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active Cases</span>
                <span className="font-medium text-medical-primary">45</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Response Time</span>
                <span className="font-medium text-medical-primary">15.8 min</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-medical-primary mb-4">Scheduled</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active Cases</span>
                <span className="font-medium text-medical-primary">78</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">On-Time Rate</span>
                <span className="font-medium text-medical-primary">98.5%</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}