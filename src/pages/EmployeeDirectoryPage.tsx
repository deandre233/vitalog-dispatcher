
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { Plus, FileDown, Search, Filter } from "lucide-react";
import { useState } from "react";

// Sample employee data
const employees = [
  { id: "1", name: "John Doe", role: "Paramedic", status: "Active", department: "Emergency", email: "john.doe@example.com" },
  { id: "2", name: "Jane Smith", role: "EMT", status: "Active", department: "Transport", email: "jane.smith@example.com" },
  { id: "3", name: "Mike Johnson", role: "Driver", status: "On Leave", department: "Transport", email: "mike.j@example.com" },
  { id: "4", name: "Sarah Williams", role: "Dispatcher", status: "Active", department: "Operations", email: "sarah.w@example.com" },
  { id: "5", name: "Robert Brown", role: "Paramedic", status: "Inactive", department: "Emergency", email: "robert.b@example.com" },
];

const columns = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: any) => {
      const status = row.getValue("status");
      return (
        <div className={`px-2 py-1 rounded-full text-xs inline-block 
          ${status === 'Active' ? 'bg-green-100 text-green-800' : 
            status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-gray-100 text-gray-800'}`}>
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];

export function EmployeeDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-medical-primary">Employee Directory</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileDown className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Employee
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="sm:w-auto w-full">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
        </div>
        
        <DataTable
          columns={columns}
          data={employees}
          searchKey="name"
        />
      </div>
    </PageLayout>
  );
}
