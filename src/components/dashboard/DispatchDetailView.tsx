import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft,
  User,
  MapPin,
  Clock,
  Ambulance,
  FileText,
  Brain,
  AlertCircle,
  Repeat,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

interface TransportRecord {
  id: string;
  dispatch_id: string;
  pickup_location: string;
  dropoff_location: string;
  transport_date: string;
  status: string;
  crew_assigned: string | null;
  notes: string | null;
  recurrence_type: string | null;
  recurrence_day: string | null;
  recurrence_frequency: string | null;
  warnings: string[] | null;
  pickup_type: string | null;
  dropoff_type: string | null;
  return_trip_id: string | null;
}

export function DispatchDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: transportRecord, isLoading } = useQuery({
    queryKey: ['transport', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transport_records')
        .select('*')
        .eq('dispatch_id', id)
        .single();

      if (error) throw error;
      return data as TransportRecord;
    },
  });

  const updateTransportMutation = useMutation({
    mutationFn: async (updates: Partial<TransportRecord>) => {
      const { error } = await supabase
        .from('transport_records')
        .update(updates)
        .eq('dispatch_id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Transport record updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update transport record");
      console.error("Update error:", error);
    },
  });

  const handleWarningToggle = (warning: string) => {
    if (!transportRecord) return;

    const currentWarnings = transportRecord.warnings || [];
    const newWarnings = currentWarnings.includes(warning)
      ? currentWarnings.filter(w => w !== warning)
      : [...currentWarnings, warning];

    updateTransportMutation.mutate({ warnings: newWarnings });
  };

  const handleRecurrenceChange = (value: string) => {
    updateTransportMutation.mutate({ recurrence_type: value });
  };

  const handlePickupTypeChange = (value: string) => {
    updateTransportMutation.mutate({ pickup_type: value });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">
          Dispatch #{id} Details
        </h2>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="warnings">Warnings</TabsTrigger>
          <TabsTrigger value="recurrence">Recurrence</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Transport Details</span>
            </div>
            <div className="pl-7 space-y-2">
              <p>From: {transportRecord?.pickup_location}</p>
              <p>To: {transportRecord?.dropoff_location}</p>
              <p>Status: {transportRecord?.status}</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Schedule</span>
            </div>
            <div className="pl-7 space-y-4">
              <div className="space-y-2">
                <Label>Transport Date</Label>
                <Input
                  type="datetime-local"
                  value={format(new Date(transportRecord?.transport_date || ''), "yyyy-MM-dd'T'HH:mm")}
                  onChange={(e) => updateTransportMutation.mutate({ 
                    transport_date: e.target.value 
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Pickup Type</Label>
                <RadioGroup
                  value={transportRecord?.pickup_type || 'asap'}
                  onValueChange={handlePickupTypeChange}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="asap" id="pickup-asap" />
                    <Label htmlFor="pickup-asap">ASAP</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="scheduled" id="pickup-scheduled" />
                    <Label htmlFor="pickup-scheduled">Scheduled Time</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="warnings" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Warnings</span>
            </div>
            <div className="pl-7 space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="warning-oxygen"
                  checked={transportRecord?.warnings?.includes('oxygen')}
                  onCheckedChange={() => handleWarningToggle('oxygen')}
                />
                <label htmlFor="warning-oxygen">
                  Breathing problem: Requires oxygen
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="warning-movement"
                  checked={transportRecord?.warnings?.includes('movement')}
                  onCheckedChange={() => handleWarningToggle('movement')}
                />
                <label htmlFor="warning-movement">
                  Impaired movement
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="warning-isolation"
                  checked={transportRecord?.warnings?.includes('isolation')}
                  onCheckedChange={() => handleWarningToggle('isolation')}
                />
                <label htmlFor="warning-isolation">
                  Requires isolation
                </label>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="recurrence" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Repeat className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Recurrence</span>
            </div>
            <div className="pl-7 space-y-2">
              <RadioGroup
                value={transportRecord?.recurrence_type || 'none'}
                onValueChange={handleRecurrenceChange}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="r1" />
                  <Label htmlFor="r1">None</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="daily" id="r2" />
                  <Label htmlFor="r2">Daily</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekly" id="r3" />
                  <Label htmlFor="r3">Weekly</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="r4" />
                  <Label htmlFor="r4">Monthly</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}