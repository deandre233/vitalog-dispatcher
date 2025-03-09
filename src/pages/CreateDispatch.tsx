
import { BookingForm } from "@/components/dispatch/BookingForm";
import { MainLayout } from "@/components/layout/MainLayout";

/**
 * CreateDispatch page component
 * Handles the creation of new dispatch records
 */
const CreateDispatch = () => {
  return (
    <MainLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-medical-primary bg-gradient-to-r from-medical-primary to-medical-secondary bg-clip-text text-transparent">
          Create New Dispatch
        </h2>
        <p className="text-gray-500">Fill out the form below to create a new dispatch</p>
      </div>
      <BookingForm />
    </MainLayout>
  );
};

export default CreateDispatch;
