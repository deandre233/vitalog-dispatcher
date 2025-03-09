
import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Employee } from "@/types/employee";

interface EmergencyContactCardProps {
  data: Partial<Employee>;
  formatPhone: (phone: string | undefined) => string;
}

export function EmergencyContactCard({ data, formatPhone }: EmergencyContactCardProps) {
  return (
    <Card className="mt-6 bg-slate-50/70">
      <CardHeader className="py-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <CardTitle className="text-md">Emergency Contact</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm font-medium">Name:</div>
            <div className="text-sm">{data.emergency_contact_name || "Not provided"}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm font-medium">Phone:</div>
            <div className="text-sm">{formatPhone(data.emergency_contact_phone)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
