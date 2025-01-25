import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export function CenterList() {
  return (
    <div className="flex-1 bg-medical-accent/5 backdrop-blur-sm overflow-auto">
      <DashboardHeader />
      <main className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-medical-primary mb-6">
          Center List
        </h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-medical-primary">Medical Center {i + 1}</h3>
                  <p className="text-sm text-gray-600">123 Healthcare Ave, Suite {100 + i}</p>
                  <p className="text-sm text-gray-600">City, State 12345</p>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Operating Hours:</span>
                  <span className="text-gray-900">24/7</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-600">Emergency Services:</span>
                  <span className="text-gray-900">Available</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="text-gray-900">150 beds</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}