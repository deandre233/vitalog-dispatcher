
import { api } from "@/services/api";
import { Crew, Shift } from "@/types/transport-system";
import { handleError } from "@/utils/errorHandling";
import { logger } from "@/utils/logger";

export const crewService = {
  async getCrewMembers(): Promise<Crew[]> {
    try {
      logger.info('Fetching all crew members');
      return await api.get<Crew>('employees');
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async getCrewMemberById(id: string): Promise<Crew | null> {
    try {
      logger.info(`Fetching crew member with ID: ${id}`);
      return await api.getById<Crew>('employees', id);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async createCrewMember(crew: Partial<Crew>): Promise<Crew> {
    try {
      logger.info('Creating new crew member', crew);
      return await api.create<Crew>('employees', crew);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async updateCrewMember(id: string, crew: Partial<Crew>): Promise<Crew> {
    try {
      logger.info(`Updating crew member with ID: ${id}`, crew);
      return await api.update<Crew>('employees', id, crew);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async getShifts(): Promise<Shift[]> {
    try {
      logger.info('Fetching all shifts');
      return await api.get<Shift>('shift_records');
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async getShiftsByCrewMember(crewId: string): Promise<Shift[]> {
    try {
      logger.info(`Fetching shifts for crew member with ID: ${crewId}`);
      return await api.get<Shift>('shift_records', { crewId });
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async createShift(shift: Partial<Shift>): Promise<Shift> {
    try {
      logger.info('Creating new shift', shift);
      return await api.create<Shift>('shift_records', shift);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async updateShift(id: string, shift: Partial<Shift>): Promise<Shift> {
    try {
      logger.info(`Updating shift with ID: ${id}`, shift);
      return await api.update<Shift>('shift_records', id, shift);
    } catch (error) {
      handleError(error);
      throw error;
    }
  }
};
