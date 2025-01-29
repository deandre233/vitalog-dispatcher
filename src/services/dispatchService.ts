import { supabase } from "@/integrations/supabase/client";
import { DispatchFormData, TransportRecord } from "@/types/dispatch";
import { toast } from "sonner";

/**
 * Service for handling dispatch-related operations
 */
export class DispatchService {
  /**
   * Creates a new dispatch record
   * @param data - The dispatch form data
   * @returns The created transport record
   */
  static async createDispatch(data: DispatchFormData): Promise<TransportRecord | null> {
    try {
      // Generate a unique dispatch ID using the Supabase function
      const { data: dispatchIdResult } = await supabase.rpc('generate_dispatch_id');
      const dispatch_id = dispatchIdResult || `DISP-${Date.now()}`;

      const { data: newDispatch, error } = await supabase
        .from('transport_records')
        .insert({
          dispatch_id,
          pickup_location: data.pickup_location,
          dropoff_location: data.dropoff_location,
          patient_id: data.patient_id,
          transport_type: data.transport_type,
          priority_level: data.priority_level,
          notes: data.notes,
          service_type: data.service_type,
          status: 'pending',
          caller_name: data.caller_name,
          caller_phone: data.caller_phone,
          trip_type: data.trip_type,
          origin_floor_room: data.origin_floor_room,
          origin_type: data.origin_type,
          origin_address: data.origin_address,
          destination_floor_room: data.destination_floor_room,
          destination_type: data.destination_type,
          destination_address: data.destination_address,
          scheduled_time: data.scheduled_time
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating dispatch:', error);
        toast("Failed to create dispatch. Please try again.", {
          description: error.message,
          duration: 5000,
        });
        return null;
      }

      toast("Dispatch created successfully", {
        duration: 3000,
      });

      return newDispatch;
    } catch (error) {
      console.error('Error in createDispatch:', error);
      toast("An unexpected error occurred. Please try again.", {
        description: error instanceof Error ? error.message : "Unknown error",
        duration: 5000,
      });
      return null;
    }
  }
}