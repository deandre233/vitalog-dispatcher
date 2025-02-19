
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wand2, Save, ArrowLeft, Brain } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { HRLayout } from "@/components/layout/HRLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Employee } from "@/types/employee";

export default function CreateEmployee() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Employee>>({
    first_name: "",
    last_name: "",
    mobile: "",
    station: "",
    status: "Active",
    employee_type: "Full-time",
    certification_level: "Basic",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('employees')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Employee created successfully",
      });
      navigate("/employees");
    } catch (error) {
      console.error('Error creating employee:', error);
      toast({
        title: "Error",
        description: "Failed to create employee",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAIAssist = () => {
    // Example AI recommendations - in production, this would call an AI service
    const recommendations = {
      station: "Based on current staffing needs: Emergency Response Unit",
      certification: "Recommended Level: Advanced",
      training: "Suggested Training Path: Emergency Response Specialist",
    };

    toast({
      title: "AI Recommendations Generated",
      description: "Staffing recommendations have been generated based on current needs.",
    });

    setFormData(prev => ({
      ...prev,
      station: recommendations.station,
      certification_level: "Advanced",
    }));
  };

  return (
    <HRLayout>
      <div className="container max-w-4xl mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Create New Team Member</h1>
            <p className="text-muted-foreground">
              Add a new member to your emergency response team
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/employees")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Directory
          </Button>
        </div>

        <Card className="p-6 bg-gradient-to-br from-background to-secondary/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="station">Station Assignment</Label>
                <Input
                  id="station"
                  value={formData.station}
                  onChange={(e) => setFormData(prev => ({ ...prev, station: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employee_type">Employment Type</Label>
                <select
                  id="employee_type"
                  className="w-full h-10 px-3 rounded-md border bg-background"
                  value={formData.employee_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, employee_type: e.target.value }))}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="certification_level">Certification Level</Label>
                <select
                  id="certification_level"
                  className="w-full h-10 px-3 rounded-md border bg-background"
                  value={formData.certification_level}
                  onChange={(e) => setFormData(prev => ({ ...prev, certification_level: e.target.value }))}
                >
                  <option value="Basic">Basic</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  Create Team Member
                </Button>
                <Button type="button" variant="secondary" onClick={handleAIAssist}>
                  <Wand2 className="mr-2 h-4 w-4" />
                  AI Assist
                </Button>
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">
                    <Brain className="mr-2 h-4 w-4" />
                    AI Insights
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>AI Staffing Insights</SheetTitle>
                    <SheetDescription>
                      Real-time analysis of staffing needs and recommendations
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    <div className="p-4 bg-secondary/50 rounded-lg space-y-2">
                      <h4 className="font-medium">Current Staffing Levels</h4>
                      <div className="flex gap-2">
                        <Badge variant="default">Emergency: 12</Badge>
                        <Badge variant="outline">Non-Emergency: 8</Badge>
                      </div>
                    </div>
                    <div className="p-4 bg-secondary/50 rounded-lg space-y-2">
                      <h4 className="font-medium">Recommended Certifications</h4>
                      <div className="flex gap-2">
                        <Badge variant="default">Advanced</Badge>
                        <Badge variant="outline">Emergency Response</Badge>
                      </div>
                    </div>
                    <div className="p-4 bg-secondary/50 rounded-lg">
                      <h4 className="font-medium">Optimal Station Assignment</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Emergency Response Unit (Based on current coverage analysis)
                      </p>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </form>
        </Card>
      </div>
    </HRLayout>
  );
}
