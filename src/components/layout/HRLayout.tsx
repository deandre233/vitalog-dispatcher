
import { AppLayout } from "@/components/layout/AppLayout";
import { HRSidebar } from "@/components/hr/HRSidebar";

interface HRLayoutProps {
  children: React.ReactNode;
}

export const HRLayout = ({ children }: HRLayoutProps) => {
  return (
    <AppLayout sidebar={<HRSidebar />}>
      {children}
    </AppLayout>
  );
};
