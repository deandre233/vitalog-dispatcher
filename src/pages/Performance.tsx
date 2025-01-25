import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function Performance() {
  return (
    <div className="flex-1 bg-medical-accent/5 backdrop-blur-sm overflow-auto">
      <DashboardHeader />
      <main className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-medical-primary mb-6">
          Performance
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-medical-primary mb-4">Response Times</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Average Response Time</p>
                <p className="text-2xl font-bold text-medical-primary">8.5 min</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">90th Percentile</p>
                <p className="text-2xl font-bold text-medical-primary">12 min</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-medical-primary mb-4">Dispatch Efficiency</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Successful Dispatches</p>
                <p className="text-2xl font-bold text-medical-primary">94%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">First Time Success Rate</p>
                <p className="text-2xl font-bold text-medical-primary">87%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-medical-primary mb-4">Resource Utilization</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Active Units</p>
                <p className="text-2xl font-bold text-medical-primary">18/20</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Efficiency Rate</p>
                <p className="text-2xl font-bold text-medical-primary">92%</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-medical-primary mb-4">Performance Trends</h2>
            <div className="h-64 flex items-center justify-center border border-dashed border-gray-200 rounded-lg">
              <p className="text-gray-500">Performance chart will be displayed here</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-medical-primary mb-4">Recent Performance Reports</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-medical-primary">Monthly Overview</p>
                  <p className="text-sm text-gray-500">March 2024</p>
                </div>
                <button className="text-medical-primary hover:text-medical-primary/80">
                  Download PDF
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-medical-primary">Weekly Summary</p>
                  <p className="text-sm text-gray-500">Week 12, 2024</p>
                </div>
                <button className="text-medical-primary hover:text-medical-primary/80">
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}