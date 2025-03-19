
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { TestProvider } from "@/contexts/TestContext";

// Pages
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import CreateTest from "./pages/CreateTest";
import UpdateTest from "./pages/UpdateTest";
import ManageTest from "./pages/ManageTest";
import StudentLogin from "./pages/StudentLogin";
import StudentDetails from "./pages/StudentDetails";
import StudentExam from "./pages/StudentExam";
import NotFound from "./pages/NotFound";

// Protected Route Component
import { useAuth } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TestProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LoginPage />} />
              <Route path="/student/login/:testId" element={<StudentLogin />} />
              <Route path="/student/details/:testId" element={<StudentDetails />} />
              <Route path="/student/exam/:testId" element={<StudentExam />} />

              {/* Protected Admin Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/create-test" 
                element={
                  <ProtectedRoute>
                    <CreateTest />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/update-test" 
                element={
                  <ProtectedRoute>
                    <UpdateTest />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/manage-test" 
                element={
                  <ProtectedRoute>
                    <ManageTest />
                  </ProtectedRoute>
                } 
              />

              {/* Catch All */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </TestProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
