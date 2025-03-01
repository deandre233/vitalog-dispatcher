
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { ScheduleOverview } from "./pages/ScheduleOverview";
import { Toaster } from "@/components/ui/toaster";
import { AnnouncementsPage } from "./pages/hr/AnnouncementsPage";
import { EmployeeDirectoryPage } from "./pages/EmployeeDirectoryPage";
import { OperationsMapPage } from "./pages/OperationsMapPage";
import { ShiftRecordsPage } from "./pages/ShiftRecordsPage";
import { VerificationQueuePage } from "./pages/VerificationQueuePage";
import { ServiceQueuePage } from "./pages/ServiceQueuePage";

function App() {
  console.log("App component rendering");
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/schedule" element={<ScheduleOverview />} />
        <Route path="/hr/announcements" element={<AnnouncementsPage />} />
        <Route path="/employees" element={<EmployeeDirectoryPage />} />
        <Route path="/operations-map" element={<OperationsMapPage />} />
        <Route path="/shift-records" element={<ShiftRecordsPage />} />
        <Route path="/verification-queue" element={<VerificationQueuePage />} />
        <Route path="/service-queue" element={<ServiceQueuePage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
