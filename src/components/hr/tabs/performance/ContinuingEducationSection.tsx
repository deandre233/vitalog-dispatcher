
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useEmployeeDetails } from "@/hooks/useEmployeeDetails";
import { useEmployeeCertifications } from "@/hooks/useEmployeeCertifications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Plus, Download, Clock, BookOpen, Brain } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export function ContinuingEducationSection() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { employee } = useEmployeeDetails(employeeId);
  const { continuingEducation, practiceLevels, isLoading } = useEmployeeCertifications(employeeId);
  
  const [showDeleted, setShowDeleted] = useState(false);
  const [showLinked, setShowLinked] = useState(true);

  const employeeName = `${employee?.first_name || ''} ${employee?.last_name || ''}`;
  
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString || dateString === "null") return "-";
    if (dateString === "[auto]") return dateString;
    try {
      return format(new Date(dateString), "yyyy-MM-dd");
    } catch {
      return dateString;
    }
  };

  const ceColumns = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>,
      size: 60,
    },
    {
      accessorKey: "earned_date",
      header: "Earned",
      cell: ({ row }) => <div>{formatDate(row.getValue("earned_date"))}</div>,
    },
    {
      accessorKey: "hours",
      header: "Hours",
      cell: ({ row }) => <div className="text-center">{row.getValue("hours")}</div>,
      size: 80,
    },
    {
      accessorKey: "applies_to",
      header: "Applies To",
      cell: ({ row }) => <div>{row.getValue("applies_to")}</div>,
    },
    {
      accessorKey: "notes",
      header: "Notes",
      cell: ({ row }) => <div>{row.getValue("notes") || "-"}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant={status === "Approved" ? "success" : status === "Pending" ? "warning" : "destructive"}>
            {status}
          </Badge>
        );
      },
    }
  ];

  const levelColumns = [
    {
      accessorKey: "nemesis_id",
      header: "NEMESIS ID",
      cell: ({ row }) => <div>{row.getValue("nemesis_id")}</div>,
    },
    {
      accessorKey: "practice_level",
      header: "Practice Level",
      cell: ({ row }) => <div className="font-medium">{row.getValue("practice_level")}</div>,
    },
    {
      accessorKey: "achieved_date",
      header: "Date Achieved As Employee",
      cell: ({ row }) => <div>{formatDate(row.getValue("achieved_date"))}</div>,
    },
    {
      accessorKey: "actions",
      header: "",
      cell: () => (
        <div className="text-blue-600 text-xs">Edit</div>
      ),
      size: 40
    },
  ];

  return (
    <>
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <Clock className="mr-2 h-5 w-5 text-blue-600" />
              Continuing Education
            </CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => setShowDeleted(!showDeleted)}>
                {showDeleted ? 
                  <><EyeOff className="mr-1 h-4 w-4" /> Hide Deleted CEs</> : 
                  <><Eye className="mr-1 h-4 w-4" /> Show Deleted CEs</>
                }
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowLinked(!showLinked)}>
                {showLinked ? 
                  <><EyeOff className="mr-1 h-4 w-4" /> Hide Unlinked CEs</> : 
                  <><Eye className="mr-1 h-4 w-4" /> Show Unlinked CEs</>
                }
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-1 h-4 w-4" /> Export
              </Button>
              <Button variant="default" size="sm">
                <Plus className="mr-1 h-4 w-4" /> Add CE
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {continuingEducation.length > 0 ? (
            <DataTable 
              columns={ceColumns} 
              data={continuingEducation} 
            />
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center text-gray-600">
              No continuing education records found for this employee.
            </div>
          )}
          
          <div className="mt-4">
            <Button variant="outline" className="text-blue-600">
              <Brain className="mr-1 h-4 w-4" />
              Suggest CE opportunities based on career goals
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-blue-600" />
              State-reportable practice levels achieved as an employee
            </CardTitle>
            <div className="text-xs text-gray-500">
              (dPersonnel.38/dPersonnel.39)
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={levelColumns} 
            data={practiceLevels} 
          />
          
          <div className="mt-6">
            <Button variant="outline" className="text-blue-600">
              <Brain className="mr-1 h-4 w-4" />
              Generate AI recommendation for career advancement
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
