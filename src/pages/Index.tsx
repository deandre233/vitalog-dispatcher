
import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { 
  Ambulance, 
  DollarSign, 
  ClipboardList, 
  Settings, 
  Database, 
  ShieldCheck, 
  Headphones,
  BarChart,
  TrendingUp,
  Truck,
  UserCheck,
  Briefcase,
  Sparkle,
  BrainCircuit,
  Bot,
  ArrowRight,
  ArrowUpRight,
  Zap,
  LineChart,
  CalendarDays,
  Users,
  Gauge,
  AlertCircle,
  CircleCheck
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AIInsightsPanel } from "@/components/dispatch/ai/AIInsightsPanel";
import { cn } from "@/lib/utils";
import type { AIInsight } from "@/types/service-queue";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    color: "text-blue-600",
    gradient: "from-blue-400/20 to-indigo-400/20",
    borderGradient: "from-blue-400 to-indigo-400",
    aiSuggestion: "3 high-priority dispatches need attention"
  },
  {
    title: "Billing",
    icon: DollarSign,
    description: "Handle invoices and payment processing",
    path: "/billing",
    color: "text-emerald-600",
    gradient: "from-emerald-400/20 to-teal-400/20",
    borderGradient: "from-emerald-400 to-teal-400",
    aiSuggestion: "Invoice efficiency up 12% this week"
  },
  {
    title: "Supervision",
    icon: ClipboardList,
    description: "Monitor operations and staff performance",
    path: "/performance",
    color: "text-indigo-600",
    gradient: "from-indigo-400/20 to-purple-400/20",
    borderGradient: "from-indigo-400 to-purple-400",
    aiSuggestion: "Crew #42 exceeding performance metrics"
  },
  {
    title: "HR",
    icon: Briefcase,
    description: "Manage employees, payroll, and HR operations",
    path: "/hr",
    color: "text-amber-600",
    gradient: "from-amber-400/20 to-orange-400/20",
    borderGradient: "from-amber-400 to-orange-400",
    aiSuggestion: "5 certifications expiring next month"
  },
  {
    title: "Settings",
    icon: Settings,
    description: "Configure system preferences and alerts",
    path: "/alerts",
    color: "text-slate-600",
    gradient: "from-slate-400/20 to-slate-500/20",
    borderGradient: "from-slate-400 to-slate-500"
  },
  {
    title: "Data Hub",
    icon: Database,
    description: "Access and analyze transport data",
    path: "/routes",
    color: "text-cyan-600",
    gradient: "from-cyan-400/20 to-blue-400/20",
    borderGradient: "from-cyan-400 to-blue-400",
    aiSuggestion: "New pattern detected in weekend calls"
  },
  {
    title: "Authorization",
    icon: ShieldCheck,
    description: "Manage access and permissions",
    path: "/settings",
    color: "text-rose-600",
    gradient: "from-rose-400/20 to-pink-400/20",
    borderGradient: "from-rose-400 to-pink-400"
  },
  {
    title: "Support",
    icon: Headphones,
    description: "Get help and access resources",
    path: "/support",
    color: "text-violet-600",
    gradient: "from-violet-400/20 to-purple-400/20",
    borderGradient: "from-violet-400 to-purple-400"
  }
];

const performanceMetrics = {
  title: "Performance",
  icon: BarChart,
  description: "Monitor key business metrics and analytics",
  path: "/analytics",
  color: "text-blue-600",
  gradient: "from-blue-400/10 to-indigo-400/10",
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
};

