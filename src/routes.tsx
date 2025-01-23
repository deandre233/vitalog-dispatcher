import { createBrowserRouter } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import { DispatchDetailView } from "./components/dashboard/DispatchDetailView";

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
    path: "/dispatch/:id",
    element: <DispatchDetailView />,
  },
]);