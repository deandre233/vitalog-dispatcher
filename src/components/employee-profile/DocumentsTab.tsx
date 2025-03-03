
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export const DocumentsTab: React.FC = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Documents</h2>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Employee Documents</h3>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="border rounded-md p-4 hover:bg-muted/20 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">Employment Contract</h4>
                <p className="text-sm text-muted-foreground">Uploaded on Jan 15, 2023</p>
              </div>
              <Button variant="ghost" size="sm">View</Button>
            </div>
          </div>
          
          <div className="border rounded-md p-4 hover:bg-muted/20 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">W-4 Form</h4>
                <p className="text-sm text-muted-foreground">Uploaded on Jan 15, 2023</p>
              </div>
              <Button variant="ghost" size="sm">View</Button>
            </div>
          </div>
          
          <div className="border rounded-md p-4 hover:bg-muted/20 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">Direct Deposit Authorization</h4>
                <p className="text-sm text-muted-foreground">Uploaded on Jan 15, 2023</p>
              </div>
              <Button variant="ghost" size="sm">View</Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