const quickStats = [
  { 
    label: "Active Units", 
    value: "14", 
    icon: Gauge, 
    change: "+2", 
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  { 
    label: "Pending Dispatches", 
    value: "7", 
    icon: AlertCircle, 
    change: "-3", 
    color: "text-amber-600",
    bgColor: "bg-amber-100" 
  },
  { 
    label: "On-Duty Staff", 
    value: "32", 
    icon: Users, 
    change: "+5", 
    color: "text-purple-600",
    bgColor: "bg-purple-100" 
  },
  { 
    label: "Completed Today", 
    value: "28", 
    icon: CircleCheck, 
    change: "+12", 
    color: "text-emerald-600",
    bgColor: "bg-emerald-100" 
  }
];

const Index = () => {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 bg-gradient-to-br from-blue-50 via-indigo-50/40 to-white overflow-auto">
        <main className="p-6 md:p-8 max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-700 pb-1">
                  Command Center
                </h1>
                <p className="text-slate-600 text-lg">
                  Unified operations management platform
                </p>
              </div>
              
              <Button 
                variant="outline" 
                className={cn(
                  "gap-2 items-center border-blue-200 bg-white shadow-sm",
                  "hover:bg-blue-50 transition-all duration-300"
                )}
                onClick={() => setShowAIPanel(!showAIPanel)}
              >
                <BrainCircuit className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700">AI Insights</span>
                {!showAIPanel && (
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                )}
              </Button>
            </motion.div>
            
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickStats.map((stat, index) => (
                <Card key={index} className="p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                          stat.change.startsWith('+') 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {stat.change}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </motion.div>
            
            {showAIPanel && (
              <motion.div 
                variants={itemVariants}
                className="overflow-hidden rounded-xl"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AIInsightsPanel 
                  insights={mockAIInsights} 
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4 shadow-sm"
                />
              </motion.div>
            )}
            
            {aiRecommendation && (
              <motion.div 
                variants={itemVariants}
                className={`transition-opacity duration-700 ${fadeItems ? 'opacity-100' : 'opacity-0'}`}
              >
                <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-indigo-100 p-5 rounded-xl shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-3 rounded-lg shadow-md">
                      <BrainCircuit className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-indigo-800">AI Recommendation</h3>
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                          High confidence
                        </span>
                      </div>
                      <p className="text-gray-700">{aiRecommendation}</p>
                      <div className="flex justify-end mt-3">
                        <Button size="sm" variant="ghost" className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 gap-1">
                          <span>View analysis</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                className="col-span-full" 
                variants={itemVariants}
              >
                <Card className="p-4 border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50/50">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg shadow-md">
                      <LineChart className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">Today's Overview</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4 border-b border-blue-100 pb-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Transport Volume</div>
                      <div className="text-2xl font-bold text-gray-800">42</div>
                      <div className="text-xs text-green-600">↑ 12% from yesterday</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Response Time</div>
                      <div className="text-2xl font-bold text-gray-800">8.2m</div>
                      <div className="text-xs text-green-600">↓ 0.3m improvement</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Utilization</div>
                      <div className="text-2xl font-bold text-gray-800">86%</div>
                      <div className="text-xs text-green-600">↑ 4% increase</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">On-Time Rate</div>
                      <div className="text-2xl font-bold text-gray-800">94%</div>
                      <div className="text-xs text-green-600">↑ 2% improvement</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      <CalendarDays className="inline mr-1 h-4 w-4" /> 
                      Data updated 23 minutes ago
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                      View detailed report <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
            
            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  variants={itemVariants}
                  className="group"
                  whileHover={{ y: -5, transition: { type: "spring", stiffness: 300, damping: 15 } }}
                >
                  <Link to={item.path}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Card className={`
                            h-full relative overflow-hidden border-0 shadow-md
                            bg-white hover:shadow-lg
                            transition-all duration-500
                          `}>
                            <div className={`
                              absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500
                              bg-gradient-to-br ${item.gradient}
                            `} />
                            <div className={`
                              absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.borderGradient}
                              opacity-0 group-hover:opacity-100 transition-opacity duration-500
                            `} />
                            <div className="relative z-20 p-6">
                              <div className="flex flex-col items-center text-center space-y-4">
                                <div className={`
                                  p-3 rounded-xl ${item.color} bg-white shadow-md
                                  group-hover:shadow-lg transform group-hover:scale-110
                                  transition-all duration-500 ring-1 ring-gray-100
                                `}>
                                  <item.icon className="w-7 h-7" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                                  {item.title}
                                </h2>
                                <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                                  {item.description}
                                </p>
                                
                                {item.aiSuggestion && (
                                  <div className="mt-3 pt-3 border-t border-gray-100 w-full">
                                    <div className="flex items-center gap-2 text-xs text-left">
                                      <Sparkle className="w-3 h-3 text-blue-500 flex-shrink-0" />
                                      <span className="text-blue-600 font-medium">{item.aiSuggestion}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Card>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Navigate to {item.title}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Link to={performanceMetrics.path}>
                <Card className={`
                  relative overflow-hidden border border-gray-100
                  shadow-md hover:shadow-lg transition-all duration-300
                `}>
                  <div className={`
                    absolute inset-0 opacity-30 transition-opacity duration-500
                    bg-gradient-to-br ${performanceMetrics.gradient}
                  `} />
                  <div className="relative z-10 p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${performanceMetrics.color} bg-white shadow-md`}>
                          <performanceMetrics.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-gray-800">
                            {performanceMetrics.title}
                          </h2>
                          <p className="text-sm text-gray-500">
                            {performanceMetrics.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 md:mt-0">
                        {performanceMetrics.metrics.map((metric, idx) => (
                          <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="p-2 rounded-full bg-blue-50">
                                <metric.icon className="w-4 h-4 text-blue-500" />
                              </div>
                              <span className="text-sm text-gray-500">{metric.label}</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-semibold text-gray-800">{metric.value}</span>
                              <span className={`text-xs px-1.5 py-0.5 rounded-full ${metric.change.startsWith('+') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {metric.change}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card className="border border-indigo-100 bg-white p-5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-purple-50/50" />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg shadow-md">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">AI-Powered Dispatch Optimization</h3>
                      <p className="text-gray-600">Let our AI analyze your routes and suggest optimal resource allocation</p>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white gap-2 shadow-md hover:shadow-lg transition-all">
                    <span>Try Smart Optimization</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
