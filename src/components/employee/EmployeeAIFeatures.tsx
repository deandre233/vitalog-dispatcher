
import { Wand2, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import type { Employee } from "@/types/employee";

interface EmployeeAIFeaturesProps {
  onAIAssist: (recommendations: AIRecommendations) => void;
}

interface AIRecommendations {
  station: string;
  certification_level: string;
}

export function EmployeeAIFeatures({ onAIAssist }: EmployeeAIFeaturesProps) {
  const { toast } = useToast();

  const handleAIAssist = () => {
    const recommendations: AIRecommendations = {
      station: "Emergency Response Unit",
      certification_level: "Advanced",
    };

    toast({
      title: "AI Recommendations Generated",
      description: "Staffing recommendations have been generated based on current needs.",
    });

    onAIAssist(recommendations);
  };

  return (
    <div className="flex items-center gap-4">
      <Button type="button" variant="secondary" onClick={handleAIAssist}>
        <Wand2 className="mr-2 h-4 w-4" />
        AI Assist
      </Button>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">
            <Brain className="mr-2 h-4 w-4" />
            AI Insights
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>AI Staffing Insights</SheetTitle>
            <SheetDescription>
              Real-time analysis of staffing needs and recommendations
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-secondary/50 rounded-lg space-y-2">
              <h4 className="font-medium">Current Staffing Levels</h4>
              <div className="flex gap-2">
                <Badge variant="default">Emergency: 12</Badge>
                <Badge variant="outline">Non-Emergency: 8</Badge>
              </div>
            </div>
            <div className="p-4 bg-secondary/50 rounded-lg space-y-2">
              <h4 className="font-medium">Recommended Certifications</h4>
              <div className="flex gap-2">
                <Badge variant="default">Advanced</Badge>
                <Badge variant="outline">Emergency Response</Badge>
              </div>
            </div>
            <div className="p-4 bg-secondary/50 rounded-lg">
              <h4 className="font-medium">Optimal Station Assignment</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Emergency Response Unit (Based on current coverage analysis)
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
