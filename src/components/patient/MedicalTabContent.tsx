import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, AlertTriangle, Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface MedicalTabContentProps {
  patientId: string;
}

export const MedicalTabContent = ({ patientId }: MedicalTabContentProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("known");
  const [isProcessing, setIsProcessing] = useState(false);
  const [documentType, setDocumentType] = useState("facesheet");

  // Medical conditions database with ICD-10 codes
  const medicalConditions = [
    { code: "I10", description: "Essential (primary) hypertension" },
    { code: "E11.9", description: "Type 2 diabetes mellitus without complications" },
    { code: "E78.5", description: "Dyslipidemia" },
    { code: "J44.9", description: "Chronic obstructive pulmonary disease, unspecified" },
    { code: "M54.5", description: "Low back pain" },
    { code: "F41.1", description: "Generalized anxiety disorder" },
    { code: "F32.9", description: "Major depressive disorder, unspecified" },
    { code: "E66.01", description: "Morbid (severe) obesity due to excess calories" },
    { code: "I25.10", description: "Atherosclerotic heart disease of native coronary artery" },
    { code: "N18.9", description: "Chronic kidney disease, unspecified" }
  ];

  const handleSearch = () => {
    toast({
      title: "Searching medical conditions",
      description: "AI is analyzing your search query...",
    });
  };

  const handleAddCondition = () => {
    toast({
      title: "Adding medical condition",
      description: "New condition has been added to the patient's record.",
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileContent = e.target?.result as string;
        
        toast({
          title: `Processing ${documentType}`,
          description: "AI is analyzing the document...",
        });

        const { data, error } = await supabase.functions.invoke('analyze-medical-documents', {
          body: { fileContent, documentType }
        });

        if (error) throw error;

        // Update patient record with the extracted information
        const { error: updateError } = await supabase
          .from('patients')
          .update({
            medical_conditions: data.medicalConditions,
            medications: data.medications,
            allergies: data.allergies
          })
          .eq('id', patientId);

        if (updateError) throw updateError;

        toast({
          title: "Analysis complete",
          description: `Found ${data.medicalConditions.length} conditions, ${data.medications.length} medications, and ${data.allergies.length} allergies.`,
        });

        if (data.vitalSigns && Object.keys(data.vitalSigns).some(key => data.vitalSigns[key])) {
          toast({
            title: "Vital Signs Extracted",
            description: "Vital signs information has been extracted from the document.",
          });
        }

        if (data.additionalNotes?.length > 0) {
          toast({
            title: "Additional Information",
            description: "Additional medical notes have been extracted and saved.",
          });
        }
      };

      reader.readAsText(file);
    } catch (error) {
      console.error('Error processing document:', error);
      toast({
        title: "Error",
        description: "Failed to process the medical document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Medical and Surgical History</h3>
            <RadioGroup
              defaultValue={selectedStatus}
              onValueChange={setSelectedStatus}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="known" id="known" />
                <Label htmlFor="known">Known</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unknown" id="unknown" />
                <Label htmlFor="unknown">Unknown</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none">None</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Search conditions (e.g., 'diabetes' or 'E11.9')"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button onClick={handleSearch} variant="secondary">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button onClick={handleAddCondition}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
            <div className="relative flex gap-2">
              <Select
                value={documentType}
                onValueChange={setDocumentType}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Document Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facesheet">Facesheet</SelectItem>
                  <SelectItem value="discharge">Discharge Summary</SelectItem>
                  <SelectItem value="progress">Progress Notes</SelectItem>
                  <SelectItem value="consultation">Consultation Notes</SelectItem>
                  <SelectItem value="lab">Lab Results</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="file"
                className="hidden"
                id="medical-doc-upload"
                accept=".txt,.pdf,.doc,.docx"
                onChange={handleFileUpload}
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('medical-doc-upload')?.click()}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Scan Document
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[300px] border rounded-md p-4">
            {medicalConditions.map((condition) => (
              <div
                key={condition.code}
                className="flex items-start space-x-2 py-2 border-b last:border-0"
              >
                <Badge variant="outline" className="shrink-0">
                  {condition.code}
                </Badge>
                <span className="text-sm">{condition.description}</span>
              </div>
            ))}
          </ScrollArea>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Current Medications</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Search medications"
              className="flex-1"
            />
            <Button variant="secondary">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
          <ScrollArea className="h-[200px] border rounded-md p-4">
            <div className="text-sm text-muted-foreground">
              Use the 'Search' box to add a medication.
            </div>
          </ScrollArea>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Drug Allergies</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Search allergies"
              className="flex-1"
            />
            <Button variant="secondary">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
          <ScrollArea className="h-[200px] border rounded-md p-4">
            <div className="text-sm text-muted-foreground">
              List RxCUI codes or names of all allergic medications, one per line
            </div>
          </ScrollArea>

          <div className="space-y-2">
            <Label>Environmental Allergies</Label>
            <Select defaultValue="none">
              <SelectTrigger>
                <SelectValue placeholder="Select environmental allergies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="dust">Dust</SelectItem>
                <SelectItem value="pollen">Pollen</SelectItem>
                <SelectItem value="mold">Mold</SelectItem>
                <SelectItem value="pets">Pets</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>PMH-x obtained from:</Label>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span>Patient</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span>Family</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span>Face sheet / Health worker</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span>Bystander</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Last review by EMS: 2024-12-13 by Kimpson, Deandre (38 days ago)</span>
            <Button variant="outline" size="sm">
              Save Changes
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
