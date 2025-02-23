import { Card } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";
import { TrendingUp, AlertTriangle, Users, Clock } from "lucide-react";

type Partner = Tables<"partners">;

interface PartnerMetricsProps {
  partners: Partner[];
}

export const PartnerMetrics = ({ partners }: PartnerMetricsProps) => {
  const metrics = {
    total: partners.length,
    active: partners.filter(p => p.status === "active").length,
    highRisk: partners.filter(p => p.risk_assessment === "high").length,
    reviewDue: partners.filter(p => {
      if (!p.next_review_date) return false;
      return new Date(p.next_review_date) <= new Date();
    }).length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Partners</p>
            <h3 className="text-2xl font-bold">{metrics.total}</h3>
          </div>
          <Users className="h-8 w-8 text-blue-500" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Active Partners</p>
            <h3 className="text-2xl font-bold">{metrics.active}</h3>
          </div>
          <TrendingUp className="h-8 w-8 text-green-500" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">High Risk Partners</p>
            <h3 className="text-2xl font-bold">{metrics.highRisk}</h3>
          </div>
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Reviews Due</p>
            <h3 className="text-2xl font-bold">{metrics.reviewDue}</h3>
          </div>
          <Clock className="h-8 w-8 text-yellow-500" />
        </div>
      </Card>
    </div>
  );
};