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
import { type DispatchFormData } from "@/types/dispatch";
import { supabase } from "@/integrations/supabase/client";
import { Bot, MapPin, Search, UserCircle2, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const serviceComplaints = [
  "Transfer / Palliative care",
  "Medical alarm",
  "MIH / CP Visit",
  "Nausea",
  "No other appropriate choice",
  "Overdose / Poisoning / Ingestion",
  "Pandemic / Epidemic / Outbreak",
  "Pregnancy / Childbirth",
  "Psychiatric / Suicidal",
  "Seizure / Convulsions",
  "Sick person",
  "Stab / Gunshot wound / Penetration",
  "Standby",
  "Stroke / CVA",
  "Traffic / Transportation incident",
  "Heart problems / AICD",
  "Heat / Cold exposure",
  "Industrial accident / Entrapments",
  "Intercept",
  "Headache",
  "Traumatic injury",
  "Unconscious / Fainting",
  "Unknown problem / Person down",
  "Vomiting",
  "Well-person check"
];

const facilities = [
  "Memorial Hospital",
  "City Medical Center",
  "Sunset Nursing Home",
  "General Hospital",
  "Community Health Center"
];

const affiliates = [
  "Vitas Hospice",
  "Kindred Healthcare",
  "Amedisys",
  "LHC Group",
  "AccentCare"
];

const mockCalls = [
  {
    caller_name: "John Smith",
    caller_phone: "555-0123",
    patient_first_name: "Jane",
    patient_last_name: "Doe",
    patient_dob: "1960-05-15",
    pickup_location: "Memorial Hospital",
    dropoff_location: "Sunset Nursing Home",
    service_type: "BLS",
    priority_level: "Scheduled",
    trip_type: "One way",
    origin_floor_room: "Room 302",
    origin_type: "hospital",
    origin_address: "123 Main St",
    origin_city: "Springfield",
    origin_state: "IL",
    origin_zip: "62701",
    origin_county: "Sangamon",
    origin_phone: "555-0100",
    destination_floor_room: "Room 205",
    destination_type: "nursing_home",
    destination_address: "456 Oak Ave",
    destination_city: "Springfield",
    destination_state: "IL",
    destination_zip: "62702",
    destination_county: "Sangamon",
    destination_phone: "555-0200",
    service_complaint: "Transfer / Palliative care",
    requires_o2: true,
    confined_to_bed: true
  },
  {
    caller_name: "Mary Johnson",
    caller_phone: "555-0456",
    patient_first_name: "Robert",
    patient_last_name: "Williams",
    patient_dob: "1955-08-22",
    pickup_location: "City Medical Center",
    dropoff_location: "General Hospital",
    service_type: "ALS",
    priority_level: "Emergency",
    trip_type: "One way",
    origin_floor_room: "ER Bay 4",
    origin_type: "hospital",
    origin_address: "789 Hospital Drive",
    origin_city: "Springfield",
    origin_state: "IL",
    origin_zip: "62701",
    origin_county: "Sangamon",
    origin_phone: "555-0300",
    destination_floor_room: "ICU Wing",
    destination_type: "hospital",
    destination_address: "321 Medical Parkway",
    destination_city: "Springfield",
    destination_state: "IL",
    destination_zip: "62703",
    destination_county: "Sangamon",
    destination_phone: "555-0400",
    service_complaint: "Heart problems / AICD",
    requires_ekg: true,
    requires_ventilator: true
  }
];

export function BookingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMockCall, setSelectedMockCall] = useState(0);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isSearchingPatient, setIsSearchingPatient] = useState(false);
  const [foundPatient, setFoundPatient] = useState<{ id: string; first_name: string; last_name: string } | null>(null);
  
  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm<DispatchFormData>({
    defaultValues: {
      service_type: 'BLS',
      priority_level: 'Scheduled',
      trip_type: 'One way',
      recurrence_type: 'Disabled',
      activation_type: 'now',
      pickup_type: 'asap',
      dropoff_type: 'asap',
      requires_ekg: false,
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
      precise_pickup: false,
      patient_last_name: '',
      patient_first_name: '',
      patient_dob: '',
      origin_city: '',
      origin_state: '',
      origin_zip: '',
      origin_county: '',
      origin_phone: '',
      destination_city: '',
      destination_state: '',
      destination_zip: '',
      destination_county: '',
      destination_phone: '',
      is_billable: false,
      requires_pcs: false,
      bill_to_insurance: false,
      bill_to_facility: false,
      billing_facility: '',
      bill_to_affiliate: false,
      billing_affiliate: '',
      bill_to_patient: false,
      cash_upfront: false,
      price_quote: '',
      service_complaint: '',
      patient_id: '',
      dispatcher_notes: '',
      billing_notes: ''
    }
  });

  const billToFacility = watch('bill_to_facility');
  const billToAffiliate = watch('bill_to_affiliate');

  const loadMockCall = () => {
    const mockCall = mockCalls[selectedMockCall];
    Object.entries(mockCall).forEach(([key, value]) => {
      setValue(key as keyof DispatchFormData, value);
    });
    setSelectedMockCall((prev) => (prev + 1) % mockCalls.length);
    toast.success("Mock call data loaded");
  };

  const handleCreatePatient = async () => {
    try {
      const patientData = {
        first_name: watch('patient_first_name'),
        last_name: watch('patient_last_name'),
        dob: watch('patient_dob'),
      };

      const { data: newPatient, error } = await supabase
        .from('patients')
        .insert(patientData)
        .select()
        .single();

      if (error) throw error;

      setValue('patient_id', newPatient.id);
      setFoundPatient({
        id: newPatient.id,
        first_name: newPatient.first_name,
        last_name: newPatient.last_name
      });

      toast.success(`Patient record created for ${newPatient.first_name} ${newPatient.last_name}`);
      
      return newPatient;
    } catch (error) {
      console.error('Error creating patient:', error);
      toast.error("Failed to create patient record");
      throw error;
    }
  };

  const handlePatientSearch = async () => {
    setIsSearchingPatient(true);
    const lastName = watch('patient_last_name');
    const firstName = watch('patient_first_name');
    
    if (!lastName && !firstName) {
      toast.error("Please enter at least a first or last name to search");
      setIsSearchingPatient(false);
      return;
    }

    try {
      let query = supabase
        .from('patients')
        .select('*');
      
      if (lastName) {
        query = query.ilike('last_name', `${lastName}%`);
      }
      if (firstName) {
        query = query.ilike('first_name', `${firstName}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data && data.length > 0) {
        const patient = data[0]; // Using first match for now
        setValue('patient_last_name', patient.last_name);
        setValue('patient_first_name', patient.first_name);
        setValue('patient_dob', patient.dob);
        setValue('patient_id', patient.id);
        
        setFoundPatient({
          id: patient.id,
          first_name: patient.first_name,
          last_name: patient.last_name
        });
        
        toast.success(`Found patient record for ${patient.first_name} ${patient.last_name}`);
      } else {
        setFoundPatient(null);
        toast.error("No matching patient records found");
      }
    } catch (error) {
      console.error('Error searching patient:', error);
      toast.error("Failed to search for patient records");
    } finally {
      setIsSearchingPatient(false);
    }
  };

  const onSubmit = async (data: DispatchFormData) => {
    setIsSubmitting(true);
    try {
      let patientId = data.patient_id;
      
      if (!patientId) {
        const newPatient = await handleCreatePatient();
        patientId = newPatient.id;
      }

      const transportRecord = {
        patient_id: patientId,
        status: 'pending',
        dispatch_id: await generateDispatchId(),
        caller_name: data.caller_name,
        caller_phone: data.caller_phone,
        pickup_location: data.pickup_location,
        dropoff_location: data.dropoff_location,
        service_type: data.service_type,
        priority_level: data.priority_level,
        trip_type: data.trip_type,
        origin_floor_room: data.origin_floor_room,
        origin_type: data.origin_type,
        origin_address: data.origin_address,
        destination_floor_room: data.destination_floor_room,
        destination_type: data.destination_type,
        destination_address: data.destination_address,
        scheduled_time: data.activation_type === 'later' ? data.activation_datetime : null,
        pickup_type: data.pickup_type,
        dropoff_type: data.dropoff_type,
        requires_ekg: data.requires_ekg,
        requires_o2: data.requires_o2,
        requires_ventilator: data.requires_ventilator,
        requires_isolation: data.requires_isolation,
        requires_bariatric: data.requires_bariatric,
        breathing_problem: data.breathing_problem,
        confined_to_bed: data.confined_to_bed,
        behavioral_illness: data.behavioral_illness,
        unstable_impaired: data.unstable_impaired,
        physically_impaired: data.physically_impaired,
        hearing_impaired: data.hearing_impaired,
        sight_impaired: data.sight_impaired,
        speech_impaired: data.speech_impaired,
        dnr_order: data.dnr_order,
        language_barrier: data.language_barrier,
        fresh_prepared: data.fresh_prepared,
        dispatcher_notes: data.dispatcher_notes,
        billing_notes: data.billing_notes
      };

      const { error: initialError } = await supabase
        .from('transport_records')
        .insert(transportRecord);

      if (initialError) throw initialError;

      if (data.trip_type === 'Round trip') {
        const returnTripId = await generateDispatchId();
        const returnTransportRecord = {
          ...transportRecord,
          dispatch_id: returnTripId,
          pickup_location: data.dropoff_location,
          dropoff_location: data.pickup_location,
          origin_floor_room: data.destination_floor_room,
          origin_type: data.destination_type,
          origin_address: data.destination_address,
          destination_floor_room: data.origin_floor_room,
          destination_type: data.origin_type,
          destination_address: data.origin_address,
          return_trip_id: transportRecord.dispatch_id,
          dispatcher_notes: `Return trip for dispatch ${transportRecord.dispatch_id}\n${data.dispatcher_notes || ''}`
        };

        const { error: returnError } = await supabase
          .from('transport_records')
          .insert(returnTransportRecord);

        if (returnError) throw returnError;

        const { error: updateError } = await supabase
          .from('transport_records')
          .update({ return_trip_id: returnTripId })
          .eq('dispatch_id', transportRecord.dispatch_id);

        if (updateError) throw updateError;

        toast.success("Round trip dispatches created successfully!");
      } else {
        toast.success("Dispatch created successfully!");
      }

      reset();
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

  const handleSaveFacility = async (type: 'origin' | 'destination') => {
    try {
      const facilityData = {
        name: type === 'origin' ? watch('pickup_location') : watch('dropoff_location'),
        floor_room: type === 'origin' ? watch('origin_floor_room') : watch('destination_floor_room'),
        location_type: type === 'origin' ? watch('origin_type') : watch('destination_type'),
        address: type === 'origin' ? watch('origin_address') : watch('destination_address'),
        city: type === 'origin' ? watch('origin_city') : watch('destination_city'),
        state: type === 'origin' ? watch('origin_state') : watch('destination_state'),
        zip: type === 'origin' ? watch('origin_zip') : watch('destination_zip'),
        county: type === 'origin' ? watch('origin_county') : watch('destination_county'),
        telephone: type === 'origin' ? watch('origin_phone') : watch('destination_phone'),
      };

      const { error } = await supabase
        .from('dispatch_locations')
        .insert(facilityData);

      if (error) throw error;

      toast.success(`${type === 'origin' ? 'Origin' : 'Destination'} location saved successfully!`);
    } catch (error) {
      console.error('Error saving facility:', error);
      toast.error(`Failed to save ${type === 'origin' ? 'origin' : 'destination'} location`);
    }
  };

  const renderTimeSlot = () => {
    const currentHour = new Date().getHours();
    const slots = Array.from({ length: 24 }).map((_, i) => ({
      hour: i,
      isCurrentHour: i === currentHour,
      isPeak: i >= 8 && i <= 18, // Peak hours between 8 AM and 6 PM
    }));

    return (
      <div className="mt-6 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Time Availability</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-medical-secondary/20 rounded-full"></div>
              <span className="text-xs text-gray-500">Off-Peak</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-medical-secondary rounded-full"></div>
              <span className="text-xs text-gray-500">Peak Hours</span>
            </div>
          </div>
        </div>
        <div className="h-12 bg-gray-50 rounded-lg flex overflow-hidden">
          {slots.map(({ hour, isCurrentHour, isPeak }) => (
            <div
              key={hour}
              className={`flex-1 flex flex-col justify-between relative ${
                isPeak ? 'bg-medical-secondary/20' : 'bg-medical-secondary/10'
              } ${isCurrentHour ? 'border-b-2 border-medical-secondary' : ''}`}
              title={`${hour}:00`}
            >
              {hour % 3 === 0 && (
                <>
                  <div className="text-[10px] text-gray-500 text-center absolute top-1 w-full">
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                  <div className="w-px h-2 bg-gray-300 absolute bottom-0 left-1/2"></div>
                </>
              )}
              {isCurrentHour && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-1 h-1 bg-medical-secondary rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-medical-primary bg-gradient-to-r from-medical-primary to-medical-secondary bg-clip-text text-transparent">
          Book a New Dispatch
        </h1>
        <Button 
          type="button" 
          variant="outline" 
          onClick={loadMockCall}
          className="flex items-center gap-2 bg-gradient-to-r from-medical-accent to-medical-highlight hover:from-medical-highlight hover:to-medical-accent text-medical-primary transition-all duration-300"
        >
          Load Mock Call
        </Button>
      </div>

      {/* Caller Information */}
      <Card className="p-6 border-l-4 border-l-[#9b87f5] bg-gradient-to-br from-white to-[#F1F0FB] shadow-lg hover:shadow-xl transition-all duration-300">
        <h3 className="text-lg font-semibold mb-4 text-[#7E69AB] flex items-center gap-2">
          <UserCircle2 className="w-5 h-5" />
          Caller Information
        </h3>
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

      {/* Patient/Customer Section */}
      <Card className="p-6 border-l-4 border-l-[#D946EF] bg-gradient-to-br from-white to-[#FFDEE2] shadow-lg hover:shadow-xl transition-all duration-300">
        <h3 className="text-lg font-semibold mb-4 text-[#D946EF] flex items-center gap-2">
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
                  className="border-medical-secondary/30 focus:border-medical-secondary"
                />
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
          <div className="flex justify-between items-center">
            <div className="flex-1">
              {foundPatient && (
                <Link 
                  to={`/patient/${encodeURIComponent(`${foundPatient.last_name}, ${foundPatient.first_name} (PAT-${foundPatient.id.slice(0, 5)})`)}` }
                  className="text-medical-secondary hover:text-medical-secondary/80 font-medium flex items-center gap-2"
                >
                  <UserCircle2 className="w-4 h-4" />
                  View {foundPatient.first_name} {foundPatient.last_name}'s Profile
                </Link>
              )}
            </div>
            <Button
              type="button"
              onClick={handlePatientSearch}
              disabled={isSearchingPatient}
              className="flex items-center gap-2 bg-medical-secondary text-white hover:bg-medical-secondary/90"
            >
              <Search className="w-4 h-4" />
              {isSearchingPatient ? "Searching..." : "Search Patient"}
            </Button>
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
          {!foundPatient && (
            <>
              <p className="text-sm text-gray-500 italic">
                A new patient record will be created when you save this dispatch.
              </p>
              <Button
                type="button"
                variant="secondary"
                onClick={handleCreatePatient}
                className="w-full bg-medical-highlight text-medical-primary hover:bg-medical-highlight/90"
              >
                Create Patient Record Now
              </Button>
            </>
          )}
        </div>
      </Card>

      {/* Origin Location */}
      <Card className="p-6 border-l-4 border-l-[#0EA5E9] bg-gradient-to-br from-white to-[#D3E4FD] shadow-lg hover:shadow-xl transition-all duration-300">
        <h3 className="text-lg font-semibold mb-4 text-[#0EA5E9] flex items-center gap-2">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>City</Label>
              <Input 
                {...register("origin_city")}
                className="border-medical-secondary/30 focus:border-medical-secondary"
              />
            </div>
            <div className="space-y-2">
              <Label>State</Label>
              <Input 
                {...register("origin_state")}
                className="border-medical-secondary/30 focus:border-medical-secondary"
              />
            </div>
            <div className="space-y-2">
              <Label>ZIP</Label>
              <Input 
                {...register("origin_zip")}
                className="border-medical-secondary/30 focus:border-medical-secondary"
              />
            </div>
            <div className="space-y-2">
              <Label>County</Label>
              <Input 
                {...register("origin_county")}
                className="border-medical-secondary/30 focus:border-medical-secondary"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input 
              {...register("origin_phone")}
              className="border-medical-secondary/30 focus:border-medical-secondary"
              placeholder="(XXX) XXX-XXXX"
            />
          </div>
          <Button 
            type="button"
            variant="outline"
            onClick={() => handleSaveFacility('origin')}
            className="w-full mt-4 bg-medical-highlight text-medical-primary hover:bg-medical-highlight/90"
          >
            Save as New Facility
          </Button>
        </div>
      </Card>

      {/* Destination Location */}
      <Card className="p-6 border-l-4 border-l-[#F97316] bg-gradient-to-br from-white to-[#FEC6A1] shadow-lg hover:shadow-xl transition-all duration-300">
        <h3 className="text-lg font-semibold mb-4 text-[#F97316] flex items-center gap-2">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>City</Label>
              <Input 
                {...register("destination_city")}
                className="border-medical-secondary/30 focus:border-medical-secondary"
              />
            </div>
            <div className="space-y-2">
              <Label>State</Label>
              <Input 
                {...register("destination_state")}
                className="border-medical-secondary/30 focus:border-medical-secondary"
              />
            </div>
            <div className="space-y-2">
              <Label>ZIP</Label>
              <Input 
                {...register("destination_zip")}
                className="border-medical-secondary/30 focus:border-medical-secondary"
              />
            </div>
            <div className="space-y-2">
              <Label>County</Label>
              <Input 
                {...register("destination_county")}
                className="border-medical-secondary/30 focus:border-medical-secondary"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input 
              {...register("destination_phone")}
              className="border-medical-secondary/30 focus:border-medical-secondary"
              placeholder="(XXX) XXX-XXXX"
            />
          </div>
          <Button 
            type="button"
            variant="outline"
            onClick={() => handleSaveFacility('destination')}
            className="w-full mt-4 bg-medical-highlight text-medical-primary hover:bg-medical-highlight/90"
          >
            Save as New Facility
          </Button>
        </div>
      </Card>

      {/* Service Details */}
      <Card className="p-6 border-l-4 border-l-[#8B5CF6] bg-gradient-to-br from-white to-[#E5DEFF] shadow-lg hover:shadow-xl transition-all duration-300">
        <h3 className="text-lg font-semibold mb-4 text-[#8B5CF6]">Service Details</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <Label>Service Complaint</Label>
                <Select onValueChange={(value) => register("service_complaint").onChange({ target: { value } })}>
                  <SelectTrigger className="border-medical-secondary/30">
                    <SelectValue placeholder="Select complaint" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceComplaints.map((complaint) => (
                      <SelectItem key={complaint} value={complaint}>
                        {complaint}
                      </SelectItem>
                    ))}
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
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox {...register("is_billable")} id="billable" />
                <Label htmlFor="billable">Service is Billable</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox {...register("requires_pcs")} id="pcs" />
                <Label htmlFor="pcs">PCS Documentation Required</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox {...register("bill_to_insurance")} id="bill-insurance" />
                <Label htmlFor="bill-insurance">Bill to Insurance</Label>
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <Checkbox {...register("bill_to_facility")} id="bill-facility" />
                  <Label htmlFor="bill-facility">Bill to Facility</Label>
                </div>
                <Select 
                  onValueChange={(value) => setValue('billing_facility', value)}
                  disabled={!billToFacility}
                >
                  <SelectTrigger className="w-[200px] border-medical-secondary/30">
                    <SelectValue placeholder="Select facility" />
                  </SelectTrigger>
                  <SelectContent>
                    {facilities.map((facility) => (
                      <SelectItem key={facility} value={facility}>
                        {facility}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <Checkbox {...register("bill_to_affiliate")} id="bill-affiliate" />
                  <Label htmlFor="bill-affiliate">Bill to Affiliate</Label>
                </div>
                <Select 
                  onValueChange={(value) => setValue('billing_affiliate', value)}
                  disabled={!billToAffiliate}
                >
                  <SelectTrigger className="w-[200px] border-medical-secondary/30">
                    <SelectValue placeholder="Select affiliate" />
                  </SelectTrigger>
                  <SelectContent>
                    {affiliates.map((affiliate) => (
                      <SelectItem key={affiliate} value={affiliate}>
                        {affiliate}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox {...register("bill_to_patient")} id="bill-patient" />
                <Label htmlFor="bill-patient">Bill to Patient</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox {...register("cash_upfront")} id="cash-upfront" />
                <Label htmlFor="cash-upfront">Cash Payment Required Upfront</Label>
              </div>

              <div className="space-y-2 mt-4">
                <Label>Price Quote</Label>
                <Input 
                  {...register("price_quote")}
                  className="border-medical-secondary/30 focus:border-medical-secondary"
                  placeholder="Enter price quote"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Scheduling Panel */}
      <Card className="p-6 border-l-4 border-l-[#0FA0CE] bg-gradient-to-br from-white to-[#D3E4FD] shadow-lg hover:shadow-xl transition-all duration-300">
        <h3 className="text-lg font-semibold mb-4 text-[#0FA0CE] flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Schedule Details
        </h3>
        <div className="space-y-6">
          {/* Activation Time */}
          <div className="space-y-2">
            <Label>Activate</Label>
            <div className="flex items-center gap-4">
              <RadioGroup
                value={watch('activation_type') || 'now'}
                onValueChange={(value: "now" | "later") => setValue('activation_type', value)}
                className="flex items-center space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="now" id="activate-now" />
                  <Label htmlFor="activate-now">Now</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="later" id="activate-later" />
                  <Label htmlFor="activate-later">Later</Label>
                </div>
              </RadioGroup>
              
              <Input
                type="datetime-local"
                className="flex-1 border-medical-secondary/30 focus:border-medical-secondary"
                disabled={watch('activation_type') !== 'later'}
                {...register('activation_datetime')}
              />
            </div>
          </div>

          {/* Pickup Time */}
          <div className="space-y-2">
            <Label>Pickup</Label>
            <div className="flex items-center gap-4">
              <RadioGroup
                value={watch('pickup_type') || 'asap'}
                onValueChange={(value: "asap" | "scheduled") => setValue('pickup_type', value)}
                className="flex items-center space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="asap" id="pickup-asap" />
                  <Label htmlFor="pickup-asap">ASAP</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="scheduled" id="pickup-scheduled" />
                  <Label htmlFor="pickup-scheduled">At</Label>
                </div>
              </RadioGroup>
              
              <div className="flex items-center gap-2 flex-1">
                <Input
                  type="time"
                  className="flex-1 border-medical-secondary/30 focus:border-medical-secondary"
                  disabled={watch('pickup_type') !== 'scheduled'}
                  {...register('pickup_time')}
                />
                <Checkbox
                  id="precise-pickup"
                  className="border-medical-secondary/30"
                  {...register('precise_pickup')}
                />
                <Label htmlFor="precise-pickup" className="text-sm">Precise</Label>
              </div>
            </div>
          </div>

          {/* Dropoff Time */}
          <div className="space-y-2">
            <Label>Dropoff</Label>
            <div className="flex items-center gap-4">
              <RadioGroup
                value={watch('dropoff_type') || 'asap'}
                onValueChange={(value: "asap" | "scheduled") => setValue('dropoff_type', value)}
                className="flex items-center space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="asap" id="dropoff-asap" />
                  <Label htmlFor="dropoff-asap">ASAP</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="scheduled" id="dropoff-scheduled" />
                  <Label htmlFor="dropoff-scheduled">At</Label>
                </div>
              </RadioGroup>
              
              <Input
                type="time"
                className="flex-1 border-medical-secondary/30 focus:border-medical-secondary"
                disabled={watch('dropoff_type') !== 'scheduled'}
                {...register('dropoff_time')}
              />
            </div>
          </div>

          {/* Trip Type */}
          <div className="space-y-2">
            <Label>Trip Type</Label>
            <RadioGroup
              value={watch('trip_type') || 'One way'}
              onValueChange={(value: "One way" | "Wait-and-return" | "Round trip") => setValue('trip_type', value)}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="One way" id="one-way" />
                <Label htmlFor="one-way">One Way</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Wait-and-return" id="wait-return" />
                <Label htmlFor="wait-return">Wait & Return</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Round trip" id="round-trip" />
                <Label htmlFor="round-trip">Round Trip</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Improved Time Slot Visualization */}
          {renderTimeSlot()}
        </div>
      </Card>

      {/* Requirements Section */}
      <Card className="p-6 border-l-4 border-l-[#33C3F0] bg-gradient-to-br from-white to-[#F2FCE2] shadow-lg hover:shadow-xl transition-all duration-300">
        <h3 className="text-lg font-semibold mb-4 text-[#33C3F0]">Requirements & Warnings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-medical-primary">Special Requirements</h4>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox {...register("requires_ekg")} id="ekg" />
                <Label htmlFor="ekg">EKG</Label>
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
      <Card className="p-6 border-l-4 border-l-[#6E59A5] bg-gradient-to-br from-white to-[#F1F0FB] shadow-lg hover:shadow-xl transition-all duration-300">
        <h3 className="text-lg font-semibold mb-4 text-[#6E59A5]">Notes</h3>
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
      <Card className="p-6 bg-gradient-to-br from-[#F1F0FB] to-[#E5DEFF] border-l-4 border-l-[#9b87f5] shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-2 mb-4">
          <Bot className="w-5 h-5 text-[#9b87f5]" />
          <h3 className="text-lg font-semibold text-[#7E69AB]">AI Recommendations</h3>
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
          className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-300"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] hover:from-[#7E69AB] hover:to-[#9b87f5] text-white transition-all duration-300"
        >
          {isSubmitting ? "Creating..." : "Create Dispatch"}
        </Button>
      </div>
    </form>
  );
}
