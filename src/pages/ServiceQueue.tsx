import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export function ServiceQueue() {
  return (
    <div className="flex-1 bg-medical-accent/5 backdrop-blur-sm overflow-auto">
      <DashboardHeader />
      <main className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-medical-primary mb-6">
          Service Queue
        </h1>
        <div className="grid gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-medical-primary mb-4">Pending Service Requests</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Request ID</th>
                    <th className="text-left p-2">Patient</th>
                    <th className="text-left p-2">Service Type</th>
                    <th className="text-left p-2">Priority</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-2">#12345</td>
                    <td className="p-2">John Doe</td>
                    <td className="p-2">Transport</td>
                    <td className="p-2">
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">High</span>
                    </td>
                    <td className="p-2">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Pending</span>
                    </td>
                    <td className="p-2">
                      <button className="text-medical-primary hover:text-medical-accent">Process</button>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-2">#12346</td>
                    <td className="p-2">Jane Smith</td>
                    <td className="p-2">Consultation</td>
                    <td className="p-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Normal</span>
                    </td>
                    <td className="p-2">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Pending</span>
                    </td>
                    <td className="p-2">
                      <button className="text-medical-primary hover:text-medical-accent">Process</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-medical-primary mb-4">Service Queue Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-medical-accent/5 rounded-lg">
                <h3 className="text-sm font-medium text-medical-primary">Total Pending</h3>
                <p className="text-2xl font-bold text-medical-primary">24</p>
              </div>
              <div className="p-4 bg-medical-accent/5 rounded-lg">
                <h3 className="text-sm font-medium text-medical-primary">High Priority</h3>
                <p className="text-2xl font-bold text-medical-primary">8</p>
              </div>
              <div className="p-4 bg-medical-accent/5 rounded-lg">
                <h3 className="text-sm font-medium text-medical-primary">Average Wait Time</h3>
                <p className="text-2xl font-bold text-medical-primary">2.5h</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}