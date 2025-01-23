import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserPlus, Users } from "lucide-react";
import { Link } from "react-router-dom";

export function EmployeeDirectorySidebar() {
  return (
    <ScrollArea className="h-full py-6 px-4">
      <div className="space-y-4">
        <div className="px-3 py-2">
          <div className="space-y-4">
            <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">
              Employee Directory
            </h2>
            <div className="space-y-2">
              <Link to="/employees">
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Users className="h-4 w-4" />
                  All Employees
                </Button>
              </Link>
              <Link to="/employees/new">
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add Employee
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}