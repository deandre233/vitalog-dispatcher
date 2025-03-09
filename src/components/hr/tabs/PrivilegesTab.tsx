
import { useState } from "react";
import { EmployeePrivileges } from "@/types/employee";
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import { UseMutationResult } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  AlertCircle, 
  FileText, 
  Clock, 
  Shield, 
  Robot, 
  Database, 
  User, 
  Settings,
  DollarSign,
  Ambulance,
  ChevronDown,
  ChevronUp,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PrivilegesTabProps {
  privileges: EmployeePrivileges | undefined;
  updatePrivileges: UseMutationResult<void, Error, Partial<EmployeePrivileges>, unknown>;
  getAIRecommendations?: (roleType: string) => Promise<Record<string, boolean>>;
}

export function PrivilegesTab({ privileges, updatePrivileges, getAIRecommendations }: PrivilegesTabProps) {
  const [expandedSections, setExpandedSections] = useState({
    patient: true,
    billing: true,
    dispatch: true,
    reports: true,
    pcr: true,
    timeclock: true,
    system: true,
    ai: true
  });

  const [isApplyingAI, setIsApplyingAI] = useState(false);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  const handleApplyAIRecommendations = async (section: string) => {
    if (!getAIRecommendations) return;
    
    setIsApplyingAI(true);
    try {
      const recommendations = await getAIRecommendations(section);
      updatePrivileges.mutate(recommendations);
    } catch (error) {
      console.error("Error applying AI recommendations:", error);
    } finally {
      setIsApplyingAI(false);
    }
  };

  const renderSectionHeader = (
    title: string, 
    section: keyof typeof expandedSections, 
    icon: React.ReactNode,
    aiRecommendable: boolean = true
  ) => (
    <div className="flex items-center justify-between border-b pb-2 mb-4">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <div className="flex items-center gap-2">
        {aiRecommendable && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleApplyAIRecommendations(section)}
                  disabled={isApplyingAI || updatePrivileges.isPending}
                  className="flex items-center gap-1"
                >
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  <span>AI Suggest</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Apply AI-recommended privileges based on employee role</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => toggleSection(section)}
          className="p-1 h-auto"
        >
          {expandedSections[section] ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );

  const renderPrivilegeItem = (
    label: string,
    field: keyof EmployeePrivileges,
    description?: string,
    isHighSecurity?: boolean
  ) => {
    if (!privileges) return null;

    return (
      <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{label}</span>
            {isHighSecurity && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="destructive" className="ml-2 px-1.5 py-0">
                      <Shield className="h-3 w-3 mr-1" />
                      <span className="text-xs">High Security</span>
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">This privilege grants significant system access and should be assigned carefully</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        </div>
        <Checkbox
          checked={privileges[field] as boolean}
          onCheckedChange={() => 
            updatePrivileges.mutate({ [field]: !privileges[field] })
          }
          disabled={updatePrivileges.isPending}
          className="h-5 w-5"
        />
      </div>
    );
  };

  return (
    <TabsContent value="privileges" className="mt-0 animate-in fade-in-50">
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                Patient Information Access
              </CardTitle>
              <CardDescription>
                Control employee access to patient data
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderSectionHeader("Patient Info", "patient", <User className="h-5 w-5 text-blue-500" />)}
              {expandedSections.patient && (
                <>
                  {renderPrivilegeItem(
                    "View Patient Information", 
                    "can_view_patient_info",
                    "Access to view patient demographics, medical history, and contact details"
                  )}
                  {renderPrivilegeItem(
                    "Edit Patient Information", 
                    "can_edit_patient_info",
                    "Ability to update patient records and modify patient data"
                  )}
                  {renderPrivilegeItem(
                    "Delete Patient Information", 
                    "can_delete_patient_info",
                    "Permission to remove patient records from the system",
                    true
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                Billing System Access
              </CardTitle>
              <CardDescription>
                Manage access to financial and billing functions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderSectionHeader("Billing Info", "billing", <DollarSign className="h-5 w-5 text-green-500" />)}
              {expandedSections.billing && (
                <>
                  {renderPrivilegeItem(
                    "View Billing Information", 
                    "can_view_billing_info",
                    "Access to view invoices, payments, and financial records"
                  )}
                  {renderPrivilegeItem(
                    "Edit Billing Information", 
                    "can_edit_billing_info",
                    "Ability to update financial records, process payments, and modify billing data"
                  )}
                  {renderPrivilegeItem(
                    "Delete Billing Information", 
                    "can_delete_billing_info",
                    "Permission to remove financial records from the system",
                    true
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Ambulance className="h-5 w-5 text-red-500" />
                Dispatch System Access
              </CardTitle>
              <CardDescription>
                Control permissions for dispatch operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderSectionHeader("Dispatch Info", "dispatch", <Ambulance className="h-5 w-5 text-red-500" />)}
              {expandedSections.dispatch && (
                <>
                  {renderPrivilegeItem(
                    "View Dispatch Information", 
                    "can_view_dispatch_info",
                    "Access to view dispatch records, crew assignments, and transport details"
                  )}
                  {renderPrivilegeItem(
                    "Edit Dispatch Information", 
                    "can_edit_dispatch_info",
                    "Ability to update dispatch records, assign crews, and modify transport details"
                  )}
                  {renderPrivilegeItem(
                    "Delete Dispatch Information", 
                    "can_delete_dispatch_info",
                    "Permission to remove dispatch records from the system",
                    true
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-500" />
                Reports & Analytics
              </CardTitle>
              <CardDescription>
                Manage report generation and analytics access
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderSectionHeader("Reports", "reports", <FileText className="h-5 w-5 text-purple-500" />)}
              {expandedSections.reports && (
                <>
                  {renderPrivilegeItem(
                    "View Reports", 
                    "can_view_reports",
                    "Access to view system reports and analytics dashboards"
                  )}
                  {renderPrivilegeItem(
                    "Create Reports", 
                    "can_create_reports",
                    "Ability to generate new reports and analytics"
                  )}
                  {renderPrivilegeItem(
                    "Edit Reports", 
                    "can_edit_reports",
                    "Permission to modify existing reports and dashboards"
                  )}
                  {renderPrivilegeItem(
                    "Delete Reports", 
                    "can_delete_reports",
                    "Ability to remove reports from the system"
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-500" />
                PCR Special Features
              </CardTitle>
              <CardDescription>
                Patient Care Report specific privileges
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderSectionHeader("PCR Features", "pcr", <FileText className="h-5 w-5 text-orange-500" />)}
              {expandedSections.pcr && (
                <>
                  {renderPrivilegeItem(
                    "PCR Auto-Duplication", 
                    "pcr_auto_duplication",
                    "Create PCR records faster by duplicating previous records or using templates"
                  )}
                  {renderPrivilegeItem(
                    "PCR Submit While Incomplete", 
                    "pcr_submit_incomplete",
                    "Allowed to submit PCRs to QA even though required fields are incomplete",
                    true
                  )}
                  {renderPrivilegeItem(
                    "PCR Narrative Composer", 
                    "pcr_narrative_composer",
                    "Allowed to use AutoCompose when writing the narrative"
                  )}
                  {renderPrivilegeItem(
                    "PCR Narrative Cut and Paste", 
                    "pcr_narrative_cut_paste",
                    "Allowed to cut and paste text for the narrative"
                  )}
                  {renderPrivilegeItem(
                    "Auto-launch Offline PCR", 
                    "pcr_auto_launch",
                    "Automatically launch the offline PCR when the crew member clicks 'Enroute'"
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                Timeclock Management
              </CardTitle>
              <CardDescription>
                Time tracking and management privileges
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderSectionHeader("Timeclock Features", "timeclock", <Clock className="h-5 w-5 text-blue-500" />)}
              {expandedSections.timeclock && (
                <>
                  {renderPrivilegeItem(
                    "Timeclock Flagging", 
                    "timeclock_flagging",
                    "Allowed to set and clear flags in the timeclock system. Captains, dispatchers, and HR typically have this privilege"
                  )}
                  {renderPrivilegeItem(
                    "Remote Timeclock", 
                    "remote_timeclock",
                    "Allowed to clock-in and clock-out from anywhere, not restricted to station locations",
                    true
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-500" />
                System Administration
              </CardTitle>
              <CardDescription>
                High-level system access controls
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderSectionHeader("System Access", "system", <Settings className="h-5 w-5 text-gray-500" />)}
              {expandedSections.system && (
                <>
                  {renderPrivilegeItem(
                    "System Administrator Access", 
                    "system_admin_access",
                    "Full administrative access to configure system settings",
                    true
                  )}
                  {renderPrivilegeItem(
                    "Audit Log Access", 
                    "audit_log_access",
                    "Ability to view detailed system audit logs and user activity",
                    true
                  )}
                  {renderPrivilegeItem(
                    "Quality Assurance Access", 
                    "quality_assurance_access",
                    "Access to QA tools and ability to review PCRs"
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Robot className="h-5 w-5 text-indigo-500" />
                AI & Automation Features
              </CardTitle>
              <CardDescription>
                Access to AI-assisted tools and automation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderSectionHeader("AI Features", "ai", <Robot className="h-5 w-5 text-indigo-500" />)}
              {expandedSections.ai && (
                <>
                  {renderPrivilegeItem(
                    "Use AI Assistance", 
                    "can_use_ai_assistance",
                    "Access to AI-powered tools for reports, narratives, and suggestions"
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </TabsContent>
  );
}
