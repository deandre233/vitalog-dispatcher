import { useState } from "react";
import { useRouteOptimizations } from "@/hooks/useRouteOptimization";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { MapPin, RotateCw, Plus } from "lucide-react";
import { toast } from "sonner";

export function RouteOptimizationView() {
  const { routes, isLoading, createRoute } = useRouteOptimizations();
  const [showForm, setShowForm] = useState(false);
  const [newRoute, setNewRoute] = useState({
    route_name: "",
    start_location: "",
    end_location: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRoute.mutateAsync(newRoute);
      setShowForm(false);
      setNewRoute({ route_name: "", start_location: "", end_location: "" });
    } catch (error) {
      console.error('Error creating route:', error);
    }
  };

  if (isLoading) {
    return <div>Loading route optimizations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Route Optimizations</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          New Route
        </Button>
      </div>

      {showForm && (
        <Card className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="route_name">Route Name</Label>
              <Input
                id="route_name"
                value={newRoute.route_name}
                onChange={(e) => setNewRoute({ ...newRoute, route_name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start_location">Start Location</Label>
              <Input
                id="start_location"
                value={newRoute.start_location}
                onChange={(e) => setNewRoute({ ...newRoute, start_location: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_location">End Location</Label>
              <Input
                id="end_location"
                value={newRoute.end_location}
                onChange={(e) => setNewRoute({ ...newRoute, end_location: e.target.value })}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createRoute.isPending}>
                {createRoute.isPending ? "Creating..." : "Create Route"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {routes?.map((route) => (
          <Card key={route.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold">{route.route_name}</h3>
              <Button variant="ghost" size="icon">
                <RotateCw className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-500" />
                <span>{route.start_location}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                <span>{route.end_location}</span>
              </div>
            </div>
            {route.optimization_score && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Optimization Score</span>
                  <span>{route.optimization_score}%</span>
                </div>
                <Progress value={route.optimization_score} className="h-2" />
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}