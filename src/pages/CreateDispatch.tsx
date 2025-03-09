import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BookingForm } from "@/components/dispatch/BookingForm";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

/**
 * CreateDispatch page component
 * Handles the creation of new dispatch records
 */
const CreateDispatch = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex">
          <SidebarProvider>
            <AppSidebar />
            <div className="flex-1 bg-[#f4f7fc] overflow-auto">
              <DashboardHeader />
              <main className="p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold">Create New Dispatch</h2>
                  <p className="text-gray-500">Fill out the form below to create a new dispatch</p>
                </div>
                <BookingForm />
              </main>
            </div>
          </SidebarProvider>
        </div>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default CreateDispatch;