
import { AppLayout } from "@/components/layout/AppLayout";
import { AppSidebar } from "@/components/navigation/AppSidebar";

interface PageLayoutProps {
  children: React.ReactNode;
}

export const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <AppLayout sidebar={<AppSidebar />}>
      {children}
    </AppLayout>
  );
};
