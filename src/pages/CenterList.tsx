import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Brain, Building2 } from "lucide-react";
import { useState } from "react";
import { AIInsightsPanel } from "@/components/dispatch/ai/AIInsightsPanel";
import { AIInsight } from "@/types/ai";
import { Json } from "@/integrations/supabase/types";
import { CenterTable } from "@/components/center/CenterTable";

interface AIRecommendations {
  usage_pattern: string;
  efficiency_score: number;
  suggested_improvements: string[];
}

export interface Center {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  status: string;
  ai_recommendations: AIRecommendations;
  efficiency_score: number;
  dispatch_count: number;
}

interface RawCenter extends Omit<Center, 'ai_recommendations'> {
  ai_recommendations: Json;
}

interface FilterState {
  nameFilter: string;
  addressFilter: string;
  locationType: string;
  minDispatches: number;
  hideInactive: boolean;
  hideNonContract: boolean;
}

export const CenterList = () => {
  const [filters, setFilters] = useState<FilterState>({
    nameFilter: "",
    addressFilter: "",
    locationType: "all",
    minDispatches: 10,
    hideInactive: false,
    hideNonContract: false
  });

  // Generate AI insights based on center data
  const generateAIInsights = (center: Center): AIInsight[] => {
    const insights: AIInsight[] = [];
    
    if (center.efficiency_score < 70) {
      insights.push({
        type: 'optimization',
        message: `${center.name}'s efficiency score is below target. Consider reviewing operational procedures.`,
        confidence: 0.85,
        impact: 'high'
      });
    }

    if (center.dispatch_count > 100) {
      insights.push({
        type: 'prediction',
        message: `High dispatch volume detected. Consider allocating additional resources.`,
        confidence: 0.92,
        impact: 'medium'
      });
    }

    if (center.status !== 'active') {
      insights.push({
        type: 'warning',
        message: `Inactive status may impact service delivery. Review activation requirements.`,
        confidence: 0.95,
        impact: 'high'
      });
    }

    return insights;
  };

  const { data: centers, isLoading, error } = useQuery({
    queryKey: ['centers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('centers')
        .select('*')
        .order('name');

      if (error) throw error;

      return (data as RawCenter[]).map(center => ({
        ...center,
        ai_recommendations: {
          usage_pattern: (center.ai_recommendations as any)?.usage_pattern || "No pattern available",
          efficiency_score: (center.ai_recommendations as any)?.efficiency_score || 0,
          suggested_improvements: (center.ai_recommendations as any)?.suggested_improvements || []
        }
      })) as Center[];
    }
  });

  const filteredCenters = centers?.filter(center => {
    if (filters.nameFilter && !center.name.toLowerCase().includes(filters.nameFilter.toLowerCase())) {
      return false;
    }
    if (filters.addressFilter && !center.address.toLowerCase().includes(filters.addressFilter.toLowerCase())) {
      return false;
    }
    if (filters.locationType !== "all" && center.type !== filters.locationType) {
      return false;
    }
    if (center.dispatch_count < filters.minDispatches) {
      return false;
    }
    if (filters.hideInactive && center.status !== "active") {
      return false;
    }
    if (filters.hideNonContract && center.status === "non-contract") {
      return false;
    }
    return true;
  });

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error loading centers: {error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-medical-primary" />
          <h1 className="text-2xl font-bold text-medical-primary">Medical Centers</h1>
        </div>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-500" />
          <span className="text-sm text-gray-600">AI-Powered Insights Active</span>
        </div>
      </div>

      <Card className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nameFilter">Name contains</Label>
            <Input
              id="nameFilter"
              value={filters.nameFilter}
              onChange={(e) => setFilters(prev => ({ ...prev, nameFilter: e.target.value }))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressFilter">Street address contains</Label>
            <Input
              id="addressFilter"
              value={filters.addressFilter}
              onChange={(e) => setFilters(prev => ({ ...prev, addressFilter: e.target.value }))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="locationType">Location type</Label>
            <Select
              value={filters.locationType}
              onValueChange={(value) => setFilters(prev => ({ ...prev, locationType: value }))}>
              <SelectTrigger id="locationType">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="hospital">Hospital</SelectItem>
                <SelectItem value="clinic">Clinic</SelectItem>
                <SelectItem value="skilled_nursing">Skilled Nursing Facility (SNF)</SelectItem>
                <SelectItem value="urgent_care">Urgent Care</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="minDispatches">Minimum dispatches</Label>
            <Select
              value={filters.minDispatches.toString()}
              onValueChange={(value) => setFilters(prev => ({ ...prev, minDispatches: parseInt(value) }))}>
              <SelectTrigger id="minDispatches">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 col-span-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hideInactive"
                checked={filters.hideInactive}
                onCheckedChange={(checked) => 
                  setFilters(prev => ({ ...prev, hideInactive: checked as boolean }))
                }
              />
              <Label htmlFor="hideInactive">Hide inactive facilities</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hideNonContract"
                checked={filters.hideNonContract}
                onCheckedChange={(checked) => 
                  setFilters(prev => ({ ...prev, hideNonContract: checked as boolean }))
                }
              />
              <Label htmlFor="hideNonContract">Hide non-contract facilities</Label>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {filteredCenters && <CenterTable centers={filteredCenters} />}
        </div>
        
        <div className="lg:col-span-1">
          {filteredCenters && filteredCenters.length > 0 && (
            <AIInsightsPanel
              insights={generateAIInsights(filteredCenters[0])}
              className="sticky top-6"
            />
          )}
        </div>
      </div>
    </div>
  );
};