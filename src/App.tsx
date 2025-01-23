import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Dashboard } from '@/pages/Dashboard';
import { PatientRecord } from '@/pages/PatientRecord';
import { UnitDetailView } from '@/components/dashboard/UnitDetailView';
import { EmployeeProfile } from '@/pages/EmployeeProfile';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patient/:patientName" element={<PatientRecord />} />
          <Route path="/unit/:unitId" element={<UnitDetailView />} />
          <Route path="/employee/:id" element={<EmployeeProfile />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;