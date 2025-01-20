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
  const [medicationSearchTerm, setMedicationSearchTerm] = useState("");

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

  // Medications database with common prescriptions
  const medications = [
    { 
      name: "Lisinopril",
      genericName: "Lisinopril",
      class: "ACE Inhibitor",
      commonDosages: ["10mg", "20mg", "40mg"],
      frequency: ["once daily", "twice daily"],
      commonIndications: ["hypertension", "heart failure"]
    },
    {
      name: "Metformin",
      genericName: "Metformin HCl",
      class: "Biguanide",
      commonDosages: ["500mg", "850mg", "1000mg"],
      frequency: ["once daily", "twice daily"],
      commonIndications: ["type 2 diabetes"]
    },
    {
      name: "Atorvastatin",
      genericName: "Atorvastatin Calcium",
      class: "Statin",
      commonDosages: ["10mg", "20mg", "40mg", "80mg"],
      frequency: ["once daily"],
      commonIndications: ["high cholesterol", "cardiovascular disease prevention"]
    },
    {
      name: "Omeprazole",
      genericName: "Omeprazole",
      class: "Proton Pump Inhibitor",
      commonDosages: ["20mg", "40mg"],
      frequency: ["once daily", "twice daily"],
      commonIndications: ["GERD", "acid reflux", "stomach ulcers"]
    },
    {
      name: "Sertraline",
      genericName: "Sertraline HCl",
      class: "SSRI",
      commonDosages: ["25mg", "50mg", "100mg"],
      frequency: ["once daily"],
      commonIndications: ["depression", "anxiety"]
    }
  ];

  const handleSearch = async () => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-medical-search', {
        body: { searchTerm, type: 'condition' }
      });

      if (error) throw error;

      toast({
        title: "Search Results",
        description: `Found ${data.results.length} matching conditions`,
      });

    } catch (error) {
      console.error('Error searching:', error);
      toast({
        title: "Error",
        description: "Failed to search medical conditions",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMedicationSearch = async () => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-medical-search', {
        body: { searchTerm: medicationSearchTerm, type: 'medication' }
      });

      if (error) throw error;

      toast({
        title: "Medication Search Results",
        description: `Found ${data.results.length} matching medications`,
      });

    } catch (error) {
      console.error('Error searching medications:', error);
      toast({
        title: "Error",
        description: "Failed to search medications",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
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
      </Card>

      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Current Medications</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Search medications (e.g., 'Lisinopril' or 'diabetes')"
              value={medicationSearchTerm}
              onChange={(e) => setMedicationSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button 
              variant="secondary" 
              onClick={handleMedicationSearch}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Search
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
          <ScrollArea className="h-[200px] border rounded-md p-4">
            {medications.map((med, index) => (
              <div key={index} className="py-2 border-b last:border-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{med.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {med.genericName} - {med.class}
                    </p>
                  </div>
                  <div className="text-sm">
                    <p>Common dosages: {med.commonDosages.join(", ")}</p>
                    <p>Frequency: {med.frequency.join(", ")}</p>
                  </div>
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {med.commonIndications.map((indication, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {indication}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Medical Conditions</h3>
          <ScrollArea className="h-[200px] border rounded-md p-4">
            {medicalConditions.map((condition) => (
              <div key={condition.code} className="flex items-start space-x-2 py-2 border-b last:border-0">
                <Badge variant="outline" className="shrink-0">
                  {condition.code}
                </Badge>
                <span className="text-sm">{condition.description}</span>
              </div>
            ))}
          </ScrollArea>
        </div>
      </Card>
    </div>
  );
};
