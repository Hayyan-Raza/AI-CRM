import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Toaster } from '@/components/ui/sonner';

// Auth Pages
import LoginPage from '@/pages/auth/Login';
import SignupPage from '@/pages/auth/Signup';

// Main Layout
import DashboardLayout from '@/components/layout/DashboardLayout';

// Dashboard Pages
import HomeDashboard from '@/pages/dashboard/Home';
import CRMPage from '@/pages/dashboard/CRM';
import PipelinePage from '@/pages/dashboard/Pipeline';
import TasksPage from '@/pages/dashboard/Tasks';
import AIEmployeesPage from '@/pages/dashboard/AIEmployees';
import TimelinePage from '@/pages/dashboard/Timeline';
import AIInsightsPage from '@/pages/dashboard/AIInsights';
import ReportsPage from '@/pages/dashboard/Reports';
import SettingsPage from '@/pages/dashboard/Settings';
import AIEmployeeEditorPage from '@/pages/dashboard/AIEmployeeEditor';

// Documentation Pages
import DocsLayout from '@/components/layout/DocsLayout';
import DocsHome from '@/pages/docs/DocsHome';
import GettingStarted from '@/pages/docs/GettingStarted';
import AuthSecurity from '@/pages/docs/AuthSecurity';
import UserRoles from '@/pages/docs/UserRoles';
import CoreFeatures from '@/pages/docs/CoreFeatures';
import AISystem from '@/pages/docs/AISystem';
import DashboardsAnalytics from '@/pages/docs/DashboardsAnalytics';
import Workflows from '@/pages/docs/Workflows';
import APIDocs from '@/pages/docs/APIDocs';
import ErrorsEdgeCases from '@/pages/docs/ErrorsEdgeCases';
import SecurityCompliance from '@/pages/docs/SecurityCompliance';
import Changelog from '@/pages/docs/Changelog';
import FAQ from '@/pages/docs/FAQ';
import Support from '@/pages/docs/Support';

// Loading Component
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2d62ff] to-[#dd23bb] flex items-center justify-center animate-pulse">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <p className="text-[#868686]">Loading NexusCRM...</p>
      </div>
    </div>
  );
}

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

// Public Route Component (redirects to dashboard if authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
}

import { useCRMStore } from '@/store/crmStore';

function App() {
  const { initializeAuth, isLoading: isAuthLoading, isAuthenticated } = useAuthStore();
  const { fetchData } = useCRMStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  if (isAuthLoading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Auth Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomeDashboard />} />
          <Route path="crm" element={<CRMPage />} />
          <Route path="pipeline" element={<PipelinePage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="ai-employees" element={<AIEmployeesPage />} />
          <Route path="timeline" element={<TimelinePage />} />
          <Route path="ai-insights" element={<AIInsightsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Standalone Agent Editor Route */}
        <Route
          path="/dashboard/agent-editor/:id"
          element={
            <ProtectedRoute>
              <AIEmployeeEditorPage />
            </ProtectedRoute>
          }
        />

        {/* Default Redirect */}
        <Route path="/docs" element={<DocsLayout />}>
          <Route index element={<DocsHome />} />
          <Route path="getting-started" element={<GettingStarted />} />
          <Route path="authentication" element={<AuthSecurity />} />
          <Route path="user-roles" element={<UserRoles />} />
          <Route path="core-features" element={<CoreFeatures />} />
          <Route path="ai-system" element={<AISystem />} />
          <Route path="dashboards-analytics" element={<DashboardsAnalytics />} />
          <Route path="workflows" element={<Workflows />} />
          <Route path="api" element={<APIDocs />} />
          <Route path="errors" element={<ErrorsEdgeCases />} />
          <Route path="security" element={<SecurityCompliance />} />
          <Route path="changelog" element={<Changelog />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="support" element={<Support />} />
        </Route>

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;
