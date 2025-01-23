import { useState } from "react";
import { FileText, Plus, AlertCircle } from "lucide-react";
import { TransportRecord } from "@/hooks/useTransportRecord";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface DocumentsTabProps {
  transportRecord: TransportRecord;
}

interface CorrectiveActionForm {
  actionType: string;
  description: string;
  improvementPlan: string;
  followUpDate: string;
}

export function DocumentsTab({ transportRecord }: DocumentsTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<CorrectiveActionForm>();

  // Fetch employee roles to check if user can create corrective actions
  const { data: userRoles } = useQuery({
    queryKey: ['userRoles'],
    queryFn: async () => {
      const { data: roles } = await supabase
        .from('employee_roles')
        .select('*')
        .single();
      return roles;
    }
  });

  const canCreateCorrectiveAction = userRoles?.is_hr || userRoles?.is_administrator || userRoles?.is_supervisor;

  const onSubmit = async (data: CorrectiveActionForm) => {
    try {
      const { error } = await supabase
        .from('corrective_actions')
        .insert({
          employee_id: transportRecord.crew_assigned,
          action_type: data.actionType,
          description: data.description,
          improvement_plan: data.improvementPlan,
          follow_up_date: data.followUpDate,
        });

      if (error) throw error;

      toast({
        title: "Corrective Action Created",
        description: "The corrective action has been successfully created.",
      });

      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create corrective action. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-500" />
          <span className="font-medium">Documents</span>
        </div>
        {canCreateCorrectiveAction && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Create Corrective Action
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Corrective Action</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="actionType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Action Type</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Performance Review, Safety Violation" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the incident or reason for corrective action"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="improvementPlan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Improvement Plan</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Detail the steps for improvement"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="followUpDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Follow-up Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="pl-7">
        <p className="text-gray-500">No documents uploaded yet.</p>
      </div>
    </div>
  );
}