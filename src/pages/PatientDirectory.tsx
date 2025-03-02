
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PatientFilters } from "@/components/patient/PatientFilters";
import { PatientTable } from "@/components/patient/PatientTable";
import { PatientDirectoryHeader } from "@/components/patient/PatientDirectoryHeader";
import { usePatientDirectory } from "@/hooks/usePatientDirectory";

export function PatientDirectory() {
  const {
    displayedPatients,
    isLoading,
    error,
    handleNameFilter,
    hideInactive,
    setHideInactive,
    hideNotSeen,
    setHideNotSeen,
    hideAnonymous,
    setHideAnonymous
  } = usePatientDirectory();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-medical-card-start to-medical-card-end">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1 bg-medical-accent/5 backdrop-blur-sm overflow-auto">
            <DashboardHeader />
            <main className="p-6 space-y-6">
              <PatientDirectoryHeader />
              
              <PatientFilters
                onNameFilterChange={handleNameFilter}
                onHideInactiveChange={setHideInactive}
                onHideNotSeenChange={setHideNotSeen}
                onHideAnonymousChange={setHideAnonymous}
                hideInactive={hideInactive}
                hideNotSeen={hideNotSeen}
                hideAnonymous={hideAnonymous}
              />

              {isLoading && (
                <div className="text-medical-secondary animate-pulse">Loading patients...</div>
              )}

              {error && (
                <div className="text-red-500">
                  Error loading patients. Please try again later.
                </div>
              )}

              {!isLoading && !error && (
                <PatientTable patients={displayedPatients} />
              )}
            </main>
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
}

export default PatientDirectory;
