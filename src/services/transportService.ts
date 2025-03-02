
import { api } from "@/services/api";
import { Transport } from "@/types/transport-system";
import { handleError } from "@/utils/errorHandling";
import { logger } from "@/utils/logger";

export const transportService = {
  async getTransports(): Promise<Transport[]> {
    try {
      logger.info('Fetching all transports');
      return await api.get<Transport>('transport_records');
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async getTransportById(id: string): Promise<Transport | null> {
    try {
      logger.info(`Fetching transport with ID: ${id}`);
      return await api.getById<Transport>('transport_records', id);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async createTransport(transport: Partial<Transport>): Promise<Transport> {
    try {
      logger.info('Creating new transport', transport);
      return await api.create<Transport>('transport_records', transport);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async updateTransport(id: string, transport: Partial<Transport>): Promise<Transport> {
    try {
      logger.info(`Updating transport with ID: ${id}`, transport);
      return await api.update<Transport>('transport_records', id, transport);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async getTransportsByPatient(patientId: string): Promise<Transport[]> {
    try {
      logger.info(`Fetching transports for patient with ID: ${patientId}`);
      return await api.get<Transport>('transport_records', { patientId });
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async getTransportsByStatus(status: Transport['status']): Promise<Transport[]> {
    try {
      logger.info(`Fetching transports with status: ${status}`);
      return await api.get<Transport>('transport_records', { status });
    } catch (error) {
      handleError(error);
      throw error;
    }
  }
};
