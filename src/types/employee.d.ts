
export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  mobile?: string;
  station?: string;
  status: string;
  employee_type?: string;
  certification_level?: string;
  created_at: string;
  updated_at: string;
  readable_id?: string;
  first_hired_date?: string;
  pay_type?: string;
  pay_rate?: number;
  uses_timeclock?: boolean;
  access_codes?: string;
  photo_url?: string;
}

export interface EmployeeRole {
  id: string;
  employee_id: string;
  is_crew_member: boolean;
  is_supervisor: boolean;
  supervisor_role: "Captain" | "Lieutenant" | "Full privileges" | "Call-taker / Self-dispatch";
  is_biller: boolean;
  is_dispatcher: boolean;
  is_qa_reviewer: boolean;
  is_hr: boolean;
  is_mechanic: boolean;
  is_salesperson: boolean;
  is_medical_director: boolean;
  is_onlooker: boolean;
  onlooker_facility?: string;
  onlooker_city?: string;
  onlooker_county?: string;
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

export interface EmployeePayroll {
  id: string;
  employee_id: string;
  effective_date: string;
  end_date?: string;
  pay_type: "hourly" | "salary";
  pay_rate: number;
  uses_timeclock: boolean;
  access_codes?: string;
  created_by: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmployeeNotification {
  id: string;
  employee_id: string;
  event_type: string;
  is_enabled: boolean;
  channel: "sms" | "email" | "push" | "in_app";
}

export interface EmployeeCertification {
  id: string;
  employee_id: string;
  certification_type: string;
  certification_number: string;
  issue_date: string;
  expiration_date: string;
  issuing_authority: string;
  status: "active" | "expired" | "pending" | "revoked";
}
