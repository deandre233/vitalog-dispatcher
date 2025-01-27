import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "@/pages/Index";
import ActiveDispatches from "@/pages/ActiveDispatches";
import ClosedDispatches from "@/pages/ClosedDispatches";
import CreateDispatch from "@/pages/CreateDispatch";
import DispatchSettings from "@/pages/DispatchSettings";
import { Reports } from "@/pages/Reports";
import { OperationsMap } from "@/pages/OperationsMap";
import { ServiceQueue } from "@/pages/ServiceQueue";
import { AuthorizationQueue } from "@/pages/AuthorizationQueue";
import { AuthorizationsOnRecord } from "@/pages/AuthorizationsOnRecord";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index hospitalName="General Hospital" />} />
          <Route path="/active-dispatches" element={<ActiveDispatches />} />
          <Route path="/closed-dispatches" element={<ClosedDispatches />} />
          <Route path="/create-dispatch" element={<CreateDispatch />} />
          <Route path="/dispatch-settings" element={<DispatchSettings />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/operations-map" element={<OperationsMap />} />
          <Route path="/service-queue" element={<ServiceQueue />} />
          <Route path="/authorization-queue" element={<AuthorizationQueue />} />
          <Route path="/authorizations-on-record" element={<AuthorizationsOnRecord />} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;