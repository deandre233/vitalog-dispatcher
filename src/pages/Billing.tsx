import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAIBillingAnalysis } from "@/hooks/useAIBillingAnalysis";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  ClipboardList, 
  Users, 
  FileText, 
  Building2, 
  Clock, 
  AlertCircle,
  Upload,
  FileCheck,
  Send,
  AlertTriangle,
  Building,
  UserSquare,
  Brain,
  Loader2,
  TrendingUp,
  AlertOctagon,
  Lightbulb,
  BarChart3,
  ChevronRight,
  DollarSign
} from "lucide-react";

const Billing = () => {
  const { toast } = useToast();

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

  const { data: aiAnalysis, isLoading: isAnalyzing } = useAIBillingAnalysis(metrics);

  const renderAIInsight = (
    title: string, 
    icon: React.ReactNode, 
    content: string, 
    metrics: any, 
    benchmarks: any, 
    recommendations: string[]
  ) => (
    <Popover>
      <PopoverTrigger asChild>
        <div className="space-y-2 cursor-pointer hover:bg-medical-card-start/5 p-4 rounded-lg transition-colors group">
          <div className="flex items-center gap-2 text-medical-secondary font-semibold">
            {icon}
            <h4>{title}</h4>
            <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-medical-primary/80 pl-6">{content}</p>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-96 bg-medical-card-start/95 backdrop-blur-sm border-medical-secondary/20">
        <div className="space-y-4 p-4">
          <div className="flex items-center gap-2 text-medical-secondary font-semibold border-b border-medical-secondary/10 pb-2">
            {icon}
            <h4>{title}</h4>
          </div>
          
          <div className="space-y-4">
            <div>
              <h5 className="text-sm font-medium text-medical-secondary mb-2">Current Metrics</h5>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(metrics).map(([key, value]) => (
                  <div key={key} className="text-xs">
                    <span className="text-medical-primary/60">{key.replace(/_/g, ' ').toUpperCase()}: </span>
                    <span className="text-medical-primary font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium text-medical-secondary mb-2">Industry Benchmarks</h5>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(benchmarks).map(([key, value]) => (
                  <div key={key} className="text-xs">
                    <span className="text-medical-primary/60">{key.replace(/_/g, ' ').toUpperCase()}: </span>
                    <span className="text-medical-primary font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium text-medical-secondary mb-2">Recommendations</h5>
              <ul className="space-y-1">
                {recommendations.map((rec, index) => (
                  <li key={index} className="text-xs text-medical-primary/90 flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-medical-secondary mt-1.5" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-medical-secondary/10 pt-2 mt-2">
              <p className="text-xs text-medical-primary/70">{content}</p>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );

  const getIconForSection = (title: string) => {
    switch (title) {
      case 'Key Performance Indicators':
        return <BarChart3 className="w-5 h-5 text-blue-500" />;
      case 'Workflow Efficiency Analysis':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'Revenue Cycle Insights':
        return <DollarSign className="w-5 h-5 text-yellow-500" />;
      case 'Risk Alerts':
        return <AlertOctagon className="w-5 h-5 text-red-500" />;
      case 'Optimization Recommendations':
        return <Lightbulb className="w-5 h-5 text-purple-500" />;
      default:
        return <Brain className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-medical-accent">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider>
          <AppSidebar />
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

              {/* AI Analysis Card with futuristic design */}
              <Card className="p-6 bg-gradient-to-br from-medical-card-start to-medical-card-end relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-medical-gradient-start via-medical-gradient-middle to-medical-gradient-end opacity-5" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-6">
                    <Brain className="w-6 h-6 text-medical-secondary animate-pulse" />
                    <h3 className="text-lg font-semibold text-medical-primary">AI Billing Analysis</h3>
                  </div>
                  
                  {isAnalyzing ? (
                    <div className="flex items-center gap-2 text-medical-primary/80 justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-medical-secondary" />
                      <p>Processing billing metrics...</p>
                    </div>
                  ) : aiAnalysis ? (
                    <ScrollArea className="h-[300px] pr-4">
                      <div className="space-y-2">
                        {aiAnalysis.sections.map((section: any, index: number) => (
                          renderAIInsight(
                            section.title,
                            getIconForSection(section.title),
                            section.content,
                            section.metrics,
                            section.benchmarks,
                            section.recommendations
                          )
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <p className="text-medical-primary/80 text-center py-8">
                      No analysis available
                    </p>
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
