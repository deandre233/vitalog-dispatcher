
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUp, FileText, FileSearch } from "lucide-react";
import { useEmployeeDocuments } from "@/hooks/useEmployeeDocuments";
import { AIDocumentRecommendations } from "@/components/hr/documents/AIDocumentRecommendations";
import { UploadDocumentDialog } from "@/components/performance/components/UploadDocumentDialog";
import { EmployeeDocument } from "@/types/employee-documents";

interface DocumentsTabProps {
  employeeId: string;
}

export function DocumentsTab({ employeeId }: DocumentsTabProps) {
  const { documents, isLoading } = useEmployeeDocuments(employeeId);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "Medical Clearance":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "Certification Documentation":
        return <FileText className="h-5 w-5 text-green-500" />;
      case "Performance Review":
        return <FileText className="h-5 w-5 text-blue-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const filteredDocuments = activeTab === "all" 
    ? documents 
    : documents.filter(doc => (doc as any).type === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Employee Documents</h2>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setUploadDialogOpen(true)}
        >
          <FileUp className="h-4 w-4" />
          <span>Upload Document</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Document Library</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="Medical Clearance">Medical</TabsTrigger>
                  <TabsTrigger value="Certification Documentation">Certifications</TabsTrigger>
                  <TabsTrigger value="Performance Review">Performance</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab}>
                  {isLoading ? (
                    <div className="flex items-center justify-center h-[200px]">
                      <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                    </div>
                  ) : filteredDocuments.length > 0 ? (
                    <div className="space-y-4">
                      {filteredDocuments.map(doc => (
                        <div key={(doc as any).id} className="flex items-start p-4 border rounded-lg">
                          <div className="mr-3">
                            {getDocumentIcon((doc as any).type || "")}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{(doc as any).description || (doc as any).filename}</h4>
                              <span className="text-sm text-gray-500">{formatDate((doc as any).date)}</span>
                            </div>
                            <p className="text-sm text-gray-500">{(doc as any).type}</p>
                            {(doc as any).ai_analysis && (
                              <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                                <div className="flex items-center gap-1">
                                  <FileSearch className="h-4 w-4 text-blue-500" />
                                  <span className="font-medium text-blue-700">AI Analysis</span>
                                </div>
                                <p className="mt-1 text-blue-800">{(doc as any).ai_analysis.summary || "Document analyzed by AI"}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-gray-50">
                      <FileText className="h-12 w-12 text-gray-400 mb-3" />
                      <h3 className="text-lg font-medium mb-2">No Documents Found</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        You haven't uploaded any {activeTab !== "all" ? activeTab.toLowerCase() : ""} documents yet
                      </p>
                      <Button 
                        variant="outline"
                        onClick={() => setUploadDialogOpen(true)}
                      >
                        Upload Document
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <AIDocumentRecommendations 
            employeeId={employeeId} 
            onUpload={() => setUploadDialogOpen(true)} 
          />
        </div>
      </div>

      <UploadDocumentDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        employeeId={employeeId}
      />
    </div>
  );
}
