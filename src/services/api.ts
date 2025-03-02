import { supabase } from "@/integrations/supabase/client";
import { handleError } from "@/utils/errorHandling";
import { logger } from "@/utils/logger";
import { Database } from "@/integrations/supabase/types";

type TableNames = keyof Database['public']['Tables'];
type QueryParams = {
  select?: string;
  orderBy?: string;
  [key: string]: string | number | boolean | undefined;
};

export const api = {
  async get<T>(table: TableNames, query: QueryParams = {}): Promise<T[]> {
    try {
      logger.info(`Fetching data from ${table}`, query);
      let dbQuery = supabase.from(table).select(query.select || '*');

      if (query.orderBy) {
        dbQuery = dbQuery.order(query.orderBy, { ascending: false });
      }

      Object.entries(query).forEach(([key, value]) => {
        if (!['select', 'orderBy'].includes(key) && value !== undefined) {
          dbQuery = dbQuery.eq(key, value);
        }
      });

      const { data, error } = await dbQuery;

      if (error) throw error;
      return data as T[];
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async getById<T>(table: TableNames, id: string, query: QueryParams = {}): Promise<T | null> {
    try {
      logger.info(`Fetching ${table} by id: ${id}`, query);
      const { data, error } = await supabase
        .from(table)
        .select(query.select || '*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as T;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async create<T>(table: TableNames, data: Partial<T>): Promise<T> {
    try {
      logger.info(`Creating new ${table}`, data);
      const { data: created, error } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return created as T;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async update<T>(table: TableNames, id: string, data: Partial<T>): Promise<T> {
    try {
      logger.info(`Updating ${table} ${id}`, data);
      const { data: updated, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updated as T;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async delete(table: TableNames, id: string): Promise<void> {
    try {
      logger.info(`Deleting ${table} ${id}`);
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      handleError(error);
      throw error;
    }
  }
};
