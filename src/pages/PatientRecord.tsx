import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { useParams } from "react-router-dom";

export function PatientRecord() {
  const { id } = useParams();
  
  return (
    <div className="flex-1 bg-medical-accent/5 backdrop-blur-sm overflow-auto">
      <DashboardHeader />
      <main className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-medical-primary mb-6">
          Patient Record
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-medical-primary mb-4">Patient Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Patient ID</label>
                <p className="font-medium">{id}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Name</label>
                <p className="font-medium">John Doe</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Date of Birth</label>
                <p className="font-medium">01/01/1980</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Contact</label>
                <p className="font-medium">+1 (555) 123-4567</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-medical-primary mb-4">Medical History</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Primary Condition</label>
                <p className="font-medium">Hypertension</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Allergies</label>
                <p className="font-medium">Penicillin</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Blood Type</label>
                <p className="font-medium">O+</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Last Visit</label>
                <p className="font-medium">03/15/2024</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 md:col-span-2">
            <h2 className="text-lg font-semibold text-medical-primary mb-4">Recent Dispatches</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">Type</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Crew</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">03/15/2024</td>
                    <td className="py-2">Regular Transport</td>
                    <td className="py-2">Completed</td>
                    <td className="py-2">Team A</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">03/10/2024</td>
                    <td className="py-2">Emergency</td>
                    <td className="py-2">Completed</td>
                    <td className="py-2">Team B</td>
                  </tr>
                  <tr>
                    <td className="py-2">03/05/2024</td>
                    <td className="py-2">Regular Transport</td>
                    <td className="py-2">Completed</td>
                    <td className="py-2">Team C</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}