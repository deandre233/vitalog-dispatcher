
export interface EmployeeDocument {
  id: string;
  employee_id: string;
  document_type: string;
  notes?: string;
  filename?: string;
  storage_path?: string;
  url?: string;
  date?: string;
  description?: string;
  type?: string;
  status?: string;
  ai_analysis?: any;
  created_at?: string;
  updated_at?: string;
}

export interface DocumentUploadParams {
  file: File;
  type: string;
  description: string;
  date: Date;
}
