import { SearchableItem } from './common';

export interface InsuranceRecord extends SearchableItem {
  id: string; // Make id required to match SearchableItem
  patient_id?: string;
  type: string;
  carrier_type: string;
  carrier_name: string;
  policy_number: string;
  phone?: string;
  claims_zip?: string;
  activation_date?: string;
  created_at?: string;
  updated_at?: string;
}