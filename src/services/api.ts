
import { TableName, QueryParams } from './api/types';
import * as crudOps from './api/crudOperations';
import * as advancedOps from './api/advancedQueries';
import { invalidateCache } from './api/cache-utils';

export type { TableName, QueryParams };

export const api = {
  /**
   * Fetch records from a table with optional filtering
   */
  get: crudOps.get,

  /**
   * Fetch a single record by ID
   */
  getById: crudOps.getById,

  /**
   * Create a new record
   */
  create: crudOps.create,

  /**
   * Update an existing record
   */
  update: crudOps.update,

  /**
   * Delete a record
   */
  delete: crudOps.deleteRecord,
  
  /**
   * Execute a raw SQL query (use with caution)
   */
  executeRawQuery: advancedOps.executeRawQuery,
  
  /**
   * Count records in a table with optional filtering
   */
  count: advancedOps.count,
  
  /**
   * Clear cache for a specific table or all tables
   */
  invalidateCache,

  /**
   * Update employee location
   */
  updateEmployeeLocation: crudOps.updateEmployeeLocation,

  /**
   * Get employee location history
   */
  getEmployeeLocationHistory: crudOps.getEmployeeLocationHistory
};
