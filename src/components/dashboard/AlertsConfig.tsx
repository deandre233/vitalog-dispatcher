import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface AlertConfig {
  enabled: boolean;
  threshold: number;
}

export function AlertsConfig() {
  const [waitTimeAlert, setWaitTimeAlert] = useState<AlertConfig>({
    enabled: true,
    threshold: 15,
  });
  const [delayAlert, setDelayAlert] = useState<AlertConfig>({
    enabled: true,
    threshold: 10,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alert Configuration</CardTitle>
        <CardDescription>
          Customize when you want to receive alerts for dispatch events
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="space-y-1">
            <Label htmlFor="wait-time">Wait Time Alerts</Label>
            <div className="text-sm text-muted-foreground">
              Alert when dispatch waiting time exceeds threshold
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Input
              id="wait-time"
              type="number"
              className="w-20"
              value={waitTimeAlert.threshold}
              onChange={(e) =>
                setWaitTimeAlert({
                  ...waitTimeAlert,
                  threshold: parseInt(e.target.value),
                })
              }
            />
            <Switch
              checked={waitTimeAlert.enabled}
              onCheckedChange={(checked) =>
                setWaitTimeAlert({ ...waitTimeAlert, enabled: checked })
              }
            />
          </div>
        </div>

        <div className="flex items-center justify-between space-x-4">
          <div className="space-y-1">
            <Label htmlFor="delay-alert">Delay Alerts</Label>
            <div className="text-sm text-muted-foreground">
              Alert when transport is delayed beyond threshold
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Input
              id="delay-alert"
              type="number"
              className="w-20"
              value={delayAlert.threshold}
              onChange={(e) =>
                setDelayAlert({
                  ...delayAlert,
                  threshold: parseInt(e.target.value),
                })
              }
            />
            <Switch
              checked={delayAlert.enabled}
              onCheckedChange={(checked) =>
                setDelayAlert({ ...delayAlert, enabled: checked })
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}