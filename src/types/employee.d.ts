export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  mobile?: string;
  station?: string;
  status?: string;
  employee_type?: string;
  certification_level?: string;
  created_at?: string;
  updated_at?: string;
  readable_id?: string;
  first_hired_date?: string;
  uses_timeclock?: boolean;
  access_codes?: string;
  photo_url?: string;
}