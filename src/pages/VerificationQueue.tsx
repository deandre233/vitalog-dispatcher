import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export function VerificationQueue() {
  return (
    <div className="flex-1 bg-medical-accent/5 backdrop-blur-sm overflow-auto">
      <DashboardHeader />
      <main className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-medical-primary mb-6">
          Verification Queue
        </h1>
        <div className="grid gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-medical-primary mb-4">Pending Verifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div>
                  <h3 className="font-medium">Patient Transfer #12345</h3>
                  <p className="text-sm text-gray-500">Awaiting medical clearance</p>
                </div>
                <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full">Pending</span>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div>
                  <h3 className="font-medium">Emergency Transport #67890</h3>
                  <p className="text-sm text-gray-500">Insurance verification needed</p>
                </div>
                <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full">Pending</span>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div>
                  <h3 className="font-medium">Routine Transfer #34567</h3>
                  <p className="text-sm text-gray-500">Documentation review required</p>
                </div>
                <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full">Pending</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}