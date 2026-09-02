import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import DashboardPage from "./pages/DashboardPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AddApplicationPage from "./pages/AddApplicationPage";
import BrowseJobsPage from "./pages/BrowseJobsPage";
import JobDetailPage from "./pages/JobDetailPage";
import SavedJobsPage from "./pages/SavedJobsPage";
import AlertsPage from "./pages/AlertsPage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      // The board is the front door now; the tracker lives alongside it.
      { index: true, element: <Navigate to="/jobs" replace /> },
      { path: "jobs", element: <BrowseJobsPage /> },
      { path: "jobs/:id", element: <JobDetailPage /> },
      { path: "saved", element: <SavedJobsPage /> },
      { path: "alerts", element: <AlertsPage /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "applications", element: <ApplicationsPage /> },
      { path: "applications/new", element: <AddApplicationPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
