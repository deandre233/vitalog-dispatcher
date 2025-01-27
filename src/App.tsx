import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Dashboard from "@/pages/Dashboard";
import Employees from "@/pages/Employees";
import OperationsMap from "@/pages/OperationsMap";
import ShiftRecords from "@/pages/ShiftRecords";
import SmartRouteOptimization from "@/pages/SmartRouteOptimization";
import VerificationQueue from "@/pages/VerificationQueue";
import ScheduleOverview from "@/pages/ScheduleOverview";
import Dispatch from "@/pages/Dispatch";
import ServiceQueue from "@/pages/ServiceQueue";
import AuthorizationQueue from "@/pages/AuthorizationQueue";
import AuthorizationsOnRecord from "@/pages/AuthorizationsOnRecord";
import CenterList from "@/pages/CenterList";
import PartnerList from "@/pages/PartnerList";
import PatientDirectory from "@/pages/PatientDirectory";
import DocumentUpload from "@/pages/DocumentUpload";
import ResourceLibrary from "@/pages/ResourceLibrary";
import Categories from "@/pages/Categories";
import HistoricalEntry from "@/pages/HistoricalEntry";
import ExternalLink from "@/pages/ExternalLink";
import CreateDispatch from "@/pages/CreateDispatch";
import DispatchSettings from "@/pages/DispatchSettings";

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <div className="flex-1 flex">
            <SidebarProvider>
              <AppSidebar />
              <main className="flex-1 bg-[#f4f7fc] overflow-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/employees" element={<Employees />} />
                  <Route path="/operations-map" element={<OperationsMap />} />
                  <Route path="/shift-records" element={<ShiftRecords />} />
                  <Route path="/smart-route-optimization" element={<SmartRouteOptimization />} />
                  <Route path="/verification-queue" element={<VerificationQueue />} />
                  <Route path="/schedule-overview" element={<ScheduleOverview />} />
                  <Route path="/dispatch" element={<Dispatch />} />
                  <Route path="/service-queue" element={<ServiceQueue />} />
                  <Route path="/authorization-queue" element={<AuthorizationQueue />} />
                  <Route path="/authorizations-on-record" element={<AuthorizationsOnRecord />} />
                  <Route path="/center-list" element={<CenterList />} />
                  <Route path="/partner-list" element={<PartnerList />} />
                  <Route path="/patient-directory" element={<PatientDirectory />} />
                  <Route path="/document-upload" element={<DocumentUpload />} />
                  <Route path="/resource-library" element={<ResourceLibrary />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/historical-entry" element={<HistoricalEntry />} />
                  <Route path="/external-link" element={<ExternalLink />} />
                  <Route path="/create-dispatch" element={<CreateDispatch />} />
                  <Route path="/dispatch-settings" element={<DispatchSettings />} />
                </Routes>
              </main>
            </SidebarProvider>
          </div>
          <Footer />
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  );
}