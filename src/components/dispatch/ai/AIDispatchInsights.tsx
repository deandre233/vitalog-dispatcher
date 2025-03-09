
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AIInsightsPanel } from "./AIInsightsPanel";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  MapPin, 
  BarChart4, 
  RefreshCw,
  Clock
} from "lucide-react";

// Define the shape of AI insights
type InsightType = "optimization" | "warning" | "prediction";
type ImpactLevel = "high" | "medium" | "low";

interface AIInsight {
  type: InsightType;
  message: string;
  confidence: number;
  impact: ImpactLevel;
}

interface TrafficInfo {
  location: string;
  congestionLevel: "high" | "medium" | "low";
  estimatedDelay: number;
  alternateRouteAvailable: boolean;
}

const mockTrafficInfo: TrafficInfo[] = [
  {
    location: "Main Street & 5th Avenue",
    congestionLevel: "high",
    estimatedDelay: 15,
    alternateRouteAvailable: true
  },
  {
    location: "Highway 101 North",
    congestionLevel: "medium",
    estimatedDelay: 8,
    alternateRouteAvailable: true
  },
  {
    location: "Downtown Medical District",
    congestionLevel: "medium",
    estimatedDelay: 10,
    alternateRouteAvailable: false
  },
  {
    location: "Hospital Access Road",
    congestionLevel: "low",
    estimatedDelay: 2,
    alternateRouteAvailable: false
  }
];

// Mock insights
const mockInsights: AIInsight[] = [
  {
    type: "optimization",
    message: "Crew assignment can be optimized by assigning Unit 103 to the north sector dispatches",
    confidence: 82,
    impact: "medium"
  },
  {
    type: "warning",
    message: "Possible hospital overcrowding at Memorial Hospital in the next 2 hours",
    confidence: 78,
    impact: "high"
  },
  {
    type: "optimization",
    message: "Route optimization available for 3 current transports to avoid construction on Main St",
    confidence: 95,
    impact: "high"
  },
  {
    type: "prediction",
    message: "Expect increased call volume between 3-5 PM based on historical patterns",
    confidence: 89,
    impact: "medium"
  },
  {
    type: "warning",
    message: "Weather alert: Freezing rain may impact response times in the northeastern sector",
    confidence: 85,
    impact: "medium"
  }
];

// Define the badge colors based on congestion level
const congestionBadgeColor = {
  low: "bg-green-100 text-green-800 hover:bg-green-200",
  medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  high: "bg-red-100 text-red-800 hover:bg-red-200"
};

export function AIDispatchInsights() {
  const [insights, setInsights] = useState<AIInsight[]>(mockInsights);
  const [trafficInfo, setTrafficInfo] = useState<TrafficInfo[]>(mockTrafficInfo);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const refreshInsights = () => {
    setIsLoading(true);
    // Simulate an API call delay
    setTimeout(() => {
      // Randomize the confidence values slightly to simulate updated data
      const updatedInsights = insights.map(insight => ({
        ...insight,
        confidence: Math.min(100, Math.max(50, insight.confidence + (Math.random() * 10 - 5))),
      }));
      
      // Randomize congestion levels
      const congestionLevels: Array<"high" | "medium" | "low"> = ["high", "medium", "low"];
      const updatedTrafficInfo = trafficInfo.map(info => ({
        ...info,
        congestionLevel: congestionLevels[Math.floor(Math.random() * congestionLevels.length)],
        estimatedDelay: Math.max(1, Math.floor(info.estimatedDelay + (Math.random() * 6 - 3))),
      }));
      
      setInsights(updatedInsights);
      setTrafficInfo(updatedTrafficInfo);
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 1500);
  };
  
  useEffect(() => {
    // Initial load with delay to simulate API fetch
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    // Regular refresh every 2 minutes
    const interval = setInterval(refreshInsights, 120000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="p-4 shadow-md bg-gradient-to-br from-white to-blue-50/30 overflow-hidden transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-medical-primary" />
          <h3 className="font-semibold text-lg text-medical-primary">AI Dispatch Insights</h3>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshInsights}
          disabled={isLoading}
          className="text-xs"
        >
          {isLoading ? (
            <LoadingSpinner size={14} className="mr-1" />
          ) : (
            <RefreshCw className="h-3 w-3 mr-1" />
          )}
          Refresh
        </Button>
      </div>
      
      <div className="text-xs text-gray-500 mb-4 flex items-center">
        <Clock className="h-3 w-3 mr-1" />
        Last updated: {lastUpdated.toLocaleTimeString()}
      </div>
      
      <Tabs defaultValue="traffic">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="traffic" className="text-xs">
            Traffic
          </TabsTrigger>
          <TabsTrigger value="insights" className="text-xs">
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="metrics" className="text-xs">
            Metrics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="traffic" className="space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-6">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <div className="text-sm font-medium mb-2">Live Traffic Conditions</div>
              {trafficInfo.map((info, index) => (
                <div key={index} className="bg-white p-3 rounded-md shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">{info.location}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Delay: ~{info.estimatedDelay} min
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={congestionBadgeColor[info.congestionLevel]}
                    >
                      {info.congestionLevel === "high" ? "Heavy" : 
                       info.congestionLevel === "medium" ? "Moderate" : "Light"}
                    </Badge>
                  </div>
                  {info.congestionLevel !== "low" && info.alternateRouteAvailable && (
                    <div className="mt-2 text-xs text-blue-600 flex items-center">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Alternate route available
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="insights">
          {isLoading ? (
            <div className="flex justify-center py-6">
              <LoadingSpinner />
            </div>
          ) : (
            <AIInsightsPanel insights={insights} />
          )}
        </TabsContent>
        
        <TabsContent value="metrics" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-6">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <div>
                <div className="text-sm font-medium mb-2 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1 text-emerald-500" />
                  Dispatch Efficiency
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm border border-gray-100">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-600">Current fleet utilization</span>
                    <span className="text-xs font-medium">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                  
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-600">Average response time</span>
                    <span className="text-xs font-medium">8.2 min</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "70%" }}></div>
                  </div>
                  
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-600">Crew assignment speed</span>
                    <span className="text-xs font-medium">3.5 min</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-violet-500 h-2 rounded-full" style={{ width: "92%" }}></div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-2 flex items-center">
                  <BarChart4 className="h-4 w-4 mr-1 text-blue-500" />
                  Prediction Accuracy
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white p-3 rounded-md shadow-sm border border-gray-100">
                    <div className="text-xl font-bold text-emerald-600">93%</div>
                    <div className="text-xs text-gray-500">Traffic predictions</div>
                  </div>
                  <div className="bg-white p-3 rounded-md shadow-sm border border-gray-100">
                    <div className="text-xl font-bold text-blue-600">87%</div>
                    <div className="text-xs text-gray-500">ETA accuracy</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
