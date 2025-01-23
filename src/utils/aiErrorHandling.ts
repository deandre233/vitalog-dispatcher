import { toast } from "sonner";

export interface AIRecommendation {
  route?: string;
  crew?: string;
  billing?: string;
  insights?: string[];
  trafficStatus?: {
    congestionLevel: "low" | "medium" | "high";
    estimatedDelay: number;
    alternateRouteAvailable: boolean;
  };
}

export const DEFAULT_AI_RECOMMENDATION: AIRecommendation = {
  route: "Standard route",
  crew: "Available crew",
  billing: "Standard billing",
  insights: ["Using default recommendations"],
  trafficStatus: {
    congestionLevel: "medium",
    estimatedDelay: 0,
    alternateRouteAvailable: false
  }
};

export function handleAIError(error: unknown, context: string): AIRecommendation {
  console.error(`AI Error in ${context}:`, error);
  toast.error(`AI service temporarily unavailable: ${context}`, {
    description: "Using fallback recommendations"
  });
  return DEFAULT_AI_RECOMMENDATION;
}

export function validateAIRecommendation(recommendation: AIRecommendation | null | undefined): AIRecommendation {
  if (!recommendation) {
    return DEFAULT_AI_RECOMMENDATION;
  }

  return {
    route: recommendation.route || DEFAULT_AI_RECOMMENDATION.route,
    crew: recommendation.crew || DEFAULT_AI_RECOMMENDATION.crew,
    billing: recommendation.billing || DEFAULT_AI_RECOMMENDATION.billing,
    insights: Array.isArray(recommendation.insights) ? recommendation.insights : DEFAULT_AI_RECOMMENDATION.insights,
    trafficStatus: recommendation.trafficStatus || DEFAULT_AI_RECOMMENDATION.trafficStatus
  };
}