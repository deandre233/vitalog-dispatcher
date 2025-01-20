import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DispatchFormData } from "@/types/dispatch";
import { supabase } from "@/integrations/supabase/client";

export function BookingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<DispatchFormData>({
    defaultValues: {
      service_type: 'BLS',
      priority_level: 'Scheduled',
      trip_type: 'One way',
      recurrence_type: 'Disabled',
      requires_bcs: false,
      requires_o2: false,
      requires_ventilator: false,
      requires_isolation: false,
      requires_bariatric: false,
      breathing_problem: false,
      confined_to_bed: false,
      behavioral_illness: false,
      unstable_impaired: false,
      physically_impaired: false,
      hearing_impaired: false,
      sight_impaired: false,
      speech_impaired: false,
      dnr_order: false,
      language_barrier: false,
      fresh_prepared: false,
    }
  });

  const onSubmit = async (data: DispatchFormData) => {
    setIsSubmitting(true);
    try {
      // Add required fields for the database
      const transportRecord = {
        ...data,
        status: 'pending', // Required field
        dispatch_id: await generateDispatchId(), // We'll create this function
      };

      const { error } = await supabase
        .from('transport_records')
        .insert(transportRecord); // Now passing a single object

      if (error) throw error;

      toast.success("Dispatch created successfully!");
    } catch (error) {
      console.error('Error creating dispatch:', error);
      toast.error("Failed to create dispatch");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to generate a dispatch ID
  const generateDispatchId = async (): Promise<string> => {
    const { data, error } = await supabase
      .rpc('generate_dispatch_id');
    
    if (error) {
      console.error('Error generating dispatch ID:', error);
      throw error;
    }
    
    return data as string;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Tabs defaultValue="caller" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="caller">Caller Info</TabsTrigger>
          <TabsTrigger value="patient">Patient</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="service">Service</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="caller" className="space-y-4">
          <Card className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="caller_name">Caller Name</Label>
                <Input
                  id="caller_name"
                  {...register("caller_name", { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="caller_phone">Caller Phone</Label>
                <Input
                  id="caller_phone"
                  {...register("caller_phone", { required: true })}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="patient" className="space-y-4">
          <Card className="p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Patient Search</Label>
                <Input placeholder="Search patients..." />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Patient Name</Label>
                  <Input {...register("patient_name")} />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <Card className="p-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Pickup Location</Label>
                <Input {...register("pickup_location", { required: true })} />
                <Input placeholder="Floor/Room" {...register("origin_floor_room")} />
                <Input placeholder="Address" {...register("origin_address")} />
              </div>

              <div className="space-y-2">
                <Label>Dropoff Location</Label>
                <Input {...register("dropoff_location", { required: true })} />
                <Input placeholder="Floor/Room" {...register("destination_floor_room")} />
                <Input placeholder="Address" {...register("destination_address")} />
                <Input placeholder="Reason" {...register("reason_for_destination")} />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="service" className="space-y-4">
          <Card className="p-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Service Type</Label>
                <Select onValueChange={(value) => register("service_type").onChange({ target: { value } })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WC">Wheelchair</SelectItem>
                    <SelectItem value="BLS">Basic Life Support</SelectItem>
                    <SelectItem value="ALS">Advanced Life Support</SelectItem>
                    <SelectItem value="MICU">Mobile ICU</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priority Level</Label>
                <Select onValueChange={(value) => register("priority_level").onChange({ target: { value } })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                    <SelectItem value="Lower acuity">Lower Acuity</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Trip Type</Label>
                <RadioGroup onValueChange={(value) => register("trip_type").onChange({ target: { value } })}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="One way" id="one-way" />
                    <Label htmlFor="one-way">One Way</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Wait-and-return" id="wait-return" />
                    <Label htmlFor="wait-return">Wait and Return</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Round trip" id="round-trip" />
                    <Label htmlFor="round-trip">Round Trip</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Transport Date & Time</Label>
                <Input type="datetime-local" {...register("transport_date", { required: true })} />
              </div>

              <div className="space-y-2">
                <Label>Recurrence</Label>
                <Select onValueChange={(value) => register("recurrence_type").onChange({ target: { value } })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select recurrence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Disabled">No Recurrence</SelectItem>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-4">
          <Card className="p-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Special Requirements</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox {...register("requires_bcs")} id="bcs" />
                    <Label htmlFor="bcs">BCS</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox {...register("requires_o2")} id="o2" />
                    <Label htmlFor="o2">O2</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox {...register("requires_ventilator")} id="ventilator" />
                    <Label htmlFor="ventilator">Ventilator</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox {...register("requires_isolation")} id="isolation" />
                    <Label htmlFor="isolation">Isolation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox {...register("requires_bariatric")} id="bariatric" />
                    <Label htmlFor="bariatric">Bariatric</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Patient Conditions</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox {...register("breathing_problem")} id="breathing" />
                    <Label htmlFor="breathing">Breathing Problem</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox {...register("confined_to_bed")} id="confined" />
                    <Label htmlFor="confined">Confined to Bed</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox {...register("behavioral_illness")} id="behavioral" />
                    <Label htmlFor="behavioral">Behavioral Illness</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox {...register("unstable_impaired")} id="unstable" />
                    <Label htmlFor="unstable">Unstable/Impaired</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox {...register("physically_impaired")} id="physical" />
                    <Label htmlFor="physical">Physically Impaired</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox {...register("hearing_impaired")} id="hearing" />
                    <Label htmlFor="hearing">Hearing Impaired</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox {...register("sight_impaired")} id="sight" />
                    <Label htmlFor="sight">Sight Impaired</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox {...register("speech_impaired")} id="speech" />
                    <Label htmlFor="speech">Speech Impaired</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox {...register("dnr_order")} id="dnr" />
                    <Label htmlFor="dnr">DNR Order</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox {...register("language_barrier")} id="language" />
                    <Label htmlFor="language">Language Barrier</Label>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card className="p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Billing Notes</Label>
                <Textarea {...register("billing_notes")} />
              </div>
              <div className="space-y-2">
                <Label>Dispatcher Notes</Label>
                <Textarea {...register("dispatcher_notes")} />
              </div>
              <div className="space-y-2">
                <Label>Prior Authorization Number</Label>
                <Input {...register("prior_auth_number")} />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" type="button">Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Dispatch"}
        </Button>
      </div>
    </form>
  );
}
