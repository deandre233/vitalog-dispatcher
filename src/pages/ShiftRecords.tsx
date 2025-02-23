import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { useQuery } from "@tanstack/react-query";
import { shiftRecordsService } from "@/services/shiftRecords";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus, FileCheck } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ShiftFilters } from "@/components/shifts/ShiftFilters";
import type { ShiftFilter, ShiftRecord } from "@/types/shift-records";

export const ShiftRecords = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<ShiftFilter>({});

  const { data: shiftRecords, isLoading } = useQuery({
    queryKey: ["shiftRecords", filters],
    queryFn: () => shiftRecordsService.getShiftRecords(filters),
  });

  const handleChecklistToggle = async (shiftId: string, type: 'primary' | 'secondary') => {
    try {
      const shift = shiftRecords?.find(s => s.id === shiftId);
      if (!shift) return;

      const field = type === 'primary' ? 'primary_checklist_completed' : 'secondary_checklist_completed';
      const currentValue = shift[field];

      await shiftRecordsService.updateShiftChecklist(shiftId, {
        [field]: !currentValue
      });

      toast({
        title: "Checklist Updated",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} checklist ${!currentValue ? 'completed' : 'uncompleted'}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update checklist status.",
        variant: "destructive",
      });
    }
  };

  const getEmployeeName = (record: ShiftRecord) => {
    if (record.employees) {
      return `${record.employees.first_name} ${record.employees.last_name}`;
    }
    return 'N/A';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 flex">
        <AppSidebar />
        <div className="flex-1 bg-[#f4f7fc] overflow-auto">
          <main className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">Shift Records & Checklists</h1>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Shift Record
              </Button>
            </div>

            <ShiftFilters onFilterChange={setFilters} />

            <div className="bg-white rounded-lg shadow">
              {isLoading ? (
                <div className="p-8 text-center">Loading shift records...</div>
              ) : !shiftRecords?.length ? (
                <div className="p-8 text-center text-gray-500">
                  No shift records found
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>End Time</TableHead>
                      <TableHead>Vehicle ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Primary Checklist</TableHead>
                      <TableHead>Secondary Checklist</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shiftRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{getEmployeeName(record)}</TableCell>
                        <TableCell>
                          {record.start_time ? format(new Date(record.start_time), "yyyy MMM dd HH:mm") : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {record.end_time ? format(new Date(record.end_time), "yyyy MMM dd HH:mm") : 'N/A'}
                        </TableCell>
                        <TableCell>{record.vehicle_id || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {record.compliance_status || 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={record.primary_checklist_completed || false}
                            onCheckedChange={() => handleChecklistToggle(record.id, 'primary')}
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={record.secondary_checklist_completed || false}
                            onCheckedChange={() => handleChecklistToggle(record.id, 'secondary')}
                          />
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <FileCheck className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};