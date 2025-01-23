import { useState } from "react";
import { useServiceRequests } from "@/hooks/useServiceRequests";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, AlertCircle, CheckCircle2, Plus } from "lucide-react";
import { format } from "date-fns";

export function ServiceRequestView() {
  const { requests, isLoading, createRequest } = useServiceRequests();
  const [showForm, setShowForm] = useState(false);
  const [newRequest, setNewRequest] = useState({
    request_type: "",
    priority: "normal",
    notes: "",
    service_date: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRequest.mutateAsync({
        ...newRequest,
        requested_date: new Date().toISOString()
      });
      setShowForm(false);
      setNewRequest({ request_type: "", priority: "normal", notes: "", service_date: "" });
    } catch (error) {
      console.error('Error creating request:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div>Loading service requests...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Service Requests</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          New Request
        </Button>
      </div>

      {showForm && (
        <Card className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="request_type">Request Type</Label>
              <Select
                onValueChange={(value) => setNewRequest({ ...newRequest, request_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select request type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                onValueChange={(value) => setNewRequest({ ...newRequest, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="service_date">Service Date</Label>
              <Input
                id="service_date"
                type="datetime-local"
                value={newRequest.service_date}
                onChange={(e) => setNewRequest({ ...newRequest, service_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newRequest.notes}
                onChange={(e) => setNewRequest({ ...newRequest, notes: e.target.value })}
                placeholder="Add any additional notes..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createRequest.isPending}>
                {createRequest.isPending ? "Creating..." : "Create Request"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {requests?.map((request) => (
          <Card key={request.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold">{request.request_type}</h3>
                <p className="text-sm text-gray-500">
                  {request.patients?.first_name} {request.patients?.last_name}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(request.status)}`}>
                {request.status}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>
                  {format(new Date(request.requested_date), 'MMM d, yyyy h:mm a')}
                </span>
              </div>
              {request.priority && (
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="capitalize">{request.priority} Priority</span>
                </div>
              )}
              {request.notes && (
                <p className="text-gray-600 mt-2">{request.notes}</p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}