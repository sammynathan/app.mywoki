import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./auth/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import DashboardLayout from "./dashboard/DashboardLayout"
import LandingPage from "./components/LandingPage"
import LoginPage from "./components/LoginPage"
import Onboarding from "./components/Onboarding"
import NotFound from "./components/NotFound"
import SearchServiceDocs from "./components/SearchServiceDocs"

// Dashboard pages
import DashboardOverview from "./dashboard/DashboardOverview"
import ToolsPage from "./dashboard/ToolsPage"
import ToolDetailsPage from "./dashboard/ToolDetailsPage"
import UsageAnalyticsPage from "./dashboard/UsageAnalyticsPage"
import BillingPage from "./dashboard/BillingPage"
import AccountSettingsPage from "./dashboard/AccountSettingsPage"
import ProjectPage from "./dashboard/ProjectsPage"
import ProjectsListPage from "./dashboard/ProjectsListPage"
import AnalyticsManagement from "./Managment/AnalyticsManagement"
import LiveMonitoring from "./Managment/LiveMonitoring"
import ManagementLayout from "./Managment/ManagementLayout"
import ManagementOverview from "./Managment/ManagementOverview"
import NotificationsManagement from "./Managment/NotificationsManagement"
import ToolsManagement from "./Managment/ToolsManagement"
import UsersManagement from "./Managment/UsersManagement"
import ManagementSettings from "./Managment/ManagementSettings"
import { SearchProvider } from './components/context/SearchContext'
function App() {
  return (
    <AuthProvider>
      <SearchProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/docs/search-service" element={<SearchServiceDocs />} />

          {/* Protected dashboard routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="projects" element={<ProjectsListPage />} />
            <Route path="projects/:id" element={<ProjectPage />} />
            <Route path="tools" element={<ToolsPage />} />
            <Route path="tools/:id" element={<ToolDetailsPage />} />
            <Route path="analytics" element={<UsageAnalyticsPage />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="settings" element={<AccountSettingsPage />} />
            
            {/* Redirect any unmatched dashboard paths to overview */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
       <Route path="/management" element={<ManagementLayout />}>
        <Route index element={<ManagementOverview />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="tools" element={<ToolsManagement />} />
        <Route path="notifications" element={<NotificationsManagement />} />
        <Route path="analytics" element={<AnalyticsManagement />} />
        <Route path="monitoring" element={<LiveMonitoring />} />
        <Route path="settings" element={<ManagementSettings />} />
      </Route>
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      </SearchProvider>
    </AuthProvider>
  )
}

export default App