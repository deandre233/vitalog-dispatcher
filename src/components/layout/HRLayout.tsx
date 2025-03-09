
import { useEffect } from "react";
import { HRSidebar } from "@/components/hr/HRSidebar";
import { createBucketIfNotExists } from "@/hooks/useStorage";

export function HRLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Ensure we have the required storage buckets
    createBucketIfNotExists('documents');
  }, []);

  return (
    <div className="flex">
      <HRSidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
