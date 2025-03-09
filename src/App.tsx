
import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";
import { Button } from "./components/ui/button";
import Index from "./pages/Index";
import ActiveDispatches from "./pages/ActiveDispatches";
import ClosedDispatches from "./pages/ClosedDispatches";
import CreateDispatch from "./pages/CreateDispatch";
import CrewAssignment from "./pages/CrewAssignment";
import ManageRoutes from "./pages/ManageRoutes";
import Performance from "./pages/Performance";
import AlertsConfig from "./pages/AlertsConfig";
import Billing from "./pages/Billing";
import { EmployeeDirectory } from "./pages/EmployeeDirectory";
import EmployeeProfile from "./pages/EmployeeProfile";
import { PatientRecord } from "./pages/PatientRecord";
import { OperationsMap } from "./pages/OperationsMap";
import { ShiftRecords } from "./pages/ShiftRecords";
import { SmartRouteOptimization } from "./pages/SmartRouteOptimization";
import { VerificationQueue } from "./pages/VerificationQueue";
import { ScheduleOverview } from "./pages/ScheduleOverview";
import { ServiceQueue } from "./pages/ServiceQueue";
import { AuthorizationQueue } from "./pages/AuthorizationQueue";
import { AuthorizationsOnRecord } from "./pages/AuthorizationsOnRecord";
import { CenterList } from "./pages/CenterList";
import { PartnerList } from "./pages/PartnerList";
import { PatientDirectory } from "./pages/PatientDirectory";
import { DocumentUpload } from "./pages/DocumentUpload";
import { ResourceLibrary } from "./pages/ResourceLibrary";
import { Categories } from "./pages/Categories";
import { HistoricalEntry } from "./pages/HistoricalEntry";
import { ExternalLink } from "./pages/ExternalLink";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    errorElement: (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-4">Sorry, we couldn't find the page you're looking for.</p>
        <Button asChild variant="default">
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    ),
  },
  {
    path: "/dispatch",
    element: <ActiveDispatches />,
  },
  {
    path: "/closed",
    element: <ClosedDispatches />,
  },
  {
    path: "/create",
    element: <CreateDispatch />,
  },
  {
    path: "/crew",
    element: <CrewAssignment />,
  },
  {
    path: "/routes",
    element: <ManageRoutes />,
  },
  {
    path: "/performance",
    element: <Performance />,
  },
  {
    path: "/alerts",
    element: <AlertsConfig />,
  },
  {
    path: "/billing",
    element: <Billing />,
  },
  {
    path: "/employees",
    element: <EmployeeDirectory />,
  },
  {
    path: "/employee/:id",
    element: <EmployeeProfile />,
  },
  {
    path: "/patient/:id",
    element: <PatientRecord />,
  },
  {
    path: "/operations-map",
    element: <OperationsMap />,
  },
  {
    path: "/shift-records",
    element: <ShiftRecords />,
  },
  {
    path: "/smart-route-optimization",
    element: <SmartRouteOptimization />,
  },
  {
    path: "/verification-queue",
    element: <VerificationQueue />,
  },
  {
    path: "/schedule-overview",
    element: <ScheduleOverview />,
  },
  {
    path: "/service-queue",
    element: <ServiceQueue />,
  },
  {
    path: "/authorization-queue",
    element: <AuthorizationQueue />,
  },
  {
    path: "/authorizations-on-record",
    element: <AuthorizationsOnRecord />,
  },
  {
    path: "/center-list",
    element: <CenterList />,
  },
  {
    path: "/partner-list",
    element: <PartnerList />,
  },
  {
    path: "/patient-directory",
    element: <PatientDirectory />,
  },
  {
    path: "/document-upload",
    element: <DocumentUpload />,
  },
  {
    path: "/resource-library",
    element: <ResourceLibrary />,
  },
  {
    path: "/categories",
    element: <Categories />,
  },
  {
    path: "/historical-entry",
    element: <HistoricalEntry />,
  },
  {
    path: "/external-link",
    element: <ExternalLink />,
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
