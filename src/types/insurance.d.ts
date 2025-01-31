export interface InsuranceRecord {
  id: string;
  patient_id: string;
  type: string;
  carrier_type: string;
  carrier_name: string;
  policy_number: string;
  phone?: string;
  claims_zip?: string;
  activation_date?: string;
  created_at: string;
  updated_at: string;
  policy_type?: string;
  group_number?: string;
  group_name?: string;
  patient_relation?: string;
  policyholder_name?: string;
  policyholder_dob?: string;
  policyholder_gender?: string;
  policyholder_phone?: string;
  payor_id?: string;
  nsure_payor_code?: string;
  carrier_id?: string;
  policy_type_id?: string;
  group_id?: string;
}

export interface InsuranceCarrier {
  id: string;
  carrier_type: string;
  carrier_name: string;
  claims_phone?: string;
  claims_zip?: string;
  created_at: string;
  updated_at: string;
}

export interface InsuranceGroup {
  id: string;
  group_number: string;
  group_name: string;
  carrier_id?: string;
  created_at: string;
  updated_at: string;
}

export interface PolicyType {
  id: string;
  code: string;
  name: string;
  description?: string;
  created_at: string;
}