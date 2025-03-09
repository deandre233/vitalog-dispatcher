
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useEmployeeDetails } from "@/hooks/useEmployeeDetails";
import { useEmployeeCertifications } from "@/hooks/useEmployeeCertifications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Plus, Download, Upload, FileCheck, AlertCircle } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function CertificationsSection() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { employee } = useEmployeeDetails(employeeId);
  const { 
    certificates, 
    isLoading, 
    addCertificate, 
    getAICertificationRecommendations 
  } = useEmployeeCertifications(employeeId);
  
  const [showDeleted, setShowDeleted] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState<{
    recommendations: string[];
    expiringCertifications: any[];
    missingRequiredCertifications: string[];
  } | null>(null);
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState(false);

  const employeeName = `${employee?.first_name || ''} ${employee?.last_name || ''}`;
  
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "yyyy-MM-dd");
    } catch {
      return dateString;
    }
  };

  const handleGenerateRecommendations = async () => {
    setIsGeneratingRecommendations(true);
    try {
      const result = await getAICertificationRecommendations.mutateAsync();
      setRecommendations(result);
      setShowRecommendations(true);
    } finally {
      setIsGeneratingRecommendations(false);
    }
  };

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>,
      size: 60,
    },
    {
      accessorKey: "cert_class",
      header: "Cert Class",
      cell: ({ row }) => (
        <div className="text-sm font-medium">{row.getValue("cert_class")}</div>
      )
    },
    {
      accessorKey: "cert_type",
      header: "Cert Type",
      cell: ({ row }) => {
        const value = row.getValue("cert_type") as string;
        return value.includes("BLS") ? (
          <div className="text-sm font-medium text-blue-600">{value}</div>
        ) : (
          <div className="text-sm font-medium">{value}</div>
        );
      }
    },
    {
      accessorKey: "state",
      header: "State",
      cell: ({ row }) => <div className="text-center">{row.getValue("state")}</div>,
      size: 90,
    },
    {
      accessorKey: "id_number",
      header: "ID Number",
      cell: ({ row }) => <div>{row.getValue("id_number")}</div>,
    },
    {
      accessorKey: "valid_from",
      header: "Valid",
      cell: ({ row }) => (
        <div>{formatDate(row.getValue("valid_from"))}</div>
      ),
    },
    {
      accessorKey: "expires",
      header: "Expires",
      cell: ({ row }) => {
        const expiryDate = row.getValue("expires") as string;
        const today = new Date();
        const expiry = new Date(expiryDate);
        const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        return (
          <div className={`font-medium ${
            daysUntilExpiry < 30 ? "text-red-600" : 
            daysUntilExpiry < 90 ? "text-amber-600" : "text-green-600"
          }`}>
            {formatDate(expiryDate)}
          </div>
        );
      },
    },
    {
      accessorKey: "notes",
      header: "Notes",
      cell: ({ row }) => <div>{row.getValue("notes") || "-"}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant={status === "Active" ? "success" : status === "Pending" ? "warning" : "destructive"}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "",
      cell: () => (
        <div className="flex space-x-2 justify-end">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <FileCheck className="h-4 w-4" />
          </Button>
        </div>
      ),
    }
  ];

  return (
    <>
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Certifications</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => setShowDeleted(!showDeleted)}>
                {showDeleted ? 
                  <><EyeOff className="mr-1 h-4 w-4" /> Hide Deleted</> : 
                  <><Eye className="mr-1 h-4 w-4" /> Show Deleted</>
                }
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="mr-1 h-4 w-4" /> Import
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-1 h-4 w-4" /> Export
              </Button>
              <Button variant="default" size="sm">
                <Plus className="mr-1 h-4 w-4" /> Add Certificate
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={certificates} 
          />
          
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              <p>
                Certifications are required for {employeeName} to perform certain duties. 
                Make sure all certifications are up to date.
              </p>
            </div>
            <Button 
              variant="outline" 
              className="text-blue-600"
              onClick={handleGenerateRecommendations}
              disabled={isGeneratingRecommendations}
            >
              {isGeneratingRecommendations ? (
                <>Generating AI recommendations...</>
              ) : (
                <>
                  <AlertCircle className="mr-1 h-4 w-4" /> 
                  Check for recommended certifications
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showRecommendations} onOpenChange={setShowRecommendations}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>AI Certification Recommendations</DialogTitle>
            <DialogDescription>
              Based on {employeeName}'s role and current certifications
            </DialogDescription>
          </DialogHeader>
          
          {recommendations && (
            <div className="space-y-4">
              {recommendations.expiringCertifications.length > 0 && (
                <div>
                  <h3 className="font-semibold text-red-600 mb-2 flex items-center">
                    <AlertCircle className="mr-1 h-4 w-4" /> 
                    Expiring Certifications
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {recommendations.expiringCertifications.map((cert, i) => (
                      <li key={i} className="text-red-600">
                        {cert.cert_type} expires on {formatDate(cert.expires)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {recommendations.missingRequiredCertifications.length > 0 && (
                <div>
                  <h3 className="font-semibold text-amber-600 mb-2">Missing Required Certifications</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {recommendations.missingRequiredCertifications.map((cert, i) => (
                      <li key={i}>{cert}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div>
                <h3 className="font-semibold text-blue-600 mb-2">Recommended Certifications</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {recommendations.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRecommendations(false)}>Close</Button>
            <Button>Create Certification Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
