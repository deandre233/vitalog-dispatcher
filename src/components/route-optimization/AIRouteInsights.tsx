
import { Card } from "@/components/ui/card";
import { useRouteOptimization } from "./RouteOptimizationContext";
import { Loader2, Lightbulb, Clock, Map, AlertTriangle, Info, Route, Car } from "lucide-react";
import { analyzeTraffic } from "@/utils/googleMapsService";
import { useEffect, useState } from "react";

interface TrafficAnalysis {
  severity: 'low' | 'medium' | 'high';
  delay: number;
  alternateRoutes: boolean;
}

export function AIRouteInsights() {
  const { origin, destination, optimizedRoute, isLoading } = useRouteOptimization();
  const [trafficAnalysis, setTrafficAnalysis] = useState<TrafficAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    async function analyzeRouteTraffic() {
      if (!origin || !destination || !optimizedRoute) return;
      
      try {
        setIsAnalyzing(true);
        const analysis = await analyzeTraffic(origin, destination);
        setTrafficAnalysis(analysis);
      } catch (error) {
        console.error("Failed to analyze traffic:", error);
      } finally {
        setIsAnalyzing(false);
      }
    }
    
    analyzeRouteTraffic();
  }, [origin, destination, optimizedRoute]);

  if (isLoading || isAnalyzing) {
    return (
      <Card className="p-6 shadow-sm bg-white">
        <div className="flex flex-col items-center justify-center min-h-[500px]">
          <Loader2 className="h-12 w-12 text-medical-primary animate-spin mb-4" />
          <h3 className="text-xl font-medium">Analyzing Route</h3>
          <p className="text-gray-500 text-center mt-2">
            Our AI is analyzing traffic patterns, distance, and optimal routing conditions
          </p>
        </div>
      </Card>
    );
  }

  if (!optimizedRoute) {
    return (
      <Card className="p-6 shadow-sm bg-white">
        <div className="flex flex-col items-center justify-center min-h-[500px]">
          <Lightbulb className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium">No Route Selected</h3>
          <p className="text-gray-500 text-center mt-2">
            Enter origin and destination points and click "Optimize Route" to view AI-powered insights
          </p>
        </div>
      </Card>
    );
  }

  const leg = optimizedRoute.route.routes[0].legs[0];
  const distance = leg.distance?.text || 'Unknown';
  const duration = leg.duration?.text || 'Unknown';
  const trafficDuration = leg.duration_in_traffic?.text || duration;
  
  const trafficSeverityColor = 
    trafficAnalysis?.severity === 'high' ? 'text-red-500' :
    trafficAnalysis?.severity === 'medium' ? 'text-amber-500' : 
    'text-green-500';

  return (
    <Card className="shadow-sm bg-white">
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-medical-accent" />
          AI Route Analysis
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="rounded-lg bg-gray-50 p-4">
              <h4 className="text-lg font-medium mb-3 flex items-center gap-2">
                <Map className="h-5 w-5 text-medical-primary" />
                Route Overview
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Distance:</span>
                  <span className="font-medium">{distance}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Normal Travel Time:</span>
                  <span className="font-medium">{duration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Time with Traffic:</span>
                  <span className="font-medium">{trafficDuration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Turns:</span>
                  <span className="font-medium">{optimizedRoute.route.routes[0].legs[0].steps.length}</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <h4 className="text-lg font-medium mb-3 flex items-center gap-2">
                <Clock className="h-5 w-5 text-medical-primary" />
                Time Optimization
              </h4>
              <p className="text-gray-700 mb-3">
                Based on current conditions, this route is the most efficient option at this time.
              </p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Car className={`h-4 w-4 ${trafficSeverityColor}`} />
                  <span className="text-sm">
                    Traffic conditions: <span className={`font-medium ${trafficSeverityColor}`}>
                      {trafficAnalysis?.severity || 'Normal'}
                    </span>
                  </span>
                </div>
                {trafficAnalysis?.delay ? (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <span className="text-sm">
                      Expected delay: <span className="font-medium">{trafficAnalysis.delay} minutes</span>
                    </span>
                  </div>
                ) : null}
                {trafficAnalysis?.alternateRoutes && (
                  <div className="flex items-center gap-2">
                    <Route className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">
                      Alternative routes available
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg bg-gray-50 p-4">
              <h4 className="text-lg font-medium mb-3 flex items-center gap-2">
                <Info className="h-5 w-5 text-medical-primary" />
                Service Recommendations
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-medical-accent shrink-0 mt-1" />
                  <span className="text-sm">
                    Plan for {trafficDuration} total travel time with current traffic conditions.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-medical-accent shrink-0 mt-1" />
                  <span className="text-sm">
                    Ensure adequate fuel for a total journey of {distance}.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-medical-accent shrink-0 mt-1" />
                  <span className="text-sm">
                    Verify patient stability for a transport of this duration.
                  </span>
                </li>
              </ul>
            </div>

            {(trafficAnalysis?.severity === 'medium' || trafficAnalysis?.severity === 'high') && (
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                <h4 className="text-lg font-medium mb-3 flex items-center gap-2 text-amber-700">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Traffic Advisory
                </h4>
                <p className="text-amber-700 text-sm mb-2">
                  {trafficAnalysis.severity === 'high' 
                    ? 'Heavy traffic detected on this route. Consider the following:' 
                    : 'Moderate traffic may impact travel time. Consider these options:'}
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-amber-500 shrink-0 mt-1" />
                    <span className="text-sm text-amber-700">
                      {trafficAnalysis.severity === 'high'
                        ? 'Inform dispatch about significant traffic delays'
                        : 'Notify dispatch about potential minor delays'}
                    </span>
                  </li>
                  {trafficAnalysis.alternateRoutes && (
                    <li className="flex items-start gap-2">
                      <Route className="h-4 w-4 text-amber-500 shrink-0 mt-1" />
                      <span className="text-sm text-amber-700">
                        Consider an alternative route if conditions worsen
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
