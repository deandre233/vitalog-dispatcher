import { supabase } from "@/integrations/supabase/client";
import type { ShiftRecord, ShiftFilter } from "@/types/shift-records";
import { logger } from "@/utils/logger";

export const shiftRecordsService = {
  async getShiftRecords(filters?: ShiftFilter): Promise<ShiftRecord[]> {
    try {
      let query = supabase
        .from('shift_records')
        .select(`
          *,
          employees (
            first_name,
            last_name
          )
        `);

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
    } catch (error) {
      logger.error('Error fetching shift records:', error);
      throw error;
    }
  },

  async updateShiftChecklist(id: string, updates: { 
    primary_checklist_completed?: boolean; 
    secondary_checklist_completed?: boolean 
  }): Promise<ShiftRecord> {
    try {
      const { data, error } = await supabase
        .from('shift_records')
        .update(updates)
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