import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function CrewAssignment() {
  return (
    <div className="flex-1 bg-medical-accent/5 backdrop-blur-sm overflow-auto">
      <DashboardHeader />
      <main className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-medical-primary mb-6">
          Crew Assignment
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-medical-primary mb-4">Available Crew</h2>
            <div className="space-y-4">
              {/* List of available crew members would go here */}
              <div className="p-3 border rounded-md hover:bg-medical-accent/5 cursor-pointer">
                <p className="font-medium">John Smith</p>
                <p className="text-sm text-gray-600">EMT - Available</p>
              </div>
              <div className="p-3 border rounded-md hover:bg-medical-accent/5 cursor-pointer">
                <p className="font-medium">Sarah Johnson</p>
                <p className="text-sm text-gray-600">Paramedic - Available</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-medical-primary mb-4">Active Assignments</h2>
            <div className="space-y-4">
              {/* List of active assignments would go here */}
              <div className="p-3 border rounded-md bg-medical-accent/5">
                <p className="font-medium">Unit 127</p>
                <p className="text-sm text-gray-600">Mike Wilson - Driver</p>
                <p className="text-sm text-gray-600">Lisa Chen - EMT</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-medical-primary mb-4">Upcoming Shifts</h2>
            <div className="space-y-4">
              {/* List of upcoming shifts would go here */}
              <div className="p-3 border rounded-md">
                <p className="font-medium">Night Shift</p>
                <p className="text-sm text-gray-600">Starting in 2 hours</p>
                <p className="text-sm text-gray-600">4 positions to fill</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-medical-primary mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 text-center border rounded-md hover:bg-medical-accent/5">
              Assign Crew
            </button>
            <button className="p-4 text-center border rounded-md hover:bg-medical-accent/5">
              Swap Shifts
            </button>
            <button className="p-4 text-center border rounded-md hover:bg-medical-accent/5">
              Request Coverage
            </button>
            <button className="p-4 text-center border rounded-md hover:bg-medical-accent/5">
              View Schedule
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}