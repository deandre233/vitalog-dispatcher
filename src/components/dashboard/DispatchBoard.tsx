import { Card } from "@/components/ui/card";
import { MapPin, Clock, Ambulance, User, Building } from "lucide-react";

const dispatches = [
  {
    id: "D-001",
    activationTime: "10:30 AM",
    assignedTo: "Team A",
    patient: "John Doe",
    serviceType: "BLS",
    origin: "123 Emergency St",
    destination: "City Hospital",
    status: "En Route",
    priority: "high",
  },
  {
    id: "D-002",
    activationTime: "10:45 AM",
    assignedTo: "Team B",
    patient: "Jane Smith",
    serviceType: "ALS",
    origin: "456 Medical Ave",
    destination: "County Medical Center",
    status: "Pending",
    priority: "medium",
  },
  {
    id: "D-003",
    activationTime: "10:15 AM",
    assignedTo: "Team C",
    patient: "Robert Brown",
    serviceType: "BLS",
    origin: "789 Care Lane",
    destination: "Memorial Hospital",
    status: "Completed",
    priority: "low",
  },
];

export function DispatchBoard() {
  return (
    <Card className="p-6 m-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-medical-primary">Active Dispatches</h2>
        <div className="flex gap-2">
          <input
            type="date"
            className="px-3 py-1 border rounded-md"
          />
          <select className="px-3 py-1 border rounded-md">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="enroute">En Route</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      <div className="space-y-4">
        {dispatches.map((dispatch) => (
          <div
            key={dispatch.id}
            className="flex items-center justify-between p-4 bg-white border rounded-lg hover:bg-medical-accent transition-colors"
          >
            <div className="flex items-center gap-6">
              <div className={`p-2 rounded-full ${
                dispatch.priority === "high" ? "bg-red-100" :
                dispatch.priority === "medium" ? "bg-yellow-100" :
                "bg-green-100"
              }`}>
                <Ambulance className={`w-5 h-5 ${
                  dispatch.priority === "high" ? "text-red-500" :
                  dispatch.priority === "medium" ? "text-yellow-500" :
                  "text-green-500"
                }`} />
              </div>
              <div className="space-y-1">
                <div className="font-medium text-medical-primary">{dispatch.id}</div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{dispatch.activationTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User className="w-4 h-4" />
                  <span>{dispatch.assignedTo}</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="font-medium">{dispatch.patient}</div>
                <div className="text-sm text-gray-500">{dispatch.serviceType}</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <Building className="w-4 h-4 text-gray-500" />
                  <span>{dispatch.origin}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{dispatch.destination}</span>
                </div>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              dispatch.status === "En Route" ? "bg-blue-100 text-blue-700" :
              dispatch.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
              "bg-green-100 text-green-700"
            }`}>
              {dispatch.status}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}