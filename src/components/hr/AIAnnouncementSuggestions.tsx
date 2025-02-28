
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, Lightbulb, Megaphone, RotateCw, ThumbsUp, AlertTriangle, UserCheck } from "lucide-react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AnnouncementForm } from "./AnnouncementForm";
import { AIRecommendation } from "@/types/ai";

export const AIAnnouncementSuggestions = () => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([
    {
      id: "1",
      type: "suggestion",
      prediction: "Several employees have missed logging safety compliance training. Consider sending a reminder about the upcoming deadline.",
      confidence_score: 0.92,
      metadata: {
        due_date: "2023-07-15",
        affected_employees: 8,
        priority: "high"
      },
      created_at: new Date().toISOString(),
      recommendation: "Send a targeted announcement to remind employees about safety compliance training deadline on July 15.",
      suggestions: [
        "With the July 15th safety compliance deadline approaching, please ensure your training logs are up to date.",
        "REMINDER: Safety compliance training documentation must be completed by July 15th to maintain certification."
      ]
    },
    {
      id: "2",
      type: "insight",
      prediction: "Upcoming system maintenance might affect crew availability reporting.",
      confidence_score: 0.85,
      metadata: {
        maintenance_window: "2023-07-10 02:00-06:00",
        affected_systems: ["Crew Management", "Dispatch Console"],
        priority: "medium"
      },
      created_at: new Date().toISOString(),
      recommendation: "Inform all staff about system maintenance and alternative procedures during the downtime.",
      suggestions: [
        "Notice: System maintenance scheduled for July 10th (2AM-6AM). Crew availability and dispatch systems will be offline.",
        "Important: Planned system maintenance on July 10th. Please use alternative reporting procedures as outlined in the operations manual."
      ]
    }
  ]);
  
  const [selectedRecommendation, setSelectedRecommendation] = useState<AIRecommendation | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
  };

  const handleUseRecommendation = (recommendation: AIRecommendation) => {
    setSelectedRecommendation(recommendation);
    setShowForm(true);
  };

  if (recommendations.length === 0 && !loading) {
    return null;
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-purple-600" />
            <h2 className="font-medium">AI-Suggested Announcements</h2>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8"
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? <LoadingSpinner size={16} className="mr-2" /> : <RotateCw className="h-4 w-4 mr-2" />}
            Refresh Insights
          </Button>
        </div>
        
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="text-center">
              <LoadingSpinner size={32} className="mx-auto mb-4" />
              <p className="text-gray-500">Analyzing organization data...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {recommendations.map((recommendation) => (
              <Card key={recommendation.id} className="overflow-hidden border-l-4" style={{
                borderLeftColor: recommendation.metadata.priority === 'high' ? '#ef4444' : 
                  recommendation.metadata.priority === 'medium' ? '#f59e0b' : '#22c55e'
              }}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge variant={recommendation.type === 'suggestion' ? 'default' : 'secondary'} className="mb-1">
                      {recommendation.type === 'suggestion' ? (
                        <Lightbulb className="h-3 w-3 mr-1" />
                      ) : (
                        <AlertTriangle className="h-3 w-3 mr-1" />
                      )}
                      {recommendation.type.charAt(0).toUpperCase() + recommendation.type.slice(1)}
                    </Badge>
                    <Badge variant="outline" className="text-xs font-normal">
                      {Math.round(recommendation.confidence_score * 100)}% confidence
                    </Badge>
                  </div>
                  <CardTitle className="text-base">{recommendation.recommendation}</CardTitle>
                  <CardDescription>{recommendation.prediction}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="font-medium text-xs text-gray-500 mb-2">SUGGESTED CONTENT:</div>
                    <p className="italic text-gray-700">{recommendation.suggestions?.[0]}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <div className="text-xs text-gray-500 flex items-center">
                    {recommendation.metadata.priority === 'high' ? (
                      <Badge variant="destructive" className="text-xs mr-2">High Priority</Badge>
                    ) : recommendation.metadata.priority === 'medium' ? (
                      <Badge variant="secondary" className="text-xs mr-2">Medium Priority</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs mr-2">Low Priority</Badge>
                    )}
                    
                    {recommendation.metadata.affected_employees && (
                      <span className="flex items-center">
                        <UserCheck className="h-3 w-3 mr-1" />
                        {recommendation.metadata.affected_employees} affected
                      </span>
                    )}
                  </div>
                  <Button size="sm" onClick={() => handleUseRecommendation(recommendation)}>
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Use This
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Announcement from AI Suggestion</DialogTitle>
            <DialogDescription>
              Review and edit the suggested announcement before publishing
            </DialogDescription>
          </DialogHeader>
          <AnnouncementForm 
            announcement={{
              id: "",
              title: selectedRecommendation?.recommendation?.split('.')[0] || "New Announcement",
              content: selectedRecommendation?.suggestions?.[0] || "",
              author: "AI-Suggested",
              createdAt: new Date().toISOString(),
              expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              status: "draft",
              targetGroups: ["All Staff"],
              requiresSignature: false,
              seenBy: 0,
              totalTargetUsers: 100
            }}
            onSuccess={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
