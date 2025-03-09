
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, FileUp, AlertCircle } from "lucide-react";
import { useEmployeeDocuments } from "@/hooks/useEmployeeDocuments";

interface AIDocumentRecommendationsProps {
  employeeId: string;
  onUpload: () => void;
}

export function AIDocumentRecommendations({ employeeId, onUpload }: AIDocumentRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getAiDocumentRecommendations } = useEmployeeDocuments(employeeId);

  useEffect(() => {
    if (employeeId) {
      loadRecommendations();
    }
  }, [employeeId]);

  const loadRecommendations = async () => {
    try {
      setIsLoading(true);
      const data = await getAiDocumentRecommendations();
      setRecommendations(data || []);
    } catch (error) {
      console.error("Error loading document recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case 'medium':
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      default:
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full border-dashed border-blue-200 bg-blue-50/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-[200px]">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card className="w-full border-dashed border-blue-200 bg-blue-50/30">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-lg font-medium">AI Document Recommendations</CardTitle>
        </div>
        <CardDescription>
          Based on the employee profile, the following documents are recommended
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="flex items-start justify-between gap-4 p-3 rounded-lg border bg-white">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{rec.type}</h4>
                  <Badge className={getPriorityColor(rec.priority)}>
                    {rec.priority} priority
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{rec.reason}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 whitespace-nowrap"
                onClick={onUpload}
              >
                <FileUp className="h-4 w-4" />
                <span>Upload</span>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
