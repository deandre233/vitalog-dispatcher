export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  middle_initial?: string;
  suffix?: string;
  mobile: string | null;
  station: string | null;
  status: string | null;
  employee_type: string | null;
  certification_level: string | null;
  created_at: string | null;
  readable_id: string | null;
  nemsis_uuid?: string;
  emergency_contact?: string;
  login_name?: string;
  last_login_attempt?: string;
  last_login_success?: string;
  beacon_token?: string;
  latest_ping?: string;
}

export interface EmployeeRole {
  isCrew: boolean;
  isSupervisor: boolean;
  supervisorRole: string;
  isBiller: boolean;
  isDispatcher: boolean;
  isQAReviewer: boolean;
  isHR: boolean;
  isMechanic: boolean;
  isSalesperson: boolean;
  isMedicalDirector: boolean;
  isOnlooker: boolean;
  onlookerFacility: string;
  onlookerCity: string;
  onlookerCounty: string;
  canSeeNonEmergent: boolean;
  isAdministrator: boolean;
  isPrincipal: boolean;
  isProvisional: boolean;
}

export interface EmployeePrivilege {
  canViewPatientInfo: boolean;
  canEditPatientInfo: boolean;
  canDeletePatientInfo: boolean;
  canViewBillingInfo: boolean;
  canEditBillingInfo: boolean;
  canDeleteBillingInfo: boolean;
  canViewDispatchInfo: boolean;
  canEditDispatchInfo: boolean;
  canDeleteDispatchInfo: boolean;
  canViewReports: boolean;
  canCreateReports: boolean;
  canEditReports: boolean;
  canDeleteReports: boolean;
  canUseAIAssistance: boolean;
}