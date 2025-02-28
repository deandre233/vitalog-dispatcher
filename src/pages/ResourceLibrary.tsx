import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Search, Database, CircuitBoard, Atom, Network, Bot, Scan } from "lucide-react";
import { format } from "date-fns";
import { useResourceDocuments } from "@/hooks/useResourceDocuments";
import { cn } from "@/lib/utils";

interface DocumentType {
  id: string;
  name: string;
  checked: boolean;
}

export const ResourceLibrary = () => {
  const { toast } = useToast();
  const [patientLastName, setPatientLastName] = useState("");
  const [patientDOB, setPatientDOB] = useState<Date>();
  const [beforeDate, setBeforeDate] = useState<Date>();
  const [hideDeleted, setHideDeleted] = useState(true);
  const [returnYoungest, setReturnYoungest] = useState(true);
  
  const documentTypes: DocumentType[] = [
    { id: "adv-dir-no-dnr", name: "Advanced directive (no DNR)", checked: false },
    { id: "adv-dir-other", name: "Advanced directive (other)", checked: false },
    { id: "adv-dir-polst", name: "Advanced directive (POLST)", checked: false },
    { id: "ama", name: "Against Medical Advice (AMA)", checked: false },
    { id: "auth-transfer", name: "Authorization and transfer signatures", checked: false },
    { id: "diagnostic", name: "Diagnostic image / Lab result", checked: false },
    { id: "dnr", name: "DNR", checked: false },
    { id: "dnr-revoke", name: "DNR revocation", checked: false },
    { id: "dnr-adv-dir", name: "DNR with advanced directive", checked: false },
    { id: "emergency", name: "Emergency contacts / Special needs", checked: false },
    { id: "epcr", name: "ePCR NEMSIS data", checked: false },
    { id: "face-sheet", name: "Face sheet", checked: false },
    { id: "insurance", name: "Insurance cards", checked: false },
    { id: "medication", name: "Medication list", checked: false },
    { id: "medical-history", name: "Past medical history (PMHx)", checked: false },
    { id: "physical", name: "Physical / Progress", checked: false },
    { id: "pcs", name: "Physician Certification Statement (PCS)", checked: false },
    { id: "pan", name: "Prior Authorization Number (PAN)", checked: false },
    { id: "mcpan", name: "State Medicaid prior auth (McPAN)", checked: false },
    { id: "telemedicine", name: "Telemedicine consult", checked: false },
    { id: "video", name: "Video / Movie", checked: false },
    { id: "other", name: "Other (see comments)", checked: false },
  ];

  const [selectedTypes, setSelectedTypes] = useState<DocumentType[]>(documentTypes);

  const { data: documents, isLoading } = useResourceDocuments({
    patientLastName,
    patientDOB,
    beforeDate,
    hideDeleted,
    returnYoungest,
    selectedTypes: selectedTypes.filter(t => t.checked).map(t => t.id)
  });

  const handleSearch = () => {
    if (!patientLastName && !patientDOB) {
      toast({
        title: "Validation Error",
        description: "Please enter either a last name or date of birth",
        variant: "destructive"
      });
      return;
    }
    // Search functionality will be handled by the useResourceDocuments hook
  };

  const handleSelectAll = () => {
    setSelectedTypes(selectedTypes.map(type => ({ ...type, checked: true })));
  };

  const handleSelectNone = () => {
    setSelectedTypes(selectedTypes.map(type => ({ ...type, checked: false })));
  };

  const toggleDocumentType = (id: string) => {
    setSelectedTypes(selectedTypes.map(type => 
      type.id === id ? { ...type, checked: !type.checked } : type
    ));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-medical-gradient-start via-medical-gradient-middle to-medical-gradient-end">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1 overflow-auto backdrop-blur-sm">
            <DashboardHeader />
            <main className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <CircuitBoard className="h-8 w-8 text-medical-secondary animate-pulse" />
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-medical-secondary to-medical-primary">
                  Patient Document Librarian
                </h1>
              </div>

              <Card className="futuristic-panel p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="flex items-center space-x-2">
                      <Database className="h-4 w-4" />
                      <span>Patient last name</span>
                    </Label>
                    <Input
                      id="lastName"
                      value={patientLastName}
                      onChange={(e) => setPatientLastName(e.target.value)}
                      className="glass-panel border-medical-secondary/20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dob" className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Patient date of birth</span>
                    </Label>
                    <div className="flex items-center space-x-2">
                      <DatePicker
                        date={patientDOB}
                        setDate={setPatientDOB}
                        onDateChange={setPatientDOB}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setPatientDOB(undefined)}
                        className="hover:bg-medical-secondary/20"
                      >
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <Network className="h-4 w-4" />
                    <span>Find documents collected on or before</span>
                  </Label>
                  <DatePicker
                    date={beforeDate}
                    setDate={setBeforeDate}
                    onDateChange={setBeforeDate}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2 hover:bg-medical-secondary/10 p-2 rounded-lg transition-colors">
                    <Checkbox
                      id="hideDeleted"
                      checked={hideDeleted}
                      onCheckedChange={(checked) => setHideDeleted(checked as boolean)}
                    />
                    <Label htmlFor="hideDeleted">Hide deleted documents</Label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 glass-panel rounded-lg">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="youngest"
                        checked={returnYoungest}
                        onChange={() => setReturnYoungest(true)}
                        className="text-medical-secondary"
                      />
                      <Label htmlFor="youngest">Return only the youngest document of each selected type</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="all"
                        checked={!returnYoungest}
                        onChange={() => setReturnYoungest(false)}
                        className="text-medical-secondary"
                      />
                      <Label htmlFor="all">Return all documents of each selected type</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Atom className="h-5 w-5 text-medical-secondary animate-spin-slow" />
                    <h3 className="text-lg font-semibold">Document Types</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {selectedTypes.map((type) => (
                      <div key={type.id} 
                        className={cn(
                          "flex items-center space-x-2 p-2 rounded-lg transition-all duration-300",
                          type.checked ? "bg-medical-secondary/20 shadow-glow" : "hover:bg-medical-secondary/10"
                        )}
                      >
                        <Checkbox
                          id={type.id}
                          checked={type.checked}
                          onCheckedChange={() => toggleDocumentType(type.id)}
                        />
                        <Label htmlFor={type.id}>{type.name}</Label>
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-4">
                    <Button onClick={handleSelectAll} variant="outline" 
                      className="hover:bg-medical-secondary/20 transition-colors">
                      <Bot className="mr-2 h-4 w-4" />
                      Select all
                    </Button>
                    <Button onClick={handleSelectNone} variant="outline"
                      className="hover:bg-medical-secondary/20 transition-colors">
                      <Scan className="mr-2 h-4 w-4" />
                      Select none
                    </Button>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold flex items-center space-x-2 mb-4">
                    <Search className="h-5 w-5 text-medical-secondary" />
                    <span>Matching documents:</span>
                  </h3>
                  <ScrollArea className="h-[400px] border rounded-md glass-panel">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-medical-secondary/10">
                          <TableHead>ID</TableHead>
                          <TableHead>Patient</TableHead>
                          <TableHead>Document Type</TableHead>
                          <TableHead>Age on Selected Date</TableHead>
                          <TableHead>Comments</TableHead>
                          <TableHead>Content</TableHead>
                          <TableHead>Attached</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoading ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <CircuitBoard className="h-5 w-5 animate-spin" />
                                <span>Loading...</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : documents && documents.length > 0 ? (
                          documents.map((doc) => (
                            <TableRow key={doc.id} className="hover:bg-medical-secondary/10 transition-colors">
                              <TableCell>{doc.id}</TableCell>
                              <TableCell>{doc.patient}</TableCell>
                              <TableCell>{doc.documentType}</TableCell>
                              <TableCell>{doc.age}</TableCell>
                              <TableCell>{doc.comments}</TableCell>
                              <TableCell>{doc.content}</TableCell>
                              <TableCell>{doc.attached}</TableCell>
                              <TableCell>{doc.status}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center">
                              No documents were found matching the criteria.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              </Card>
            </main>
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
};
