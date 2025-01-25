import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, UserPlus, UserSearch, UserCog } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * EmployeeDirectorySidebar Component
 * 
 * Navigation sidebar for the employee directory section providing access to
 * various employee management features.
 */
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
              <Link to="/employees" aria-label="View all employees">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-2"
                  role="menuitem"
                >
                  <Users className="h-4 w-4" aria-hidden="true" />
                  All Employees
                </Button>
              </Link>
              <Link to="/employees/new" aria-label="Add new employee">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-2"
                  role="menuitem"
                >
                  <UserPlus className="h-4 w-4" aria-hidden="true" />
                  Add Employee
                </Button>
              </Link>
              <Link to="/employees/search" aria-label="Search employees">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-2"
                  role="menuitem"
                >
                  <UserSearch className="h-4 w-4" aria-hidden="true" />
                  Search Directory
                </Button>
              </Link>
              <Link to="/employees/settings" aria-label="Directory settings">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-2"
                  role="menuitem"
                >
                  <UserCog className="h-4 w-4" aria-hidden="true" />
                  Directory Settings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}