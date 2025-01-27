import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Bot, TrendingUp, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AIInsight {
  type: string;
  message: string;
  confidence: number;
}

export function PatientInsights() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const { data: aiResults, error } = await supabase
          .from('ai_analysis_results')
          .select('*')
          .eq('analysis_type', 'patient_demographics')
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;

        // Transform the results into insights
        const formattedInsights = aiResults.map(result => ({
          type: 'ai',
          message: result.recommendation || '',
          confidence: result.confidence_score || 0
        }));

        setInsights(formattedInsights);
      } catch (error) {
        console.error('Error fetching insights:', error);
        toast.error('Failed to load AI insights');
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  if (loading) {
    return (
      <Card className="p-4 w-full max-w-md animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-4 w-full max-w-md bg-white/50 backdrop-blur-sm border-medical-secondary/20">
      <div className="flex items-center gap-2 text-medical-primary">
        <Bot className="h-5 w-5" />
        <h3 className="font-semibold">AI Insights</h3>
      </div>

      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="flex items-start gap-2 p-2 rounded-md bg-white/30 backdrop-blur-sm"
          >
            {insight.confidence > 0.8 ? (
              <TrendingUp className="h-4 w-4 text-green-500 mt-1" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-1" />
            )}
            <p className="text-sm text-gray-700">{insight.message}</p>
          </div>
        ))}

        {insights.length === 0 && (
          <p className="text-sm text-gray-500 italic">No insights available</p>
        )}
      </div>
    </Card>
  );
}