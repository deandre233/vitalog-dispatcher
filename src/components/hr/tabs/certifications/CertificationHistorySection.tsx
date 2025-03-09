
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useEmployeeDetails } from "@/hooks/useEmployeeDetails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Eye, EyeOff, FileCheck, History, Upload } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { format, differenceInMonths } from "date-fns";

// Mock data for certification history
const mockCertificationHistory = [
  {
    id: "1",
    cert_type: "BLS - Basic/EMT",
    state: "CA",
    status: "Expired",
    valid_from: "2021-03-26",
    expires: "2023-03-31",
    notes: "Replaced by new certification",
    modified_by: "Karpinski, Danielle",
    modified_at: "2023-03-25"
  },
  {
    id: "2",
    cert_type: "CPR - Healthcare Provider",
    state: "CA",
    status: "Expired",
    valid_from: "2021-01-15",
    expires: "2023-01-15",
    notes: "Renewed",
    modified_by: "System",
    modified_at: "2023-01-10"
  },
  {
    id: "3",
    cert_type: "ACLS - Advanced Cardiac Life Support",
    state: "CA",
    status: "Revoked",
    valid_from: "2022-05-10",
    expires: "2024-05-10",
    notes: "Revoked due to training standards update",
    modified_by: "Martinez, Juan",
    modified_at: "2022-11-12"
  }
];

export function CertificationHistorySection() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { employee } = useEmployeeDetails(employeeId);
  const [showDeleted, setShowDeleted] = useState(true);
  
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "yyyy-MM-dd");
    } catch {
      return dateString;
    }
  };

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>,
      size: 60,
    },
    {
      accessorKey: "cert_type",
      header: "Certification Type",
      cell: ({ row }) => <div className="font-medium">{row.getValue("cert_type")}</div>,
    },
    {
      accessorKey: "state",
      header: "State",
      cell: ({ row }) => <div className="text-center">{row.getValue("state")}</div>,
      size: 90,
    },
    {
      accessorKey: "valid_from",
      header: "Valid From",
      cell: ({ row }) => <div>{formatDate(row.getValue("valid_from"))}</div>,
    },
    {
      accessorKey: "expires",
      header: "Expired On",
      cell: ({ row }) => <div>{formatDate(row.getValue("expires"))}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant={status === "Active" ? "success" : status === "Expired" ? "secondary" : "destructive"}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "notes",
      header: "Notes",
      cell: ({ row }) => <div>{row.getValue("notes") || "-"}</div>,
    },
    {
      accessorKey: "modified_by",
      header: "Modified By",
      cell: ({ row }) => <div>{row.getValue("modified_by")}</div>,
    },
    {
      accessorKey: "modified_at",
      header: "Modified Date",
      cell: ({ row }) => <div>{formatDate(row.getValue("modified_at"))}</div>,
    },
  ];

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <History className="mr-2 h-5 w-5 text-blue-600" />
            Certification History
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => setShowDeleted(!showDeleted)}>
              {showDeleted ? 
                <><EyeOff className="mr-1 h-4 w-4" /> Hide Expired & Revoked</> : 
                <><Eye className="mr-1 h-4 w-4" /> Show Expired & Revoked</>
              }
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-1 h-4 w-4" /> Export History
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable 
          columns={columns} 
          data={mockCertificationHistory} 
        />
        
        <div className="mt-4 text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-blue-500 mr-2" />
            <span>
              <strong>Certification Longevity Analysis:</strong> {employee?.first_name} has maintained valid certifications for approximately {
                differenceInMonths(new Date(), new Date(mockCertificationHistory[0]?.valid_from || new Date()))
              } months.
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
