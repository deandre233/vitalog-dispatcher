
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface DirectoryHeaderProps {
  employeeCount: number;
}

export function DirectoryHeader({ employeeCount }: DirectoryHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#D946EF]">
          Personnel Directory
        </h1>
        <p className="text-gray-500">
          View and manage all emergency service personnel
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-sm bg-gradient-to-r from-[#F1F0FB] to-white border-[#E5DEFF]">
          {employeeCount} Personnel
        </Badge>
        <Button className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white hover:opacity-90">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Personnel
        </Button>
      </div>
    </div>
  );
}
