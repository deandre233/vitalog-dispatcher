import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search, Filter, Download } from "lucide-react";

export default function ClosedDispatches() {
  const [searchQuery, setSearchQuery] = useState("");

  const columns = [
    { header: "Dispatch ID", accessorKey: "id" },
    { header: "Patient", accessorKey: "patient" },
    { header: "Date", accessorKey: "date" },
    { header: "Status", accessorKey: "status" },
    { header: "Location", accessorKey: "location" },
    { header: "Crew", accessorKey: "crew" }
  ];

  const data = [
    {
      id: "D-2023-001",
      patient: "John Doe",
      date: "2023-12-01",
      status: "Completed",
      location: "Memorial Hospital",
      crew: "Team A"
    },
    {
      id: "D-2023-002",
      patient: "Jane Smith",
      date: "2023-12-02",
      status: "Cancelled",
      location: "City Medical Center",
      crew: "Team B"
    }
  ];

  return (
    <div className="flex-1 bg-medical-accent/5 backdrop-blur-sm overflow-auto">
      <DashboardHeader />
      <main className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-medical-primary mb-6">
          Closed Dispatches
        </h1>
        
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div className="flex gap-2 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search dispatches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <DataTable
            columns={columns}
            data={data}
            searchKey="patient"
            searchQuery={searchQuery}
          />
        </div>
      </main>
    </div>
  );
}