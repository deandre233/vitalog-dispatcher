
import { Card } from "@/components/ui/card";
import { useRouteOptimization } from "./RouteOptimizationContext";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Clock, 
  TrendingUp, 
  Car, 
  AlertTriangle, 
  Calendar, 
  MapPin, 
  BarChart, 
  CloudRain, 
  Sun,
  Cloud
} from "lucide-react";
import { format } from "date-fns";

export function AIRouteInsights() {
  const { optimizedRoute, departureTime, serviceType, isLoading, error } = useRouteOptimization();

  if (isLoading) {
    return (
      <Card className="p-6 shadow-sm">
        <div className="flex items-center justify-center min-h-[600px]">
          <div className="text-center">
            <Brain className="h-12 w-12 text-medical-accent/50 mx-auto mb-4 animate-pulse" />
            <h3 className="text-xl font-semibold mb-2">AI is analyzing your route...</h3>
            <p className="text-gray-500 max-w-md">
              Our AI is calculating the optimal route based on traffic patterns, weather conditions, and historical data.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 shadow-sm">
        <Alert variant="destructive">
          <AlertTriangle className="h-5 w-5" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </Card>
    );
  }

  if (!optimizedRoute) {
    return (
      <Card className="p-6 shadow-sm">
        <div className="flex items-center justify-center min-h-[600px]">
          <div className="text-center">
            <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Route Analysis Available</h3>
            <p className="text-gray-500 max-w-md">
              Enter your route details and click "Optimize Route" to see AI-powered insights and recommendations.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  // Extract data from the optimized route
  const { route, trafficPrediction, recommendations } = optimizedRoute;

  // Helper function to get congestion level color
  const getCongestionColor = (level) => {
    switch (level) {
      case "high": return "text-red-500";
      case "medium": return "text-yellow-500";
      case "low": return "text-green-500";
      default: return "text-gray-500";
    }
  };

  // Simple function to return a weather icon (mock for demonstration)
  const getWeatherIcon = () => {
    const weatherType = Math.random() > 0.7 ? "rain" : Math.random() > 0.5 ? "cloudy" : "clear";
    
    switch(weatherType) {
      case "rain": return <CloudRain className="h-5 w-5 text-blue-500" />;
      case "cloudy": return <Cloud className="h-5 w-5 text-gray-500" />;
      default: return <Sun className="h-5 w-5 text-yellow-500" />;
    }
  };

  const efficiencyScore = 100 - (trafficPrediction.predictedDelayMinutes / route.duration) * 100;

  return (
    <Card className="p-6 shadow-sm">
      <div className="space-y-8">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-medical-accent" />
          <h3 className="text-xl font-medium">AI Route Analysis</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Route Overview */}
          <Card className="p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-5 w-5 text-medical-primary" />
              <h4 className="font-medium">Route Overview</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Distance:</span>
                <span className="font-medium">{route.distance.toFixed(1)} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Est. Duration:</span>
                <span className="font-medium">{Math.round(route.duration)} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Departure:</span>
                <span className="font-medium">{format(departureTime, "h:mm a")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Service Type:</span>
                <Badge variant="outline">{serviceType}</Badge>
              </div>
            </div>
          </Card>

          {/* Traffic Analysis */}
          <Card className="p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Car className="h-5 w-5 text-medical-accent" />
              <h4 className="font-medium">Traffic Analysis</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Congestion:</span>
                <Badge variant={trafficPrediction.congestionLevel === "high" ? "destructive" : 
                              trafficPrediction.congestionLevel === "medium" ? "warning" : "success"}>
                  {trafficPrediction.congestionLevel}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Predicted Delay:</span>
                <span className="font-medium">{trafficPrediction.predictedDelayMinutes} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Confidence:</span>
                <span className="font-medium">{(trafficPrediction.confidence * 100).toFixed(0)}%</span>
              </div>
              <div className="pt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Route Efficiency</span>
                  <span>{efficiencyScore.toFixed(0)}%</span>
                </div>
                <Progress value={efficiencyScore} className="h-2" />
              </div>
            </div>
          </Card>

          {/* Weather Impact */}
          <Card className="p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              {getWeatherIcon()}
              <h4 className="font-medium">Environmental Factors</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Weather Impact:</span>
                <Badge variant="outline">Medium</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Road Conditions:</span>
                <span className="font-medium">Good</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Construction:</span>
                <span className="font-medium">None Detected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Special Events:</span>
                <span className="font-medium">None</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Timeline */}
        <Card className="p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-medical-primary" />
            <h4 className="font-medium">Route Timeline</h4>
          </div>
          <div className="relative">
            <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-gray-200"></div>
            
            <div className="flex mb-6 relative">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center z-10">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="ml-6">
                <h5 className="font-medium">Departure</h5>
                <p className="text-sm text-gray-500">Estimated at {format(departureTime, "h:mm a")}</p>
              </div>
            </div>
            
            {trafficPrediction.congestionLevel !== "low" && (
              <div className="flex mb-6 relative">
                <div className="w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center z-10">
                  <Car className="h-4 w-4" />
                </div>
                <div className="ml-6">
                  <h5 className="font-medium">Traffic Zone</h5>
                  <p className="text-sm text-gray-500">
                    Expect {trafficPrediction.predictedDelayMinutes} min delay due to {trafficPrediction.congestionLevel} traffic
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex relative">
              <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center z-10">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="ml-6">
                <h5 className="font-medium">Arrival</h5>
                <p className="text-sm text-gray-500">
                  Estimated arrival at {format(new Date(departureTime.getTime() + route.duration * 60000), "h:mm a")}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* AI Recommendations */}
        <Card className="p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-medical-accent" />
            <h4 className="font-medium">AI Recommendations</h4>
          </div>
          <div className="space-y-3">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 bg-medical-accent/10 p-3 rounded-md">
                <div className="mt-0.5">
                  <Brain className="h-5 w-5 text-medical-accent" />
                </div>
                <p>{recommendation}</p>
              </div>
            ))}
            
            {trafficPrediction.congestionLevel === "high" && (
              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  High traffic congestion detected on this route. Consider delaying departure by 30 minutes for better conditions.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </Card>
      </div>
    </Card>
  );
}
