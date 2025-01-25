import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { BillingSidebar } from "@/components/navigation/BillingSidebar";

export default function Billing() {
  return (
    <div className="flex h-screen">
      <BillingSidebar />
      <div className="flex-1 bg-medical-accent/5 backdrop-blur-sm overflow-auto">
        <DashboardHeader />
        <main className="p-6 space-y-6">
          <h1 className="text-2xl font-bold text-medical-primary mb-6">
            Billing
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-medical-primary mb-4">Pending Claims</h2>
              <p className="text-3xl font-bold text-medical-secondary">1,234</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-medical-primary mb-4">Total Revenue</h2>
              <p className="text-3xl font-bold text-medical-secondary">$45,678</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-medical-primary mb-4">Outstanding Balance</h2>
              <p className="text-3xl font-bold text-medical-secondary">$12,345</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-medical-primary mb-4">Recent Transactions</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Patient</th>
                    <th className="text-left p-2">Service</th>
                    <th className="text-right p-2">Amount</th>
                    <th className="text-right p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">2024-01-15</td>
                    <td className="p-2">John Doe</td>
                    <td className="p-2">Emergency Transport</td>
                    <td className="text-right p-2">$1,200</td>
                    <td className="text-right p-2">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                        Paid
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">2024-01-14</td>
                    <td className="p-2">Jane Smith</td>
                    <td className="p-2">Medical Transport</td>
                    <td className="text-right p-2">$800</td>
                    <td className="text-right p-2">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                        Pending
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">2024-01-13</td>
                    <td className="p-2">Robert Johnson</td>
                    <td className="p-2">Emergency Transport</td>
                    <td className="text-right p-2">$1,500</td>
                    <td className="text-right p-2">
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
                        Overdue
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}