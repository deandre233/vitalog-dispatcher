import { Clock, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { TransportRecord } from "@/hooks/useTransportRecord";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ScheduleTabProps {
  transportRecord: TransportRecord;
  onUpdate: (updates: Partial<TransportRecord>) => void;
}

export function ScheduleTab({ transportRecord, onUpdate }: ScheduleTabProps) {
  // Debug logs
  console.log("Trip type:", transportRecord?.trip_type);
  console.log("Full transport record:", transportRecord);
  
  // Check if trip type matches either condition
  const showReturnSection = transportRecord?.trip_type === "Round trip" || transportRecord?.trip_type === "Wait-and-return";

  console.log("Show return section:", showReturnSection);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-medical-secondary" />
        <span className="font-medium text-medical-primary">Schedule</span>
      </div>
      
      <Card className="p-4 border-l-4 border-l-medical-secondary bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="space-y-4">
          <div className="space-y-2 bg-white/80 p-4 rounded-lg shadow-sm">
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
                value={transportRecord?.transport_date ? format(new Date(transportRecord.transport_date), "yyyy-MM-dd'T'HH:mm") : ''}
                onChange={(e) => onUpdate({ transport_date: e.target.value })}
                className="flex-1 border-medical-secondary/30 focus:border-medical-secondary bg-white"
              />
            </div>
          </div>

          <div className="space-y-2 bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg shadow-sm">
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
                  value={transportRecord?.scheduled_time || ''}
                  className="border-medical-secondary/30 focus:border-medical-secondary bg-white"
                  onChange={(e) => onUpdate({ scheduled_time: e.target.value })}
                />
                <Checkbox
                  id="precise-pickup"
                  checked={transportRecord?.precise_pickup || false}
                  className="border-medical-secondary/30"
                  onCheckedChange={(checked) => {
                    onUpdate({ precise_pickup: checked === true });
                  }}
                />
                <Label htmlFor="precise-pickup" className="text-sm">Precise</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg shadow-sm">
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
                className="flex-1 border-medical-secondary/30 focus:border-medical-secondary bg-white"
              />
            </div>
          </div>

          <div className="space-y-2 bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg shadow-sm">
            <Label className="text-medical-primary">Trip Type</Label>
            <RadioGroup
              value={transportRecord?.trip_type || 'One way'}
              onValueChange={(value: 'One way' | 'Wait-and-return' | 'Round trip') => {
                console.log("Selected trip type:", value);
                onUpdate({ 
                  trip_type: value,
                  // Reset return-related fields when switching to One way
                  ...(value === 'One way' ? {
                    return_activation_time: null,
                    return_pickup_time: null,
                    return_precise_pickup: false
                  } : {})
                });
              }}
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

          {/* Return Trip Section */}
          {showReturnSection && (
            <div className="space-y-4 mt-4 bg-gradient-to-r from-rose-50 to-red-50 p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-medical-secondary" />
                <Label className="text-medical-primary font-medium">Return Trip</Label>
              </div>
              
              <div className="space-y-4">
                {/* Return Activation Time */}
                <div className="flex items-center gap-2">
                  <Label className="min-w-[100px]">Return trip:</Label>
                  <div className="flex-1">
                    <Label className="text-sm text-gray-600">Activate at:</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="datetime-local"
                        className="flex-1 border-medical-secondary/30 focus:border-medical-secondary bg-white"
                        value={transportRecord?.return_activation_time || ''}
                        onChange={(e) => onUpdate({ return_activation_time: e.target.value })}
                      />
                      <button 
                        onClick={() => onUpdate({ return_activation_time: '' })}
                        className="text-gray-500 hover:text-gray-700 px-2"
                        type="button"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>

                {/* Return Pickup Time */}
                <div className="flex items-center gap-2">
                  <Label className="min-w-[100px]"></Label>
                  <div className="flex-1">
                    <Label className="text-sm text-gray-600">Pick back up at:</Label>
                    <div className="flex items-center gap-2">
                      <Select
                        value={transportRecord?.return_pickup_time || ''}
                        onValueChange={(value) => onUpdate({ return_pickup_time: value })}
                      >
                        <SelectTrigger className="w-[180px] bg-white">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 * 4 }).map((_, i) => {
                            const hour = Math.floor(i / 4);
                            const minute = (i % 4) * 15;
                            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                            const ampm = hour >= 12 ? 'PM' : 'AM';
                            const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                            const display = `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
                            return (
                              <SelectItem key={time} value={time}>
                                {display}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <div className="flex flex-col gap-1">
                        <button 
                          onClick={() => {
                            const [hours, minutes] = (transportRecord?.return_pickup_time || '00:00').split(':');
                            const date = new Date();
                            date.setHours(parseInt(hours));
                            date.setMinutes(parseInt(minutes) + 15);
                            onUpdate({ 
                              return_pickup_time: format(date, 'HH:mm')
                            });
                          }}
                          className="text-xs bg-blue-100 hover:bg-blue-200 p-1 rounded"
                          type="button"
                        >
                          ▲
                        </button>
                        <button 
                          onClick={() => {
                            const [hours, minutes] = (transportRecord?.return_pickup_time || '00:00').split(':');
                            const date = new Date();
                            date.setHours(parseInt(hours));
                            date.setMinutes(parseInt(minutes) - 15);
                            onUpdate({ 
                              return_pickup_time: format(date, 'HH:mm')
                            });
                          }}
                          className="text-xs bg-blue-100 hover:bg-blue-200 p-1 rounded"
                          type="button"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Checkbox
                        id="precise-return"
                        checked={transportRecord?.return_precise_pickup || false}
                        onCheckedChange={(checked) => {
                          if (typeof checked === 'boolean') {
                            onUpdate({ return_precise_pickup: checked });
                          }
                        }}
                      />
                      <Label htmlFor="precise-return" className="text-sm">Precise</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6">
            <div className="h-8 bg-gradient-to-r from-gray-50 to-slate-100 rounded-lg flex overflow-hidden shadow-inner">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 flex flex-col justify-between relative ${
                    i >= 8 && i <= 18 ? 'bg-medical-secondary/20' : 'bg-medical-secondary/10'
                  } hover:bg-medical-secondary/30 transition-colors`}
                  title={`${i}:00`}
                >
                  {i % 3 === 0 && (
                    <>
                      <div className="text-[10px] text-gray-500 text-center absolute top-1 w-full">
                        {i.toString().padStart(2, '0')}:00
                      </div>
                      <div className="w-px h-2 bg-gray-300 absolute bottom-0 left-1/2"></div>
                    </>
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
