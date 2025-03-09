
import { Brain, Zap, TrendingUp, AlertTriangle, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AIInsightsPanel } from "@/components/dispatch/ai/AIInsightsPanel";
import { optimizeRoute, RouteRecommendation } from "@/utils/aiDispatchOptimization";
import { analyzeDispatchEfficiency, DispatchAnalytics } from "@/utils/aiDispatchAnalytics";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface AIDispatchInsightsProps {
  origin?: { lat: number; lng: number };
  destination?: { lat: number; lng: number };
  departureTime?: Date;
  serviceType?: string;
  priority?: string;
  elapsedTime?: string;
}

export function AIDispatchInsights({
  origin = { lat: 33.7488, lng: -84.3877 }, // Default to Atlanta
  destination = { lat: 33.9526, lng: -84.5499 }, // Default to Marietta
  departureTime = new Date(),
  serviceType = "BLS",
  priority = "medium",
  elapsedTime = "0"
}: AIDispatchInsightsProps) {
  const [routeRecommendation, setRouteRecommendation] = useState<RouteRecommendation | null>(null);
  const [analytics, setAnalytics] = useState<DispatchAnalytics | null>(null);
  const [activeTab, setActiveTab] = useState("route");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    generateInsights();
  }, [origin, destination]);

  const generateInsights = () => {
    setIsGenerating(true);
    try {
      // Get route optimization insights
      const routeRecommendation = optimizeRoute(origin, destination, departureTime);
      setRouteRecommendation(routeRecommendation);
      
      // Get efficiency analytics
      const analytics = analyzeDispatchEfficiency(origin, destination, undefined, elapsedTime);
      setAnalytics(analytics);
      
      toast.success("AI insights generated successfully");
    } catch (error) {
      console.error("Error generating AI insights:", error);
      toast.error("Failed to generate AI insights");
    } finally {
      setIsGenerating(false);
    }
  };

  const aiInsights = [
    {
      type: 'optimization' as const,
      message: routeRecommendation ? 
        `Optimal route found with ${routeRecommendation.trafficPrediction.predictedDelayMinutes} min estimated delay.` : 
        "Route optimization available.",
      confidence: 0.93,
      impact: 'high'
    },
    {
      type: 'warning' as const,
      message: routeRecommendation?.trafficPrediction.congestionLevel === 'high' ? 
        "High traffic congestion detected on primary route." : 
        "Weather conditions may affect transport speed.",
      confidence: 0.87,
      impact: 'medium'
    },
    {
      type: 'prediction' as const,
      message: analytics ? 
        `Dispatch efficiency predicted at ${analytics.efficiency}%.` : 
        "Dispatch efficiency prediction available.",
      confidence: 0.91,
      impact: 'high'
    }
  ];

  return (
    <Card className="p-4 shadow-lg border border-medical-secondary/10 overflow-hidden bg-gradient-to-br from-white to-blue-50/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-medical-primary" />
          <h3 className="font-semibold text-lg text-medical-primary">AI Dispatch Intelligence</h3>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={generateInsights}
          disabled={isGenerating}
          className="bg-white hover:bg-blue-50 text-medical-primary border-medical-secondary/30"
        >
          {isGenerating ? "Analyzing..." : "Refresh Analysis"}
        </Button>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-4 bg-gray-100">
          <TabsTrigger value="route" className="flex-1">
            <TrendingUp className="h-4 w-4 mr-2" />
            Route Optimization
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex-1">
            <Zap className="h-4 w-4 mr-2" />
            Performance Analytics
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex-1">
            <Brain className="h-4 w-4 mr-2" />
            AI Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="route" className="space-y-4">
          {routeRecommendation ? (
            <>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Traffic Condition</span>
                  <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                    routeRecommendation.trafficPrediction.congestionLevel === 'high' 
                      ? 'bg-red-100 text-red-700' 
                      : routeRecommendation.trafficPrediction.congestionLevel === 'medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {routeRecommendation.trafficPrediction.congestionLevel.charAt(0).toUpperCase() + 
                     routeRecommendation.trafficPrediction.congestionLevel.slice(1)} Congestion
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Estimated Delay</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {routeRecommendation.trafficPrediction.predictedDelayMinutes} minutes
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Route Efficiency</span>
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={100 - (routeRecommendation.trafficPrediction.predictedDelayMinutes * 3)} 
                      className="w-24 h-2" 
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {100 - (routeRecommendation.trafficPrediction.predictedDelayMinutes * 3)}%
                    </span>
                  </div>
                </div>
              </div>

              {routeRecommendation.alternativeRoutes.length > 0 && (
                <div className="mt-4 bg-blue-50 p-3 rounded-md">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-700 font-medium">Alternative Route Available</p>
                      <p className="text-xs text-blue-600 mt-1">
                        {Math.round(routeRecommendation.alternativeRoutes[0].distance / 1.1)} km, 
                        {Math.round(routeRecommendation.alternativeRoutes[0].duration / 1.2)} min estimated time
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-40">
              <p className="text-gray-500">Generating route optimization...</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {analytics ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Dispatch Efficiency</span>
                  <div className="flex items-center gap-2">
                    <Progress value={analytics.efficiency} className="w-24 h-2" />
                    <span className="text-sm font-medium text-gray-700">{analytics.efficiency}%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Risk Level</span>
                  <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                    analytics.riskLevel === 'high' 
                      ? 'bg-red-100 text-red-700' 
                      : analytics.riskLevel === 'medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {analytics.riskLevel.charAt(0).toUpperCase() + analytics.riskLevel.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="bg-gray-50 p-2 rounded-md text-center">
                    <p className="text-xs text-gray-500">Response Time</p>
                    <p className="text-sm font-medium text-gray-700">
                      {analytics.performanceMetrics.responseTime} min
                    </p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-md text-center">
                    <p className="text-xs text-gray-500">Patient Satisfaction</p>
                    <p className="text-sm font-medium text-gray-700">
                      {analytics.performanceMetrics.patientSatisfaction}%
                    </p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-md text-center">
                    <p className="text-xs text-gray-500">Route Efficiency</p>
                    <p className="text-sm font-medium text-gray-700">
                      {analytics.performanceMetrics.routeEfficiency}%
                    </p>
                  </div>
                </div>
              </div>

              {analytics.suggestedActions.length > 0 && (
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm text-blue-700 font-medium mb-2">Suggested Actions</p>
                  <ul className="space-y-1">
                    {analytics.suggestedActions.map((action, index) => (
                      <li key={index} className="text-xs text-blue-600 flex items-start gap-2">
                        <span className="inline-block h-4 w-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center mt-0.5">
                          {index + 1}
                        </span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40">
              <p className="text-gray-500">Generating analytics...</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="insights">
          <AIInsightsPanel insights={aiInsights} className="mt-0" />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
