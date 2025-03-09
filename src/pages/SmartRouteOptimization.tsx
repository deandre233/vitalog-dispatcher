
import { useEffect, useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Route, MapPin, BarChart3, Brain, Car, Clock, 
  Calendar, AlertTriangle, CheckCircle, Zap
} from "lucide-react";
import { toast } from "sonner";
import { predictTraffic, optimizeRoute } from "@/utils/aiDispatchOptimization";
import { analyzeDispatchEfficiency } from "@/utils/aiDispatchAnalytics";
import { AIInsightsPanel } from "@/components/dispatch/ai/AIInsightsPanel";

export function SmartRouteOptimization() {
  const [origin, setOrigin] = useState({ lat: 33.7490, lng: -84.3880 });
  const [destination, setDestination] = useState({ lat: 33.9480, lng: -84.1480 });
  const [departureTime, setDepartureTime] = useState(new Date());
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [optimizedRoute, setOptimizedRoute] = useState<any>(null);
  const [insights, setInsights] = useState<any[]>([]);

  // Mock function to simulate route optimization with AI
  const runOptimization = async () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);
    
    // Progressive loading simulation
    const interval = setInterval(() => {
      setOptimizationProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 200);

    try {
      // Simulate API calls with delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get traffic prediction
      const traffic = predictTraffic(origin, destination, departureTime);
      
      // Generate route optimization
      const route = optimizeRoute(origin, destination, departureTime);
      
      // Get efficiency analysis
      const efficiency = analyzeDispatchEfficiency(origin, destination);
      
      // Generate AI insights
      const generatedInsights = [
        {
          type: "optimization",
          message: `Route optimized to avoid ${traffic.congestionLevel} traffic conditions. Expected time savings: ${Math.round(traffic.predictedDelayMinutes * 0.7)} minutes.`,
          confidence: 0.92
        },
        {
          type: "warning",
          message: traffic.congestionLevel === "high" 
            ? "High traffic detected on primary route. Alternative routes recommended." 
            : "Weather conditions may affect ETA. Consider adding buffer time.",
          confidence: 0.85
        },
        {
          type: "prediction",
          message: `Based on historical patterns, estimated arrival is ${new Date(departureTime.getTime() + route.route.duration * 60000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}.`,
          confidence: 0.89
        }
      ];
      
      setOptimizedRoute(route);
      setInsights(generatedInsights);
      
      toast.success("Route optimization complete", {
        description: "AI has analyzed traffic patterns and suggested optimal routes."
      });
    } catch (error) {
      console.error("Optimization error:", error);
      toast.error("Optimization failed", {
        description: "Unable to complete route optimization. Please try again."
      });
    } finally {
      clearInterval(interval);
      setIsOptimizing(false);
      setOptimizationProgress(100);
    }
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Route className="h-6 w-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Smart Route Optimization</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Input Panel */}
          <Card className="p-6 col-span-1 bg-gradient-to-br from-indigo-950/50 to-purple-950/30 border-purple-800/30 shadow-xl backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4 text-purple-200 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-purple-400" />
              Route Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-gray-300 mb-1 block">Origin</label>
                <Input 
                  placeholder="Enter origin address"
                  className="bg-indigo-950/40 border-indigo-800/30 text-white"
                  value="Atlanta Medical Center" 
                  onChange={() => {}} // This would connect to a geocoding service
                />
              </div>
              
              <div>
                <label className="text-gray-300 mb-1 block">Destination</label>
                <Input 
                  placeholder="Enter destination address" 
                  className="bg-indigo-950/40 border-indigo-800/30 text-white"
                  value="Northside Hospital" 
                  onChange={() => {}} // This would connect to a geocoding service
                />
              </div>
              
              <div>
                <label className="text-gray-300 mb-1 block">Departure Time</label>
                <Input 
                  type="datetime-local" 
                  className="bg-indigo-950/40 border-indigo-800/30 text-white"
                  value={departureTime.toISOString().slice(0, 16)} 
                  onChange={(e) => setDepartureTime(new Date(e.target.value))} 
                />
              </div>
              
              <Button 
                className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                onClick={runOptimization}
                disabled={isOptimizing}
              >
                {isOptimizing ? (
                  <>
                    <Zap className="mr-2 h-4 w-4 animate-pulse" />
                    Optimizing with AI...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Optimize Route
                  </>
                )}
              </Button>
              
              {isOptimizing && (
                <div className="mt-2">
                  <Progress value={optimizationProgress} className="h-2 bg-indigo-950/70" />
                  <p className="text-xs text-gray-400 mt-1">
                    Analyzing traffic patterns and calculating optimal routes...
                  </p>
                </div>
              )}
            </div>
          </Card>
          
          {/* Results & Map Panel */}
          <Card className="p-6 col-span-2 bg-gradient-to-br from-indigo-950/50 to-purple-950/30 border-purple-800/30 shadow-xl backdrop-blur-sm">
            <Tabs defaultValue="map">
              <TabsList className="mb-4 bg-indigo-950/70">
                <TabsTrigger value="map" className="data-[state=active]:bg-purple-700 data-[state=active]:text-white">
                  Map View
                </TabsTrigger>
                <TabsTrigger value="insights" className="data-[state=active]:bg-purple-700 data-[state=active]:text-white">
                  AI Insights
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-700 data-[state=active]:text-white">
                  Analytics
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="map" className="mt-0">
                <div className="aspect-video bg-indigo-950/30 border border-indigo-800/30 rounded-md flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    {optimizedRoute ? (
                      <div className="space-y-4">
                        <div className="bg-indigo-950/50 p-4 rounded-md">
                          <h4 className="text-lg font-semibold text-white mb-2 flex items-center justify-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-400" />
                            Optimized Route Found
                          </h4>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Distance:</span>
                              <span className="text-white font-medium">{optimizedRoute.route.distance.toFixed(1)} km</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Duration:</span>
                              <span className="text-white font-medium">{optimizedRoute.route.duration.toFixed(0)} mins</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Traffic:</span>
                              <span className={`font-medium ${
                                optimizedRoute.trafficPrediction.congestionLevel === "low" 
                                  ? "text-green-400" 
                                  : optimizedRoute.trafficPrediction.congestionLevel === "medium"
                                    ? "text-yellow-400"
                                    : "text-red-400"
                              }`}>
                                {optimizedRoute.trafficPrediction.congestionLevel.toUpperCase()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">ETA:</span>
                              <span className="text-white font-medium">
                                {new Date(departureTime.getTime() + optimizedRoute.route.duration * 60000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {optimizedRoute.alternativeRoutes.length > 0 && (
                          <div>
                            <h5 className="text-white text-sm font-medium mb-2">Alternative Routes:</h5>
                            {optimizedRoute.alternativeRoutes.map((alt: any, idx: number) => (
                              <div key={idx} className="text-xs text-gray-400">
                                Route {idx + 1}: {alt.duration.toFixed(0)} mins ({alt.distance.toFixed(1)} km)
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <Car className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p>Enter route details and click "Optimize Route" to view the map</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {optimizedRoute && <AIInsightsPanel insights={insights} className="mt-4" />}
              </TabsContent>
              
              <TabsContent value="insights" className="mt-0 space-y-4">
                {optimizedRoute ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="p-4 bg-indigo-950/30 border-indigo-800/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-purple-400" />
                          <h4 className="font-medium text-white">Time Analysis</h4>
                        </div>
                        <p className="text-sm text-gray-400">
                          Most efficient time window for travel is between 10:00 AM and 2:00 PM based on historical traffic patterns.
                        </p>
                      </Card>
                      
                      <Card className="p-4 bg-indigo-950/30 border-indigo-800/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4 text-purple-400" />
                          <h4 className="font-medium text-white">Day Planning</h4>
                        </div>
                        <p className="text-sm text-gray-400">
                          Tuesday and Thursday typically have 23% less congestion on this route compared to Monday and Friday.
                        </p>
                      </Card>
                      
                      <Card className="p-4 bg-indigo-950/30 border-indigo-800/30">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-400" />
                          <h4 className="font-medium text-white">Risk Factors</h4>
                        </div>
                        <p className="text-sm text-gray-400">
                          Construction on Main St may cause delays until June 15th. Consider alternative routes.
                        </p>
                      </Card>
                    </div>
                    
                    <Card className="p-4 bg-indigo-950/30 border-indigo-800/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="h-5 w-5 text-purple-400" />
                        <h4 className="font-medium text-white">AI Recommendation</h4>
                      </div>
                      <p className="text-sm text-gray-400">
                        Based on the patient's condition and current traffic patterns, we recommend dispatching an ALS unit at least 15 minutes before the scheduled departure time. This route has a 92% efficiency score with minimal risk factors.
                      </p>
                    </Card>
                  </>
                ) : (
                  <div className="text-center py-10 text-gray-400">
                    <Brain className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>Run the route optimization to view AI insights</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="analytics" className="mt-0">
                {optimizedRoute ? (
                  <div className="space-y-4">
                    <div className="aspect-video bg-indigo-950/30 border border-indigo-800/30 rounded-md flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <BarChart3 className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p>Historical traffic patterns visualization would render here</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="p-4 bg-indigo-950/30 border-indigo-800/30">
                        <h5 className="font-medium text-white mb-2">Route Performance</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">Efficiency Score:</span>
                            <span className="text-green-400 font-medium">92%</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">Historical Accuracy:</span>
                            <span className="text-blue-400 font-medium">89%</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">Confidence Level:</span>
                            <span className="text-purple-400 font-medium">High</span>
                          </div>
                        </div>
                      </Card>
                      
                      <Card className="p-4 bg-indigo-950/30 border-indigo-800/30">
                        <h5 className="font-medium text-white mb-2">Optimization Results</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">Time Saved:</span>
                            <span className="text-green-400 font-medium">12 minutes</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">Fuel Efficiency:</span>
                            <span className="text-blue-400 font-medium">+18%</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">Risk Reduction:</span>
                            <span className="text-purple-400 font-medium">73%</span>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-400">
                    <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>Run the route optimization to view analytics</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}

export default SmartRouteOptimization;
