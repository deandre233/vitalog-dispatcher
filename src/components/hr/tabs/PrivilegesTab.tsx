
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EmployeePrivileges } from "@/types/employee";
import { 
  Lock, 
  ShieldAlert, 
  ChevronDown, 
  FileText, 
  Clock, 
  Cog, 
  Info,
  AlertTriangle,
  Server
} from "lucide-react";

interface PrivilegesTabProps {
  privileges: EmployeePrivileges;
  updatePrivileges: any;
  getAIRecommendations: (category: string) => Promise<Record<string, boolean>>;
}

export function PrivilegesTab({ privileges, updatePrivileges, getAIRecommendations }: PrivilegesTabProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(["core"]);
  const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({
    core: false,
    pcr: false,
    timeclock: false,
    system: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section) 
        : [...prev, section]
    );
  };

  const isSectionExpanded = (section: string) => {
    return expandedSections.includes(section);
  };

  const handleToggle = (key: keyof EmployeePrivileges) => {
    updatePrivileges.mutate({
      [key]: !privileges[key]
    });
  };

  const getAIRecommendationsForCategory = async (category: string) => {
    setAiLoading(prev => ({ ...prev, [category]: true }));
    try {
      const recommendations = await getAIRecommendations(category);
      
      const updates: Partial<EmployeePrivileges> = {};
      Object.entries(recommendations).forEach(([key, value]) => {
        // Using type assertion to avoid TypeScript error
        (updates as any)[key] = value;
      });
      
      updatePrivileges.mutate(updates);
    } catch (error) {
      console.error("Error getting AI recommendations:", error);
    } finally {
      setAiLoading(prev => ({ ...prev, [category]: false }));
    }
  };

  const PrivilegeSwitch = ({ 
    name, 
    value, 
    label, 
    description 
  }: { 
    name: keyof EmployeePrivileges; 
    value: boolean; 
    label: string; 
    description: string;
  }) => (
    <div className="flex items-center justify-between py-2">
      <div className="space-y-0.5">
        <div className="flex items-center">
          <span className="text-sm font-medium">{label}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground ml-1.5 cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">
                <p className="text-xs">{description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {(name === "system_admin_access" || name === "can_delete_patient_info") && (
            <Badge className="ml-2 bg-red-100 text-red-800 hover:bg-red-100" variant="outline">
              <ShieldAlert className="h-3 w-3 mr-1" />
              Security Risk
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch 
        checked={value} 
        onCheckedChange={() => handleToggle(name)} 
      />
    </div>
  );

  return (
    <TabsContent value="privileges" className="space-y-6 py-4">
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Access Privileges</h2>
          <p className="text-muted-foreground">
            Manage this employee's system access and privileges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Core Privileges */}
          <Card>
            <CardHeader className="pb-3">
              <Collapsible open={isSectionExpanded("core")}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Lock className="mr-2 h-5 w-5 text-muted-foreground" />
                    <CardTitle>Core Access Privileges</CardTitle>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={aiLoading.core}
                      onClick={() => getAIRecommendationsForCategory("core")}
                    >
                      {aiLoading.core ? "Processing..." : "AI Recommend"}
                    </Button>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => toggleSection("core")}>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isSectionExpanded("core") ? "" : "-rotate-90"}`} />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Basic access controls for patient data and core functionality
                </p>
                <CollapsibleContent>
                  <CardContent className="pt-3">
                    <div className="space-y-4">
                      <PrivilegeSwitch
                        name="can_view_patient_info"
                        value={privileges.can_view_patient_info}
                        label="View Patient Info"
                        description="Can view patient personal and medical information"
                      />
                      <PrivilegeSwitch
                        name="can_edit_patient_info"
                        value={privileges.can_edit_patient_info}
                        label="Edit Patient Info"
                        description="Can modify patient personal and medical information"
                      />
                      <PrivilegeSwitch
                        name="can_delete_patient_info"
                        value={privileges.can_delete_patient_info}
                        label="Delete Patient Info"
                        description="Can permanently remove patient information from the system"
                      />
                      <Separator />
                      <PrivilegeSwitch
                        name="can_view_billing_info"
                        value={privileges.can_view_billing_info}
                        label="View Billing Info"
                        description="Can access patient billing and insurance information"
                      />
                      <PrivilegeSwitch
                        name="can_edit_billing_info"
                        value={privileges.can_edit_billing_info}
                        label="Edit Billing Info"
                        description="Can modify billing records and payment information"
                      />
                      <PrivilegeSwitch
                        name="can_delete_billing_info"
                        value={privileges.can_delete_billing_info}
                        label="Delete Billing Info"
                        description="Can remove billing records from the system"
                      />
                      <Separator />
                      <PrivilegeSwitch
                        name="can_view_dispatch_info"
                        value={privileges.can_view_dispatch_info}
                        label="View Dispatch Info"
                        description="Can see transport and dispatch information"
                      />
                      <PrivilegeSwitch
                        name="can_edit_dispatch_info"
                        value={privileges.can_edit_dispatch_info}
                        label="Edit Dispatch Info"
                        description="Can modify transport and dispatch details"
                      />
                      <PrivilegeSwitch
                        name="can_delete_dispatch_info"
                        value={privileges.can_delete_dispatch_info}
                        label="Delete Dispatch Info"
                        description="Can remove dispatch records from the system"
                      />
                      <Separator />
                      <PrivilegeSwitch
                        name="can_view_reports"
                        value={privileges.can_view_reports}
                        label="View Reports"
                        description="Can access system reports and analytics"
                      />
                      <PrivilegeSwitch
                        name="can_create_reports"
                        value={privileges.can_create_reports}
                        label="Create Reports"
                        description="Can generate new reports in the system"
                      />
                      <PrivilegeSwitch
                        name="can_edit_reports"
                        value={privileges.can_edit_reports}
                        label="Edit Reports"
                        description="Can modify existing reports"
                      />
                      <PrivilegeSwitch
                        name="can_delete_reports"
                        value={privileges.can_delete_reports}
                        label="Delete Reports"
                        description="Can remove reports from the system"
                      />
                      <Separator />
                      <PrivilegeSwitch
                        name="can_use_ai_assistance"
                        value={privileges.can_use_ai_assistance}
                        label="Use AI Assistance"
                        description="Can use AI tools for recommendations and insights"
                      />
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </CardHeader>
          </Card>

          {/* PCR Privileges */}
          <Card>
            <CardHeader className="pb-3">
              <Collapsible open={isSectionExpanded("pcr")}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                    <CardTitle>PCR Privileges</CardTitle>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={aiLoading.pcr}
                      onClick={() => getAIRecommendationsForCategory("pcr")}
                    >
                      {aiLoading.pcr ? "Processing..." : "AI Recommend"}
                    </Button>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => toggleSection("pcr")}>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isSectionExpanded("pcr") ? "" : "-rotate-90"}`} />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  PCR creation and management capabilities
                </p>
                <CollapsibleContent>
                  <CardContent className="pt-3">
                    <div className="space-y-4">
                      <PrivilegeSwitch
                        name="pcr_auto_duplication"
                        value={privileges.pcr_auto_duplication}
                        label="PCR Auto-Duplication"
                        description="Can use automated duplication features for PCRs"
                      />
                      <PrivilegeSwitch
                        name="pcr_submit_incomplete"
                        value={privileges.pcr_submit_incomplete}
                        label="Submit Incomplete PCR"
                        description="Can submit PCRs with incomplete information"
                      />
                      <PrivilegeSwitch
                        name="pcr_narrative_composer"
                        value={privileges.pcr_narrative_composer}
                        label="Narrative Composer"
                        description="Can use the advanced narrative composition tool"
                      />
                      <PrivilegeSwitch
                        name="pcr_narrative_cut_paste"
                        value={privileges.pcr_narrative_cut_paste}
                        label="Cut & Paste Narratives"
                        description="Can copy and paste content into PCR narratives"
                      />
                      <PrivilegeSwitch
                        name="pcr_auto_launch"
                        value={privileges.pcr_auto_launch}
                        label="Auto-Launch PCR"
                        description="PCR automatically launches with dispatch"
                      />
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </CardHeader>
          </Card>

          {/* Timeclock Privileges */}
          <Card>
            <CardHeader className="pb-3">
              <Collapsible open={isSectionExpanded("timeclock")}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                    <CardTitle>Timeclock Privileges</CardTitle>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={aiLoading.timeclock}
                      onClick={() => getAIRecommendationsForCategory("timeclock")}
                    >
                      {aiLoading.timeclock ? "Processing..." : "AI Recommend"}
                    </Button>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => toggleSection("timeclock")}>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isSectionExpanded("timeclock") ? "" : "-rotate-90"}`} />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Timeclock and shift management access
                </p>
                <CollapsibleContent>
                  <CardContent className="pt-3">
                    <div className="space-y-4">
                      <PrivilegeSwitch
                        name="timeclock_flagging"
                        value={privileges.timeclock_flagging}
                        label="Timeclock Flagging"
                        description="Can flag unusual timeclock entries for review"
                      />
                      <PrivilegeSwitch
                        name="remote_timeclock"
                        value={privileges.remote_timeclock}
                        label="Remote Timeclock"
                        description="Can clock in/out from remote locations"
                      />
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </CardHeader>
          </Card>

          {/* System Administration Privileges */}
          <Card>
            <CardHeader className="pb-3">
              <Collapsible open={isSectionExpanded("system")}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Server className="mr-2 h-5 w-5 text-muted-foreground" />
                    <CardTitle>System Administration</CardTitle>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={aiLoading.system}
                      onClick={() => getAIRecommendationsForCategory("system")}
                    >
                      {aiLoading.system ? "Processing..." : "AI Recommend"}
                    </Button>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => toggleSection("system")}>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isSectionExpanded("system") ? "" : "-rotate-90"}`} />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Advanced system administration privileges
                </p>
                <CollapsibleContent>
                  <CardContent className="pt-3">
                    <Alert className="mb-4 bg-amber-50 text-amber-800 border-amber-200">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        These privileges grant extensive access to sensitive parts of the system.
                        Only assign them to trusted administrators.
                      </AlertDescription>
                    </Alert>
                    <div className="space-y-4">
                      <PrivilegeSwitch
                        name="system_admin_access"
                        value={privileges.system_admin_access}
                        label="System Admin Access"
                        description="Full administrative access to system settings"
                      />
                      <PrivilegeSwitch
                        name="audit_log_access"
                        value={privileges.audit_log_access}
                        label="Audit Log Access"
                        description="Can view system audit logs and user activity"
                      />
                      <PrivilegeSwitch
                        name="quality_assurance_access"
                        value={privileges.quality_assurance_access}
                        label="Quality Assurance Access"
                        description="Can access quality assurance tools and reviews"
                      />
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </CardHeader>
          </Card>
        </div>
      </div>
    </TabsContent>
  );
}

function TabsContent({ value, className, children }: { value: string; className?: string; children: React.ReactNode }) {
  return (
    <div role="tabpanel" hidden={value !== "privileges"} className={className}>
      {children}
    </div>
  );
}
