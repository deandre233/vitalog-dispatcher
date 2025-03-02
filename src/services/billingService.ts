
import { api } from "@/services/api";
import { Billing } from "@/types/transport-system";
import { handleError } from "@/utils/errorHandling";
import { logger } from "@/utils/logger";

export const billingService = {
  async getBillingRecords(): Promise<Billing[]> {
    try {
      logger.info('Fetching all billing records');
      return await api.get<Billing>('billing_records');
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async getBillingRecordById(id: string): Promise<Billing | null> {
    try {
      logger.info(`Fetching billing record with ID: ${id}`);
      return await api.getById<Billing>('billing_records', id);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async createBillingRecord(billing: Partial<Billing>): Promise<Billing> {
    try {
      logger.info('Creating new billing record', billing);
      return await api.create<Billing>('billing_records', billing);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async updateBillingRecord(id: string, billing: Partial<Billing>): Promise<Billing> {
    try {
      logger.info(`Updating billing record with ID: ${id}`, billing);
      return await api.update<Billing>('billing_records', id, billing);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async getBillingRecordsByStatus(status: Billing['status']): Promise<Billing[]> {
    try {
      logger.info(`Fetching billing records with status: ${status}`);
      return await api.get<Billing>('billing_records', { status });
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async getBillingRecordsByTransport(transportId: string): Promise<Billing[]> {
    try {
      logger.info(`Fetching billing records for transport with ID: ${transportId}`);
      return await api.get<Billing>('billing_records', { transportId });
    } catch (error) {
      handleError(error);
      throw error;
    }
  }
};
