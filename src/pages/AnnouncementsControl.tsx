
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

  const generateSummary = () => {
    toast.success("AI Summary Generated", {
      description: "Summary of current bulletins has been created and exported",
    });
  };

  const suggestTargetGroups = () => {
    toast.info("AI Targeting Suggestion", {
      description: "Based on content analysis, consider including Dispatch team in bulletin #2",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto">
              {/* Header Section */}
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Megaphone className="h-6 w-6 text-blue-500" />
                  Bulletin Control Center
                </h1>
                <div className="flex gap-2">
                  <Button onClick={getAIInsights} variant="secondary" className="gap-2">
                    <Brain className="h-4 w-4" />
                    AI Insights
                  </Button>
                  <Button variant="default" className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Bulletin
                  </Button>
                </div>
              </div>

              {/* Analytics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-white/50 backdrop-blur-sm border border-blue-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Active Bulletins</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">12</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/50 backdrop-blur-sm border border-green-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Read Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">85%</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/50 backdrop-blur-sm border border-purple-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Pending Signatures</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">3</div>
                  </CardContent>
                </Card>
              </div>

              {/* Controls */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search bulletins..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Filter Date
                </Button>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Status
                </Button>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>

              {/* Main Table */}
              <Card className="bg-white/50 backdrop-blur-sm">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Target Groups</TableHead>
                      <TableHead>Expiry</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {announcements.map((announcement) => (
                      <TableRow key={announcement.id}>
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
                              <Badge key={group} variant="secondary" className="text-xs">
                                {group}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{announcement.expiry}</TableCell>
                        <TableCell>
                          <Badge
                            variant={announcement.status === 'active' ? 'default' : 'destructive'}
                          >
                            {announcement.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm">
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
