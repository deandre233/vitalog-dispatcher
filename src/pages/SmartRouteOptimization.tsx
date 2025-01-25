import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export function SmartRouteOptimization() {
  return (
    <div className="flex-1 bg-medical-accent/5 backdrop-blur-sm overflow-auto">
      <DashboardHeader />
      <main className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-medical-primary mb-6">
          Smart Route Optimization
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-medical-primary mb-4">Route Analysis</h2>
            <p className="text-gray-600 mb-4">Analyze and optimize delivery routes based on multiple factors including traffic, distance, and priority.</p>
            <button className="bg-medical-primary text-white px-4 py-2 rounded hover:bg-medical-primary/90 transition-colors">
              Start Analysis
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-medical-primary mb-4">Active Routes</h2>
            <p className="text-gray-600 mb-4">View and manage currently active delivery routes and make real-time adjustments.</p>
            <button className="bg-medical-primary text-white px-4 py-2 rounded hover:bg-medical-primary/90 transition-colors">
              View Routes
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-medical-primary mb-4">Route History</h2>
            <p className="text-gray-600 mb-4">Access historical route data and performance metrics to improve future planning.</p>
            <button className="bg-medical-primary text-white px-4 py-2 rounded hover:bg-medical-primary/90 transition-colors">
              View History
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}