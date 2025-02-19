
import { Brain, Bell, ArrowUpRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export function HeroSection() {
  const getAIInsights = () => {
    toast.success("AI Analysis: 85% read rate across all bulletins", {
      description: "Engagement is highest on Tuesday mornings",
    });
  };

  return (
    <Card className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
              <Bell className="h-8 w-8" />
              Broadcast Hub
            </h1>
            <p className="text-blue-100 text-lg mb-8">Enterprise Communication Center</p>
            <div className="flex gap-4 mt-4">
              <Button onClick={getAIInsights} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm">
                <Brain className="h-5 w-5 mr-2" />
                AI Analytics
              </Button>
              <Button className="bg-white text-blue-600 hover:bg-white/90">
                <Plus className="h-5 w-5 mr-2" />
                Create Broadcast
              </Button>
            </div>
          </div>
          <ArrowUpRight className="h-16 w-16 text-white/20" />
        </div>
      </CardContent>
    </Card>
  );
}
