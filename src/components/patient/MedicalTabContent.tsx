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
import { Search, Plus, AlertTriangle } from "lucide-react";

interface MedicalTabContentProps {
  patientId: string;
}

export const MedicalTabContent = ({ patientId }: MedicalTabContentProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("known");

  // Mock data - replace with actual data from your backend
  const medicalConditions = [
    { code: "299.2", description: "Dialysis - renal, status" },
    { code: "E71.314", description: "Muscle, muscular - carnitine deficiency" },
    { code: "R53.1", description: "Weak, weakening, weakness" },
    { code: "R57.9", description: "Failure, failed - circulation, circulatory" },
    { code: "E11.9", description: "Diabetes, diabetic" },
    { code: "M54.9", description: "Pain - back" },
    { code: "E66.01", description: "Obesity - morbid" },
    { code: "R06.89", description: "Respiration - insufficient, or poor" }
  ];

  const handleSearch = () => {
    // Implement AI-powered search functionality
    toast({
      title: "Searching medical conditions",
      description: "AI is analyzing your search query...",
    });
  };

  const handleAddCondition = () => {
    // Implement condition adding logic
    toast({
      title: "Adding medical condition",
      description: "New condition has been added to the patient's record.",
    });
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