import { useState } from "react";
import { useParams } from "react-router-dom";
import { useEmployeeDetails } from "@/hooks/useEmployeeDetails";
import { useEmployeeCertifications } from "@/hooks/useEmployeeCertifications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Plus, Download, Clock, BookOpen, Brain, Filter, Calendar } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";

export function ContinuingEducationSection() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { employee } = useEmployeeDetails(employeeId);
  const { continuingEducation, isLoading, addContinuingEducation } = useEmployeeCertifications(employeeId);
  
  const [showDeleted, setShowDeleted] = useState(false);
  const [showLinked, setShowLinked] = useState(true);
  const [showAddCE, setShowAddCE] = useState(false);
  const [dateRange, setDateRange] = useState<{from?: Date; to?: Date}>({});

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

  // Filter CEs by date range if specified
  const filteredCEs = continuingEducation.filter(ce => {
    if (!dateRange.from && !dateRange.to) return true;
    
    const ceDate = new Date(ce.earned_date);
    
    if (dateRange.from && dateRange.to) {
      return ceDate >= dateRange.from && ceDate <= dateRange.to;
    } else if (dateRange.from) {
      return ceDate >= dateRange.from;
    } else if (dateRange.to) {
      return ceDate <= dateRange.to!;
    }
    
    return true;
  });

  // Calculate total CE hours
  const totalHours = filteredCEs.reduce((total, ce) => total + ce.hours, 0);

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
      accessorKey: "title",
      header: "CE Title",
      cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
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
    },
    {
      accessorKey: "actions",
      header: "",
      cell: () => (
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <span className="sr-only">Edit</span>
          <Eye className="h-4 w-4" />
        </Button>
      ),
      size: 40,
    }
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
              <Button variant="default" size="sm" onClick={() => setShowAddCE(true)}>
                <Plus className="mr-1 h-4 w-4" /> Add CE
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="h-8">
                <Filter className="mr-1 h-4 w-4" /> Filter
              </Button>
              
              <div className="flex items-center space-x-2">
                <Label className="text-sm">From:</Label>
                <DatePicker 
                  selected={dateRange.from} 
                  onChange={(date) => setDateRange(prev => ({ ...prev, from: date as Date }))}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Label className="text-sm">To:</Label>
                <DatePicker 
                  selected={dateRange.to}
                  onChange={(date) => setDateRange(prev => ({ ...prev, to: date as Date }))}
                />
              </div>
              
              {(dateRange.from || dateRange.to) && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setDateRange({})}
                  className="h-8 px-2"
                >
                  Clear
                </Button>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="font-medium">Total Hours:</span> {totalHours}
              </div>
              <div className="text-sm">
                <span className="font-medium">Records:</span> {filteredCEs.length}
              </div>
            </div>
          </div>
          
          {continuingEducation.length > 0 ? (
            <DataTable 
              columns={ceColumns} 
              data={filteredCEs} 
            />
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center text-gray-600">
              No continuing education records found for this employee.
            </div>
          )}
          
          <div className="mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <Calendar className="inline-block mr-1 h-4 w-4" /> 
                CE tracking period: January 1, 2023 - December 31, 2025
              </div>
              
              <Button variant="outline" className="text-blue-600">
                <Brain className="mr-1 h-4 w-4" />
                Suggest CE opportunities based on career goals
              </Button>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
              <h3 className="font-medium text-blue-800 flex items-center mb-2">
                <BookOpen className="mr-2 h-4 w-4" />
                AI Insights for Continuing Education
              </h3>
              <p className="text-sm text-blue-700 mb-2">
                Based on {employeeName}'s certification level and career trajectory:
              </p>
              <ul className="list-disc pl-6 text-sm text-blue-600 space-y-1">
                <li>{employee?.certification_level.includes("EMT") ? "Complete at least 24 hours" : "Complete at least 36 hours"} of continuing education annually to stay ahead of recertification requirements</li>
                <li>Focus on {employee?.certification_level.includes("EMT") ? "advanced assessment techniques" : "critical care and advanced procedures"} to prepare for career advancement</li>
                <li>Consider attending the upcoming regional EMS conference for networking opportunities and additional CE credits</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showAddCE} onOpenChange={setShowAddCE}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Continuing Education</DialogTitle>
            <DialogDescription>
              Record a new continuing education activity for {employeeName}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ce-title" className="text-right">
                Title
              </Label>
              <input
                id="ce-title"
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="CE Title or Course Name"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ce-date" className="text-right">
                Date Earned
              </Label>
              <input
                id="ce-date"
                type="date"
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ce-hours" className="text-right">
                Hours
              </Label>
              <input
                id="ce-hours"
                type="number"
                step="0.5"
                min="0"
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="0.0"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ce-applies" className="text-right">
                Applies To
              </Label>
              <select
                id="ce-applies"
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select</option>
                <option value="EMT Recertification">EMT Recertification</option>
                <option value="Paramedic Recertification">Paramedic Recertification</option>
                <option value="BLS Renewal">BLS Renewal</option>
                <option value="ACLS Renewal">ACLS Renewal</option>
                <option value="PHTLS Renewal">PHTLS Renewal</option>
                <option value="General Knowledge">General Knowledge</option>
              </select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ce-notes" className="text-right">
                Notes
              </Label>
              <textarea
                id="ce-notes"
                className="col-span-3 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Additional information about this CE"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowAddCE(false)}>
              Cancel
            </Button>
            <Button type="submit">Save CE Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
