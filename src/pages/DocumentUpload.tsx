
import { PageLayout } from "@/components/layout/PageLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DocumentUploadForm } from "@/components/document/DocumentUploadForm";

export const DocumentUpload = () => {
  return (
    <PageLayout>
      <DashboardHeader />
      <main className="p-6 fade-in">
        <DocumentUploadForm />
      </main>
    </PageLayout>
  );
};
