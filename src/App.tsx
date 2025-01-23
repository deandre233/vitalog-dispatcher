import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
import { EmployeeProfile } from "./pages/EmployeeProfile";
import { PatientRecord } from "./pages/PatientRecord";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
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
    path: "/patient/:patientName",
    element: <PatientRecord />,
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;