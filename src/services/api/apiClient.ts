
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/utils/logger";

// Simple cache implementation
export const cache = new Map<string, { data: unknown; timestamp: number }>();
export const CACHE_TTL = 60000; // 1 minute cache TTL

export { supabase };
export { logger };
