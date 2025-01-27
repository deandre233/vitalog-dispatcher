import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/utils/logger";

export const generateHourlyLoad = (): { hour: number; load: "high" | "medium" | "low" }[] => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  return hours.map(hour => ({
    hour,
    load: getLoadLevel(hour) as "high" | "medium" | "low"
  }));
};

const getLoadLevel = (hour: number): "high" | "medium" | "low" => {
  // Example logic for determining load level based on hour
  if (hour >= 8 && hour < 12) return "high";
  if (hour >= 12 && hour < 18) return "medium";
  return "low";
};

export const fetchShiftRecords = async () => {
  const { data, error } = await supabase
    .from("shift_records")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    logger.error("Error fetching shift records:", error);
    throw error;
  }
  return data;
};
