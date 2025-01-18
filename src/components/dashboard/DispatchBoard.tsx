import { Card } from "@/components/ui/card";
import { MapPin, Clock, Ambulance } from "lucide-react";

const dispatches = [
  {
    id: 1,
    location: "123 Emergency St",
    status: "En Route",
    time: "10:30 AM",
    priority: "high",
  },
  {
    id: 2,
    location: "456 Medical Ave",
    status: "Pending",
    time: "10:45 AM",
    priority: "medium",
  },
  {
    id: 3,
    location: "789 Care Lane",
    status: "Completed",
    time: "10:15 AM",
    priority: "low",
  },
];

export function DispatchBoard() {
  return (
    <Card className="p-6 m-6">
      <h2 className="text-xl font-semibold text-medical-primary mb-4">Active Dispatches</h2>
      <div className="space-y-4">
        {dispatches.map((dispatch) => (
          <div
            key={dispatch.id}
            className="flex items-center justify-between p-4 bg-white border rounded-lg hover:bg-medical-accent transition-colors"
          >
            <div className="flex items-center gap-4">
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
              <div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{dispatch.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{dispatch.time}</span>
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