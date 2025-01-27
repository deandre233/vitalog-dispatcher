import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Map, Bell } from "lucide-react";

export function DispatchPreferences() {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-6 w-6 text-medical-secondary" />
        <h2 className="text-2xl font-semibold">General Preferences</h2>
      </div>

      <div className="space-y-6">
        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Default Map View</Label>
              <p className="text-sm text-gray-500">Choose your preferred map display</p>
            </div>
            <Select defaultValue="satellite">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="satellite">Satellite</SelectItem>
                <SelectItem value="terrain">Terrain</SelectItem>
                <SelectItem value="street">Street</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Auto-refresh Interval</Label>
              <p className="text-sm text-gray-500">Update frequency for dispatch board</p>
            </div>
            <Select defaultValue="30">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 seconds</SelectItem>
                <SelectItem value="30">30 seconds</SelectItem>
                <SelectItem value="60">1 minute</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Sound Notifications</Label>
              <p className="text-sm text-gray-500">Enable audio alerts for new dispatches</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>
    </Card>
  );
}