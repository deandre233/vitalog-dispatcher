
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { 
  Ambulance, 
  DollarSign, 
  ClipboardList, 
  Users, 
  Settings, 
  Database, 
  ShieldCheck, 
  Headphones,
  BarChart,
  TrendingUp,
  Truck,
  UserCheck,
  Briefcase,
  Brain,
  Sparkles,
  Zap,
  Bot,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { AIInsightsPanel } from "@/components/dispatch/ai/AIInsightsPanel";
import { cn } from "@/lib/utils";
import type { AIInsight } from "@/types/service-queue";

const logStartup = () => {
  console.log("Index component starting to render...");
};

// Mock AI insights with the correct type values
const mockAIInsights: AIInsight[] = [
  {
    type: 'prediction',
    message: 'High volume expected in South District today based on historical patterns',
    confidence: 0.92,
    impact: 'medium'
  },
  {
    type: 'optimization',
    message: 'Crew allocation could be optimized for Route 7 based on current demand',
    confidence: 0.86,
    impact: 'high'
  },
  {
    type: 'warning',
    message: 'Weather alert may affect northern routes in the afternoon',
    confidence: 0.78,
    impact: 'medium'
  }
];

const menuItems = [
  {
    title: "Dispatch",
    icon: Ambulance,
    description: "Manage active dispatches and transport requests",
    path: "/dispatch",
    color: "text-medical-secondary",
    gradient: "from-medical-gradient-start to-medical-gradient-middle",
    aiSuggestion: "3 high-priority dispatches need attention"
  },
  {
    title: "Billing",
    icon: DollarSign,
    description: "Handle invoices and payment processing",
    path: "/billing",
    color: "text-emerald-500",
    gradient: "from-emerald-400 to-teal-500",
    aiSuggestion: "Invoice efficiency up 12% this week"
  },
  {
    title: "Supervision",
    icon: ClipboardList,
    description: "Monitor operations and staff performance",
    path: "/performance",
    color: "text-indigo-500",
    gradient: "from-indigo-400 to-purple-500",
    aiSuggestion: "Crew #42 exceeding performance metrics"
  },
  {
    title: "HR",
    icon: Briefcase,
    description: "Manage employees, payroll, and HR operations",
    path: "/hr",
    color: "text-amber-500",
    gradient: "from-amber-400 to-orange-500",
    aiSuggestion: "5 certifications expiring next month"
  },
  {
    title: "Settings",
    icon: Settings,
    description: "Configure system preferences and alerts",
    path: "/alerts",
    color: "text-slate-600",
    gradient: "from-slate-400 to-slate-500"
  },
  {
    title: "Data Hub",
    icon: Database,
    description: "Access and analyze transport data",
    path: "/routes",
    color: "text-cyan-500",
    gradient: "from-cyan-400 to-blue-500",
    aiSuggestion: "New pattern detected in weekend calls"
  },
  {
    title: "Authorization",
    icon: ShieldCheck,
    description: "Manage access and permissions",
    path: "/settings",
    color: "text-rose-500",
    gradient: "from-rose-400 to-pink-500"
  },
  {
    title: "Support",
    icon: Headphones,
    description: "Get help and access resources",
    path: "/support",
    color: "text-violet-500",
    gradient: "from-violet-400 to-purple-500"
  },
  {
    title: "Performance",
    icon: BarChart,
    description: "Monitor key business metrics and analytics",
    path: "/analytics",
    color: "text-blue-500",
    gradient: "from-blue-400 to-indigo-500",
    metrics: [
      {
        icon: UserCheck,
        label: "Crew Performance",
        value: "94%",
        change: "+2.3%"
      },
      {
        icon: Truck,
        label: "Fleet Utilization",
        value: "87%",
        change: "+1.5%"
      },
      {
        icon: TrendingUp,
        label: "Profit Margin",
        value: "$142K",
        change: "+12.5%"
      }
    ]
  }
];

const Index = () => {
  logStartup();
  console.log("Menu items loaded:", menuItems.length);
  
  const [aiRecommendation, setAiRecommendation] = useState("");
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [fadeItems, setFadeItems] = useState(false);
  
  useEffect(() => {
    // Simulate AI generating a recommendation
    const recommendations = [
      "Based on current traffic patterns, prioritize northern sector dispatches today",
      "Vehicle maintenance schedule optimization available - could reduce downtime by 12%",
      "Crew resource allocation could be improved for afternoon shifts",
      "Weather patterns indicate potential increase in call volume this weekend"
    ];
    
    const timer = setTimeout(() => {
      setAiRecommendation(recommendations[Math.floor(Math.random() * recommendations.length)]);
      setFadeItems(true);
    }, 700);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 bg-gradient-to-br from-medical-accent via-blue-50 to-white overflow-auto">
        <main className="p-6 md:p-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-start mb-8">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-medical-primary via-blue-700 to-indigo-700 bg-clip-text text-transparent pb-1 animate-fade-in">
                Welcome to Dispatch Control
              </h1>
              <p className="text-medical-primary/70 text-lg animate-fade-in" style={{ animationDelay: "200ms" }}>
                Select a module to get started
              </p>
            </div>
            
            <Button 
              variant="outline" 
              className={cn(
                "gap-2 items-center bg-blue-50/50 border-blue-100",
                "hover:bg-blue-100/80 transition-all duration-300",
                "hidden md:flex animate-fade-in"
              )}
              onClick={() => setShowAIPanel(!showAIPanel)}
              style={{ animationDelay: "400ms" }}
            >
              <Brain className="w-4 h-4 text-blue-600" />
              <span className="text-blue-800">AI Insights</span>
              {!showAIPanel && (
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              )}
            </Button>
          </div>
          
          {showAIPanel && (
            <div className="mb-6 animate-fade-in">
              <AIInsightsPanel 
                insights={mockAIInsights} 
                className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4 shadow-sm"
              />
            </div>
          )}
          
          {aiRecommendation && (
            <div className={`mb-8 transition-opacity duration-700 ${fadeItems ? 'opacity-100' : 'opacity-0'}`}>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-4 rounded-lg shadow-sm flex items-start gap-3">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-full">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-blue-800 font-medium flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-blue-500" />
                      AI Recommendation
                    </h3>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      96% confidence
                    </span>
                  </div>
                  <p className="text-gray-700">{aiRecommendation}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity duration-700 ${fadeItems ? 'opacity-100' : 'opacity-0'}`}>
            {(() => {
              console.log("Starting to render menu items grid");
              return menuItems.slice(0, -2).map((item, index) => {
                console.log(`Rendering menu item ${index + 1}:`, item.title);
                return (
                <Link 
                  key={item.title} 
                  to={item.path}
                  className="block transform transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                  style={{ animationDelay: `${100 * index}ms` }}
                >
                  <Card className={`
                    h-full relative overflow-hidden
                    bg-gradient-to-br ${item.gradient}
                    border-0 shadow-lg hover:shadow-xl
                    group transition-all duration-500
                    before:absolute before:inset-0
                    before:bg-white before:z-10 before:opacity-95
                    before:transition-opacity before:duration-500
                    hover:before:opacity-90
                    after:absolute after:inset-0 after:-z-10
                    after:bg-gradient-to-br ${item.gradient}
                    after:opacity-0 hover:after:opacity-100
                    after:transition-opacity after:duration-500
                    backdrop-blur-sm
                    hover:shadow-glow
                  `}>
                    <div className="relative z-20 p-6">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className={`
                          p-3 rounded-xl ${item.color}
                          bg-white/80 shadow-lg
                          group-hover:scale-110 group-hover:shadow-xl
                          transform transition-all duration-500
                          backdrop-blur-sm
                          group-hover:rotate-3
                        `}>
                          <item.icon className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-semibold text-medical-primary group-hover:text-medical-secondary transition-colors duration-300">
                          {item.title}
                        </h2>
                        <p className="text-sm text-medical-primary/70 group-hover:text-medical-primary/90 transition-colors duration-300">
                          {item.description}
                        </p>
                        
                        {item.aiSuggestion && (
                          <div className="mt-3 pt-3 border-t border-gray-100 w-full">
                            <div className="flex items-center gap-2 text-xs text-left">
                              <Brain className="w-3 h-3 text-blue-500 flex-shrink-0" />
                              <span className="text-blue-700">{item.aiSuggestion}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
                );
              });
            })()}
            
            {(() => {
              return menuItems.slice(-2).map((item, index) => {
                console.log(`Rendering special panel ${index + 1}:`, item.title);
                return (
                <Link 
                  key={item.title} 
                  to={item.path}
                  className="block transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 xl:col-span-2"
                  style={{ animationDelay: `${100 * (menuItems.length - 2 + index)}ms` }}
                >
                  <Card className={`
                    h-full relative overflow-hidden
                    bg-gradient-to-br ${item.gradient}
                    border-0 shadow-lg hover:shadow-xl
                    group transition-all duration-500
                    before:absolute before:inset-0
                    before:bg-white before:z-10 before:opacity-95
                    before:transition-opacity before:duration-500
                    hover:before:opacity-90
                    after:absolute after:inset-0 after:-z-10
                    after:bg-gradient-to-br ${item.gradient}
                    after:opacity-0 hover:after:opacity-100
                    after:transition-opacity after:duration-500
                    backdrop-blur-sm
                    hover:shadow-glow
                  `}>
                    <div className="relative z-20 p-6">
                      <div className="flex items-center space-x-6">
                        <div className={`
                          p-3 rounded-xl ${item.color}
                          bg-white/80 shadow-lg
                          group-hover:scale-110 group-hover:shadow-xl
                          transform transition-all duration-500
                          backdrop-blur-sm
                          group-hover:rotate-3
                        `}>
                          <item.icon className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                          <h2 className="text-xl font-semibold text-medical-primary group-hover:text-medical-secondary transition-colors duration-300">
                            {item.title}
                          </h2>
                          <p className="text-sm text-medical-primary/70 group-hover:text-medical-primary/90 transition-colors duration-300">
                            {item.description}
                          </p>
                          
                          {item.metrics && (
                            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
                              {item.metrics.map((metric, idx) => (
                                <div key={idx} className="flex flex-col">
                                  <div className="flex items-center gap-2 mb-1">
                                    <metric.icon className="w-3 h-3 text-blue-500" />
                                    <span className="text-xs text-gray-500">{metric.label}</span>
                                  </div>
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-lg font-semibold text-gray-800">{metric.value}</span>
                                    <span className={`text-xs ${metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                      {metric.change}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
                );
              });
            })()}
          </div>
          
          <div className={`mt-8 transition-opacity duration-700 ${fadeItems ? 'opacity-100' : 'opacity-0'}`}>
            <Card className="border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-5">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">AI-Powered Dispatch Optimization</h3>
                    <p className="text-gray-600">Let our AI analyze your routes and suggest optimal resource allocation</p>
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white gap-2">
                  <span>Try Smart Optimization</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

console.log("Index component definition completed");

export default Index;
