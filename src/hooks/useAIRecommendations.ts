
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AIRecommendation } from "@/types/ai";

// Helper function to adapt data to AIRecommendation type
const adaptToAIRecommendation = (data: any): AIRecommendation => {
  return {
    recommendation: data.recommendation || data.prediction || "",
    confidence: data.confidence_score ? data.confidence_score / 100 : (data.confidence || 0.7),
    source: data.source || "AI Analysis",
    context: data.metadata?.context || data.context || "",
    timestamp: data.created_at || new Date().toISOString()
  };
};

export function useAIRecommendations() {
  const [loading, setLoading] = useState(false);
  
  const getRecommendations = async (entity: string, entityId: string): Promise<AIRecommendation[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ai_recommendations')
        .select('*')
        .eq('entity_type', entity)
        .eq('entity_id', entityId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to match AIRecommendation type
      const recommendations = (data || []).map(adaptToAIRecommendation);
      
      return recommendations;
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  const addRecommendation = async (
    entity: string, 
    entityId: string, 
    recommendation: string,
    confidence: number = 0.7,
    metadata: any = {}
  ) => {
    try {
      const { error } = await supabase
        .from('ai_recommendations')
        .insert({
          entity_type: entity,
          entity_id: entityId,
          recommendation,
          confidence_score: confidence * 100, // Store as percentage
          metadata,
          created_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error adding AI recommendation:', error);
      return false;
    }
  };
  
  return { getRecommendations, addRecommendation, loading };
}
