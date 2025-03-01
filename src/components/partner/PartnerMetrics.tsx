
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Partner } from '@/types/partner';
import { TrendingUp, Users, Award, AlertTriangle } from 'lucide-react';

export interface PartnerMetricsProps {
  partners: Partner[];
  isLoading: boolean;
}

export const PartnerMetrics: React.FC<PartnerMetricsProps> = ({ partners, isLoading }) => {
  // Calculate metrics
  const totalPartners = partners.length;
  const activePartners = partners.filter(p => p.status === 'active').length;
  const averageScore = partners.length > 0
    ? partners.reduce((sum, partner) => sum + partner.partnership_score, 0) / partners.length
    : 0;
  const partnersAtRisk = partners.filter(p => p.risk_assessment === 'high').length;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map(i => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Partners</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPartners}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Active Partners</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{activePartners}</div>
          <p className="text-xs text-muted-foreground">
            {((activePartners / totalPartners) * 100).toFixed(1)}% of total
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Avg Partnership Score</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{averageScore.toFixed(1)}%</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Partners at Risk</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-600">{partnersAtRisk}</div>
          <p className="text-xs text-muted-foreground">
            {((partnersAtRisk / totalPartners) * 100).toFixed(1)}% of total
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
