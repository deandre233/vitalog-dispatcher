import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "../components/ui/tooltip";
import { Toaster } from "../components/ui/sonner";
import { UnitDetailView } from "./components/dashboard/UnitDetailView";
import { DispatchDetailView } from "./components/dashboard/DispatchDetailView";
import { DashboardView } from "./components/dashboard/DashboardView";
import { PatientDetailView } from "./components/dashboard/PatientDetailView";
import { SettingsView } from "./components/dashboard/SettingsView";
import { Layout } from "./components/Layout";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<DashboardView />} />
              <Route path="dispatch/:id" element={<DispatchDetailView />} />
              <Route path="transport/:unitId" element={<UnitDetailView />} />
              <Route path="patient/:patientId" element={<PatientDetailView />} />
              <Route path="settings" element={<SettingsView />} />
            </Route>
          </Routes>
          <Toaster />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;