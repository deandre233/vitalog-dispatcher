
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useEmployeeDetails } from "@/hooks/useEmployeeDetails";
import { useEmployeeCertifications } from "@/hooks/useEmployeeCertifications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, Download, Edit, Plus, Upload } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { PracticeLevel } from "@/types/employee";

export function PracticeLevelsSection() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { employee } = useEmployeeDetails(employeeId);
  const { practiceLevels, isLoading } = useEmployeeCertifications(employeeId);
  
  const [showPlanningPanel, setShowPlanningPanel] = useState(false);

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString || dateString === "null") return "-";
    if (dateString === "[auto]") return dateString;
    try {
      return format(new Date(dateString), "yyyy-MM-dd");
    } catch {
      return dateString;
    }
  };

  const columns = [
    {
      accessorKey: "nemesis_id",
      header: "NEMESIS ID",
      cell: ({ row }) => <div>{row.getValue("nemesis_id")}</div>,
    },
    {
      accessorKey: "practice_level",
      header: "Practice Level",
      cell: ({ row }) => {
        const level = row.getValue("practice_level") as string;
        const achieved = row.original.achieved_date;
        
        return (
          <div className={`font-medium ${achieved ? "text-green-600" : ""}`}>
            {level}
            {achieved === "[auto]" && (
              <Badge variant="outline" className="ml-2 bg-blue-50">Auto-assigned</Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "achieved_date",
      header: "Date Achieved As Employee",
      cell: ({ row }) => <div>{formatDate(row.getValue("achieved_date"))}</div>,
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      ),
      size: 40
    },
  ];

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <BookOpen className="mr-2 h-5 w-5 text-blue-600" />
            State-reportable practice levels achieved as an employee
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Upload className="mr-1 h-4 w-4" /> Import Levels
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-1 h-4 w-4" /> Export
            </Button>
            <Button variant="default" size="sm">
              <Plus className="mr-1 h-4 w-4" /> Add Practice Level
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable 
          columns={columns} 
          data={practiceLevels} 
        />
        
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            <p className="mb-2">
              These practice levels are state-reportable qualifications that {employee?.first_name} has achieved 
              while employed with your organization.
            </p>
            <p>
              Reference: dPersonnel.38/dPersonnel.39
            </p>
          </div>
          
          <Button 
            variant="outline" 
            className="text-blue-600"
            onClick={() => setShowPlanningPanel(!showPlanningPanel)}
          >
            <Brain className="mr-1 h-4 w-4" />
            Generate AI career advancement plan
          </Button>
        </div>

        {showPlanningPanel && (
          <div className="mt-4 p-4 border rounded-md bg-blue-50">
            <h3 className="font-medium text-blue-800 mb-2">AI Career Advancement Recommendations</h3>
            <p className="text-sm mb-3">Based on {employee?.first_name}'s current practice levels and certifications:</p>
            
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>
                <strong>Next level recommendation:</strong> Consider pursuing {
                  employee?.certification_level === "EMT - Basic" ? "Advanced EMT (AEMT)" 
                  : employee?.certification_level === "Paramedic" ? "Critical Care Paramedic" 
                  : "Paramedic certification"
                }
              </li>
              <li>
                <strong>Timeline estimate:</strong> 6-12 months based on current qualifications
              </li>
              <li>
                <strong>Prerequisites needed:</strong> {
                  employee?.certification_level === "EMT - Basic" ? "Complete AEMT bridge course (150-250 hours)" 
                  : employee?.certification_level === "Paramedic" ? "Minimum 2 years paramedic experience, ACLS, PALS certifications" 
                  : "EMT-Basic certification for at least 6 months, anatomy & physiology coursework"
                }
              </li>
            </ul>
            
            <div className="flex justify-end mt-4">
              <Button size="sm">Create Advancement Plan</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
