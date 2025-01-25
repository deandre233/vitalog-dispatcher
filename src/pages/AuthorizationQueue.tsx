import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export function AuthorizationQueue() {
  return (
    <div className="flex-1 bg-medical-accent/5 backdrop-blur-sm overflow-auto">
      <DashboardHeader />
      <main className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-medical-primary mb-6">
          Authorization Queue
        </h1>
        <div className="grid gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-medical-primary">Pending Authorizations</h2>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">10 Pending</span>
            </div>
            <div className="divide-y">
              {/* This would typically be mapped from actual data */}
              <div className="py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Patient: John Doe</h3>
                    <p className="text-sm text-gray-600">Service: Physical Therapy</p>
                  </div>
                  <button className="px-4 py-2 bg-medical-primary text-white rounded-md hover:bg-medical-primary/90 transition-colors">
                    Review
                  </button>
                </div>
              </div>
              <div className="py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Patient: Jane Smith</h3>
                    <p className="text-sm text-gray-600">Service: Occupational Therapy</p>
                  </div>
                  <button className="px-4 py-2 bg-medical-primary text-white rounded-md hover:bg-medical-primary/90 transition-colors">
                    Review
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-medical-primary">Recently Processed</h2>
              <button className="text-medical-primary hover:underline text-sm">View All</button>
            </div>
            <div className="divide-y">
              <div className="py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Patient: Robert Johnson</h3>
                    <p className="text-sm text-gray-600">Status: Approved</p>
                  </div>
                  <span className="text-green-600 text-sm">2 hours ago</span>
                </div>
              </div>
              <div className="py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Patient: Mary Williams</h3>
                    <p className="text-sm text-gray-600">Status: Denied</p>
                  </div>
                  <span className="text-green-600 text-sm">4 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}