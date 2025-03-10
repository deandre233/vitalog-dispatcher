
import { ReactNode, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { createBucketIfNotExists } from "@/hooks/useStorage";

export function HRLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Ensure we have the required storage buckets
    createBucketIfNotExists('documents');
  }, []);

  return (
    <MainLayout>
      <div className="flex">
        <div className="flex-1">{children}</div>
      </div>
    </MainLayout>
  );
}
