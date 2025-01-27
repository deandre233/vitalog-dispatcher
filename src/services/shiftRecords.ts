import { ShiftRecord } from "@/types/shift-records";
import { supabase } from "@/integrations/supabase/client";

export const getShiftRecords = async (): Promise<ShiftRecord[]> => {
  const { data, error } = await supabase
    .from("shift_records")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const createShiftRecord = async (record: ShiftRecord): Promise<ShiftRecord> => {
  const { data, error } = await supabase
    .from("shift_records")
    .insert(record)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateShiftRecord = async (id: string, updates: Partial<ShiftRecord>): Promise<ShiftRecord> => {
  const { data, error } = await supabase
    .from("shift_records")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteShiftRecord = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("shift_records")
    .delete()
    .eq("id", id);

  if (error) throw error;
};
