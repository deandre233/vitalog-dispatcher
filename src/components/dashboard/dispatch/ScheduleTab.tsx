import { Clock, Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TransportRecord } from "@/hooks/useTransportRecord";
import { Card } from "@/components/ui/card";

interface ScheduleTabProps {
  transportRecord: TransportRecord;
  onUpdate: (updates: Partial<TransportRecord>) => void;
}

export function ScheduleTab({ transportRecord, onUpdate }: ScheduleTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-medical-secondary" />
        <span className="font-medium text-medical-primary">Schedule</span>
      </div>
      
      <Card className="p-4 border-l-4 border-l-medical-secondary">
        <div className="space-y-4">
          {/* Activation Date/Time */}
          <div className="space-y-2">
            <Label className="text-medical-primary">Activate</Label>
            <div className="flex items-center gap-4">
              <RadioGroup
                value={transportRecord?.pickup_type || 'now'}
                onValueChange={(value) => onUpdate({ pickup_type: value })}
                className="flex items-center space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="now" id="activate-now" />
                  <Label htmlFor="activate-now">Now</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="later" id="activate-later" />
                  <Label htmlFor="activate-later">Later</Label>
                </div>
              </RadioGroup>
              
              <Input
                type="datetime-local"
                value={format(new Date(transportRecord?.transport_date || ''), "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) => onUpdate({ transport_date: e.target.value })}
                className="flex-1 border-medical-secondary/30 focus:border-medical-secondary"
              />
            </div>
          </div>

          {/* Pickup Time */}
          <div className="space-y-2">
            <Label className="text-medical-primary">Pickup</Label>
            <div className="flex items-center gap-4">
              <RadioGroup
                value={transportRecord?.pickup_type || 'asap'}
                onValueChange={(value) => onUpdate({ pickup_type: value })}
                className="flex items-center space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="asap" id="pickup-asap" />
                  <Label htmlFor="pickup-asap">ASAP</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="scheduled" id="pickup-scheduled" />
                  <Label htmlFor="pickup-scheduled">At</Label>
                </div>
              </RadioGroup>
              
              <div className="flex items-center gap-2 flex-1">
                <Input
                  type="time"
                  className="border-medical-secondary/30 focus:border-medical-secondary"
                  onChange={(e) => onUpdate({ scheduled_time: e.target.value })}
                />
                <Checkbox
                  id="precise-pickup"
                  className="border-medical-secondary/30"
                  onCheckedChange={(checked) => {
                    // Handle precise pickup time requirement
                  }}
                />
                <Label htmlFor="precise-pickup" className="text-sm">Precise</Label>
              </div>
            </div>
          </div>

          {/* Dropoff Time */}
          <div className="space-y-2">
            <Label className="text-medical-primary">Dropoff</Label>
            <div className="flex items-center gap-4">
              <RadioGroup
                value="asap"
                className="flex items-center space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="asap" id="dropoff-asap" />
                  <Label htmlFor="dropoff-asap">ASAP</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="scheduled" id="dropoff-scheduled" />
                  <Label htmlFor="dropoff-scheduled">At</Label>
                </div>
              </RadioGroup>
              
              <Input
                type="time"
                className="flex-1 border-medical-secondary/30 focus:border-medical-secondary"
              />
            </div>
          </div>

          {/* Trip Type */}
          <div className="space-y-2">
            <Label className="text-medical-primary">Trip Type</Label>
            <RadioGroup
              value={transportRecord?.trip_type || 'One way'}
              onValueChange={(value: 'One way' | 'Wait-and-return' | 'Round trip') => 
                onUpdate({ trip_type: value })}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="One way" id="one-way" />
                <Label htmlFor="one-way">One Way</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Wait-and-return" id="wait-return" />
                <Label htmlFor="wait-return">Wait & Return</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Round trip" id="round-trip" />
                <Label htmlFor="round-trip">Round Trip</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Return Trip Section - Only show when Round trip is selected */}
          {transportRecord?.trip_type === 'Round trip' && (
            <div className="space-y-4 mt-4 p-4 bg-medical-accent rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-medical-secondary" />
                <Label className="text-medical-primary font-medium">Return Trip</Label>
              </div>
              
              <div className="space-y-2">
                <Label className="text-medical-primary">Activate at</Label>
                <Input
                  type="datetime-local"
                  className="border-medical-secondary/30 focus:border-medical-secondary"
                  onChange={(e) => onUpdate({ return_activation_time: e.target.value })}
                  value={transportRecord?.return_activation_time || ''}
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-medical-primary">Pick back up at</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    className="border-medical-secondary/30 focus:border-medical-secondary"
                    onChange={(e) => onUpdate({ return_pickup_time: e.target.value })}
                    value={transportRecord?.return_pickup_time || ''}
                  />
                  <Checkbox
                    id="precise-return"
                    className="border-medical-secondary/30"
                    checked={transportRecord?.return_precise_pickup || false}
                    onCheckedChange={(checked: boolean) => onUpdate({ return_precise_pickup: checked })}
                  />
                  <Label htmlFor="precise-return" className="text-sm">Precise</Label>
                </div>
              </div>
            </div>
          )}

          {/* Time Slot Visualization */}
          <div className="mt-6">
            <div className="h-8 bg-gray-100 rounded-lg flex">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 border-r border-gray-200 last:border-r-0"
                  title={`${i}:00`}
                >
                  {i % 3 === 0 && (
                    <div className="text-[10px] text-gray-500 text-center">
                      {i}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}