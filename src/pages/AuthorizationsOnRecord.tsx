import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export function AuthorizationsOnRecord() {
  return (
    <div className="flex-1 bg-medical-accent/5 backdrop-blur-sm overflow-auto">
      <DashboardHeader />
      <main className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-medical-primary mb-6">
          Authorizations on Record
        </h1>
        <div className="grid gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-medical-primary">Active Authorizations</h2>
                <button className="text-sm text-medical-accent hover:text-medical-accent/80">
                  View All
                </button>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-medical-accent/5">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-medical-primary">Patient Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-medical-primary">Auth Number</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-medical-primary">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-medical-primary">Expiration</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-medical-primary">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr className="hover:bg-medical-accent/5">
                      <td className="px-4 py-3 text-sm">John Doe</td>
                      <td className="px-4 py-3 text-sm">AUTH-2023-001</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">Dec 31, 2023</td>
                      <td className="px-4 py-3 text-sm">
                        <button className="text-medical-accent hover:text-medical-accent/80">View Details</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-medical-accent/5">
                      <td className="px-4 py-3 text-sm">Jane Smith</td>
                      <td className="px-4 py-3 text-sm">AUTH-2023-002</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">Jan 15, 2024</td>
                      <td className="px-4 py-3 text-sm">
                        <button className="text-medical-accent hover:text-medical-accent/80">View Details</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}