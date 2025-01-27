import { supabase } from "@/integrations/supabase/client";
import type { ShiftRecord, ShiftFilter } from "@/types/shift-records";

export const shiftRecordsService = {
  getShiftRecords: async (filters?: ShiftFilter): Promise<ShiftRecord[]> => {
    let query = supabase
      .from('shift_records')
      .select(`
        *,
        employees (
          first_name,
          last_name
        )
      `)
      .order('created_at', { ascending: false });

    if (filters?.startDate) {
      query = query.gte('shift_date', filters.startDate.toISOString());
    }

    if (filters?.endDate) {
      query = query.lte('shift_date', filters.endDate.toISOString());
    }

    if (filters?.vehicle) {
      query = query.eq('vehicle_id', filters.vehicle);
    }

    if (filters?.station) {
      query = query.eq('station', filters.station);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []) as ShiftRecord[];
  },

  updateShiftChecklist: async (
    shiftId: string,
    updates: Partial<Pick<ShiftRecord, 'primary_checklist_completed' | 'secondary_checklist_completed'>>
  ): Promise<ShiftRecord> => {
    const { data, error } = await supabase
      .from('shift_records')
      .update(updates)
      .eq('id', shiftId)
      .select()
      .single();

    if (error) throw error;
    return data as ShiftRecord;
  }
};