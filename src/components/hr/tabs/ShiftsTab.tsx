
import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { shiftRecordsService } from "@/services/shiftRecords";
import type { ShiftRecord } from "@/types/shift-records";

interface ShiftsTabProps {
  employeeId?: string;
}

type ShiftStatus = "upcoming" | "completed" | "available";

interface ShiftWithStatus extends ShiftRecord {
  status: ShiftStatus;
  payment?: number;
  overtime?: boolean;
}

const calculateShiftPayment = (shift: ShiftRecord, hourlyRate: number = 25): number => {
  if (!shift.start_time || !shift.end_time) return 0;
  
  const start = new Date(shift.shift_date + "T" + shift.start_time);
  const end = new Date(shift.shift_date + "T" + shift.end_time);
  
  const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  
  // Calculate overtime (anything over 8 hours)
  const regularHours = Math.min(hours, 8);
  const overtimeHours = Math.max(0, hours - 8);
  
  return (regularHours * hourlyRate) + (overtimeHours * hourlyRate * 1.5);
};

export function ShiftsTab({ employeeId }: ShiftsTabProps) {
  const [activeFilter, setActiveFilter] = useState<ShiftStatus>("upcoming");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedShift, setSelectedShift] = useState<ShiftWithStatus | null>(null);
  
  // Mock data for shifts - in a real app, this would come from a hook or service
  const mockShifts: ShiftWithStatus[] = [
    {
      id: "shift-001",
      employee_id: employeeId,
      shift_date: "2024-07-05",
      shift_type: "Day",
      start_time: "08:00:00",
      end_time: "16:00:00",
      status: "upcoming",
      payment: 200,
      overtime: false,
      vehicle_id: "AMB-105",
      notes: "Regular day shift",
    },
    {
      id: "shift-002",
      employee_id: employeeId,
      shift_date: "2024-07-07",
      shift_type: "Night",
      start_time: "20:00:00",
      end_time: "06:00:00", 
      status: "upcoming",
      payment: 280,
      overtime: true, 
      vehicle_id: "AMB-102",
      notes: "Overtime expected",
    },
    {
      id: "shift-003",
      employee_id: employeeId,
      shift_date: "2024-06-30",
      shift_type: "Day",
      start_time: "08:00:00",
      end_time: "17:00:00",
      status: "completed",
      payment: 225,
      overtime: true,
      vehicle_id: "AMB-101",
      notes: "Completed with 1 hour overtime",
    },
    {
      id: "shift-004",
      employee_id: null,
      shift_date: "2024-07-10",
      shift_type: "Evening",
      start_time: "16:00:00",
      end_time: "00:00:00",
      status: "available",
      payment: 200,
      vehicle_id: "AMB-103",
      notes: "Coverage needed",
    },
    {
      id: "shift-005",
      employee_id: null,
      shift_date: "2024-07-12",
      shift_type: "Day",
      start_time: "08:00:00",
      end_time: "16:00:00",
      status: "available",
      payment: 200,
      vehicle_id: "AMB-104",
      notes: "Volunteer opportunity",
    }
  ];

  // Count available shifts
  const availableShiftsCount = mockShifts.filter(shift => shift.status === "available").length;

  // Determine badge color based on count
  const getBadgeVariant = (count: number): "default" | "success" | "warning" | "info" => {
    if (count >= 5) return "success";
    if (count >= 3) return "info";
    if (count >= 1) return "warning";
    return "default";
  };

  const filteredShifts = mockShifts.filter(shift => {
    if (activeFilter === "available") {
      return shift.status === "available";
    }
    return shift.status === activeFilter && shift.employee_id === employeeId;
  });

  const handlePickUpShift = (shift: ShiftWithStatus) => {
    setSelectedShift(shift);
    setShowConfirmation(true);
  };

  const confirmPickUpShift = () => {
    // In a real app, this would call an API to assign the shift
    console.log(`Shift ${selectedShift?.id} picked up`);
    setShowConfirmation(false);
    // Would refresh data here
  };

  const upcomingShiftsColumns: ColumnDef<ShiftWithStatus>[] = [
    {
      accessorKey: "shift_date",
      header: "Date",
      cell: ({ row }) => {
        const shift = row.original;
        return format(new Date(shift.shift_date), "MMM dd, yyyy");
      }
    },
    {
      accessorKey: "shift_type",
      header: "Shift Type",
    },
    {
      accessorKey: "time",
      header: "Time",
      cell: ({ row }) => {
        const shift = row.original;
        return `${shift.start_time?.substring(0, 5)} - ${shift.end_time?.substring(0, 5)}`;
      }
    },
    {
      accessorKey: "vehicle_id",
      header: "Vehicle",
    },
    {
      accessorKey: "payment",
      header: "Payment",
      cell: ({ row }) => {
        const shift = row.original;
        return `$${shift.payment?.toFixed(2)}`;
      }
    },
    {
      accessorKey: "overtime",
      header: "Overtime",
      cell: ({ row }) => {
        const shift = row.original;
        return shift.overtime ? <Badge variant="default">OT</Badge> : null;
      }
    },
    {
      id: "notes",
      header: "Notes",
      cell: ({ row }) => row.original.notes,
    }
  ];

  const availableShiftsColumns: ColumnDef<ShiftWithStatus>[] = [
    ...upcomingShiftsColumns,
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handlePickUpShift(row.original)}
        >
          Pick Up
        </Button>
      )
    }
  ];

  return (
    <TabsContent value="shifts" className="mt-0 animate-in fade-in-50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Shift Management</h2>
            <p className="text-muted-foreground">View, manage, and pick up shifts</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={activeFilter === "upcoming" ? "default" : "outline"} 
              onClick={() => setActiveFilter("upcoming")}
            >
              Upcoming
            </Button>
            <Button 
              variant={activeFilter === "completed" ? "default" : "outline"} 
              onClick={() => setActiveFilter("completed")}
            >
              Completed
            </Button>
            <Button 
              variant={activeFilter === "available" ? "default" : "outline"} 
              onClick={() => setActiveFilter("available")}
              className="relative"
            >
              Available
              {availableShiftsCount > 0 && (
                <Badge 
                  variant={getBadgeVariant(availableShiftsCount)}
                  className="absolute -top-2 -right-2 flex items-center justify-center min-w-[1.5rem] h-[1.5rem] rounded-full text-xs font-bold"
                >
                  {availableShiftsCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {activeFilter === "upcoming" && (
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Upcoming Shifts</CardTitle>
                  <CardDescription>Your scheduled shifts for the next two weeks</CardDescription>
                </div>
                {availableShiftsCount > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setActiveFilter("available")}
                    className="flex items-center gap-2"
                  >
                    <span>Available Shifts</span>
                    <Badge 
                      variant={getBadgeVariant(availableShiftsCount)}
                      className="ml-1 flex items-center justify-center min-w-[1.5rem] h-[1.5rem] rounded-full"
                    >
                      {availableShiftsCount}
                    </Badge>
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <DataTable 
                  columns={upcomingShiftsColumns} 
                  data={filteredShifts} 
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Total upcoming shifts: {filteredShifts.length}
                </div>
                <div className="text-sm font-medium">
                  Projected earnings: ${filteredShifts.reduce((sum, shift) => sum + (shift.payment || 0), 0).toFixed(2)}
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shift Calendar</CardTitle>
                <CardDescription>Visual overview of your upcoming shifts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 border rounded-md bg-muted/20 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Calendar className="h-10 w-10" />
                    <p>Calendar view will be implemented here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeFilter === "completed" && (
          <Card>
            <CardHeader>
              <CardTitle>Completed Shifts</CardTitle>
              <CardDescription>History of your past shifts and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={upcomingShiftsColumns} 
                data={filteredShifts} 
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Total completed shifts: {filteredShifts.length}
              </div>
              <div className="text-sm font-medium">
                Total earnings: ${filteredShifts.reduce((sum, shift) => sum + (shift.payment || 0), 0).toFixed(2)}
              </div>
            </CardFooter>
          </Card>
        )}

        {activeFilter === "available" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                Available Shifts
                <Badge 
                  variant={getBadgeVariant(filteredShifts.length)}
                  className="ml-2 flex items-center justify-center min-w-[1.75rem] h-[1.75rem] rounded-full text-sm"
                >
                  {filteredShifts.length}
                </Badge>
              </CardTitle>
              <CardDescription>Open shifts you can pick up for extra hours</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={availableShiftsColumns} 
                data={filteredShifts} 
              />
            </CardContent>
            <CardFooter>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Available opportunities:</span>
                <Badge variant={getBadgeVariant(filteredShifts.length)}>
                  {filteredShifts.length} {filteredShifts.length === 1 ? 'shift' : 'shifts'}
                </Badge>
              </div>
            </CardFooter>
          </Card>
        )}

        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Shift Pickup</DialogTitle>
              <DialogDescription>
                Are you sure you want to take this shift on {selectedShift?.shift_date}?
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Date</TableCell>
                    <TableCell>{selectedShift?.shift_date}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Time</TableCell>
                    <TableCell>{selectedShift?.start_time?.substring(0, 5)} - {selectedShift?.end_time?.substring(0, 5)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Type</TableCell>
                    <TableCell>{selectedShift?.shift_type}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Payment</TableCell>
                    <TableCell>${selectedShift?.payment?.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmation(false)}>Cancel</Button>
              <Button onClick={confirmPickUpShift}>Confirm Pickup</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TabsContent>
  );
}
