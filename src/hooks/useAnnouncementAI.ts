
import { useState } from "react";
import { AIRecommendation } from "@/types/ai";

interface AIAnnouncementSuggestion {
  title?: string;
  content?: string;
  priority?: string;
  expiryDate?: Date;
}

export function useAnnouncementAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<AIAnnouncementSuggestion | null>(null);

  // This would normally call an API endpoint to get AI suggestions
  const generateAnnouncement = async (prompt: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock AI response
      const mockSuggestions: AIAnnouncementSuggestion = {
        title: prompt.length > 10 
          ? `Announcement: ${prompt.substring(0, 20)}...` 
          : "Important Team Update",
        content: `Based on your request, here's a suggested announcement: \n\n${prompt}\n\nPlease review and edit as needed before sending to the team.`,
        priority: prompt.includes("urgent") ? "urgent" : "medium",
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      };
      
      setSuggestion(mockSuggestions);
    } catch (err) {
      setError("Failed to generate AI suggestion. Please try again.");
      console.error("AI generation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getRecommendedRecipients = async (announcement: string): Promise<AIRecommendation[]> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock recommendations
      return [
        {
          id: "rec1",
          type: "recipient_suggestion",
          prediction: "Operations Team",
          confidence_score: 0.92,
          metadata: { reason: "Content relevance" },
          created_at: new Date().toISOString(),
          recommendation: "This announcement appears most relevant to the Operations Team."
        },
        {
          id: "rec2",
          type: "recipient_suggestion",
          prediction: "All Staff",
          confidence_score: 0.78,
          metadata: { reason: "General importance" },
          created_at: new Date().toISOString(),
          recommendation: "Consider sharing with all staff due to general importance."
        }
      ];
    } catch (err) {
      setError("Failed to get recipient recommendations.");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateAnnouncement,
    getRecommendedRecipients,
    suggestion,
    isLoading,
    error
  };
}
