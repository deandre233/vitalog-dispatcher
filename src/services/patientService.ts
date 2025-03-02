
import { api } from "@/services/api";
import { Patient } from "@/types/transport-system";
import { handleError } from "@/utils/errorHandling";
import { logger } from "@/utils/logger";

export const patientService = {
  async getPatients(): Promise<Patient[]> {
    try {
      logger.info('Fetching all patients');
      return await api.get<Patient>('patients');
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async getPatientById(id: string): Promise<Patient | null> {
    try {
      logger.info(`Fetching patient with ID: ${id}`);
      return await api.getById<Patient>('patients', id);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async createPatient(patient: Partial<Patient>): Promise<Patient> {
    try {
      logger.info('Creating new patient', patient);
      return await api.create<Patient>('patients', patient);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async updatePatient(id: string, patient: Partial<Patient>): Promise<Patient> {
    try {
      logger.info(`Updating patient with ID: ${id}`, patient);
      return await api.update<Patient>('patients', id, patient);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async searchPatients(query: string): Promise<Patient[]> {
    try {
      logger.info(`Searching patients with query: ${query}`);
      // This will need to be implemented with a more sophisticated search
      // in the future, possibly using a Supabase function or RPC call
      const patients = await api.get<Patient>('patients');
      return patients.filter(
        patient => 
          patient.firstName.toLowerCase().includes(query.toLowerCase()) ||
          patient.lastName.toLowerCase().includes(query.toLowerCase()) ||
          patient.medicalRecordNumber?.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      handleError(error);
      throw error;
    }
  }
};
