
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Award, Plus, Brain } from "lucide-react";
import { useEmployeeAchievements } from "@/hooks/useEmployeeAchievements";
import { AchievementCategory } from "@/components/hr/tabs/achievements/types/achievementTypes";
import { toast } from "sonner";

interface AIAchievementIdeasProps {
  employeeId: string;
}

export function AIAchievementIdeas({ employeeId }: AIAchievementIdeasProps) {
  const [activeCategory, setActiveCategory] = useState<AchievementCategory | 'all'>('all');
  const [ideas, setIdeas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getAchievementIdeas, createAchievementFromIdea, isProcessing } = useEmployeeAchievements(employeeId);

  const loadIdeas = async (category: AchievementCategory | 'all') => {
    try {
      setIsLoading(true);
      const data = await getAchievementIdeas(category === 'all' ? undefined : category);
      setIdeas(data || []);
    } catch (error) {
      console.error("Error loading achievement ideas:", error);
      toast.error("Failed to load achievement ideas");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category as AchievementCategory | 'all');
    loadIdeas(category as AchievementCategory | 'all');
  };

  const handleCreateAchievement = async (idea: any) => {
    try {
      await createAchievementFromIdea(idea, activeCategory as AchievementCategory);
      toast.success(`Achievement "${idea.name}" created successfully!`);
    } catch (error) {
      console.error("Error creating achievement:", error);
      toast.error("Failed to create achievement");
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'hard':
        return "bg-red-100 text-red-800";
      case 'medium':
        return "bg-yellow-100 text-yellow-800";
      case 'easy':
        return "bg-green-100 text-green-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <Card className="w-full border-blue-200 bg-blue-50/20">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-lg font-medium">AI Achievement Ideas</CardTitle>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => loadIdeas(activeCategory)}
            disabled={isLoading}
          >
            <Sparkles className="h-4 w-4" />
            <span>Generate Ideas</span>
          </Button>
        </div>
        <CardDescription>
          AI-powered achievement suggestions based on employee profile
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeCategory} onValueChange={handleCategoryChange}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="clinical">Clinical</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="leadership">Leadership</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeCategory}>
            {isLoading ? (
              <div className="flex items-center justify-center h-[200px]">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
              </div>
            ) : ideas.length > 0 ? (
              <div className="space-y-4">
                {ideas.map((idea, index) => (
                  <div key={index} className="flex items-start justify-between gap-4 p-4 rounded-lg border bg-white">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-amber-500" />
                        <h4 className="font-medium">{idea.name}</h4>
                        <Badge className={getDifficultyColor(idea.difficulty)}>
                          {idea.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{idea.description}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-2 whitespace-nowrap"
                      onClick={() => handleCreateAchievement(idea)}
                      disabled={isProcessing}
                    >
                      <Plus className="h-4 w-4" />
                      <span>Create</span>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-gray-50">
                <Sparkles className="h-12 w-12 text-blue-400 mb-3" />
                <h3 className="text-lg font-medium mb-2">Generate Achievement Ideas</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Click the "Generate Ideas" button to get AI-powered achievement suggestions
                </p>
                <Button 
                  onClick={() => loadIdeas(activeCategory)}
                  disabled={isLoading}
                >
                  Generate Ideas
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
