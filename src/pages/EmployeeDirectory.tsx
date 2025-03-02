
import React from "react";
import { Badge } from "@/components/ui/badge";
import { HRLayout } from "@/components/layout/HRLayout";
import { EmployeeDirectoryHeader } from "@/components/employee/EmployeeDirectoryHeader";
import { EmployeeCardGrid } from "@/components/employee/EmployeeCardGrid";
import { EmployeeTable } from "@/components/employee/EmployeeTable";
import { useEmployeeDirectory } from "@/hooks/useEmployeeDirectory";
import { getCapabilityDisplay } from "@/utils/capabilityUtils";

export function EmployeeDirectory() {
  const {
    employees,
    filteredEmployees,
    searchQuery,
    isLoading,
    alerts,
    showCardView,
    sortField,
    sortDirection,
    aiRecommendations,
    assignmentRequirements,
    handleSearch,
    handleEmployeeClick,
    handleAddEmployee,
    handleSort,
    handleGetRecommendations,
    setShowCardView,
    setAiRecommendations,
    setAssignmentRequirements,
  } = useEmployeeDirectory();

  if (isLoading) {
    return (
      <HRLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-gray-500">Loading employee directory...</div>
        </div>
      </HRLayout>
    );
  }

  return (
    <HRLayout>
      <div className="space-y-6">
        <EmployeeDirectoryHeader 
          searchQuery={searchQuery}
          onSearch={handleSearch}
          onAddEmployee={handleAddEmployee}
          showCardView={showCardView}
          setShowCardView={setShowCardView}
          alertCount={alerts.length}
          assignmentRequirements={assignmentRequirements}
          setAssignmentRequirements={setAssignmentRequirements}
          handleGetRecommendations={handleGetRecommendations}
          aiRecommendations={aiRecommendations}
          setAiRecommendations={setAiRecommendations}
          employees={employees}
          handleEmployeeClick={handleEmployeeClick}
        />

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Employee Directory</h1>
          <Badge variant="outline" className="text-sm">
            {filteredEmployees.length} Employees
          </Badge>
        </div>
        
        {showCardView ? (
          <EmployeeCardGrid 
            employees={filteredEmployees}
            alerts={alerts}
            onEmployeeClick={handleEmployeeClick}
            getCapabilityDisplay={getCapabilityDisplay}
          />
        ) : (
          <EmployeeTable 
            employees={filteredEmployees}
            alerts={alerts}
            onEmployeeClick={handleEmployeeClick}
            getCapabilityDisplay={getCapabilityDisplay}
            sortField={sortField}
            sortDirection={sortDirection}
            handleSort={handleSort}
          />
        )}

        {filteredEmployees.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No employees found matching your search</p>
          </div>
        )}
      </div>
    </HRLayout>
  );
}

export default EmployeeDirectory;
