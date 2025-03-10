
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileText } from "lucide-react";

// This component is no longer being used as its functionality
// has been moved directly into the HRHome page component.
// It's kept here for reference or potential future use.

export function HRDashboard() {
  const [isDeprecated, setIsDeprecated] = useState(true);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Legacy Dashboard Component</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            This component has been deprecated. All functionality has been moved to the main HRHome page for better organization.
          </p>
          <div className="flex gap-4">
            <Button variant="outline" className="gap-2">
              <Users className="h-4 w-4" />
              <span>View Employees</span>
            </Button>
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              <span>View Documentation</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
