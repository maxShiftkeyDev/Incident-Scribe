// src/router.tsx
import { createBrowserRouter } from "react-router";
import DrawerLayout from "./layouts/DrawerLayout";
import Home from "./pages/Home";
import CreateIncident from "./pages/CreateIncident";
import IncidentDetail from "./pages/IncidentDetail";
import IncidentsList from "./pages/IncidentsList";


const router = createBrowserRouter([
  {
    element: <DrawerLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/create",
        element: <CreateIncident />,
      },
      {
        path: "/incidents",
        element: <IncidentsList />,
      },
      {
        path: "/incident/:id",
        element: <IncidentDetail />,
      },
    ],
  },
]);

export default router;
