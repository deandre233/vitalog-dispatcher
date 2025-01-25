import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export function ScheduleOverview() {
  return (
    <div className="flex-1 bg-medical-accent/5 backdrop-blur-sm overflow-auto">
      <DashboardHeader />
      <main className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-medical-primary mb-6">
          Schedule Overview
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-medical-primary mb-4">Today's Schedule</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-medical-primary pl-4">
                <p className="text-sm text-gray-500">9:00 AM - 10:00 AM</p>
                <p className="font-medium">Morning Dispatch Briefing</p>
              </div>
              <div className="border-l-4 border-medical-secondary pl-4">
                <p className="text-sm text-gray-500">11:00 AM - 12:00 PM</p>
                <p className="font-medium">Route Planning Meeting</p>
              </div>
              <div className="border-l-4 border-medical-accent pl-4">
                <p className="text-sm text-gray-500">2:00 PM - 3:00 PM</p>
                <p className="font-medium">Shift Handover</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-medical-primary mb-4">Upcoming Events</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-medical-primary pl-4">
                <p className="text-sm text-gray-500">Tomorrow</p>
                <p className="font-medium">Staff Training Session</p>
              </div>
              <div className="border-l-4 border-medical-secondary pl-4">
                <p className="text-sm text-gray-500">Next Week</p>
                <p className="font-medium">Quarterly Review</p>
              </div>
              <div className="border-l-4 border-medical-accent pl-4">
                <p className="text-sm text-gray-500">Next Month</p>
                <p className="font-medium">Emergency Response Drill</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-medical-primary mb-4">Team Availability</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">On Duty</span>
                <span className="text-green-500">12 Members</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">On Call</span>
                <span className="text-yellow-500">5 Members</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Off Duty</span>
                <span className="text-red-500">8 Members</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}