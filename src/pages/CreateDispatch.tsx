
import { PageLayout } from "@/components/layout/PageLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { BookingForm } from "@/components/dispatch/BookingForm";
import { useTheme } from "@/components/theme/ThemeProvider";

/**
 * CreateDispatch page component
 * Handles the creation of new dispatch records
 */
const CreateDispatch = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <PageLayout>
      <DashboardHeader />
      <main className="p-6 fade-in">
        <div className="mb-6">
          <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Create New Dispatch</h2>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Fill out the form below to create a new dispatch</p>
        </div>
        <BookingForm />
      </main>
    </PageLayout>
  );
};

export default CreateDispatch;
