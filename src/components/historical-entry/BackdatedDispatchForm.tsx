import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { BackdatedDispatchFormData } from "@/types/historical-entry";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Calendar, User, Ambulance, FileText, AlertTriangle } from "lucide-react";

export const BackdatedDispatchForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<BackdatedDispatchFormData>();

  const onSubmit = async (data: BackdatedDispatchFormData) => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('transport_records')
        .insert([{
          ...data,
          created_at: new Date().toISOString(),
          status: 'completed',
          is_historical: true
        }]);

      if (error) throw error;
      
      toast.success("Historical dispatch record created successfully");
    } catch (error) {
      console.error('Error creating historical dispatch:', error);
      toast.error("Failed to create historical dispatch record");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-medical-card-start to-medical-card-end border-medical-secondary/20">
        <Tabs defaultValue="origin" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-medical-accent rounded-lg">
            <TabsTrigger value="origin" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Origin
            </TabsTrigger>
            <TabsTrigger value="destination" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Destination
            </TabsTrigger>
            <TabsTrigger value="patient" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Patient
            </TabsTrigger>
            <TabsTrigger value="service" className="flex items-center gap-2">
              <Ambulance className="w-4 h-4" />
              Service
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="origin" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Facility Name</Label>
                <Input {...register("origin_name")} className="glass-panel" />
              </div>
              <div className="space-y-2">
                <Label>Floor/Room</Label>
                <Input {...register("origin_floor_room")} className="glass-panel" />
              </div>
            </div>
            {/* ... Additional origin fields */}
          </TabsContent>

          <TabsContent value="destination" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Facility Name</Label>
                <Input {...register("destination_name")} className="glass-panel" />
              </div>
              <div className="space-y-2">
                <Label>Floor/Room</Label>
                <Input {...register("destination_floor_room")} className="glass-panel" />
              </div>
            </div>
            {/* ... Additional destination fields */}
          </TabsContent>

          <TabsContent value="patient" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input {...register("patient_last_name")} className="glass-panel" />
              </div>
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Input type="date" {...register("patient_dob")} className="glass-panel" />
              </div>
            </div>
            {/* ... Additional patient fields */}
          </TabsContent>

          <TabsContent value="service" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Service Type</Label>
                <Select>
                  <SelectTrigger className="glass-panel">
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WC">Wheelchair</SelectItem>
                    <SelectItem value="BLS">Basic Life Support</SelectItem>
                    <SelectItem value="ALS">Advanced Life Support</SelectItem>
                    <SelectItem value="MICU">Mobile ICU</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select>
                  <SelectTrigger className="glass-panel">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                    <SelectItem value="Lower acuity">Lower Acuity</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Special Requirements</Label>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch {...register("requires_o2")} />
                    <Label>Oxygen Required</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch {...register("requires_ventilator")} />
                    <Label>Ventilator Required</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch {...register("requires_isolation")} />
                    <Label>Isolation Required</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch {...register("requires_bariatric")} />
                    <Label>Bariatric Required</Label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <div className="space-y-2">
              <Label>Dispatcher Notes</Label>
              <Textarea {...register("dispatcher_notes")} className="glass-panel min-h-[100px]" />
            </div>
            <div className="space-y-2">
              <Label>Billing Notes</Label>
              <Textarea {...register("billing_notes")} className="glass-panel min-h-[100px]" />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end space-x-4">
          <Button variant="outline" type="button">Cancel</Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-medical-primary hover:bg-medical-primary/90"
          >
            {isSubmitting ? "Creating..." : "Create Historical Entry"}
          </Button>
        </div>
      </Card>
    </form>
  );
};