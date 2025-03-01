import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building2, Phone, Mail, Calendar, AlertTriangle, TrendingUp, Star } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { formatPhoneNumber } from "@/utils/stringUtils";

type Partner = Tables<"partners">;

interface PartnerTableProps {
  partners: Partner[];
  showInactive?: boolean;
}

export const PartnerTable = ({ partners, showInactive = false }: PartnerTableProps) => {
  const getStatusBadge = (status: string | null) => {
    const statusConfig = {
      active: { color: "bg-green-500", icon: Star },
      inactive: { color: "bg-gray-500", icon: AlertTriangle },
      pending: { color: "bg-yellow-500", icon: Calendar },
      high_risk: { color: "bg-red-500", icon: AlertTriangle },
    };

    const config = statusConfig[status?.toLowerCase() ?? "inactive"];

    return (
      <Badge className={`${config.color} text-white flex items-center gap-1`}>
        <config.icon className="h-3 w-3" />
        <span>{status || "Unknown"}</span>
      </Badge>
    );
  };

  const getRiskBadge = (risk: string | null) => {
    if (!risk) return null;
    
    const riskConfig = {
      low: "bg-green-500",
      medium: "bg-yellow-500",
      high: "bg-red-500",
    };

    return (
      <Badge className={`${riskConfig[risk.toLowerCase()] || "bg-gray-500"} text-white`}>
        {risk}
      </Badge>
    );
  };

  const getPerformanceScore = (score: number | null) => {
    if (score === null) return null;
    
    let color = "text-gray-500";
    if (score >= 80) color = "text-green-500";
    else if (score >= 60) color = "text-yellow-500";
    else if (score > 0) color = "text-red-500";

    return (
      <div className="flex items-center gap-1">
        <TrendingUp className={`h-4 w-4 ${color}`} />
        <span className={color}>{score.toFixed(1)}%</span>
      </div>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Partner</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Partnership Type</TableHead>
            <TableHead>Performance Score</TableHead>
            <TableHead>Risk Assessment</TableHead>
            <TableHead>Next Review</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {partners
            .filter(partner => showInactive || partner.status === "active")
            .map((partner) => (
              <TableRow key={partner.id} className="group hover:bg-gray-50">
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{partner.name}</span>
                    </div>
                    {partner.ai_recommendations && (
                      <div className="mt-1 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        AI Insight: {JSON.parse(partner.ai_recommendations as string).latest || "No insights available"}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{formatPhoneNumber(partner.contact_phone || '')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{partner.contact_email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{partner.partnership_type}</TableCell>
                <TableCell>{getPerformanceScore(partner.partnership_score)}</TableCell>
                <TableCell>{getRiskBadge(partner.risk_assessment)}</TableCell>
                <TableCell>
                  {partner.next_review_date && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{new Date(partner.next_review_date).toLocaleDateString()}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(partner.status)}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};