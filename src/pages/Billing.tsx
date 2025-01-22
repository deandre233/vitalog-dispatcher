import { SidebarProvider } from "@/components/ui/sidebar";
import { BillingSidebar } from "@/components/navigation/BillingSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAIBillingAnalysis } from "@/hooks/useAIBillingAnalysis";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { 
  ClipboardList, Users, FileText, Building2, Clock, AlertCircle,
  Upload, FileCheck, Send, AlertTriangle, Building, UserSquare,
  Brain, Loader2, TrendingUp, AlertOctagon, Lightbulb, BarChart3,
  ChevronRight, DollarSign, Info, Cpu, Database, Network, 
  Radio, Rocket, Signal, Sparkles, Zap, ChevronLeft
} from "lucide-react";

const Billing = () => {
  const { toast } = useToast();
  const [isAIPanelCollapsed, setIsAIPanelCollapsed] = useState(false);

  const metrics = {
    priorAuth: { value: 10, change: "+2" },
    missingDemographics: { value: 43, change: "+5" },
    qaReview: { value: 124, change: "-12" },
    masterQueue: { value: 239, change: "+15" },
    reviewQueue: { value: 65, change: "-3" },
    filingQueue: { value: 136, change: "+24" },
    transmissionQueue: { value: 4527, change: "+204" },
    exceptionQueue: { value: 1, change: "0" },
    facilityInvoicing: { value: 1, change: "0" },
    affiliateInvoicing: { value: 0, change: "0" },
    patientInvoicing: { value: 36, change: "+12" },
    openInvoices: { value: 363, change: "+25" }
  };

  const analysisCards = [
    {
      title: "Key Performance Indicators",
      icon: Signal,
      metrics: {
        "Prior Auths": "10 (+2)",
        "Missing Demographics": "43 (+5)",
        "QA Reviews": "124 (-12)",
        "Master Queue": "239 (+15)"
      },
      insights: [
        "Prior authorizations show increasing trend (+2)",
        "Missing demographics rising significantly (+5)",
        "QA reviews decreasing (-12), potential efficiency gain",
        "Growing master queue backlog (+15)"
      ],
      recommendations: [
        "Implement automated demographic verification",
        "Increase QA review capacity",
        "Optimize prior auth workflow"
      ]
    },
    {
      title: "Workflow Efficiency",
      icon: Cpu,
      metrics: {
        "Review Queue": "65 (-3)",
        "Filing Queue": "136 (+24)",
        "Processing Time": "48hrs",
        "Automation Rate": "65%"
      },
      insights: [
        "Filing queue showing significant increase",
        "Review queue slightly improved",
        "Processing time within target range",
        "Automation opportunities identified"
      ],
      recommendations: [
        "Streamline filing process",
        "Implement automated claim scrubbing",
        "Enhance workflow monitoring"
      ]
    },
    {
      title: "Revenue Cycle",
      icon: DollarSign,
      metrics: {
        "Open Invoices": "363 (+25)",
        "Days in AR": "32",
        "Collection Rate": "92%",
        "Clean Claim Rate": "95%"
      },
      insights: [
        "Open invoices increasing (+25)",
        "Days in AR above target",
        "Collection rate needs improvement",
        "Clean claim rate meeting target"
      ],
      recommendations: [
        "Enhance collection strategies",
        "Reduce days in AR",
        "Improve payment posting efficiency"
      ]
    },
    {
      title: "Risk Assessment",
      icon: AlertOctagon,
      metrics: {
        "Compliance Score": "98%",
        "Risk Level": "Medium",
        "Missing Docs": "43",
        "Deadline Alerts": "12"
      },
      insights: [
        "Missing documentation increasing",
        "Compliance score maintained",
        "Medium risk level identified",
        "Multiple deadline alerts active"
      ],
      recommendations: [
        "Address missing documentation",
        "Monitor compliance requirements",
        "Implement proactive risk assessment"
      ]
    },
    {
      title: "Optimization Opportunities",
      icon: Sparkles,
      metrics: {
        "Potential Savings": "$25,000",
        "Revenue Opportunity": "$50,000",
        "Efficiency Gain": "15%",
        "ROI Estimate": "3.2x"
      },
      insights: [
        "Significant revenue opportunity identified",
        "Efficiency improvements possible",
        "Strong ROI potential",
        "Cost reduction areas found"
      ],
      recommendations: [
        "Implement suggested automations",
        "Optimize resource allocation",
        "Enhance staff training"
      ]
    }
  ];

  const AnalysisCard = ({ 
    title, 
    icon: Icon, 
    metrics = {}, 
    insights = [], 
    recommendations = [] 
  }: { 
    title: string;
    icon: any;
    metrics?: Record<string, string | number>;
    insights?: string[];
    recommendations?: string[];
  }) => {
    return (
      <Card className="p-4 bg-gradient-to-br from-medical-card-start to-medical-card-end relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-medical-gradient-start via-medical-gradient-middle to-medical-gradient-end opacity-5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-medical-secondary/20 rounded-full blur-sm group-hover:animate-pulse" />
              <Icon className="w-6 h-6 text-medical-secondary relative" />
            </div>
            <h3 className="text-lg font-semibold text-medical-primary">{title}</h3>
          </div>

          {Object.keys(metrics).length > 0 && (
            <div className="mb-4 space-y-2">
              <h4 className="text-sm font-medium text-medical-secondary">Key Metrics</h4>
              <div className="grid grid-cols-2 gap-2 bg-white/5 rounded-lg p-3">
                {Object.entries(metrics).map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <span className="text-medical-primary/60">{key.replace(/_/g, ' ')}: </span>
                    <span className="text-medical-primary font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {insights.length > 0 && (
            <div className="mb-4 space-y-2">
              <h4 className="text-sm font-medium text-medical-secondary">Insights</h4>
              <div className="space-y-2">
                {insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-medical-primary/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-medical-secondary mt-1.5" />
                    <p>{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recommendations.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-medical-secondary">Recommendations</h4>
              <div className="space-y-2">
                {recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-medical-primary/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5" />
                    <p>{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-medical-accent">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider>
          <BillingSidebar />
          <div className="flex-1 overflow-auto">
            <DashboardHeader />
            <main className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-medical-primary">Billing Dashboard</h2>
                <div className="space-x-2">
                  <Button variant="outline">
                    <Clock className="w-4 h-4 mr-2" />
                    Last Updated: 5 mins ago
                  </Button>
                  <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Claims
                  </Button>
                </div>
              </div>

              <Card className={cn(
                "bg-gradient-to-br from-medical-card-start to-medical-card-end relative overflow-hidden transition-all duration-300",
                isAIPanelCollapsed ? "p-2" : "p-6"
              )}>
                <div className="absolute inset-0 bg-gradient-to-r from-medical-gradient-start via-medical-gradient-middle to-medical-gradient-end opacity-5" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="absolute -inset-1 bg-medical-secondary/20 rounded-full blur-sm animate-pulse" />
                        <Brain className="w-7 h-7 text-medical-secondary relative animate-pulse" />
                      </div>
                      {!isAIPanelCollapsed && (
                        <h3 className="text-lg font-semibold text-medical-primary bg-clip-text text-transparent bg-gradient-to-r from-medical-primary to-medical-secondary">
                          AI Billing Analysis
                        </h3>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-medical-primary hover:bg-medical-secondary/20"
                      onClick={() => setIsAIPanelCollapsed(!isAIPanelCollapsed)}
                    >
                      {isAIPanelCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                    </Button>
                  </div>

                  {!isAIPanelCollapsed && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {analysisCards.map((card, index) => (
                        <AnalysisCard key={index} {...card} />
                      ))}
                    </div>
                  )}
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Prior Auth Queue"
                  value="10"
                  icon={ClipboardList}
                  change="+2"
                  aiInsight="2 new prior authorizations require immediate attention"
                />
                <MetricCard
                  title="Missing Demographics"
                  value="43"
                  icon={Users}
                  change="+5"
                  aiInsight="Patient information needs to be updated for billing"
                />
                <MetricCard
                  title="QA Review Queue"
                  value="124"
                  icon={FileCheck}
                  change="-12"
                  aiInsight="Quality assurance review backlog reduced by 12 since yesterday"
                />
                <MetricCard
                  title="Master Queue"
                  value="239"
                  icon={AlertCircle}
                  change="+15"
                  aiInsight="15 new items added to master review queue"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Review Queue"
                  value="65"
                  icon={FileText}
                  change="-3"
                  aiInsight="Claims ready for review"
                />
                <MetricCard
                  title="Filing Queue"
                  value="136"
                  icon={Send}
                  change="+24"
                  aiInsight="Claims prepared for submission"
                />
                <MetricCard
                  title="Transmission Queue"
                  value="4,527"
                  icon={Upload}
                  change="+204"
                  aiInsight="Claims pending electronic transmission"
                />
                <MetricCard
                  title="Exception Queue"
                  value="1"
                  icon={AlertTriangle}
                  change="0"
                  aiInsight="Critical exceptions requiring attention"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Facility Invoicing"
                  value="1"
                  icon={Building}
                  change="0"
                  aiInsight="Facility invoices pending review"
                />
                <MetricCard
                  title="Affiliate Invoicing"
                  value="0"
                  icon={Building2}
                  change="0"
                  aiInsight="No pending affiliate invoices"
                />
                <MetricCard
                  title="Patient Invoicing"
                  value="36"
                  icon={UserSquare}
                  change="+12"
                  aiInsight="New patient invoices ready for processing"
                />
                <MetricCard
                  title="Open Invoices"
                  value="363"
                  icon={FileText}
                  change="+25"
                  aiInsight="Total outstanding invoices pending payment"
                />
              </div>

              <div className="flex gap-2 mt-6">
                <Button variant="outline" className="flex-1">General</Button>
                <Button variant="outline" className="flex-1">Claims</Button>
                <Button variant="outline" className="flex-1">Receivables</Button>
                <Button variant="outline" className="flex-1">Invoicing</Button>
                <Button variant="outline" className="flex-1">Facility</Button>
                <Button variant="outline" className="flex-1">Compliance</Button>
              </div>
            </main>
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
};

export default Billing;
