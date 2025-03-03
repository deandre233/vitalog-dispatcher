
import React from "react";
import { TabsList as ShadcnTabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  Award, 
  Calendar, 
  User, 
  Ambulance, 
  FileText, 
  Phone, 
  BarChart2, 
  MessageSquare, 
  HeartPulse,
  MapPin
} from "lucide-react";

export const TabsList: React.FC = () => {
  return (
    <ShadcnTabsList className="bg-muted/50 p-1 flex flex-nowrap overflow-x-auto mb-4 sticky top-0 z-10 rounded-lg">
      <TabsTrigger value="identity">Identity</TabsTrigger>
      <TabsTrigger value="payroll">Payroll</TabsTrigger>
      <TabsTrigger value="roles">Roles (1)</TabsTrigger>
      <TabsTrigger value="privileges">Privileges</TabsTrigger>
      <TabsTrigger value="demographics">Demographics</TabsTrigger>
      <TabsTrigger value="incidents">
        <div className="flex items-center gap-1">
          <AlertTriangle className="w-4 h-4" />
          <span>Incidents</span>
        </div>
      </TabsTrigger>
      <TabsTrigger value="documents">
        <div className="flex items-center gap-1">
          <FileText className="w-4 h-4" />
          <span>Documents</span>
        </div>
      </TabsTrigger>
      <TabsTrigger value="stats">
        <div className="flex items-center gap-1">
          <BarChart2 className="w-4 h-4" />
          <span>Stats</span>
        </div>
      </TabsTrigger>
      <TabsTrigger value="certificates">Certificates</TabsTrigger>
      <TabsTrigger value="achievements">
        <div className="flex items-center gap-1">
          <Award className="w-4 h-4" />
          <span>Achievements</span>
        </div>
      </TabsTrigger>
      <TabsTrigger value="damage">Damage</TabsTrigger>
      <TabsTrigger value="announcements">
        <div className="flex items-center gap-1">
          <MessageSquare className="w-4 h-4" />
          <span>Announcements</span>
        </div>
      </TabsTrigger>
      <TabsTrigger value="immunizations">
        <div className="flex items-center gap-1">
          <HeartPulse className="w-4 h-4" />
          <span>Immunizations</span>
        </div>
      </TabsTrigger>
      <TabsTrigger value="tracking">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span>Tracking</span>
        </div>
      </TabsTrigger>
    </ShadcnTabsList>
  );
};
