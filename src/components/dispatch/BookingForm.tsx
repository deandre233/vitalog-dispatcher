
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { type DispatchFormData } from "@/types/dispatch";
import { supabase } from "@/integrations/supabase/client";
import { initGoogleMaps } from "@/services/googleMaps";

// Import our new components
import { CallerSection } from "./form/CallerSection";
import { PatientSection } from "./form/PatientSection";
import { LocationSection } from "./form/LocationSection";
import { RoutePreviewSection } from "./form/RoutePreviewSection";
import { ServiceDetailsSection } from "./form/ServiceDetailsSection";
import { ScheduleDetailsSection } from "./form/ScheduleDetailsSection";
import { RequirementsSection } from "./form/RequirementsSection";
import { NotesSection } from "./form/NotesSection";
import { AIRecommendationsSection } from "./form/AIRecommendationsSection";

// Constants
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

// Mock calls data
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

      // Create the initial transport record
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

      // Insert the initial transport record
      const { error: initialError } = await supabase
        .from('transport_records')
        .insert(transportRecord);

      if (initialError) throw initialError;

      // If this is a round trip, create the return trip with reversed locations
      if (data.trip_type === 'Round trip') {
        const returnTripId = await generateDispatchId();
        const returnTransportRecord = {
          ...transportRecord,
          dispatch_id: returnTripId,
          // Swap origin and destination details
          pickup_location: data.dropoff_location,
          dropoff_location: data.pickup_location,
          origin_floor_room: data.destination_floor_room,
          origin_type: data.destination_type,
          origin_address: data.destination_address,
          destination_floor_room: data.origin_floor_room,
          destination_type: data.origin_type,
          destination_address: data.origin_address,
          // Link the trips together
          return_trip_id: transportRecord.dispatch_id,
          dispatcher_notes: `Return trip for dispatch ${transportRecord.dispatch_id}\n${data.dispatcher_notes || ''}`
        };

        const { error: returnError } = await supabase
          .from('transport_records')
          .insert(returnTransportRecord);

        if (returnError) throw returnError;

        // Update the original transport record with the return trip ID
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

  const setupLocationInput = useCallback((input: HTMLInputElement | null, type: 'origin' | 'destination') => {
    if (!input) return;
    
    const loadGoogleMaps = async () => {
      try {
        await initGoogleMaps();
        // Removed the geocodeAddress since it doesn't exist in the googleMaps service
      } catch (error) {
        console.error('Error initializing Google Maps:', error);
      }
    };
    
    loadGoogleMaps();
  }, []);

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

      {/* Caller Section */}
      <CallerSection register={register} />

      {/* Patient Section */}
      <PatientSection 
        register={register} 
        watch={watch} 
        setValue={setValue} 
        foundPatient={foundPatient} 
        isSearchingPatient={isSearchingPatient} 
        handlePatientSearch={handlePatientSearch} 
        handleCreatePatient={handleCreatePatient} 
      />

      {/* Origin Location */}
      <LocationSection 
        type="origin" 
        register={register}
        watch={watch}
        handleSaveFacility={handleSaveFacility}
        inputRef={(input) => setupLocationInput(input, 'origin')}
      />

      {/* Map Visualization */}
      <RoutePreviewSection
        pickupLocation={watch('pickup_location')}
        dropoffLocation={watch('dropoff_location')}
      />

      {/* Destination Location */}
      <LocationSection 
        type="destination" 
        register={register}
        watch={watch}
        handleSaveFacility={handleSaveFacility}
        inputRef={(input) => setupLocationInput(input, 'destination')}
      />

      {/* Service Details */}
      <ServiceDetailsSection 
        register={register}
        watch={watch}
        setValue={setValue}
        serviceComplaints={serviceComplaints}
        facilities={facilities}
        affiliates={affiliates}
      />

      {/* Schedule Details */}
      <ScheduleDetailsSection 
        register={register}
        watch={watch}
        setValue={setValue}
      />

      {/* Requirements Section */}
      <RequirementsSection register={register} />

      {/* Notes Section */}
      <NotesSection register={register} />

      {/* AI Recommendations */}
      <AIRecommendationsSection />
      
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
