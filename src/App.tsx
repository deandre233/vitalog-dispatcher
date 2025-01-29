import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import Index from "@/pages/Index";
import CreateDispatch from "@/pages/CreateDispatch";
import { EmployeeDirectory } from "@/pages/EmployeeDirectory";
import EmployeeProfile from "@/pages/EmployeeProfile";
import { OperationsMap } from "@/pages/OperationsMap";
import { ShiftRecords } from "@/pages/ShiftRecords";
import { SmartRouteOptimization } from "@/pages/SmartRouteOptimization";
import { VerificationQueue } from "@/pages/VerificationQueue";
import { ScheduleOverview } from "@/pages/ScheduleOverview";
import { ServiceQueue } from "@/pages/ServiceQueue";
import { AuthorizationQueue } from "@/pages/AuthorizationQueue";
import { AuthorizationsOnRecord } from "@/pages/AuthorizationsOnRecord";
import { CenterList } from "@/pages/CenterList";
import { PartnerList } from "@/pages/PartnerList";
import { PatientDirectory } from "@/pages/PatientDirectory";
import { DocumentUpload } from "@/pages/DocumentUpload";
import { ResourceLibrary } from "@/pages/ResourceLibrary";
import { Categories } from "@/pages/Categories";
import HistoricalEntry from "@/pages/HistoricalEntry";
import { ExternalLink } from "@/pages/ExternalLink";
import PatientRecord from "@/pages/PatientRecord";
import Performance from "@/pages/Performance";
import Billing from "@/pages/Billing";
import ManageRoutes from "@/pages/ManageRoutes";
import AlertsConfig from "@/pages/AlertsConfig";
import CrewAssignment from "@/pages/CrewAssignment";
import ActiveDispatches from "@/pages/ActiveDispatches";
import ClosedDispatches from "@/pages/ClosedDispatches";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dispatch/new" element={<CreateDispatch />} />
        <Route path="/employees" element={<EmployeeDirectory />} />
        <Route path="/employee/:id" element={<EmployeeProfile />} />
        <Route path="/operations-map" element={<OperationsMap />} />
        <Route path="/shift-records" element={<ShiftRecords />} />
        <Route path="/smart-route-optimization" element={<SmartRouteOptimization />} />
        <Route path="/verification-queue" element={<VerificationQueue />} />
        <Route path="/schedule-overview" element={<ScheduleOverview />} />
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
        <Route path="/patient/:id" element={<PatientRecord />} />
        <Route path="/performance" element={<Performance />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/manage-routes" element={<ManageRoutes />} />
        <Route path="/alerts-config" element={<AlertsConfig />} />
        <Route path="/crew-assignment" element={<CrewAssignment />} />
        <Route path="/active-dispatches" element={<ActiveDispatches />} />
        <Route path="/closed-dispatches" element={<ClosedDispatches />} />
      </Routes>
      <Toaster />
      <SonnerToaster position="top-right" />
    </Router>
  );
}

export default App;