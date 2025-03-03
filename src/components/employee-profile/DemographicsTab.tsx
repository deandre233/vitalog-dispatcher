
import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { PhoneInput } from "@/components/common/PhoneInput";

export const DemographicsTab: React.FC = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Demographics</h2>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Date of Birth</Label>
            <Input type="date" />
          </div>
          <div className="space-y-2">
            <Label>Gender</Label>
            <Select defaultValue="male">
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="non-binary">Non-binary</SelectItem>
                <SelectItem value="prefer-not">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Ethnicity</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select ethnicity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="white">White</SelectItem>
                <SelectItem value="black">Black or African American</SelectItem>
                <SelectItem value="asian">Asian</SelectItem>
                <SelectItem value="hispanic">Hispanic or Latino</SelectItem>
                <SelectItem value="native-american">Native American</SelectItem>
                <SelectItem value="pacific-islander">Pacific Islander</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer-not">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Marital Status</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select marital status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="divorced">Divorced</SelectItem>
                <SelectItem value="widowed">Widowed</SelectItem>
                <SelectItem value="separated">Separated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="font-semibold">Contact Information</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Personal Email</Label>
              <Input type="email" placeholder="email@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Home Phone</Label>
              <PhoneInput value="" onChange={() => {}} />
            </div>
            <div className="space-y-2">
              <Label>Home Address</Label>
              <Input placeholder="Street address" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-2">
                <Label>City</Label>
                <Input placeholder="City" />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input placeholder="State" />
              </div>
              <div className="space-y-2">
                <Label>ZIP</Label>
                <Input placeholder="ZIP code" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
