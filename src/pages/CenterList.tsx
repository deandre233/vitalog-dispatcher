
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { AIInsightsPanel } from "@/components/dispatch/ai/AIInsightsPanel";
import { AIInsight } from "@/types/ai";
import { Json } from "@/integrations/supabase/types";
import { CenterTable } from "@/components/center/CenterTable";
import { CenterFilters, FilterState } from "@/components/center/CenterFilters";
import { CenterHeader } from "@/components/center/CenterHeader";
import { BillingSidebar } from "@/components/navigation/BillingSidebar";
import { Header } from "@/components/layout/Header";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

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

interface AIRecommendations {
  usage_pattern: string;
  efficiency_score: number;
  suggested_improvements: string[];
}

interface RawCenter extends Omit<Center, 'ai_recommendations'> {
  ai_recommendations: Json;
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

  const generateInsights = (): AIInsight[] => {
    return [
      {
        type: 'optimization',
        message: 'Resource allocation can be improved',
        confidence: 92,
        impact: 'high',
        recommendation: 'Redistribute staff during peak hours between 2-5 PM',
        timeEstimate: '1 week'
      },
      {
        type: 'prediction',
        message: 'Patient volume trend detected',
        confidence: 85,
        impact: 'medium',
        recommendation: 'Prepare for 20% increase in weekend appointments',
        timeEstimate: '2 weeks'
      },
      {
        type: 'warning',
        message: 'Equipment maintenance needed',
        confidence: 78,
        impact: 'high',
        recommendation: 'Schedule preventive maintenance for 3 transport units',
        timeEstimate: '3 days'
      }
    ];
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
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex flex-1">
          <BillingSidebar />
          <div className="flex-1 flex justify-center items-center">
            <p className="text-red-500">Error loading centers: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex flex-1">
          <BillingSidebar />
          <div className="flex-1 flex justify-center items-center">
            <LoadingSpinner size={32} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1">
        <BillingSidebar />
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto p-6 space-y-6">
            <CenterHeader />
            <CenterFilters filters={filters} onFiltersChange={setFilters} />
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                {filteredCenters && <CenterTable centers={filteredCenters} />}
              </div>
              
              <div className="lg:col-span-1">
                {filteredCenters && filteredCenters.length > 0 && (
                  <AIInsightsPanel insights={generateInsights()} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
