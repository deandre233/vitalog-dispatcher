import { ModuleGrid } from "@/components/dashboard/ModuleGrid";
import { QueueCard } from "@/components/dashboard/QueueCard";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Users, Building2, UserCog } from "lucide-react";

export function Index() {
  const queues = [
    { title: "Shifts Active", count: 2, variant: "active" },
    { title: "Shifts Overdue", count: 0, variant: "overdue" },
    { title: "Prior Auth Queue", count: 60, variant: "auth" },
    { title: "Request Queue", count: 0, variant: "request" },
    { title: "Confirmation Queue", count: 24, variant: "confirmation" },
  ] as const;

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Queue Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {queues.map((queue) => (
          <QueueCard
            key={queue.title}
            title={queue.title}
            count={queue.count}
            variant={queue.variant}
          />
        ))}
      </div>

      {/* Main Content Tabs */}
      <Card className="p-4">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-transparent">
            <TabsTrigger 
              value="general"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <Clock className="mr-2 h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger 
              value="calls"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <Users className="mr-2 h-4 w-4" />
              Calls
            </TabsTrigger>
            <TabsTrigger 
              value="facility"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <Building2 className="mr-2 h-4 w-4" />
              Facility
            </TabsTrigger>
            <TabsTrigger 
              value="crew"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <UserCog className="mr-2 h-4 w-4" />
              Crew
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6">
            <div className="grid gap-4">
              <h2 className="text-2xl font-bold">General Overview</h2>
              {/* Add general content */}
            </div>
          </TabsContent>

          <TabsContent value="calls" className="mt-6">
            <div className="grid gap-4">
              <h2 className="text-2xl font-bold">Calls Management</h2>
              {/* Add calls content */}
            </div>
          </TabsContent>

          <TabsContent value="facility" className="mt-6">
            <div className="grid gap-4">
              <h2 className="text-2xl font-bold">Facility Status</h2>
              {/* Add facility content */}
            </div>
          </TabsContent>

          <TabsContent value="crew" className="mt-6">
            <div className="grid gap-4">
              <h2 className="text-2xl font-bold">Crew Management</h2>
              {/* Add crew content */}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
