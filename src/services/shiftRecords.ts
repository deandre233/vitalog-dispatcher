
import { api } from "@/services/api";
import type { ShiftRecord } from "@/types/shift-records";
import { supabase } from "@/integrations/supabase/client";

export const shiftRecordsService = {
  getShiftRecords: async (filters: any = {}) => {
    try {
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
    } catch (error) {
      console.error("Error fetching shift records:", error);
      throw error;
    }
  },

  getShiftRecordById: async (id: string) => {
    return await api.getById<ShiftRecord>("shift_records", id);
  },

  updateShiftChecklist: async (shiftId: string, updates: Partial<ShiftRecord>) => {
    try {
      const { error } = await supabase
        .from("shift_records")
        .update(updates)
        .eq("id", shiftId);

      if (error) throw error;
    } catch (error) {
      console.error("Error updating shift checklist:", error);
      throw error;
    }
  },
  
  createShiftRecord: async (record: Partial<ShiftRecord>) => {
    return await api.create<ShiftRecord>("shift_records", record as Record<string, unknown>);
  }
};
