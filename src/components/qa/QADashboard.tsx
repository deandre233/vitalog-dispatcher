
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Brain, CheckCircle, AlertTriangle, HelpCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface QAMetrics {
  totalCases: number;
  reviewedCases: number;
  pendingReview: number;
  criticalIssues: number;
  complianceScore: number;
}

export function QADashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: metrics, isLoading } = useQuery({
    queryKey: ['qa-metrics'],
    queryFn: async () => {
      // This would be replaced with actual metrics from the backend
      const mockMetrics: QAMetrics = {
        totalCases: 150,
        reviewedCases: 120,
        pendingReview: 30,
        criticalIssues: 5,
        complianceScore: 94.5
      };
      return mockMetrics;
    }
  });

  const handleAnalyze = () => {
    toast.success("Analysis started", {
      description: "The QA analysis process has been initiated."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="h-6 w-6 text-medical-primary" />
            Quality Assurance System
          </h1>
          <p className="text-gray-500 mt-1">
            Monitor and improve service quality through AI-powered analysis
          </p>
        </div>
        <Button onClick={handleAnalyze} className="bg-medical-primary hover:bg-medical-primary/90">
          Start New Analysis
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Cases"
          value={metrics?.totalCases || 0}
          icon={CheckCircle}
          color="text-green-500"
        />
        <MetricCard
          title="Reviewed"
          value={metrics?.reviewedCases || 0}
          icon={Brain}
          color="text-blue-500"
        />
        <MetricCard
          title="Pending Review"
          value={metrics?.pendingReview || 0}
          icon={HelpCircle}
          color="text-orange-500"
        />
        <MetricCard
          title="Critical Issues"
          value={metrics?.criticalIssues || 0}
          icon={AlertTriangle}
          color="text-red-500"
        />
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Compliance Score</h2>
            <span className="text-2xl font-bold text-medical-primary">
              {metrics?.complianceScore}%
            </span>
          </div>
          <Progress value={metrics?.complianceScore || 0} className="h-2" />
        </div>
      </Card>

      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search cases..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* This section will be expanded with the actual case review table */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Reviews</h2>
        <p className="text-gray-500">Coming soon: Case review table with detailed QA analysis results</p>
      </Card>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, color }: { 
  title: string;
  value: number;
  icon: any;
  color: string;
}) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
    </Card>
  );
}
