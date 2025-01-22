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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AIAnalysisSection } from "@/types/billing";
import { 
  ClipboardList, Users, FileText, Building2, Clock, AlertCircle,
  Upload, FileCheck, Send, AlertTriangle, Building, UserSquare,
  Brain, Loader2, TrendingUp, AlertOctagon, Lightbulb, BarChart3,
  ChevronRight, DollarSign, Info, Circuit, Cpu, Database, Network, 
  Radio, Rocket, Signal, Sparkles, Zap
} from "lucide-react";

interface MetricAnalysis {
  insights: string[];
  recommendations: string[];
  impact: string;
  trends: string[];
}

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

  const metricAnalysis: Record<string, MetricAnalysis> = {
    priorAuth: {
      insights: [
        "2 new prior authorizations require immediate attention",
        "20% increase in prior auth requests this week",
        "Average processing time: 48 hours"
      ],
      recommendations: [
        "Implement automated prior auth tracking",
        "Set up alerts for aging requests",
        "Review payer-specific requirements"
      ],
      impact: "Delayed prior auths can result in claim denials and delayed payments",
      trends: [
        "Upward trend in prior auth volume",
        "Consistent approval rate of 85%"
      ]
    },
    missingDemographics: {
      insights: [
        "43 patient records need demographic updates",
        "Most common missing fields: insurance ID, DOB",
        "15% increase in incomplete records"
      ],
      recommendations: [
        "Implement mandatory field validation",
        "Schedule patient information update campaign",
        "Train staff on data collection protocols"
      ],
      impact: "Missing demographics lead to claim rejections and delayed reimbursement",
      trends: [
        "Rising trend in incomplete records",
        "Data quality score decreased by 5%"
      ]
    },
    qaReview: {
      insights: [
        "124 items in QA review, down by 12",
        "Average review time: 72 hours",
        "Focus on reducing backlog"
      ],
      recommendations: [
        "Increase QA staffing during peak times",
        "Implement a triage system for urgent reviews",
        "Provide additional training for QA staff"
      ],
      impact: "Delays in QA can affect overall billing cycle",
      trends: [
        "Consistent increase in QA items",
        "Need for improved review processes"
      ]
    },
    masterQueue: {
      insights: [
        "239 items in the master queue, up by 15",
        "Average age of items: 5 days",
        "Focus on reducing aging items"
      ],
      recommendations: [
        "Prioritize items older than 7 days",
        "Implement daily review meetings",
        "Enhance communication with billing staff"
      ],
      impact: "Aging items can lead to delayed payments",
      trends: [
        "Increasing trend in master queue size",
        "Need for better item management"
      ]
    },
    reviewQueue: {
      insights: [
        "65 items ready for review, down by 3",
        "Average review time: 48 hours",
        "Focus on timely reviews"
      ],
      recommendations: [
        "Streamline review processes",
        "Implement automated reminders for reviewers",
        "Provide feedback to staff on review times"
      ],
      impact: "Timely reviews are critical for cash flow",
      trends: [
        "Stable review queue size",
        "Need for continuous improvement"
      ]
    },
    filingQueue: {
      insights: [
        "136 claims prepared for submission, up by 24",
        "Focus on timely filing to avoid denials",
        "Monitor submission success rates"
      ],
      recommendations: [
        "Implement a filing checklist",
        "Train staff on common filing errors",
        "Review payer requirements regularly"
      ],
      impact: "Delays in filing can lead to lost revenue",
      trends: [
        "Increasing trend in filing volume",
        "Need for improved filing accuracy"
      ]
    },
    transmissionQueue: {
      insights: [
        "4,527 claims pending electronic transmission, up by 204",
        "Monitor transmission success rates",
        "Focus on reducing transmission errors"
      ],
      recommendations: [
        "Implement automated transmission tracking",
        "Review transmission logs regularly",
        "Train staff on transmission processes"
      ],
      impact: "Transmission errors can delay payments",
      trends: [
        "Stable transmission queue size",
        "Need for better tracking"
      ]
    },
    exceptionQueue: {
      insights: [
        "1 critical exception requiring attention",
        "Focus on resolving exceptions quickly",
        "Monitor exception trends"
      ],
      recommendations: [
        "Implement a dedicated exception handling team",
        "Review exception causes regularly",
        "Enhance communication with payers"
      ],
      impact: "Unresolved exceptions can lead to significant revenue loss",
      trends: [
        "Stable exception queue size",
        "Need for proactive exception management"
      ]
    },
    facilityInvoicing: {
      insights: [
        "1 facility invoice pending review",
        "Focus on timely invoicing to avoid delays",
        "Monitor facility payment trends"
      ],
      recommendations: [
        "Implement a facility invoicing checklist",
        "Train staff on facility billing processes",
        "Review facility contracts regularly"
      ],
      impact: "Delays in facility invoicing can affect cash flow",
      trends: [
        "Stable facility invoicing volume",
        "Need for improved invoicing accuracy"
      ]
    },
    affiliateInvoicing: {
      insights: [
        "0 pending affiliate invoices",
        "Focus on maintaining strong affiliate relationships",
        "Monitor affiliate payment trends"
      ],
      recommendations: [
        "Regularly review affiliate contracts",
        "Enhance communication with affiliates",
        "Implement a feedback loop for affiliate invoicing"
      ],
      impact: "Strong affiliate relationships are critical for revenue",
      trends: [
        "Stable affiliate invoicing volume",
        "Need for proactive affiliate management"
      ]
    },
    patientInvoicing: {
      insights: [
        "36 new patient invoices ready for processing, up by 12",
        "Focus on timely patient invoicing to improve cash flow",
        "Monitor patient payment trends"
      ],
      recommendations: [
        "Implement a patient invoicing checklist",
        "Train staff on patient billing processes",
        "Review patient contracts regularly"
      ],
      impact: "Timely patient invoicing is critical for revenue",
      trends: [
        "Increasing trend in patient invoicing volume",
        "Need for improved patient communication"
      ]
    },
    openInvoices: {
      insights: [
        "363 total outstanding invoices pending payment, up by 25",
        "Focus on reducing outstanding invoices",
        "Monitor payment trends"
      ],
      recommendations: [
        "Implement a collections strategy",
        "Train staff on collections processes",
        "Review outstanding invoices regularly"
      ],
      impact: "Outstanding invoices can significantly affect cash flow",
      trends: [
        "Increasing trend in outstanding invoices",
        "Need for proactive collections management"
      ]
    }
  };

  const renderAIInsight = (
    title: string, 
    icon: React.ReactNode, 
    content: string, 
    metrics: Record<string, string | number> = {}, 
    benchmarks: Record<string, string | number> = {}, 
    recommendations: string[] = []
  ) => (
    <Popover key={title}>
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
            {Object.keys(metrics).length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-medical-secondary mb-2">Current Metrics</h5>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(metrics).map(([key, value]) => (
                    <div key={key} className="text-xs">
                      <span className="text-medical-primary/60">{key.replace(/_/g, ' ').toUpperCase()}: </span>
                      <span className="text-medical-primary font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {Object.keys(benchmarks).length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-medical-secondary mb-2">Industry Benchmarks</h5>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(benchmarks).map(([key, value]) => (
                    <div key={key} className="text-xs">
                      <span className="text-medical-primary/60">{key.replace(/_/g, ' ').toUpperCase()}: </span>
                      <span className="text-medical-primary font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recommendations && recommendations.length > 0 && (
              <div>
                <h5 className="text-sm font-medium mb-2">Recommendations</h5>
                <ul className="space-y-1">
                  {recommendations.map((rec, index) => (
                    <li key={index} className="text-xs text-medical-primary/90 flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-medical-secondary mt-1.5" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="border-t border-medical-secondary/10 pt-2 mt-2">
              <p className="text-xs text-medical-primary/70">{content}</p>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );

  const MetricCardWithAnalysis = ({ 
    title, 
    value, 
    icon: Icon, 
    change, 
    aiInsight 
  }: { 
    title: string; 
    value: string; 
    icon: any; 
    change: string; 
    aiInsight: string; 
  }) => {
    const analysis = metricAnalysis[title.toLowerCase().replace(/\s+/g, '')] || null;

    return (
      <div className="relative">
        <MetricCard
          title={title}
          value={value}
          icon={Icon}
          change={change}
          aiInsight={aiInsight}
        />
        {analysis && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
              >
                <Info className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <h4 className="font-medium">{title} Analysis</h4>
                </div>
                
                {analysis.insights.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium mb-2">Key Insights</h5>
                    <ul className="space-y-1">
                      {analysis.insights.map((insight, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <div className="w-1 h-1 rounded-full bg-blue-500 mt-2" />
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysis.recommendations.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium mb-2">Recommendations</h5>
                    <ul className="space-y-1">
                      {analysis.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <div className="w-1 h-1 rounded-full bg-green-500 mt-2" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysis.impact && (
                  <div>
                    <h5 className="text-sm font-medium mb-2">Business Impact</h5>
                    <p className="text-sm text-gray-600">{analysis.impact}</p>
                  </div>
                )}

                {analysis.trends.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium mb-2">Trends</h5>
                    <ul className="space-y-1">
                      {analysis.trends.map((trend, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <div className="w-1 h-1 rounded-full bg-purple-500 mt-2" />
                          {trend}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    );
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

              <Card className="p-6 bg-gradient-to-br from-medical-card-start to-medical-card-end relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-medical-gradient-start via-medical-gradient-middle to-medical-gradient-end opacity-5" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-medical-secondary/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-medical-secondary/50 to-transparent" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-medical-secondary/20 rounded-full blur-sm animate-pulse" />
                      <Brain className="w-7 h-7 text-medical-secondary relative animate-pulse" />
                    </div>
                    <h3 className="text-lg font-semibold text-medical-primary bg-clip-text text-transparent bg-gradient-to-r from-medical-primary to-medical-secondary">
                      AI Billing Analysis
                    </h3>
                  </div>
                  
                  {isAnalyzing ? (
                    <div className="flex items-center gap-3 text-medical-primary/80 justify-center py-8">
                      <div className="relative">
                        <div className="absolute -inset-1 bg-medical-secondary/20 rounded-full blur-sm animate-pulse" />
                        <Circuit className="w-6 h-6 animate-spin text-medical-secondary" />
                      </div>
                      <p className="animate-pulse">Processing billing metrics...</p>
                    </div>
                  ) : aiAnalysis?.sections ? (
                    <ScrollArea className="h-[300px] pr-4">
                      <div className="space-y-2">
                        {aiAnalysis.sections.map((section: AIAnalysisSection) => (
                          <Popover key={section.title}>
                            <PopoverTrigger asChild>
                              <div className="space-y-2 cursor-pointer hover:bg-medical-card-start/5 p-4 rounded-lg transition-all duration-300 group backdrop-blur-sm border border-transparent hover:border-medical-secondary/20 hover:shadow-lg hover:shadow-medical-secondary/5">
                                <div className="flex items-center gap-3 text-medical-secondary font-semibold">
                                  <div className="relative">
                                    <div className="absolute -inset-1 bg-medical-secondary/10 rounded-full blur-sm group-hover:animate-pulse" />
                                    {getIconForSection(section.title)}
                                  </div>
                                  <h4 className="group-hover:text-medical-secondary transition-colors">
                                    {section.title}
                                  </h4>
                                  <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                                </div>
                                <p className="text-medical-primary/80 pl-10 group-hover:text-medical-primary transition-colors">
                                  {section.content}
                                </p>
                              </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-96 bg-medical-card-start/95 backdrop-blur-sm border-medical-secondary/20">
                              <div className="space-y-4 p-4">
                                <div className="flex items-center gap-2 text-medical-secondary font-semibold border-b border-medical-secondary/10 pb-2">
                                  {getIconForSection(section.title)}
                                  <h4>{section.title}</h4>
                                </div>
                                
                                <div className="space-y-4">
                                  {section.metrics && Object.keys(section.metrics).length > 0 && (
                                    <div className="space-y-2">
                                      <h5 className="text-sm font-medium text-medical-secondary flex items-center gap-2">
                                        <Signal className="w-4 h-4" />
                                        Current Metrics
                                      </h5>
                                      <div className="grid grid-cols-2 gap-2 bg-medical-secondary/5 p-3 rounded-lg">
                                        {Object.entries(section.metrics).map(([key, value]) => (
                                          <div key={key} className="text-xs">
                                            <span className="text-medical-primary/60">{key.replace(/_/g, ' ').toUpperCase()}: </span>
                                            <span className="text-medical-primary font-medium">{String(value)}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {section.benchmarks && Object.keys(section.benchmarks).length > 0 && (
                                    <div className="space-y-2">
                                      <h5 className="text-sm font-medium text-medical-secondary flex items-center gap-2">
                                        <Database className="w-4 h-4" />
                                        Industry Benchmarks
                                      </h5>
                                      <div className="grid grid-cols-2 gap-2 bg-medical-secondary/5 p-3 rounded-lg">
                                        {Object.entries(section.benchmarks).map(([key, value]) => (
                                          <div key={key} className="text-xs">
                                            <span className="text-medical-primary/60">{key.replace(/_/g, ' ').toUpperCase()}: </span>
                                            <span className="text-medical-primary font-medium">{String(value)}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {section.recommendations && section.recommendations.length > 0 && (
                                    <div className="space-y-2">
                                      <h5 className="text-sm font-medium text-medical-secondary flex items-center gap-2">
                                        <Sparkles className="w-4 h-4" />
                                        Recommendations
                                      </h5>
                                      <div className="space-y-2 bg-medical-secondary/5 p-3 rounded-lg">
                                        {section.recommendations.map((rec, index) => (
                                          <div key={index} className="text-xs text-medical-primary/90 flex items-start gap-2">
                                            <div className="w-1 h-1 rounded-full bg-medical-secondary mt-1.5 animate-pulse" />
                                            {rec}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  <div className="border-t border-medical-secondary/10 pt-2 mt-2">
                                    <p className="text-xs text-medical-primary/70">{section.content}</p>
                                  </div>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
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
                <MetricCardWithAnalysis
                  title="Prior Auth Queue"
                  value="10"
                  icon={ClipboardList}
                  change="+2"
                  aiInsight="2 new prior authorizations require immediate attention"
                />
                <MetricCardWithAnalysis
                  title="Missing Demographics"
                  value="43"
                  icon={Users}
                  change="+5"
                  aiInsight="Patient information needs to be updated for billing"
                />
                <MetricCardWithAnalysis
                  title="QA Review Queue"
                  value="124"
                  icon={FileCheck}
                  change="-12"
                  aiInsight="Quality assurance review backlog reduced by 12 since yesterday"
                />
                <MetricCardWithAnalysis
                  title="Master Queue"
                  value="239"
                  icon={AlertCircle}
                  change="+15"
                  aiInsight="15 new items added to master review queue"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCardWithAnalysis
                  title="Review Queue"
                  value="65"
                  icon={FileText}
                  change="-3"
                  aiInsight="Claims ready for review"
                />
                <MetricCardWithAnalysis
                  title="Filing Queue"
                  value="136"
                  icon={Send}
                  change="+24"
                  aiInsight="Claims prepared for submission"
                />
                <MetricCardWithAnalysis
                  title="Transmission Queue"
                  value="4,527"
                  icon={Upload}
                  change="+204"
                  aiInsight="Claims pending electronic transmission"
                />
                <MetricCardWithAnalysis
                  title="Exception Queue"
                  value="1"
                  icon={AlertTriangle}
                  change="0"
                  aiInsight="Critical exceptions requiring attention"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCardWithAnalysis
                  title="Facility Invoicing"
                  value="1"
                  icon={Building}
                  change="0"
                  aiInsight="Facility invoices pending review"
                />
                <MetricCardWithAnalysis
                  title="Affiliate Invoicing"
                  value="0"
                  icon={Building2}
                  change="0"
                  aiInsight="No pending affiliate invoices"
                />
                <MetricCardWithAnalysis
                  title="Patient Invoicing"
                  value="36"
                  icon={UserSquare}
                  change="+12"
                  aiInsight="New patient invoices ready for processing"
                />
                <MetricCardWithAnalysis
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

const getIconForSection = (title: string) => {
  switch (title) {
    case 'Key Performance Indicators':
      return <Signal className="w-5 h-5 text-blue-500" />;
    case 'Workflow Efficiency Analysis':
      return <Cpu className="w-5 h-5 text-green-500" />;
    case 'Revenue Cycle Insights':
      return <Zap className="w-5 h-5 text-yellow-500" />;
    case 'Risk Alerts':
      return <Radio className="w-5 h-5 text-red-500" />;
    case 'Optimization Recommendations':
      return <Rocket className="w-5 h-5 text-purple-500" />;
    default:
      return <Network className="w-5 h-5 text-gray-500" />;
  }
};

export default Billing;
