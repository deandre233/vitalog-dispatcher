import { supabase } from "@/integrations/supabase/client";
import { DispatchFormData, TransportRecord } from "@/types/dispatch";
import { toast } from "@/hooks/use-toast";

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
      const { data: newDispatch, error } = await supabase
        .from('transport_records')
        .insert([{
          pickup_location: data.pickup_location,
          dropoff_location: data.dropoff_location,
          patient_id: data.patient_id,
          transport_type: data.transport_type,
          priority_level: data.priority_level,
          notes: data.notes,
          service_type: data.service_type,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating dispatch:', error);
        toast({
          title: "Error",
          description: "Failed to create dispatch. Please try again.",
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "Success",
        description: "Dispatch created successfully",
      });

      return newDispatch;
    } catch (error) {
      console.error('Error in createDispatch:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  }
}