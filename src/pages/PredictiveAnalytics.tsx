
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { HRLayout } from "@/components/layout/HRLayout";
import { Brain, TrendingUp, AlertTriangle, Ambulance, Receipt, Box, Calendar } from "lucide-react";
import { toast } from "sonner";
import { 
  predictTransportVolume, 
  predictClaimDenials, 
  predictResourceShortages,
  TransportPrediction,
  BillingPrediction,
  ResourcePrediction
} from "@/utils/aiPredictiveAnalytics";

export default function PredictiveAnalytics() {
  const [activeTab, setActiveTab] = useState("transport");
  const [transportPredictions, setTransportPredictions] = useState<TransportPrediction[]>([]);
  const [billingPredictions, setBillingPredictions] = useState<BillingPrediction[]>([]);
  const [resourcePredictions, setResourcePredictions] = useState<ResourcePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setIsLoading(true);
        
        // Mock historical data
        const historicalTransportData = Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
          volume: Math.floor(Math.random() * 20) + 20
        }));
        
        // Mock external factors
        const externalFactors = [
          { 
            date: new Date(Date.now() + (2 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], 
            factor: "Local sports event", 
            impact: 5 
          },
          { 
            date: new Date(Date.now() + (4 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], 
            factor: "Forecasted storm", 
            impact: 8 
          }
        ];
        
        // Mock claims data
        const claimsData = [
          { 
            id: "CLM-001", 
            amount: 1250, 
            service: "ALS Transport", 
            documentation: ["patient-consent", "physician-order"], 
            previousDenials: 0 
          },
          { 
            id: "CLM-042", 
            amount: 850, 
            service: "BLS Transport", 
            documentation: ["patient-consent"], 
            previousDenials: 1 
          },
          { 
            id: "CLM-078", 
            amount: 1800, 
            service: "Critical Care Transport", 
            documentation: ["patient-consent", "physician-order", "medical-necessity"], 
            previousDenials: 0 
          },
          { 
            id: "CLM-103", 
            amount: 975, 
            service: "ALS Transport", 
            documentation: ["physician-order"], 
            previousDenials: 2 
          }
        ];
        
        // Mock inventory data
        const inventoryData = [
          { type: "Oxygen Tanks", quantity: 28, usageRate: 1.5 },
          { type: "Medical Gloves", quantity: 350, usageRate: 25 },
          { type: "IV Supplies", quantity: 45, usageRate: 3 },
          { type: "Defibrillator Pads", quantity: 12, usageRate: 0.8 }
        ];
        
        // Mock upcoming demand
        const upcomingDemand = [
          { 
            date: new Date(Date.now() + (3 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
            additionalDemand: { "Oxygen Tanks": 3, "Medical Gloves": 50 } 
          },
          { 
            date: new Date(Date.now() + (5 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
            additionalDemand: { "IV Supplies": 8, "Defibrillator Pads": 4 } 
          }
        ];
        
        // Generate predictions
        const transportData = predictTransportVolume(historicalTransportData, externalFactors);
        const billingData = predictClaimDenials(claimsData);
        const resourceData = predictResourceShortages(inventoryData, upcomingDemand);
        
        setTransportPredictions(transportData);
        setBillingPredictions(billingData);
        setResourcePredictions(resourceData);
        
        toast.success("AI predictions generated successfully");
      } catch (error) {
        console.error("Error generating predictions:", error);
        toast.error("Failed to generate AI predictions");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPredictions();
  }, []);

  const regeneratePredictions = () => {
    setIsLoading(true);
    setTimeout(() => {
      toast.success("AI predictions refreshed");
      setIsLoading(false);
    }, 1500);
  };

  const getTransportVolumeColor = (volume: number) => {
    if (volume > 35) return "text-red-600";
    if (volume > 25) return "text-amber-600";
    return "text-green-600";
  };

  const getDenialRiskBadge = (risk: number) => {
    if (risk > 0.7) return "bg-red-100 text-red-800";
    if (risk > 0.4) return "bg-amber-100 text-amber-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <HRLayout>
      <div className="container p-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Brain className="mr-2 h-6 w-6 text-purple-600" />
              AI Predictive Analytics
            </h1>
            <p className="text-gray-500">
              Machine learning predictions to optimize operations and resource allocation
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={regeneratePredictions}
            disabled={isLoading}
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Refresh Predictions
          </Button>
        </div>

        <Tabs defaultValue="transport" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="transport" className="flex items-center">
              <Ambulance className="mr-2 h-4 w-4" />
              Transport Volume
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center">
              <Receipt className="mr-2 h-4 w-4" />
              Billing Risks
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center">
              <Box className="mr-2 h-4 w-4" />
              Resource Planning
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transport">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-blue-500" />
                  Predicted Transport Volume
                </CardTitle>
                <CardDescription>
                  7-day forecast of transport demand based on historical patterns and external factors
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transportPredictions.map((prediction) => (
                      <Card key={prediction.date} className="overflow-hidden">
                        <div className="flex">
                          <div className="bg-slate-50 p-4 flex items-center justify-center w-20">
                            <div className="text-center">
                              <div className="text-sm font-medium">
                                {new Date(prediction.date).toLocaleDateString('en-US', { weekday: 'short' })}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(prediction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-medium">Predicted Volume: </span>
                                <span className={`font-bold ${getTransportVolumeColor(prediction.predictedVolume)}`}>
                                  {prediction.predictedVolume} transports
                                </span>
                              </div>
                              <div className="text-sm text-gray-500">
                                Confidence: {Math.round(prediction.confidence * 100)}%
                              </div>
                            </div>
                            {prediction.factors.length > 0 && (
                              <div className="mt-2">
                                <div className="text-sm font-medium">Influencing Factors:</div>
                                <ul className="text-sm">
                                  {prediction.factors.map((factor, index) => (
                                    <li key={index} className="flex items-center mt-1">
                                      <AlertTriangle className="h-3.5 w-3.5 mr-1 text-amber-500" />
                                      {factor.name} (Impact: {factor.impact > 0 ? "+" : ""}{factor.impact})
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <div className="text-sm text-gray-500">
                  Predictions use historical data, seasonal patterns, and known events
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
                  Claims Denial Risk Assessment
                </CardTitle>
                <CardDescription>
                  AI analysis of claims with probability of denial and recommended actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {billingPredictions.map((prediction) => (
                      <Card key={prediction.claimId}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-md">Claim {prediction.claimId}</CardTitle>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDenialRiskBadge(prediction.denialRisk)}`}>
                              {Math.round(prediction.denialRisk * 100)}% Risk
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <div className="text-sm font-medium">Risk Factors:</div>
                              <ul className="text-sm">
                                {prediction.riskFactors.map((factor, index) => (
                                  <li key={index} className="flex items-start mt-1">
                                    <AlertTriangle className="h-3.5 w-3.5 mr-1 mt-0.5 text-amber-500 flex-shrink-0" />
                                    <span>{factor}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <div className="text-sm font-medium">Recommended Actions:</div>
                              <ul className="text-sm">
                                {prediction.recommendedActions.map((action, index) => (
                                  <li key={index} className="flex items-start mt-1">
                                    <Brain className="h-3.5 w-3.5 mr-1 mt-0.5 text-purple-500 flex-shrink-0" />
                                    <span>{action}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button size="sm" variant="outline" className="w-full">Review Claim</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Box className="mr-2 h-5 w-5 text-blue-500" />
                  Resource Shortage Predictions
                </CardTitle>
                <CardDescription>
                  Inventory forecasting with predicted shortages and recommended actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resourcePredictions.map((prediction) => (
                      <Card key={prediction.resourceType} className={prediction.predictedShortage ? "border-red-300 bg-red-50" : "border-amber-300 bg-amber-50"}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-md flex items-center">
                            <Box className="mr-2 h-4 w-4" />
                            {prediction.resourceType}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <div className="font-medium">Status:</div>
                              <div className="ml-2">
                                {prediction.predictedShortage ? (
                                  <span className="text-red-600 font-medium flex items-center">
                                    <AlertTriangle className="h-4 w-4 mr-1" />
                                    Shortage predicted by {prediction.shortageDate}
                                  </span>
                                ) : (
                                  <span className="text-amber-600 font-medium flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    Monitor levels
                                  </span>
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium">Recommended Actions:</div>
                              <ul className="text-sm">
                                {prediction.recommendedActions.map((action, index) => (
                                  <li key={index} className="flex items-start mt-1">
                                    <Brain className="h-3.5 w-3.5 mr-1 mt-0.5 text-purple-500 flex-shrink-0" />
                                    <span>{action}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button size="sm" variant={prediction.predictedShortage ? "default" : "outline"} className="w-full">
                            {prediction.predictedShortage ? "Order Now" : "Check Inventory"}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </HRLayout>
  );
}
