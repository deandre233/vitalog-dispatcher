
import { useEffect, useState } from "react";
import { HRLayout } from "@/components/layout/HRLayout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DispatchTable } from "@/components/dispatch/DispatchTable";
import { DispatchSearch } from "@/components/dispatch/DispatchSearch";
import { DispatchActions } from "@/components/dispatch/DispatchActions";
import { AddNoteSheet } from "@/components/dispatch/AddNoteSheet";
import { TransportRecord } from "@/types/dispatch";

export default function Dispatch() {
  const [dispatches, setDispatches] = useState<TransportRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDispatch, setSelectedDispatch] = useState<string | null>(null);

  useEffect(() => {
    const fetchDispatches = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('transport_records')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setDispatches(data || []);
      } catch (error) {
        console.error('Error fetching dispatches:', error);
        toast({
          title: "Error",
          description: "Failed to load dispatch records",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDispatches();
  }, [toast]);

  const handleAddNote = (dispatchId: string) => {
    setSelectedDispatch(dispatchId);
  };

  if (isLoading) {
    return (
      <HRLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-gray-500">Loading dispatch records...</div>
        </div>
      </HRLayout>
    );
  }

  return (
    <HRLayout>
      <div className="space-y-6 p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full md:w-auto">
            <DispatchSearch 
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
          <DispatchActions dispatches={dispatches} />
        </div>

        <DispatchTable 
          dispatches={dispatches}
          onAddNote={handleAddNote}
        />

        {dispatches.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No dispatch records found</p>
          </div>
        )}

        <AddNoteSheet
          dispatchId={selectedDispatch}
          onClose={() => setSelectedDispatch(null)}
        />
      </div>
    </HRLayout>
  );
}
