// src/router.tsx
import { createBrowserRouter } from "react-router";
import DrawerLayout from "./layouts/DrawerLayout";
import Home from "./pages/Home";
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
        path: "/incidents",
        element: <IncidentsList />,
      },
      {
        path: "/incident/:incidentId",
        element: <IncidentDetail />,
      },
    ],
  },
]);

export default router;
