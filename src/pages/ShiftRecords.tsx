import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
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

interface ShiftRecord {
  id: string;
  employee_id: string | null;
  shift_date: string;
  shift_type: string;
  start_time: string | null;
  end_time: string | null;
  primary_checklist_completed: boolean;
  secondary_checklist_completed: boolean;
  notes: string | null;
  compliance_status: string;
}

export const ShiftRecords = () => {
  const { toast } = useToast();
  const [selectedShift, setSelectedShift] = useState<string | null>(null);

  const { data: shiftRecords, isLoading } = useQuery({
    queryKey: ["shiftRecords"],
    queryFn: async () => {
      return api.get<ShiftRecord>("shift_records", {
        select: "*",
        orderBy: "shift_date",
      });
    },
  });

  const handleChecklistToggle = async (shiftId: string, type: 'primary' | 'secondary') => {
    try {
      const shift = shiftRecords?.find(s => s.id === shiftId);
      if (!shift) return;

      const field = type === 'primary' ? 'primary_checklist_completed' : 'secondary_checklist_completed';
      const currentValue = shift[field];

      await api.update<ShiftRecord>("shift_records", shiftId, {
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
                      <TableHead>Date</TableHead>
                      <TableHead>Shift Type</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Primary Checklist</TableHead>
                      <TableHead>Secondary Checklist</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shiftRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          {format(new Date(record.shift_date), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell className="capitalize">{record.shift_type}</TableCell>
                        <TableCell>
                          {record.start_time && record.end_time
                            ? `${format(new Date(record.start_time), "HH:mm")} - ${format(
                                new Date(record.end_time),
                                "HH:mm"
                              )}`
                            : "Not set"}
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={record.primary_checklist_completed}
                            onCheckedChange={() => handleChecklistToggle(record.id, 'primary')}
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={record.secondary_checklist_completed}
                            onCheckedChange={() => handleChecklistToggle(record.id, 'secondary')}
                          />
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={record.compliance_status === 'pending' ? 'secondary' : 'success'}
                          >
                            {record.compliance_status}
                          </Badge>
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