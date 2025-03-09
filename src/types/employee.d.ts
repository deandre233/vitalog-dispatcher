
export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  mobile: string;
  station: string;
  status: string;
  employee_type: string;
  certification_level: string;
  created_at: string;
  updated_at: string;
  readable_id?: string;
  first_hired_date?: string;
  pay_type?: string;
  pay_rate?: number;
  uses_timeclock?: boolean;
  access_codes?: string;
  photo_url?: string;
  
  // Demographics fields
  date_of_birth?: string;
  gender?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  race_ethnicity?: string;
  secondary_race?: string;
  citizenship?: string;
  certification_number?: string;
  certification_expiry?: string;
  years_experience?: number;
  email?: string;
  home_phone?: string;
  work_phone?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  preferred_contact_method?: string;
  consent_to_background_check?: boolean;
  consent_to_drug_testing?: boolean;
}

export interface EmployeeRole {
  id: string;
  employee_id: string;
  is_crew_member: boolean;
  is_supervisor: boolean;
  supervisor_role: "Captain" | "Lieutenant" | "Full privileges" | "Call-taker / Self-dispatch" | string;
  is_biller: boolean;
  is_dispatcher: boolean;
  is_qa_reviewer: boolean;
  is_hr: boolean;
  is_mechanic: boolean;
  is_salesperson: boolean;
  is_medical_director: boolean;
  is_onlooker: boolean;
  onlooker_facility: string;
  onlooker_city: string;
  onlooker_county: string;
  can_see_non_emergent: boolean;
  is_administrator: boolean;
  is_principal: boolean;
  is_provisional: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmployeePrivileges {
  id: string;
  employee_id: string;
  can_view_patient_info: boolean;
  can_edit_patient_info: boolean;
  can_delete_patient_info: boolean;
  can_view_billing_info: boolean;
  can_edit_billing_info: boolean;
  can_delete_billing_info: boolean;
  can_view_dispatch_info: boolean;
  can_edit_dispatch_info: boolean;
  can_delete_dispatch_info: boolean;
  can_view_reports: boolean;
  can_create_reports: boolean;
  can_edit_reports: boolean;
  can_delete_reports: boolean;
  can_use_ai_assistance: boolean;
  created_at: string;
  updated_at: string;
}
