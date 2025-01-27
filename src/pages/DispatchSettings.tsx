import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertsConfig } from "@/components/dashboard/AlertsConfig";
import { AIOptimizationSettings } from "@/components/dispatch/settings/AIOptimizationSettings";
import { DispatchPreferences } from "@/components/dispatch/settings/DispatchPreferences";
import { AutomationRules } from "@/components/dispatch/settings/AutomationRules";

export default function DispatchSettings() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-medical-primary">Dispatch Settings</h1>
      </div>

      <Tabs defaultValue="preferences" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="preferences">General Preferences</TabsTrigger>
          <TabsTrigger value="alerts">Alert Configuration</TabsTrigger>
          <TabsTrigger value="ai">AI Optimization</TabsTrigger>
          <TabsTrigger value="automation">Automation Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="preferences">
          <DispatchPreferences />
        </TabsContent>

        <TabsContent value="alerts">
          <AlertsConfig />
        </TabsContent>

        <TabsContent value="ai">
          <AIOptimizationSettings />
        </TabsContent>

        <TabsContent value="automation">
          <AutomationRules />
        </TabsContent>
      </Tabs>
    </div>
  );
}