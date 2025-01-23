import { Card } from "@/components/ui/card";

export function DashboardView() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Active Dispatches</h2>
          <p>Content coming soon...</p>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
          <p>Content coming soon...</p>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <p>Content coming soon...</p>
        </Card>
      </div>
    </div>
  );
}