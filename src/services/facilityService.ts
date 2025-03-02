
import { api } from "@/services/api";
import { Facility } from "@/types/transport-system";
import { handleError } from "@/utils/errorHandling";
import { logger } from "@/utils/logger";

export const facilityService = {
  async getFacilities(): Promise<Facility[]> {
    try {
      logger.info('Fetching all facilities');
      return await api.get<Facility>('facilities');
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async getFacilityById(id: string): Promise<Facility | null> {
    try {
      logger.info(`Fetching facility with ID: ${id}`);
      return await api.getById<Facility>('facilities', id);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async createFacility(facility: Partial<Facility>): Promise<Facility> {
    try {
      logger.info('Creating new facility', facility);
      return await api.create<Facility>('facilities', facility);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async updateFacility(id: string, facility: Partial<Facility>): Promise<Facility> {
    try {
      logger.info(`Updating facility with ID: ${id}`, facility);
      return await api.update<Facility>('facilities', id, facility);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async getFacilitiesByType(type: Facility['type']): Promise<Facility[]> {
    try {
      logger.info(`Fetching facilities with type: ${type}`);
      return await api.get<Facility>('facilities', { type });
    } catch (error) {
      handleError(error);
      throw error;
    }
  }
};
