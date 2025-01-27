import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Building2, Mail, MapPin, Phone, Search } from "lucide-react";
import { useState } from "react";

interface Center {
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
  ai_recommendations: {
    usage_pattern: string;
    efficiency_score: number;
    suggested_improvements: string[];
  };
  efficiency_score: number;
  dispatch_count: number;
  created_at: string;
  updated_at: string;
}

export const CenterList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("");

  const { data: centers, isLoading } = useQuery({
    queryKey: ['centers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('centers')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Center[];
    }
  });

  const filteredCenters = centers?.filter(center => {
    const matchesSearch = center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || center.type === filterType;
    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  const getEfficiencyColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Medical Centers</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search centers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="hospital">Hospital</SelectItem>
              <SelectItem value="clinic">Clinic</SelectItem>
              <SelectItem value="urgent_care">Urgent Care</SelectItem>
              <SelectItem value="specialty">Specialty Center</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCenters?.map((center) => (
          <Card key={center.id} className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{center.name}</h3>
                <p className="text-sm text-gray-500">{center.type}</p>
              </div>
              <Badge className={getEfficiencyColor(center.efficiency_score)}>
                {center.efficiency_score}% Efficient
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{center.address}, {center.city}, {center.state} {center.zip}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{center.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{center.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="h-4 w-4" />
                <span>{center.dispatch_count} Dispatches</span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">AI Insights</h4>
              <p className="text-sm text-blue-800">{center.ai_recommendations.usage_pattern}</p>
              <ul className="mt-2 space-y-1">
                {center.ai_recommendations.suggested_improvements.map((improvement, index) => (
                  <li key={index} className="text-sm text-blue-700">• {improvement}</li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};