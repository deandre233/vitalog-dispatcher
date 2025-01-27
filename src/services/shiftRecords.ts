import { supabase } from "@/integrations/supabase/client";
import type { ShiftRecord, ShiftFilter } from "@/types/shift-records";
import { logger } from "@/utils/logger";

export const shiftRecordsService = {
  async getShiftRecords(filters?: ShiftFilter) {
    try {
      let query = supabase
        .from('shift_records')
        .select('*');

      if (filters) {
        if (filters.employeeId) {
          query = query.eq('employee_id', filters.employeeId);
        }
        if (filters.startDate) {
          query = query.gte('shift_date', filters.startDate);
        }
        if (filters.endDate) {
          query = query.lte('shift_date', filters.endDate);
        }
        if (filters.shiftType) {
          query = query.eq('shift_type', filters.shiftType);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []) as ShiftRecord[];
    } catch (error) {
      logger.error('Error fetching shift records:', error);
      throw error;
    }
  },

  async updateShiftChecklist(id: string, checklistCompleted: boolean): Promise<ShiftRecord> {
    try {
      const { data, error } = await supabase
        .from('shift_records')
        .update({ checklist_completed: checklistCompleted })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as ShiftRecord;
    } catch (error) {
      logger.error('Error updating shift checklist:', error);
      throw error;
    }
  }
};