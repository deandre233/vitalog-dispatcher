import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export function HistoricalEntry() {
  return (
    <div className="flex-1 bg-medical-accent/5 backdrop-blur-sm overflow-auto">
      <DashboardHeader />
      <main className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-medical-primary mb-6">
          Historical Entry
        </h1>
        <div className="grid gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-medical-primary mb-4">Create Historical Dispatch Entry</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Date of Service</label>
                  <input type="date" className="w-full rounded-md border border-gray-300 p-2" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Time of Service</label>
                  <input type="time" className="w-full rounded-md border border-gray-300 p-2" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Patient Name</label>
                  <input type="text" className="w-full rounded-md border border-gray-300 p-2" placeholder="Enter patient name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Service Location</label>
                  <input type="text" className="w-full rounded-md border border-gray-300 p-2" placeholder="Enter service location" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Service Type</label>
                  <select className="w-full rounded-md border border-gray-300 p-2">
                    <option value="">Select service type</option>
                    <option value="emergency">Emergency</option>
                    <option value="non-emergency">Non-Emergency</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Assigned Crew</label>
                  <input type="text" className="w-full rounded-md border border-gray-300 p-2" placeholder="Enter crew members" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Notes</label>
                <textarea className="w-full rounded-md border border-gray-300 p-2 h-32" placeholder="Enter any additional notes"></textarea>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Reason for Historical Entry</label>
                <textarea className="w-full rounded-md border border-gray-300 p-2 h-24" placeholder="Explain why this dispatch is being entered historically"></textarea>
              </div>
              <div className="flex justify-end space-x-4">
                <button type="button" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-medical-primary rounded-md hover:bg-medical-primary/90">
                  Create Historical Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}