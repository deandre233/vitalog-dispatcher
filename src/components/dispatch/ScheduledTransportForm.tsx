import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export function ScheduledTransportForm() {
  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "",
    serviceType: "BLS",
    pickupAddress: "",
    destinationAddress: "",
    transportTime: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Scheduled transport form submitted:", formData);
    // TODO: Implement form submission logic
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Patient Information</h3>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientName">Patient Name</Label>
              <Input
                id="patientName"
                value={formData.patientName}
                onChange={(e) =>
                  setFormData({ ...formData, patientName: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patientId">Patient ID</Label>
              <Input
                id="patientId"
                value={formData.patientId}
                onChange={(e) =>
                  setFormData({ ...formData, patientId: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceType">Service Type</Label>
              <Select
                value={formData.serviceType}
                onValueChange={(value) =>
                  setFormData({ ...formData, serviceType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BLS">BLS</SelectItem>
                  <SelectItem value="ALS">ALS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Transport Details</h3>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="pickupAddress">Pickup Address</Label>
              <Input
                id="pickupAddress"
                value={formData.pickupAddress}
                onChange={(e) =>
                  setFormData({ ...formData, pickupAddress: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destinationAddress">Destination Address</Label>
              <Input
                id="destinationAddress"
                value={formData.destinationAddress}
                onChange={(e) =>
                  setFormData({ ...formData, destinationAddress: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transportTime">Transport Date & Time</Label>
              <Input
                id="transportTime"
                type="datetime-local"
                value={formData.transportTime}
                onChange={(e) =>
                  setFormData({ ...formData, transportTime: e.target.value })
                }
                required
              />
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full">
          Schedule Transport
        </Button>
      </form>
    </Card>
  );
}