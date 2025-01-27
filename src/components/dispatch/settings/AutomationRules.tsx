import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Wand2, Plus, AlertTriangle } from "lucide-react";

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  priority: "high" | "medium" | "low";
}

export function AutomationRules() {
  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: "1",
      name: "High Priority Assignment",
      description: "Automatically assign critical cases to nearest available crew",
      enabled: true,
      priority: "high",
    },
    {
      id: "2",
      name: "Weather Rerouting",
      description: "Reroute vehicles based on severe weather conditions",
      enabled: true,
      priority: "medium",
    },
  ]);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Wand2 className="h-6 w-6 text-medical-secondary" />
          <h2 className="text-2xl font-semibold">Automation Rules</h2>
        </div>
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" /> Add Rule
        </Button>
      </div>

      <div className="space-y-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="flex items-center justify-between p-4 bg-medical-accent rounded-lg hover:bg-medical-accent/80 transition-colors"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{rule.name}</h3>
                <Badge
                  variant={
                    rule.priority === "high"
                      ? "destructive"
                      : rule.priority === "medium"
                      ? "default"
                      : "secondary"
                  }
                >
                  {rule.priority}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">{rule.description}</p>
            </div>
            <Switch
              checked={rule.enabled}
              onCheckedChange={(checked) =>
                setRules((prev) =>
                  prev.map((r) => (r.id === rule.id ? { ...r, enabled: checked } : r))
                )
              }
            />
          </div>
        ))}
      </div>
    </Card>
  );
}