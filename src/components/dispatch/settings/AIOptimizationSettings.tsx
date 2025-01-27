import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Brain, Zap, BarChart } from "lucide-react";

export function AIOptimizationSettings() {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState([75]);
  const [features, setFeatures] = useState({
    routeOptimization: true,
    crewAssignment: true,
    demandPrediction: true,
  });

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Brain className="h-6 w-6 text-medical-secondary" />
          <h2 className="text-2xl font-semibold">AI Optimization Settings</h2>
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-lg">Enable AI Assistance</Label>
              <p className="text-sm text-gray-500">Use AI to optimize dispatch operations</p>
            </div>
            <Switch checked={aiEnabled} onCheckedChange={setAiEnabled} />
          </div>

          <div className="space-y-4">
            <Label className="text-lg">AI Confidence Threshold</Label>
            <p className="text-sm text-gray-500 mb-4">
              Minimum confidence level required for AI recommendations
            </p>
            <Slider
              value={confidenceThreshold}
              onValueChange={setConfidenceThreshold}
              max={100}
              step={1}
            />
            <p className="text-sm text-medical-secondary font-medium">
              {confidenceThreshold}% confidence required
            </p>
          </div>

          <div className="space-y-4">
            <Label className="text-lg">Enabled Features</Label>
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 bg-medical-accent rounded-lg">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-medical-secondary" />
                  <div>
                    <p className="font-medium">Route Optimization</p>
                    <p className="text-sm text-gray-500">Optimize routes based on traffic and weather</p>
                  </div>
                </div>
                <Switch
                  checked={features.routeOptimization}
                  onCheckedChange={(checked) =>
                    setFeatures((prev) => ({ ...prev, routeOptimization: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-medical-accent rounded-lg">
                <div className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-medical-secondary" />
                  <div>
                    <p className="font-medium">Demand Prediction</p>
                    <p className="text-sm text-gray-500">Predict dispatch demand patterns</p>
                  </div>
                </div>
                <Switch
                  checked={features.demandPrediction}
                  onCheckedChange={(checked) =>
                    setFeatures((prev) => ({ ...prev, demandPrediction: checked }))
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}