import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CreateDispatch from "./pages/CreateDispatch";
import ActiveDispatches from "./pages/ActiveDispatches";
import ClosedDispatches from "./pages/ClosedDispatches";
import CrewAssignment from "./pages/CrewAssignment";
import ManageRoutes from "./pages/ManageRoutes";
import Performance from "./pages/Performance";
import AlertsConfig from "./pages/AlertsConfig";
import Billing from "./pages/Billing";
import { EmployeeDirectory } from "./pages/EmployeeDirectory";
import EmployeeProfile from "./pages/EmployeeProfile";
import { PatientRecord } from "./pages/PatientRecord";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dispatch/create" element={<CreateDispatch />} />
          <Route path="/dispatch/active" element={<ActiveDispatches />} />
          <Route path="/dispatch/closed" element={<ClosedDispatches />} />
          <Route path="/crew-assignment" element={<CrewAssignment />} />
          <Route path="/routes" element={<ManageRoutes />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/alerts" element={<AlertsConfig />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/employees" element={<EmployeeDirectory />} />
          <Route path="/employees/:id" element={<EmployeeProfile />} />
          <Route path="/patients/:id" element={<PatientRecord />} />
        </Routes>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;