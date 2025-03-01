
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
  console.log("App component rendering with all routes");
  
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
        <Route path="/dispatch" element={<Index />} /> {/* Added dispatch route temporarily pointing to Index */}
        <Route path="/billing" element={<Index />} /> {/* Added billing route temporarily pointing to Index */}
        <Route path="/performance" element={<Index />} /> {/* Added performance route temporarily */}
        <Route path="/crew" element={<Index />} /> {/* Added crew route temporarily */}
        <Route path="/alerts" element={<Index />} /> {/* Added alerts route temporarily */}
        <Route path="/routes" element={<Index />} /> {/* Added routes route temporarily */}
        <Route path="/settings" element={<Index />} /> {/* Added settings route temporarily */}
        <Route path="/support" element={<Index />} /> {/* Added support route temporarily */}
        <Route path="/analytics" element={<Index />} /> {/* Added analytics route temporarily */}
        <Route path="*" element={<div className="p-10 text-center"><h1 className="text-2xl">Page Not Found</h1><p>The page you're looking for doesn't exist.</p></div>} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
