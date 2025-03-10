
import { useEffect, useState } from "react";
import { HRLayout } from "@/components/layout/HRLayout";
import { HRDashboard } from "@/components/hr/HRDashboard";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function HRHome() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "HR Dashboard Updated",
        description: "Latest employee data has been loaded",
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <HRLayout>
      <div className="container mx-auto py-6 space-y-8">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-1/3" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
            <Card className="p-4">
              <Skeleton className="h-64 w-full" />
            </Card>
          </div>
        ) : (
          <HRDashboard />
        )}
      </div>
    </HRLayout>
  );
}
