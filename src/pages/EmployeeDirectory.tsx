
import { HRLayout } from "@/components/layout/HRLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useEmployeeDirectory } from "@/hooks/useEmployeeDirectory";
import { DirectoryHeader } from "@/components/employee-directory/DirectoryHeader";
import { DirectoryFilters } from "@/components/employee-directory/DirectoryFilters";
import { DirectoryTabs } from "@/components/employee-directory/DirectoryTabs";
import { EmployeeGrid } from "@/components/employee-directory/EmployeeGrid";
import { EmployeeList } from "@/components/employee-directory/EmployeeList";
import { EmptyState } from "@/components/employee-directory/EmptyState";

export function EmployeeDirectory() {
  const {
    filteredEmployees,
    isLoading,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    certFilter,
    setCertFilter,
    stationFilter,
    setStationFilter,
    stations,
    certificationLevels,
    resetFilters,
    getStatusBadgeColor
  } = useEmployeeDirectory();

  if (isLoading) {
    return (
      <HRLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-36" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <Card key={i} className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <div className="text-center w-full">
                    <Skeleton className="h-5 w-3/4 mx-auto mb-2" />
                    <Skeleton className="h-4 w-1/2 mx-auto mb-2" />
                    <Skeleton className="h-6 w-1/3 mx-auto rounded-full" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </HRLayout>
    );
  }

  return (
    <HRLayout>
      <div className="space-y-6">
        <DirectoryHeader employeeCount={filteredEmployees.length} />
        
        <DirectoryFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          certFilter={certFilter}
          setCertFilter={setCertFilter}
          stationFilter={stationFilter}
          setStationFilter={setStationFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
          certificationLevels={certificationLevels}
          stations={stations}
          resetFilters={resetFilters}
        />
        
        <DirectoryTabs 
          employeeCount={filteredEmployees.length}
          emptyState={<EmptyState resetFilters={resetFilters} />}
        >
          {viewMode === "grid" ? (
            <EmployeeGrid 
              employees={filteredEmployees} 
              getStatusBadgeColor={getStatusBadgeColor} 
            />
          ) : (
            <EmployeeList 
              employees={filteredEmployees} 
              getStatusBadgeColor={getStatusBadgeColor} 
            />
          )}
        </DirectoryTabs>
      </div>
    </HRLayout>
  );
}

export default EmployeeDirectory;
