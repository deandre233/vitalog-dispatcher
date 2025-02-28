
import { Routes, Route } from "react-router-dom";
import { Index } from "./pages/Index";
import { ScheduleOverview } from "./pages/ScheduleOverview";
import { Toaster } from "@/components/ui/toaster";
import { AnnouncementsPage } from "./pages/hr/AnnouncementsPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/schedule" element={<ScheduleOverview />} />
        <Route path="/hr/announcements" element={<AnnouncementsPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
