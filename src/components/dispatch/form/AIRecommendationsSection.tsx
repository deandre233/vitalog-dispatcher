
import { Bot } from "lucide-react";
import { Card } from "@/components/ui/card";

export function AIRecommendationsSection() {
  return (
    <Card className="p-6 bg-gradient-to-br from-[#F1F0FB] to-[#E5DEFF] border-l-4 border-l-[#9b87f5] shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="w-5 h-5 text-[#9b87f5]" />
        <h3 className="text-lg font-semibold text-[#7E69AB]">AI Recommendations</h3>
      </div>
      <div className="space-y-2 text-medical-primary/80">
        <p className="text-sm">Based on the provided information, our AI suggests:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Recommended crew type will be shown after submission</li>
          <li>Estimated duration will be calculated based on trip type</li>
          <li>Priority score will be assigned based on service level</li>
        </ul>
      </div>
    </Card>
  );
}
