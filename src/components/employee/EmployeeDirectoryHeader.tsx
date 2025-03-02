
import React from "react";
import { Search, UserPlus, Filter, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { AIRecommendationSheet } from "./AIRecommendationSheet";
import type { CapabilityAlert, AICrewRecommendation, Employee } from "@/types/employee";

interface EmployeeDirectoryHeaderProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  onAddEmployee: () => void;
  showCardView: boolean;
  setShowCardView: (value: boolean) => void;
  alertCount: number;
  assignmentRequirements: {
    serviceType: string;
    requiredCertifications: string[];
    startTime: string;
    location: string;
  };
  setAssignmentRequirements: React.Dispatch<React.SetStateAction<{
    serviceType: string;
    requiredCertifications: string[];
    startTime: string;
    location: string;
  }>>;
  handleGetRecommendations: () => Promise<void>;
  aiRecommendations: AICrewRecommendation[];
  setAiRecommendations: React.Dispatch<React.SetStateAction<AICrewRecommendation[]>>;
  employees: Employee[];
  handleEmployeeClick: (employeeId: string) => void;
}

export const EmployeeDirectoryHeader = ({
  searchQuery,
  onSearch,
  onAddEmployee,
  showCardView,
  setShowCardView,
  alertCount,
  assignmentRequirements,
  setAssignmentRequirements,
  handleGetRecommendations,
  aiRecommendations,
  setAiRecommendations,
  employees,
  handleEmployeeClick
}: EmployeeDirectoryHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex-1 w-full md:w-auto">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={() => setShowCardView(!showCardView)}
              >
                {showCardView ? "Table View" : "Card View"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Toggle between table and card view
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
        
        <Button onClick={onAddEmployee}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
        
        <AIRecommendationSheet 
          assignmentRequirements={assignmentRequirements}
          setAssignmentRequirements={setAssignmentRequirements}
          handleGetRecommendations={handleGetRecommendations}
          aiRecommendations={aiRecommendations}
          setAiRecommendations={setAiRecommendations}
          employees={employees}
          handleEmployeeClick={handleEmployeeClick}
        />
        
        {alertCount > 0 && (
          <Button variant="outline" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {alertCount}
            </span>
          </Button>
        )}
      </div>
    </div>
  );
};
