import { MapPin, Clock, User, Building, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface ScheduledTransportProps {
  id: string;
  scheduledTime: string;
  patient: string;
  serviceType: string;
  origin: string;
  destination: string;
  status: "Scheduled" | "Assigned" | "Completed";
  warnings?: string[];
  unitAssigned?: string;
  progress?: number;
}

const scheduledTransports: ScheduledTransportProps[] = [
  {
    id: "ST-001",
    scheduledTime: "12:30",
    patient: "Martin, Jane",
    serviceType: "BLS",
    origin: "Parkside at Budd Terrace, 508A",
    destination: "Neurology/Emory Brain Health Center",
    status: "Scheduled",
    warnings: ["Requires oxygen support"],
  },
  {
    id: "ST-002",
    scheduledTime: "13:00",
    patient: "Michael, Robert",
    serviceType: "BLS",
    origin: "Parkside at Budd Terrace, 613",
    destination: "Emory University Hospital Midtown",
    status: "Assigned",
    unitAssigned: "MED-1",
    progress: 45,
    warnings: ["Limited mobility"],
  },
];

const getStatusColor = (status: ScheduledTransportProps["status"]) => {
  switch (status) {
    case "Scheduled":
      return "bg-gray-100 text-gray-700";
    case "Assigned":
      return "bg-yellow-100 text-yellow-700";
    case "Completed":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export function ScheduledTransport() {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (expandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-medical-primary">
          Scheduled Transports
        </h2>
        <Button variant="outline">+ New Transport</Button>
      </div>
      
      <div className="space-y-4">
        {scheduledTransports.map((transport) => (
          <div 
            key={transport.id}
            className="border rounded-lg bg-white shadow-sm"
          >
            <div 
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
              onClick={() => toggleRow(transport.id)}
            >
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="font-medium">{transport.id}</span>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-sm font-medium",
                    getStatusColor(transport.status)
                  )}>
                    {transport.status}
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    {transport.scheduledTime}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <Link 
                      to={`/patient/${transport.patient}`}
                      className="text-blue-600 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {transport.patient}
                    </Link>
                  </div>
                </div>
              </div>
              {expandedRows.has(transport.id) ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </div>

            {expandedRows.has(transport.id) && (
              <div className="p-4 border-t bg-gray-50">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Origin:</span>
                      <span>{transport.origin}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Destination:</span>
                      <span>{transport.destination}</span>
                    </div>
                    {transport.unitAssigned && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Unit Assigned:</span>
                        <span>{transport.unitAssigned}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {transport.warnings && transport.warnings.length > 0 && (
                      <div className="bg-red-50 p-2 rounded-md">
                        <span className="text-sm font-medium text-red-700">Warnings:</span>
                        <ul className="list-disc list-inside text-sm text-red-600">
                          {transport.warnings.map((warning, index) => (
                            <li key={index}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {transport.progress !== undefined && (
                      <div className="space-y-1">
                        <div className="text-sm text-gray-600">Progress</div>
                        <Progress value={transport.progress} className="w-full" />
                        <div className="text-sm text-gray-600 text-right">
                          {transport.progress}%
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  {transport.status === "Scheduled" && (
                    <Button variant="default">
                      Assign Crew
                    </Button>
                  )}
                  {transport.status === "Assigned" && (
                    <Button variant="outline">
                      Track Transport
                    </Button>
                  )}
                  <Button variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}