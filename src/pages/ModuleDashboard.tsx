
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageLayout } from "@/components/layout/PageLayout";
import { Brain, Calendar, Clock, LayoutDashboard, BarChart4, UserPlus, Alert, TrendingUp } from "lucide-react";
import { MODULES } from "@/config/modules";
import { AIDashboardData, AIPrediction } from "@/types/ai-analytics";
import { toast } from "sonner";

export default function ModuleDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dispatch");
  const [aiData, setAiData] = useState<AIDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAIData = async () => {
      try {
        setIsLoading(true);
        // Mocked AI data - in a real app, this would come from an API call
        const mockData: AIDashboardData = {
          predictions: [
            {
              id: "1",
              type: "transport",
              confidence: 0.89,
              prediction: "Transport demand will increase by 15% next week",
              recommendation: "Consider scheduling additional crews for peak hours",
              createdAt: new Date().toISOString(),
              metadata: { peakHours: ["08:00-10:00", "15:00-17:00"] }
            },
            {
              id: "2",
              type: "billing",
              confidence: 0.92,
              prediction: "3 claims are at risk of denial",
              recommendation: "Review documentation for completeness before submission",
              createdAt: new Date().toISOString(),
              metadata: { claimIds: ["CLM-001", "CLM-042", "CLM-078"] }
            },
            {
              id: "3",
              type: "scheduling",
              confidence: 0.86,
              prediction: "Current schedule has 2 coverage gaps next week",
              recommendation: "Adjust shift distributions to ensure coverage",
              createdAt: new Date().toISOString(),
              metadata: { gaps: ["Tuesday 14:00-16:00", "Friday 22:00-02:00"] }
            }
          ],
          metrics: [
            {
              id: "m1",
              name: "Dispatch Efficiency",
              value: 87,
              previousValue: 82,
              trend: "up",
              percentageChange: 6.1,
              description: "Measures overall efficiency of transport operations"
            },
            {
              id: "m2",
              name: "Claim Acceptance Rate",
              value: 92,
              previousValue: 94,
              trend: "down",
              percentageChange: 2.1,
              description: "Percentage of submitted claims approved on first submission"
            },
            {
              id: "m3",
              name: "Resource Utilization",
              value: 78,
              previousValue: 72,
              trend: "up",
              percentageChange: 8.3,
              description: "Efficiency of resource allocation and usage"
            }
          ],
          insights: [
            "Traffic patterns suggest rerouting transports through northern routes between 4-6 PM",
            "Certification renewal notifications should be sent to 5 crew members this week",
            "Billing claims processed on Tuesdays have 8% higher approval rate than other days"
          ]
        };
        
        setAiData(mockData);
      } catch (error) {
        console.error("Error fetching AI data:", error);
        toast.error("Failed to load AI analytics data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAIData();
  }, []);

  const renderPredictionCard = (prediction: AIPrediction) => (
    <Card key={prediction.id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md flex items-center">
            <Brain className="mr-2 h-4 w-4 text-purple-500" />
            {prediction.type.charAt(0).toUpperCase() + prediction.type.slice(1)} Prediction
          </CardTitle>
          <Badge variant="outline" className="bg-purple-50">
            {Math.round(prediction.confidence * 100)}% confidence
          </Badge>
        </div>
        <CardDescription>{prediction.prediction}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm font-medium">Recommendation:</div>
        <p className="text-sm text-muted-foreground">{prediction.recommendation}</p>
      </CardContent>
    </Card>
  );

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default:
        return <TrendingUp className="h-4 w-4 text-gray-500 rotate-90" />;
    }
  };

  const activeModule = MODULES.find(module => module.id === activeTab);

  return (
    <PageLayout>
      <div className="container p-4">
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <LayoutDashboard className="mr-2 h-7 w-7 text-primary" />
          Operations Command Center
        </h1>
        
        <Tabs defaultValue="dispatch" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid grid-cols-4 w-full">
            {MODULES.map(module => (
              <TabsTrigger key={module.id} value={module.id} className="gap-1">
                <span className="hidden sm:inline">{module.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {MODULES.map(module => (
            <TabsContent key={module.id} value={module.id} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Main Content - Features Cards */}
                <div className="md:col-span-8 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{module.title}</CardTitle>
                      <CardDescription>{module.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {module.features.map((feature) => (
                          <Card 
                            key={feature.id} 
                            className="cursor-pointer hover:shadow-md transition-shadow hover:border-primary/50"
                            onClick={() => navigate(feature.route)}
                          >
                            <CardHeader className="pb-2">
                              <CardTitle className="text-md flex items-center">
                                {/* Dynamically render icon based on feature.icon */}
                                {feature.icon === 'activity' && <Alert className="mr-2 h-4 w-4" />}
                                {feature.icon === 'users' && <UserPlus className="mr-2 h-4 w-4" />}
                                {feature.icon === 'layout-dashboard' && <LayoutDashboard className="mr-2 h-4 w-4" />}
                                {feature.icon === 'calendar' && <Calendar className="mr-2 h-4 w-4" />}
                                {feature.icon === 'bar-chart' && <BarChart4 className="mr-2 h-4 w-4" />}
                                {feature.title}
                                {feature.badge && (
                                  <Badge variant={feature.badge.variant} className="ml-2">
                                    {feature.badge.text}
                                  </Badge>
                                )}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </CardContent>
                            <CardFooter className="pt-0">
                              <Button variant="ghost" size="sm" className="ml-auto">
                                Open
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Metrics Cards */}
                  {module.aiEnabled && aiData && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <BarChart4 className="mr-2 h-5 w-5 text-primary" />
                          Performance Metrics
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {aiData.metrics.map(metric => (
                            <Card key={metric.id}>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium flex items-center justify-between">
                                  {metric.name}
                                  <div className="flex items-center">
                                    {getTrendIcon(metric.trend)}
                                    {metric.percentageChange && (
                                      <span className={`text-xs ml-1 ${
                                        metric.trend === 'up' ? 'text-green-500' : 
                                        metric.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                                      }`}>
                                        {metric.percentageChange}%
                                      </span>
                                    )}
                                  </div>
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">{metric.value}%</div>
                                <p className="text-xs text-muted-foreground">{metric.description}</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                {/* AI Predictions & Insights Sidebar */}
                {module.aiEnabled && aiData && (
                  <div className="md:col-span-4 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Brain className="mr-2 h-5 w-5 text-purple-500" />
                          AI Predictions
                        </CardTitle>
                        <CardDescription>
                          Machine learning predictions and recommendations
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {aiData.predictions
                          .filter(p => p.type === (activeTab === 'hr' ? 'scheduling' : activeTab) || activeTab === 'supervision')
                          .map(renderPredictionCard)}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Clock className="mr-2 h-5 w-5 text-blue-500" />
                          Real-time Insights
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {aiData.insights.map((insight, index) => (
                            <li key={index} className="text-sm p-2 bg-secondary/20 rounded-md">
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">
                          View All Insights
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </PageLayout>
  );
}
