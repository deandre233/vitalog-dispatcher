import { createBrowserRouter } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ActiveDispatches from "./pages/ActiveDispatches";
import ClosedDispatches from "./pages/ClosedDispatches";
import CreateDispatch from "./pages/CreateDispatch";
import CrewAssignment from "./pages/CrewAssignment";
import Performance from "./pages/Performance";
import AlertsConfig from "./pages/AlertsConfig";
import Billing from "./pages/Billing";
import { EmployeeDirectory } from "./pages/EmployeeDirectory";
import { EmployeeProfile } from "./pages/EmployeeProfile";
import { PatientRecord } from "./pages/PatientRecord";
import ManageRoutes from "./pages/ManageRoutes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/dispatch/active",
    element: <ActiveDispatches />,
  },
  {
    path: "/dispatch/closed",
    element: <ClosedDispatches />,
  },
  {
    path: "/dispatch/create",
    element: <CreateDispatch />,
  },
  {
    path: "/dispatch/crew",
    element: <CrewAssignment />,
  },
  {
    path: "/dispatch/:id",
    element: <CreateDispatch />,
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
    path: "/routes",
    element: <ManageRoutes />,
  },
]);