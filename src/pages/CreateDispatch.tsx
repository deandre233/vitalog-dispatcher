
import { BookingForm } from "@/components/dispatch/BookingForm";
import { MainLayout } from "@/components/layout/MainLayout";
import { AIDispatchInsights } from "@/components/dispatch/ai/AIDispatchInsights";
import { Card } from "@/components/ui/card";

/**
 * CreateDispatch page component
 * Handles the creation of new dispatch records
 */
const CreateDispatch = () => {
  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-medical-primary bg-gradient-to-r from-medical-primary to-medical-secondary bg-clip-text text-transparent">
              Create New Dispatch
            </h2>
            <p className="text-gray-500">Fill out the form below to create a new dispatch</p>
          </div>
          <BookingForm />
        </div>
        
        <div className="space-y-6">
          <Card className="p-4 shadow-md border-l-4 border-l-medical-secondary">
            <h3 className="font-semibold text-lg text-medical-primary mb-4">Dispatch AI Assistant</h3>
            <p className="text-sm text-gray-600 mb-4">
              Our AI assistant provides real-time insights to help optimize dispatch operations. 
              Get traffic predictions, route recommendations, and efficiency analytics.
            </p>
            <div className="text-xs text-gray-500">
              <p>✓ Real-time traffic analysis</p>
              <p>✓ Optimal route suggestions</p>
              <p>✓ Efficiency predictions</p>
              <p>✓ Risk assessment</p>
            </div>
          </Card>
          
          <AIDispatchInsights />
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateDispatch;
