
import { Filter, UserPlus, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger 
} from "@/components/ui/sheet";

interface EmployeeActionsProps {
  onAddEmployee: () => void;
  insights: string[];
}

export function EmployeeActions({ onAddEmployee, insights }: EmployeeActionsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
        <Filter className="mr-2 h-4 w-4" />
        Filters
      </Button>
      <Button onClick={onAddEmployee} className="bg-indigo-500 hover:bg-indigo-600 text-white">
        <UserPlus className="mr-2 h-4 w-4" />
        Add Employee
      </Button>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="secondary" className="bg-purple-500/20 hover:bg-purple-500/30 text-white border-purple-400/20">
            <Brain className="mr-2 h-4 w-4" />
            AI Insights
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>AI Workforce Insights</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="p-4 bg-purple-500/10 rounded-lg text-white">
                {insight}
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
