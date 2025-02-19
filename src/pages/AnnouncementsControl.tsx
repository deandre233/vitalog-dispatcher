
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { 
  Brain,
  Megaphone,
  Plus,
  Download,
  Search,
  Calendar,
  Filter,
  Users,
  AlertCircle,
  Bell,
  ArrowUpRight,
  LineChart,
  Activity,
  Clock,
  Tag,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Bulletin {
  id: number;
  title: string;
  author: string;
  expiry: string;
  targetGroups: string[];
  status: 'active' | 'expired';
  requiresSignature: boolean;
  seenBy: number;
  priority: 'low' | 'medium' | 'high';
}

const announcements: Bulletin[] = [
  {
    id: 1,
    title: "New AI-Powered Route Optimization System Launch",
    author: "System Admin",
    expiry: "2024-03-28",
    targetGroups: ["Operations", "Field Teams", "Dispatch"],
    status: "active",
    requiresSignature: true,
    seenBy: 24,
    priority: "high"
  },
  {
    id: 2,
    title: "Updated Safety Protocols for Field Operations",
    author: "Safety Director",
    expiry: "2024-03-15",
    targetGroups: ["Field Teams", "Supervisors"],
    status: "active",
    requiresSignature: true,
    seenBy: 45,
    priority: "medium"
  }
];

export default function BulletinControl() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");

  const getAIInsights = () => {
    toast.success("AI Analysis: 85% read rate across all bulletins", {
      description: "Engagement is highest on Tuesday mornings",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f8f9ff] to-[#f0f2ff]">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1 overflow-auto">
            {/* Main Content */}
            <div className="max-w-[1800px] mx-auto p-8 space-y-8">
              {/* Top Section with Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Hero Card */}
                <Card className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex justify-between items-start">
                      <div>
                        <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
                          <Bell className="h-8 w-8" />
                          Broadcast Hub
                        </h1>
                        <p className="text-blue-100 text-lg mb-8">Enterprise Communication Center</p>
                        <div className="flex gap-4 mt-4">
                          <Button onClick={getAIInsights} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm">
                            <Brain className="h-5 w-5 mr-2" />
                            AI Analytics
                          </Button>
                          <Button className="bg-white text-blue-600 hover:bg-white/90">
                            <Plus className="h-5 w-5 mr-2" />
                            Create Broadcast
                          </Button>
                        </div>
                      </div>
                      <ArrowUpRight className="h-16 w-16 text-white/20" />
                    </div>
                  </CardContent>
                </Card>

                {/* Right Column - Quick Stats */}
                <Card className="bg-white/50 backdrop-blur-md border-none shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-700">Quick Stats</CardTitle>
                    <CardDescription>Real-time metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Activity className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-gray-700">Active Broadcasts</span>
                      </div>
                      <span className="text-xl font-bold text-green-600">12</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <LineChart className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">Read Rate</span>
                      </div>
                      <span className="text-xl font-bold text-blue-600">85%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-purple-600" />
                        <span className="text-sm font-medium text-gray-700">Pending</span>
                      </div>
                      <span className="text-xl font-bold text-purple-600">3</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Search Bar and Filters */}
              <div className="flex flex-col lg:flex-row gap-4 items-center bg-white/50 backdrop-blur-md p-4 rounded-xl shadow-sm">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search broadcasts..."
                    className="pl-10 bg-white border-gray-200 focus:border-blue-500 transition-all duration-300"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-3 w-full lg:w-auto">
                  <Button variant="outline" className="flex-1 lg:flex-none bg-white hover:bg-gray-50">
                    <Calendar className="h-4 w-4 mr-2" />
                    Date
                  </Button>
                  <Button variant="outline" className="flex-1 lg:flex-none bg-white hover:bg-gray-50">
                    <Tag className="h-4 w-4 mr-2" />
                    Priority
                  </Button>
                  <Button variant="outline" className="flex-1 lg:flex-none bg-white hover:bg-gray-50">
                    <Filter className="h-4 w-4 mr-2" />
                    Status
                  </Button>
                </div>
              </div>

              {/* Broadcasts Table */}
              <Card className="bg-white/80 backdrop-blur-lg shadow-xl border-none overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-semibold text-gray-800">Active Broadcasts</CardTitle>
                    <Button variant="outline" className="bg-white">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50/50">
                        <TableHead className="font-semibold text-gray-700">ID</TableHead>
                        <TableHead className="font-semibold text-gray-700">Title</TableHead>
                        <TableHead className="font-semibold text-gray-700">Target Groups</TableHead>
                        <TableHead className="font-semibold text-gray-700">Expiry</TableHead>
                        <TableHead className="font-semibold text-gray-700">Status</TableHead>
                        <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {announcements.map((announcement) => (
                        <TableRow 
                          key={announcement.id} 
                          className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                        >
                          <TableCell className="font-medium">{announcement.id}</TableCell>
                          <TableCell className="max-w-md">
                            <div className="flex items-center gap-2">
                              {announcement.title}
                              {announcement.priority === 'high' && (
                                <AlertCircle className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              By {announcement.author} • {announcement.seenBy} views
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {announcement.targetGroups.map((group) => (
                                <Badge 
                                  key={group} 
                                  variant="secondary" 
                                  className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                                >
                                  {group}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span>{announcement.expiry}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={announcement.status === 'active' ? 'default' : 'destructive'}
                              className={announcement.status === 'active' 
                                ? 'bg-green-50 text-green-700 hover:bg-green-100' 
                                : 'bg-red-50 text-red-700 hover:bg-red-100'}
                            >
                              <div className="flex items-center gap-1">
                                {announcement.status === 'active' ? (
                                  <CheckCircle2 className="h-3 w-3" />
                                ) : (
                                  <XCircle className="h-3 w-3" />
                                )}
                                {announcement.status}
                              </div>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
}
