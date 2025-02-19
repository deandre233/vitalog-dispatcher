
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
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
  AlertCircle
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-medical-accent to-white">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1 overflow-auto p-8">
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Hero Section */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-indigo-600/50 backdrop-blur-sm"></div>
                <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                      <Megaphone className="h-8 w-8" />
                      Command Center
                    </h1>
                    <p className="text-blue-100">Centralized Broadcast Management System</p>
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={getAIInsights} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/30 border">
                      <Brain className="h-5 w-5 mr-2" />
                      AI Insights
                    </Button>
                    <Button className="bg-white text-blue-600 hover:bg-white/90">
                      <Plus className="h-5 w-5 mr-2" />
                      New Broadcast
                    </Button>
                  </div>
                </div>
              </div>

              {/* Analytics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-md border-blue-100/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Active Broadcasts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">12</div>
                    <div className="text-sm text-gray-500 mt-1">+2 from last week</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-md border-green-100/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Read Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">85%</div>
                    <div className="text-sm text-gray-500 mt-1">Target: 90%</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-md border-purple-100/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Pending Signatures</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">3</div>
                    <div className="text-sm text-gray-500 mt-1">Due within 24h</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-md border-orange-100/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Engagement Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-600">92</div>
                    <div className="text-sm text-gray-500 mt-1">Above average</div>
                  </CardContent>
                </Card>
              </div>

              {/* Search and Controls */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-lg backdrop-blur-sm -z-10"></div>
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search broadcasts..."
                    className="pl-10 bg-white/50 border-0 focus:ring-2 ring-blue-500/20"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="bg-white/50 backdrop-blur-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Date Range
                  </Button>
                  <Button variant="outline" className="bg-white/50 backdrop-blur-sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" className="bg-white/50 backdrop-blur-sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Main Table */}
              <Card className="bg-white/60 backdrop-blur-lg shadow-xl">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-blue-100">
                      <TableHead className="font-semibold text-blue-900">ID</TableHead>
                      <TableHead className="font-semibold text-blue-900">Title</TableHead>
                      <TableHead className="font-semibold text-blue-900">Target Groups</TableHead>
                      <TableHead className="font-semibold text-blue-900">Expiry</TableHead>
                      <TableHead className="font-semibold text-blue-900">Status</TableHead>
                      <TableHead className="font-semibold text-blue-900">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {announcements.map((announcement) => (
                      <TableRow key={announcement.id} className="border-b border-blue-50 hover:bg-blue-50/50 transition-colors">
                        <TableCell className="font-medium">{announcement.id}</TableCell>
                        <TableCell className="max-w-md">
                          <div className="flex items-center gap-2">
                            {announcement.title}
                            {announcement.priority === 'high' && (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {announcement.targetGroups.map((group) => (
                              <Badge 
                                key={group} 
                                variant="secondary" 
                                className="bg-blue-100/50 text-blue-700 hover:bg-blue-200/50"
                              >
                                {group}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{announcement.expiry}</TableCell>
                        <TableCell>
                          <Badge
                            variant={announcement.status === 'active' ? 'default' : 'destructive'}
                            className={announcement.status === 'active' 
                              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                              : 'bg-red-100 text-red-700 hover:bg-red-200'}
                          >
                            {announcement.status}
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
              </Card>
            </div>
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
}
