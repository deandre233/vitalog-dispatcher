import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function ManageRoutes() {
  return (
    <div className="flex-1 bg-medical-accent/5 backdrop-blur-sm overflow-auto">
      <DashboardHeader />
      <main className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-medical-primary mb-6">
          Manage Routes
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-medical-primary mb-4">Active Routes</h2>
            <div className="space-y-4">
              {/* Route list would go here */}
              <div className="border-b pb-2">
                <p className="font-medium">Route #1234</p>
                <p className="text-sm text-gray-600">4 stops • 2.5 hours</p>
              </div>
              <div className="border-b pb-2">
                <p className="font-medium">Route #1235</p>
                <p className="text-sm text-gray-600">6 stops • 3.5 hours</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-medical-primary mb-4">Route Planning</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Total Routes Today</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Completed Routes</span>
                <span className="font-semibold">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span>In Progress</span>
                <span className="font-semibold">4</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-medical-primary mb-4">Route Optimization</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Average Route Time</span>
                <span className="font-semibold">2.8 hrs</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Average Stops</span>
                <span className="font-semibold">5</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Efficiency Score</span>
                <span className="font-semibold text-green-600">92%</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}