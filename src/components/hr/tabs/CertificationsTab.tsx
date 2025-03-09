
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useEmployeeDetails } from "@/hooks/useEmployeeDetails";
import { useEmployeeCertifications } from "@/hooks/useEmployeeCertifications";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Award, BookOpen, Brain, Calendar, Clock, Download, FileCheck, Folder, GraduationCap, Plus, Trash2, Upload } from "lucide-react";
import { CertificationsSection } from "./performance/CertificationsSection";
import { ContinuingEducationSection } from "./performance/ContinuingEducationSection";
import { PracticeLevelsSection } from "./certifications/PracticeLevelsSection";
import { AdvancedSearchSection } from "./certifications/AdvancedSearchSection";
import { CertificationPlannerSection } from "./certifications/CertificationPlannerSection";
import { CertificationHistorySection } from "./certifications/CertificationHistorySection";

export function CertificationsTab() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { employee } = useEmployeeDetails(employeeId);
  const { 
    certificates, 
    continuingEducation, 
    practiceLevels, 
    isLoading
  } = useEmployeeCertifications(employeeId);

  const [activeTab, setActiveTab] = useState("active-certs");
  
  if (isLoading) {
    return <div className="flex justify-center p-8">Loading employee certification data...</div>;
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Certification Management: {employee?.first_name} {employee?.last_name}
        </h1>
        
        <div className="flex gap-2">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="active-certs" className="flex items-center">
                <Award className="mr-1 h-4 w-4" />
                Active Certifications
              </TabsTrigger>
              <TabsTrigger value="continuing-education" className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                Continuing Education
              </TabsTrigger>
              <TabsTrigger value="practice-levels" className="flex items-center">
                <BookOpen className="mr-1 h-4 w-4" />
                Practice Levels
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                Certification History
              </TabsTrigger>
              <TabsTrigger value="planner" className="flex items-center">
                <Brain className="mr-1 h-4 w-4" />
                AI Certification Planner
              </TabsTrigger>
              <TabsTrigger value="advanced-search" className="flex items-center">
                <Folder className="mr-1 h-4 w-4" />
                Advanced Search
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active-certs" className="mt-0">
              <CertificationsSection />
            </TabsContent>

            <TabsContent value="continuing-education" className="mt-0">
              <ContinuingEducationSection />
            </TabsContent>

            <TabsContent value="practice-levels" className="mt-0">
              <PracticeLevelsSection />
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <CertificationHistorySection />
            </TabsContent>

            <TabsContent value="planner" className="mt-0">
              <CertificationPlannerSection />
            </TabsContent>

            <TabsContent value="advanced-search" className="mt-0">
              <AdvancedSearchSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {activeTab === "active-certs" && <CertificationsSection />}
      {activeTab === "continuing-education" && <ContinuingEducationSection />}
      {activeTab === "practice-levels" && <PracticeLevelsSection />}
      {activeTab === "history" && <CertificationHistorySection />}
      {activeTab === "planner" && <CertificationPlannerSection />}
      {activeTab === "advanced-search" && <AdvancedSearchSection />}
    </div>
  );
}
