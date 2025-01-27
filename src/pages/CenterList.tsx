import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, MapPin, Phone, Mail, Search, Filter, Activity } from "lucide-react";
import { useState } from "react";
import { Json } from "@/integrations/supabase/types";

// TypeScript interfaces for better type safety
interface AIRecommendations {
  usage_pattern: string;
  efficiency_score: number;
  suggested_improvements: string[];
}

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
  ai_recommendations: AIRecommendations;
  efficiency_score: number;
  dispatch_count: number;
}

interface RawCenter extends Omit<Center, 'ai_recommendations'> {
  ai_recommendations: Json;
}

export const CenterList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [sortField, setSortField] = useState<keyof Center>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

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
    const matchesSearch = 
      center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || center.type === filterType;
    return matchesSearch && matchesType;
  }).sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    const direction = sortDirection === "asc" ? 1 : -1;
    return aValue < bValue ? -1 * direction : aValue > bValue ? 1 * direction : 0;
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEfficiencyColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-medical-primary">Medical Centers</h1>
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
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="hospital">Hospital</SelectItem>
              <SelectItem value="clinic">Clinic</SelectItem>
              <SelectItem value="urgent_care">Urgent Care</SelectItem>
              <SelectItem value="specialty">Specialty Center</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Efficiency</TableHead>
            <TableHead>Dispatches</TableHead>
            <TableHead>Contact</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCenters?.map((center) => (
            <TableRow key={center.id} className="hover:bg-medical-highlight/50">
              <TableCell className="font-medium">{center.name}</TableCell>
              <TableCell>{center.type}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{center.address}, {center.city}, {center.state}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(center.status)}>{center.status}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={getEfficiencyColor(center.efficiency_score)}>
                  {center.efficiency_score}%
                </Badge>
              </TableCell>
              <TableCell>{center.dispatch_count}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <a href={`tel:${center.phone}`} className="text-blue-500 hover:text-blue-700">
                    <Phone className="h-4 w-4" />
                  </a>
                  <a href={`mailto:${center.email}`} className="text-blue-500 hover:text-blue-700">
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};