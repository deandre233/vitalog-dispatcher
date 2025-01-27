import { supabase } from "@/integrations/supabase/client";
import type { ShiftRecord, ShiftFilter } from "@/types/shift-records";

// Helper type to avoid deep recursion
type BasicShiftRecord = Omit<ShiftRecord, 'ai_analysis' | 'performance_metrics'> & {
  ai_analysis: Record<string, unknown>;
  performance_metrics: Record<string, unknown>;
};

export const shiftRecordsService = {
  getShiftRecords: async (filters?: ShiftFilter): Promise<BasicShiftRecord[]> => {
    let query = supabase
      .from('shift_records')
      .select('*')
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
    return (data || []) as BasicShiftRecord[];
  },

  updateShiftChecklist: async (
    shiftId: string,
    updates: Partial<ShiftRecord>
  ): Promise<BasicShiftRecord> => {
    const { data, error } = await supabase
      .from('shift_records')
      .update(updates)
      .eq('id', shiftId)
      .select()
      .single();

    if (error) throw error;
    return data as BasicShiftRecord;
  }
};