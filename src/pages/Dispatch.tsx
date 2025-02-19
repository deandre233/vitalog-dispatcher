
import { useEffect, useState } from "react";
import { Search, Filter, Brain, MessageSquarePlus, MapPin } from "lucide-react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { HRLayout } from "@/components/layout/HRLayout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Dispatch {
  id: string;
  patient_name: string;
  phone: string;
  service_type: string;
  status: 'Active' | 'Pending' | 'Completed';
  origin: string;
  destination: string;
  notes?: string;
  warnings?: string[];
}

export default function Dispatch() {
  const [dispatches, setDispatches] = useState<Dispatch[]>([]);
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
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search dispatches..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary">
                  <Brain className="mr-2 h-4 w-4" />
                  AI Insights
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>AI Dispatch Insights</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    Active dispatches: {dispatches.filter(d => d.status === 'Active').length}
                  </div>
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    Average response time: 12 minutes
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Origin</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dispatches.map((dispatch) => (
                <TableRow key={dispatch.id} className="group hover:bg-muted/50">
                  <TableCell className="font-medium">{dispatch.id}</TableCell>
                  <TableCell>{dispatch.patient_name}</TableCell>
                  <TableCell>{dispatch.phone}</TableCell>
                  <TableCell>
                    <Badge variant={dispatch.service_type === 'BLS' ? 'default' : 'secondary'}>
                      {dispatch.service_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        dispatch.status === 'Active' ? 'success' :
                        dispatch.status === 'Pending' ? 'warning' : 'default'
                      }
                    >
                      {dispatch.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{dispatch.origin}</TableCell>
                  <TableCell>{dispatch.destination}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={() => handleAddNote(dispatch.id)}>
                        <MessageSquarePlus className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {dispatches.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No dispatch records found</p>
          </div>
        )}
      </div>

      <Sheet open={!!selectedDispatch} onOpenChange={() => setSelectedDispatch(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add Note to Dispatch #{selectedDispatch}</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <textarea
              className="w-full min-h-[200px] p-4 rounded-md border resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Dispatch notes are NOT shown to the crew,&#13;&#10;and are NOT preserved on recurring trips.&#13;&#10;Lines beginning with ! will print as comments in the customer invoice."
              maxLength={4000}
            />
          </div>
          <SheetFooter className="mt-4">
            <Button onClick={() => setSelectedDispatch(null)}>Save Note</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </HRLayout>
  );
}
