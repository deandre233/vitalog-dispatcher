
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserPlus, Sparkles, Download } from "lucide-react";
import { motion } from "framer-motion";

interface DirectoryHeaderProps {
  employeeCount: number;
}

export function DirectoryHeader({ employeeCount }: DirectoryHeaderProps) {
  return (
    <motion.div 
      className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-sm border border-[#E5DEFF]"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#D946EF]">
          Personnel Directory
        </h1>
        <p className="text-gray-500">
          View and manage all emergency service personnel
        </p>
      </div>
      
      <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
        <Badge variant="outline" className="text-sm bg-gradient-to-r from-[#F1F0FB] to-white border-[#E5DEFF]">
          {employeeCount} Personnel
        </Badge>
        
        <Button variant="outline" className="text-[#8B5CF6] border-[#E5DEFF] hover:bg-[#F1F0FB]">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
        
        <Button variant="outline" className="text-[#8B5CF6] border-[#E5DEFF] hover:bg-[#F1F0FB]">
          <Sparkles className="w-4 h-4 mr-2" />
          AI Insights
        </Button>
        
        <Button className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white hover:opacity-90">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Personnel
        </Button>
      </div>
    </motion.div>
  );
}
