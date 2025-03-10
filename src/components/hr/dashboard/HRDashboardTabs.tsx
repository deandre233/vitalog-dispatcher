
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileCheck2, FileText, Users, AlertTriangle, Calendar, GraduationCap } from "lucide-react";
import { HRComplianceTab } from "./tabs/HRComplianceTab";
import { HRCertificationsTab } from "./tabs/HRCertificationsTab";
import { HRIncidentsTab } from "./tabs/HRIncidentsTab";
import { HRTrainingTab } from "./tabs/HRTrainingTab";
import { HRTeamAnalyticsTab } from "./tabs/HRTeamAnalyticsTab";

export function HRDashboardTabs() {
  return (
    <Tabs defaultValue="team" className="w-full">
      <TabsList className="grid grid-cols-5 w-full">
        <TabsTrigger value="team">Team Analytics</TabsTrigger>
        <TabsTrigger value="compliance">Compliance</TabsTrigger>
        <TabsTrigger value="certifications">Certifications</TabsTrigger>
        <TabsTrigger value="incidents">Incidents</TabsTrigger>
        <TabsTrigger value="training">Training</TabsTrigger>
      </TabsList>
      <TabsContent value="team" className="space-y-4 mt-4">
        <HRTeamAnalyticsTab />
      </TabsContent>
      <TabsContent value="compliance" className="space-y-4 mt-4">
        <HRComplianceTab />
      </TabsContent>
      <TabsContent value="certifications" className="space-y-4 mt-4">
        <HRCertificationsTab />
      </TabsContent>
      <TabsContent value="incidents" className="space-y-4 mt-4">
        <HRIncidentsTab />
      </TabsContent>
      <TabsContent value="training" className="space-y-4 mt-4">
        <HRTrainingTab />
      </TabsContent>
    </Tabs>
  );
}
