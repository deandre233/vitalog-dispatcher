import { MapPin, Clock, Ambulance, User, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ScheduledTransportProps {
  id: string;
  scheduledTime: string;
  patient: string;
  serviceType: string;
  origin: string;
  destination: string;
  status: string;
}

const scheduledTransports: ScheduledTransportProps[] = [
  {
    id: "ST-001",
    scheduledTime: "12:30",
    patient: "Martin, Jane",
    serviceType: "BLS",
    origin: "Parkside at Budd Terrace, 508A",
    destination: "Neurologyy/Emory Brain Health Center",
    status: "Scheduled",
  },
  {
    id: "ST-002",
    scheduledTime: "13:00",
    patient: "Michael, Robert",
    serviceType: "BLS",
    origin: "Parkside at Budd Terrace, 613",
    destination: "Emory University Hospital Midtown",
    status: "Pending",
  },
];

export function ScheduledTransport() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-medical-primary">
          Scheduled Transports
        </h2>
        <Button variant="outline">+ New Transport</Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Origin</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scheduledTransports.map((transport) => (
            <TableRow key={transport.id}>
              <TableCell>{transport.id}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  {transport.scheduledTime}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  {transport.patient}
                </div>
              </TableCell>
              <TableCell>{transport.serviceType}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-500" />
                  {transport.origin}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  {transport.destination}
                </div>
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-sm font-medium ${
                    transport.status === "Scheduled"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {transport.status}
                </span>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  Assign Crew
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}