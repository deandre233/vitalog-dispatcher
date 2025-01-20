import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Bot } from "lucide-react";

const mockCalls = [
  {
    caller_name: "John Smith",
    caller_phone: "(555) 123-4567",
    patient_name: "Alice Johnson",
    pickup_location: "Memorial Hospital",
    dropoff_location: "123 Home Street",
    service_type: "BLS",
    priority_level: "Scheduled",
  },
  {
    caller_name: "Mary Wilson",
    caller_phone: "(555) 987-6543",
    patient_name: "Bob Anderson",
    pickup_location: "456 Oak Avenue",
    dropoff_location: "City Medical Center",
    service_type: "ALS",
    priority_level: "Emergency",
  },
  {
    caller_name: "David Brown",
    caller_phone: "(555) 246-8135",
    patient_name: "Carol Martinez",
    pickup_location: "Sunset Nursing Home",
    dropoff_location: "General Hospital",
    service_type: "MICU",
    priority_level: "Critical",
  }
];

export function BookingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMockCall, setSelectedMockCall] = useState(0);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  
  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm<DispatchFormData>({
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

  const loadMockCall = () => {
    const mockCall = mockCalls[selectedMockCall];
    Object.entries(mockCall).forEach(([key, value]) => {
      setValue(key as keyof DispatchFormData, value);
    });
    setSelectedMockCall((prev) => (prev + 1) % mockCalls.length);
    toast.success("Mock call data loaded");
  };

  const onSubmit = async (data: DispatchFormData) => {
    setIsSubmitting(true);
    try {
      const transportRecord = {
        ...data,
        status: 'pending',
        dispatch_id: await generateDispatchId(),
      };

      const { error } = await supabase
        .from('transport_records')
        .insert(transportRecord);

      if (error) throw error;

      toast.success("Dispatch created successfully!");
    } catch (error) {
      console.error('Error creating dispatch:', error);
      toast.error("Failed to create dispatch");
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex justify-end gap-4 mb-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={loadMockCall}
          className="flex items-center gap-2"
        >
          Load Mock Call
        </Button>
      </div>

      {/* Caller Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Caller Information</h3>
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

      {/* Patient Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Patient Information</h3>
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

      {/* Location Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Location Information</h3>
        <div className="grid gap-6">
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

      {/* Service Details */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Service Details</h3>
        <div className="grid gap-6">
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

      {/* Requirements */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Requirements</h3>
        <div className="grid gap-6">
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

      {/* Notes */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Notes</h3>
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

      {/* AI Recommendations */}
      <Card className="p-6 bg-blue-50">
        <div className="flex items-center gap-2 mb-4">
          <Bot className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-blue-700">AI Recommendations</h3>
        </div>
        <div className="space-y-2 text-blue-600">
          <p className="text-sm">Based on the provided information, our AI suggests:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Recommended crew type will be shown after submission</li>
            <li>Estimated duration will be calculated based on trip type</li>
            <li>Priority score will be assigned based on service level</li>
          </ul>
        </div>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" type="button">Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Dispatch"}
        </Button>
      </div>
    </form>
  );
}
