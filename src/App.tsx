import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RouteOptimizationView } from './components/dispatch/RouteOptimizationView';
import { ServiceRequestView } from './components/dispatch/ServiceRequestView';
import { DashboardView } from './components/dashboard/DashboardView';
import { DispatchDetailView } from './components/dashboard/DispatchDetailView';
import { BookingForm } from './components/dispatch/BookingForm';
import { Layout } from './components/layout/Layout';
import { Toaster } from './components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<DashboardView />} />
            <Route path="/dispatch/:id" element={<DispatchDetailView />} />
            <Route path="/dispatch/new" element={<BookingForm />} />
            <Route path="/dispatch/routes" element={<RouteOptimizationView />} />
            <Route path="/dispatch/requests" element={<ServiceRequestView />} />
          </Routes>
        </Layout>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;