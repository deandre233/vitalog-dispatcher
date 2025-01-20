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
import { Bot, MapPin, Search, UserCircle2 } from "lucide-react";

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
  const [isSearchingPatient, setIsSearchingPatient] = useState(false);
  
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
      patient_last_name: '',
      patient_first_name: '',
      patient_dob: '',
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-[1200px] mx-auto bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-medical-primary">Book a New Dispatch</h1>
        <Button 
          type="button" 
          variant="outline" 
          onClick={loadMockCall}
          className="flex items-center gap-2 bg-medical-accent text-medical-primary hover:bg-medical-highlight"
        >
          Load Mock Call
        </Button>
      </div>

      {/* New Patient/Customer Section */}
      <Card className="p-6 border-l-4 border-l-medical-secondary">
        <h3 className="text-lg font-semibold mb-4 text-medical-primary flex items-center gap-2">
          <UserCircle2 className="w-5 h-5" />
          Patient / Customer Information
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient_last_name">Last Name</Label>
              <div className="relative">
                <Input
                  id="patient_last_name"
                  {...register("patient_last_name")}
                  className="border-medical-secondary/30 focus:border-medical-secondary pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setIsSearchingPatient(true)}
                >
                  <Search className="w-4 h-4 text-medical-secondary" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="patient_first_name">First Name</Label>
              <Input
                id="patient_first_name"
                {...register("patient_first_name")}
                className="border-medical-secondary/30 focus:border-medical-secondary"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="patient_dob">Date of Birth</Label>
            <Input
              id="patient_dob"
              type="date"
              {...register("patient_dob")}
              className="border-medical-secondary/30 focus:border-medical-secondary"
            />
          </div>
          <p className="text-sm text-gray-500 italic">
            A new patient record will be created when you save this dispatch.
          </p>
          <Button
            type="button"
            variant="secondary"
            className="w-full bg-medical-highlight text-medical-primary hover:bg-medical-highlight/90"
          >
            Create Patient Record Now
          </Button>
        </div>
      </Card>

      {/* Caller Information */}
      <Card className="p-6 border-l-4 border-l-medical-secondary">
        <h3 className="text-lg font-semibold mb-4 text-medical-primary">Caller Information</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="caller_name">Caller Name</Label>
              <Input
                id="caller_name"
                className="border-medical-secondary/30 focus:border-medical-secondary"
                {...register("caller_name", { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="caller_phone">Phone</Label>
              <Input
                id="caller_phone"
                className="border-medical-secondary/30 focus:border-medical-secondary"
                placeholder="###-###-####"
                {...register("caller_phone", { required: true })}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Origin Location */}
      <Card className="p-6 border-l-4 border-l-medical-secondary">
        <h3 className="text-lg font-semibold mb-4 text-medical-primary flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Origin Location
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Location Name</Label>
            <Input 
              {...register("pickup_location")} 
              className="border-medical-secondary/30 focus:border-medical-secondary"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Floor/Room</Label>
              <Input 
                {...register("origin_floor_room")}
                className="border-medical-secondary/30 focus:border-medical-secondary"
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select onValueChange={(value) => register("origin_type").onChange({ target: { value } })}>
                <SelectTrigger className="border-medical-secondary/30">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hospital">Hospital</SelectItem>
                  <SelectItem value="nursing_home">Nursing Home</SelectItem>
                  <SelectItem value="residence">Residence</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input 
              {...register("origin_address")}
              className="border-medical-secondary/30 focus:border-medical-secondary"
            />
          </div>
        </div>
      </Card>

      {/* Destination Location */}
      <Card className="p-6 border-l-4 border-l-medical-secondary">
        <h3 className="text-lg font-semibold mb-4 text-medical-primary flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Destination Location
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Location Name</Label>
            <Input 
              {...register("dropoff_location")}
              className="border-medical-secondary/30 focus:border-medical-secondary"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Floor/Room</Label>
              <Input 
                {...register("destination_floor_room")}
                className="border-medical-secondary/30 focus:border-medical-secondary"
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select onValueChange={(value) => register("destination_type").onChange({ target: { value } })}>
                <SelectTrigger className="border-medical-secondary/30">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hospital">Hospital</SelectItem>
                  <SelectItem value="nursing_home">Nursing Home</SelectItem>
                  <SelectItem value="residence">Residence</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input 
              {...register("destination_address")}
              className="border-medical-secondary/30 focus:border-medical-secondary"
            />
          </div>
        </div>
      </Card>

      {/* Service Details */}
      <Card className="p-6 border-l-4 border-l-medical-secondary">
        <h3 className="text-lg font-semibold mb-4 text-medical-primary">Service Details</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Service Type</Label>
            <Select onValueChange={(value) => register("service_type").onChange({ target: { value } })}>
              <SelectTrigger className="border-medical-secondary/30">
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
            <RadioGroup 
              className="flex gap-4" 
              onValueChange={(value) => register("priority_level").onChange({ target: { value } })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Critical" id="critical" />
                <Label htmlFor="critical" className="text-red-500">Critical</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Emergency" id="emergency" />
                <Label htmlFor="emergency" className="text-orange-500">Emergency</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Lower acuity" id="lower-acuity" />
                <Label htmlFor="lower-acuity" className="text-yellow-600">Lower Acuity</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Scheduled" id="scheduled" />
                <Label htmlFor="scheduled" className="text-green-600">Scheduled</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Trip Type</Label>
            <RadioGroup 
              className="flex gap-4"
              onValueChange={(value) => register("trip_type").onChange({ target: { value } })}
            >
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
        </div>
      </Card>

      {/* Requirements Section */}
      <Card className="p-6 border-l-4 border-l-medical-secondary">
        <h3 className="text-lg font-semibold mb-4 text-medical-primary">Requirements & Warnings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-medical-primary">Special Requirements</h4>
            <div className="grid grid-cols-1 gap-2">
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

          <div className="space-y-4">
            <h4 className="font-medium text-medical-primary">Patient Conditions</h4>
            <div className="grid grid-cols-1 gap-2">
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
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-medical-primary">Additional Warnings</h4>
            <div className="grid grid-cols-1 gap-2">
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
            </div>
          </div>
        </div>
      </Card>

      {/* Notes Section */}
      <Card className="p-6 border-l-4 border-l-medical-secondary">
        <h3 className="text-lg font-semibold mb-4 text-medical-primary">Notes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Dispatcher Notes</Label>
            <Textarea 
              {...register("dispatcher_notes")}
              className="min-h-[100px] border-medical-secondary/30 focus:border-medical-secondary"
              placeholder="Notes for dispatch team..."
            />
          </div>
          <div className="space-y-2">
            <Label>Billing Notes</Label>
            <Textarea 
              {...register("billing_notes")}
              className="min-h-[100px] border-medical-secondary/30 focus:border-medical-secondary"
              placeholder="Notes for billing department..."
            />
          </div>
        </div>
      </Card>

      {/* AI Recommendations */}
      <Card className="p-6 bg-medical-highlight border-l-4 border-l-medical-secondary">
        <div className="flex items-center gap-2 mb-4">
          <Bot className="w-5 h-5 text-medical-secondary" />
          <h3 className="text-lg font-semibold text-medical-primary">AI Recommendations</h3>
        </div>
        <div className="space-y-2 text-medical-primary/80">
          <p className="text-sm">Based on the provided information, our AI suggests:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Recommended crew type will be shown after submission</li>
            <li>Estimated duration will be calculated based on trip type</li>
            <li>Priority score will be assigned based on service level</li>
          </ul>
        </div>
      </Card>

      <div className="flex justify-end space-x-4 pt-4">
        <Button 
          variant="outline" 
          type="button"
          className="bg-gray-50 hover:bg-gray-100"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-medical-secondary hover:bg-medical-secondary/90 text-white"
        >
          {isSubmitting ? "Creating..." : "Create Dispatch"}
        </Button>
      </div>
    </form>
  );
}
