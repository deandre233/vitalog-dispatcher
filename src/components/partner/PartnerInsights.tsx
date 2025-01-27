import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Brain, TrendingUp, AlertTriangle, Signal, Robot } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface PartnerInsight {
  type: "recommendation" | "alert" | "trend" | "ai";
  message: string;
  priority: "low" | "medium" | "high";
  source?: "ai" | "system";
}

export const PartnerInsights = () => {
  const [insights, setInsights] = useState<PartnerInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      setIsLoading(true);
      
      // Fetch partners data
      const { data: partners, error } = await supabase
        .from('partners')
        .select('*');

      if (error) throw error;

      // Generate insights from partner data
      const generatedInsights: PartnerInsight[] = [];

      // Add AI-generated insights
      const aiInsights = await generateAIInsights(partners);
      generatedInsights.push(...aiInsights);

      // Add system-generated insights
      const systemInsights = generateSystemInsights(partners);
      generatedInsights.push(...systemInsights);

      setInsights(generatedInsights);
    } catch (error) {
      console.error('Error loading insights:', error);
      toast({
        title: "Error loading insights",
        description: "There was a problem loading the partner insights.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIInsights = async (partners: any[]): Promise<PartnerInsight[]> => {
    try {
      const response = await supabase.functions.invoke('analyze-partner', {
        body: { partnerData: partners }
      });

      if (response.error) throw response.error;

      const analysis = response.data;
      return analysis.recommendations.map((rec: string) => ({
        type: "ai",
        message: rec.replace('Recommendation: ', ''),
        priority: analysis.riskAssessment,
        source: "ai"
      }));
    } catch (error) {
      console.error('Error generating AI insights:', error);
      return [];
    }
  };

  const generateSystemInsights = (partners: any[]): PartnerInsight[] => {
    const insights: PartnerInsight[] = [];
    
    // Check for expiring contracts
    const expiringPartners = partners.filter(p => {
      if (!p.contract_end_date) return false;
      const daysUntilExpiry = (new Date(p.contract_end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
      return daysUntilExpiry < 30;
    });

    if (expiringPartners.length > 0) {
      insights.push({
        type: "alert",
        message: `${expiringPartners.length} partners have contracts expiring in the next 30 days`,
        priority: "high"
      });
    }

    // Check for high performing partners
    const highPerformers = partners.filter(p => p.partnership_score >= 90);
    if (highPerformers.length > 0) {
      insights.push({
        type: "trend",
        message: `${highPerformers.length} partners are showing exceptional performance`,
        priority: "medium"
      });
    }

    return insights;
  };

  const getIcon = (type: PartnerInsight["type"], source?: string) => {
    if (source === "ai") return <Robot className="h-5 w-5 text-purple-500" />;
    
    switch (type) {
      case "recommendation":
        return <Brain className="h-5 w-5 text-blue-500" />;
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "trend":
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case "ai":
        return <Signal className="h-5 w-5 text-purple-500" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="p-4">
        <h3 className="text-lg font-semibold">AI Insights</h3>
        <div className="animate-pulse space-y-3 mt-4">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">AI Insights</h3>
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 p-3 rounded-lg ${
              insight.source === "ai" ? "bg-purple-50" : "bg-gray-50"
            }`}
          >
            {getIcon(insight.type, insight.source)}
            <div>
              <p className="text-sm text-gray-600">{insight.message}</p>
              {insight.source === "ai" && (
                <span className="text-xs text-purple-600 mt-1">AI-generated insight</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};