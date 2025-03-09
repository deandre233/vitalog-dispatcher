
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Employee } from "@/types/employee";

interface EmployeeHeaderProps {
  employee: Employee | undefined;
}

export function EmployeeHeader({ employee }: EmployeeHeaderProps) {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white border-b">
      <div className="container mx-auto py-4 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/employees")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {employee?.first_name} {employee?.last_name}
            </h1>
            <p className="text-gray-500 text-sm">
              {employee?.certification_level} • ID: {employee?.readable_id || employee?.id?.substring(0, 8)}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous Employee
          </Button>
          <Button variant="outline">
            Next Employee <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
}
