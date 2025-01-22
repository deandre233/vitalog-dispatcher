import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import CreateDispatch from './pages/CreateDispatch';
import ActiveDispatches from './pages/ActiveDispatches';
import ClosedDispatches from './pages/ClosedDispatches';
import CrewAssignment from './pages/CrewAssignment';
import ManageRoutes from './pages/ManageRoutes';
import Performance from './pages/Performance';
import Billing from './pages/Billing';
import EmployeeDirectory from './pages/EmployeeDirectory';
import EmployeeProfile from './pages/EmployeeProfile';
import AlertsConfig from './pages/AlertsConfig';
import PatientRecord from './pages/PatientRecord';
import BookDispatch from './pages/BookDispatch';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import './App.css';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dispatch" element={<ActiveDispatches />} />
        <Route path="/book-dispatch" element={<BookDispatch />} />
        <Route path="/dispatch/active" element={<ActiveDispatches />} />
        <Route path="/dispatch/closed" element={<ClosedDispatches />} />
        <Route path="/dispatch/crew" element={<CrewAssignment />} />
        <Route path="/dispatch/routes" element={<ManageRoutes />} />
        <Route path="/performance" element={<Performance />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/employees" element={<EmployeeDirectory />} />
        <Route path="/employees/:id" element={<EmployeeProfile />} />
        <Route path="/alerts" element={<AlertsConfig />} />
        <Route path="/patient/:id" element={<PatientRecord />} />
      </Routes>
      <Toaster />
      <SonnerToaster position="bottom-right" />
    </ThemeProvider>
  );
}

export default App;