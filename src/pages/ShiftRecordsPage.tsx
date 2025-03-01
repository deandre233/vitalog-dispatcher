
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, FileDown, Filter, PlusCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";

const shiftRecords = [
  { id: "1", employee: "John Doe", date: "2023-05-10", shift: "Morning", hours: 8, status: "Completed" },
  { id: "2", employee: "Jane Smith", date: "2023-05-10", shift: "Evening", hours: 8, status: "Completed" },
  { id: "3", employee: "Mike Johnson", date: "2023-05-11", shift: "Night", hours: 10, status: "Completed" },
  { id: "4", employee: "Sarah Williams", date: "2023-05-11", shift: "Morning", hours: 8, status: "In Progress" },
  { id: "5", employee: "Robert Brown", date: "2023-05-12", shift: "Evening", hours: 8, status: "Scheduled" },
];

const columns = [
  {
    accessorKey: "employee",
    header: "Employee",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "shift",
    header: "Shift",
  },
  {
    accessorKey: "hours",
    header: "Hours",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: any) => {
      const status = row.getValue("status");
      return (
        <div className={`px-2 py-1 rounded-full text-xs inline-block 
          ${status === 'Completed' ? 'bg-green-100 text-green-800' : 
            status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
            'bg-gray-100 text-gray-800'}`}>
          {status}
        </div>
      );
    },
  },
];

const checklistColumns = [
  {
    accessorKey: "item",
    header: "Checklist Item",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: any) => {
      const status = row.getValue("status");
      return (
        <div className={`px-2 py-1 rounded-full text-xs inline-block 
          ${status === 'Completed' ? 'bg-green-100 text-green-800' : 
            status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-red-100 text-red-800'}`}>
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "assignee",
    header: "Assignee",
  },
  {
    accessorKey: "due",
    header: "Due Date",
  },
];

const checklistItems = [
  { id: "1", item: "Vehicle Inspection", status: "Completed", assignee: "John Doe", due: "2023-05-10" },
  { id: "2", item: "Equipment Check", status: "Completed", assignee: "Jane Smith", due: "2023-05-10" },
  { id: "3", item: "Medication Inventory", status: "Pending", assignee: "Mike Johnson", due: "2023-05-11" },
  { id: "4", item: "Oxygen Tank Replacement", status: "Not Started", assignee: "Sarah Williams", due: "2023-05-12" },
  { id: "5", item: "Radio Communication Test", status: "Completed", assignee: "Robert Brown", due: "2023-05-10" },
];

export function ShiftRecordsPage() {
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-medical-primary">Shift Records & Checklists</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowDatePicker(!showDatePicker)}>
              <Calendar className="mr-2 h-4 w-4" /> Date Range
            </Button>
            <Button variant="outline" size="sm">
              <FileDown className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> New Record
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="shifts">
          <TabsList>
            <TabsTrigger value="shifts">Shift Records</TabsTrigger>
            <TabsTrigger value="checklists">Checklists</TabsTrigger>
          </TabsList>
          
          <TabsContent value="shifts" className="space-y-4">
            <div className="flex justify-end">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" /> Filters
              </Button>
            </div>
            
            <Card className="p-4">
              <DataTable
                columns={columns}
                data={shiftRecords}
                searchKey="employee"
              />
            </Card>
          </TabsContent>
          
          <TabsContent value="checklists" className="space-y-4">
            <div className="flex justify-end">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" /> Filters
              </Button>
            </div>
            
            <Card className="p-4">
              <DataTable
                columns={checklistColumns}
                data={checklistItems}
                searchKey="item"
              />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
