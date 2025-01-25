import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export function ResourceLibrary() {
  return (
    <div className="flex-1 bg-medical-accent/5 backdrop-blur-sm overflow-auto">
      <DashboardHeader />
      <main className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-medical-primary mb-6">
          Resource Library
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-medical-primary mb-4">Protocols & Guidelines</h2>
            <p className="text-gray-600 mb-4">Access standard operating procedures and clinical guidelines.</p>
            <button className="text-medical-primary hover:text-medical-accent">View Documents →</button>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-medical-primary mb-4">Training Materials</h2>
            <p className="text-gray-600 mb-4">Educational resources and training documentation for staff.</p>
            <button className="text-medical-primary hover:text-medical-accent">Access Training →</button>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-medical-primary mb-4">Forms & Templates</h2>
            <p className="text-gray-600 mb-4">Standardized forms and document templates.</p>
            <button className="text-medical-primary hover:text-medical-accent">Download Forms →</button>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-medical-primary mb-4">Equipment Manuals</h2>
            <p className="text-gray-600 mb-4">Technical documentation and user guides for equipment.</p>
            <button className="text-medical-primary hover:text-medical-accent">View Manuals →</button>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-medical-primary mb-4">Safety Resources</h2>
            <p className="text-gray-600 mb-4">Safety protocols and emergency procedures.</p>
            <button className="text-medical-primary hover:text-medical-accent">Review Safety →</button>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-medical-primary mb-4">Reference Materials</h2>
            <p className="text-gray-600 mb-4">Quick reference guides and helpful resources.</p>
            <button className="text-medical-primary hover:text-medical-accent">Browse References →</button>
          </div>
        </div>
      </main>
    </div>
  );
}