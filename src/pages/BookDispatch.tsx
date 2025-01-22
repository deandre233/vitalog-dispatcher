import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { BookingForm } from "@/components/dispatch/BookingForm";

const BookDispatch = () => {
  return (
    <div className="min-h-screen flex">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1 bg-[#f4f7fc] overflow-auto">
          <DashboardHeader />
          <main className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Create New Dispatch</h2>
              <p className="text-gray-500">Fill out the form below to create a new dispatch</p>
            </div>
            <BookingForm />
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default BookDispatch;