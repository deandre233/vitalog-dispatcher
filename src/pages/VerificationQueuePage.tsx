
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Filter, CheckCircle2, XCircle, Clock } from "lucide-react";

const verificationItems = [
  { 
    id: "1", 
    patientName: "John Smith", 
    type: "Insurance Verification", 
    requestedBy: "Dr. Johnson", 
    requestedDate: "2023-05-08", 
    dueDate: "2023-05-10", 
    status: "Pending",
    priority: "High"
  },
  { 
    id: "2", 
    patientName: "Mary Davis", 
    type: "Prior Authorization", 
    requestedBy: "Dr. Williams", 
    requestedDate: "2023-05-07", 
    dueDate: "2023-05-12", 
    status: "In Progress",
    priority: "Medium"
  },
  { 
    id: "3", 
    patientName: "Robert Jones", 
    type: "Eligibility Check", 
    requestedBy: "Dr. Brown", 
    requestedDate: "2023-05-09", 
    dueDate: "2023-05-11", 
    status: "Pending",
    priority: "Low"
  },
  { 
    id: "4", 
    patientName: "Susan Miller", 
    type: "Insurance Verification", 
    requestedBy: "Dr. Davis", 
    requestedDate: "2023-05-06", 
    dueDate: "2023-05-09", 
    status: "Completed",
    priority: "High"
  },
  { 
    id: "5", 
    patientName: "James Wilson", 
    type: "Prior Authorization", 
    requestedBy: "Dr. Taylor", 
    requestedDate: "2023-05-05", 
    dueDate: "2023-05-08", 
    status: "Rejected",
    priority: "Medium"
  },
];

const columns = [
  {
    accessorKey: "patientName",
    header: "Patient",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "requestedBy",
    header: "Requested By",
  },
  {
    accessorKey: "requestedDate",
    header: "Request Date",
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }: any) => {
      const dueDate = new Date(row.getValue("dueDate"));
      const today = new Date();
      const isPastDue = dueDate < today;
      
      return (
        <div className={`${isPastDue ? 'text-red-600 font-medium' : ''}`}>
          {row.getValue("dueDate")}
          {isPastDue && <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">Overdue</span>}
        </div>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }: any) => {
      const priority = row.getValue("priority");
      return (
        <div className={`px-2 py-1 rounded-full text-xs inline-block 
          ${priority === 'High' ? 'bg-red-100 text-red-800' : 
            priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-green-100 text-green-800'}`}>
          {priority}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: any) => {
      const status = row.getValue("status");
      let icon;
      let statusClasses;
      
      switch(status) {
        case 'Completed':
          icon = <CheckCircle2 className="h-4 w-4 text-green-600 mr-1" />;
          statusClasses = 'bg-green-100 text-green-800';
          break;
        case 'Rejected':
          icon = <XCircle className="h-4 w-4 text-red-600 mr-1" />;
          statusClasses = 'bg-red-100 text-red-800';
          break;
        case 'In Progress':
          icon = <Clock className="h-4 w-4 text-blue-600 mr-1" />;
          statusClasses = 'bg-blue-100 text-blue-800';
          break;
        default:
          icon = <Clock className="h-4 w-4 text-yellow-600 mr-1" />;
          statusClasses = 'bg-yellow-100 text-yellow-800';
      }
      
      return (
        <div className={`px-2 py-1 rounded-full text-xs inline-flex items-center ${statusClasses}`}>
          {icon}
          {status}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: () => {
      return (
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Review</Button>
        </div>
      );
    },
  },
];

export function VerificationQueuePage() {
  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-medical-primary">Verification Queue</h1>
            <div className="flex items-center mt-1 space-x-2">
              <Badge variant="outline" className="bg-yellow-50">11 Pending</Badge>
              <Badge variant="outline" className="bg-blue-50">4 In Progress</Badge>
              <Badge variant="outline" className="bg-green-50">23 Completed</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
            <Button>
              Process Next
            </Button>
          </div>
        </div>
        
        <Card className="p-4">
          <DataTable
            columns={columns}
            data={verificationItems}
            searchKey="patientName"
          />
        </Card>
      </div>
    </PageLayout>
  );
}
