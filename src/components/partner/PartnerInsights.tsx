
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Partner } from '@/types/partner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface PartnerInsightsProps {
  partners: Partner[];
  isLoading: boolean;
}

export const PartnerInsights: React.FC<PartnerInsightsProps> = ({ partners, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Partnership Types</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <div className="flex items-center justify-center h-full">Loading...</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Partner Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <div className="flex items-center justify-center h-full">Loading...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Generate data for partnership types chart
  const partnershipTypeData = partners.reduce((acc, partner) => {
    const existing = acc.find(item => item.name === partner.partnership_type);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: partner.partnership_type, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Generate data for partner status distribution
  const statusDistributionData = partners.reduce((acc, partner) => {
    const existing = acc.find(item => item.name === partner.status);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: partner.status, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Average partnership score
  const averageScore = partners.length
    ? partners.reduce((sum, partner) => sum + partner.partnership_score, 0) / partners.length
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{partners.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-500">
              {partners.filter(p => p.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-500">
              {averageScore.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Partnership Types</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={partnershipTypeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Partners" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Partner Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
