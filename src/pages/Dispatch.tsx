
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { DispatchStatusBar } from "@/components/dispatch/DispatchStatusBar";
import { AIInsightsPanel } from "@/components/dispatch/ai/AIInsightsPanel";
import { useState } from "react";
import type { DispatchStatus } from "@/components/dispatch/DispatchStatusBar";
import type { AIInsight } from "@/types/ai";

const mockInsights: AIInsight[] = [
  {
    type: 'optimization',
    message: 'Unit 7 could improve response time',
    recommendation: "Based on historical data, assigning Unit 7 could reduce response time by 23%",
    confidence: 89,
    impact: "high",
    timeEstimate: "2-3 min"
  },
  {
    type: 'prediction',
    message: 'Alternative route suggestion',
    recommendation: "Traffic patterns suggest taking Maple Ave route instead of Oak St",
    confidence: 75,
    impact: "medium",
    timeEstimate: "5 min"
  },
  {
    type: 'warning',
    message: 'Supply recommendation',
    recommendation: "Similar cases typically require additional oxygen supplies",
    confidence: 65,
    impact: "low",
    timeEstimate: "1-2 min"
  },
];

export default function Dispatch() {
  const [status, setStatus] = useState<DispatchStatus>("dispatch");
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-white/80 backdrop-blur border-none shadow-lg">
              <h1 className="text-2xl font-bold mb-4">Active Dispatches</h1>
              <DispatchStatusBar 
                currentStatus={status}
                onStatusChange={setStatus}
              />
            </Card>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="p-4 bg-purple-50 border-none">
                <h3 className="text-lg font-semibold mb-2">Active Units</h3>
                <p className="text-3xl font-bold text-purple-600">12</p>
              </Card>
              
              <Card className="p-4 bg-blue-50 border-none">
                <h3 className="text-lg font-semibold mb-2">Pending Requests</h3>
                <p className="text-3xl font-bold text-blue-600">5</p>
              </Card>
              
              <Card className="p-4 bg-green-50 border-none">
                <h3 className="text-lg font-semibold mb-2">Completed Today</h3>
                <p className="text-3xl font-bold text-green-600">47</p>
              </Card>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <AIInsightsPanel insights={mockInsights} />
          </div>
          
        </div>
      </main>
    </div>
  );
}
