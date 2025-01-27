export interface MedicalHistory {
  id: string;
  patient_id: string;
  date: string;
  description: string;
  type: string;
  notes?: string;
  created_at: string;
}

export interface MedicalRecord {
  id: string;
  patient_id: string;
  record_type: string;
  record_date: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  provider?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface Medication {
  id: string;
  generic_name: string;
  brand_names?: string[];
  medication_class?: string;
  common_dosages?: string[];
  frequencies?: string[];
  indications?: string[];
  contraindications?: string[];
  side_effects?: string[];
  interactions?: string[];
  created_at: string;
  updated_at: string;
}