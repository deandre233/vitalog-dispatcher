import { supabase } from "@/integrations/supabase/client";
import type { ShiftRecord } from "@/types/shift-records";

export const shiftRecordsService = {
  getShiftRecords: async (filters: any = {}) => {
    const { data, error } = await supabase
      .from("shift_records")
      .select(`
        *,
        employees (
          id,
          first_name,
          last_name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as ShiftRecord[];
  },

  updateShiftChecklist: async (shiftId: string, updates: Partial<ShiftRecord>) => {
    const { error } = await supabase
      .from("shift_records")
      .update(updates)
      .eq("id", shiftId);

    if (error) throw error;
  }
};