import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from "./integrations/supabase/client";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { AppLayout } from "./components/app/AppLayout";
import { AdminLayout } from "./components/admin/AdminLayout";

// Pages
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import Pricing from "./pages/Pricing";
import Instructor from "./pages/Instructor";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Checkout from "./pages/Checkout";
import StartupAILanding from "./pages/StartupAILanding";
import CourseLandingPage from "./pages/CourseLandingPage";
import Dashboard from "./pages/app/Dashboard";
import CourseView from "./pages/app/CourseView";
import Profile from "./pages/app/Profile";
import History from "./pages/app/History";
import Notifications from "./pages/app/Notifications";
import AppCourses from "./pages/app/AppCourses";
import CourseExam from "./pages/app/CourseExam";
import CourseCertificate from "./pages/app/CourseCertificate";
import Subscription from "./pages/app/Subscription";
import Certificates from "./pages/app/Certificates";
import PaymentCancel from "./pages/app/PaymentCancel";
import PaymentSuccess from "./pages/app/PaymentSuccess";
import Settings from "./pages/app/Settings";
import ChatIA from "./pages/app/ChatIA";
import VerifyCertificate from "./pages/app/VerifyCertificate";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminCourses from "./pages/admin/Courses";
import CreateCourse from "./pages/admin/CreateCourse";
import EditCourse from "./pages/admin/EditCourse";
import Users from "./pages/admin/Users";
import Statistics from "./pages/admin/Statistics";
import AdminNotifications from "./pages/admin/Notifications";
import AdminSettings from "./pages/admin/Settings";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SessionContextProvider supabaseClient={supabase}>
      <TooltipProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-[#0A0F1C]">
            <Routes>
              {/* Public routes */}
              <Route
                path="/"
                element={
                  <>
                    <Navigation />
                    <main className="flex-grow pt-16">
                      <Index />
                    </main>
                    <Footer />
                  </>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <>
                    <Navigation />
                    <main className="flex-grow pt-16">
                      <ForgotPassword />
                    </main>
                    <Footer />
                  </>
                }
              />
              <Route
                path="/cursos"
                element={
                  <>
                    <Navigation />
                    <main className="flex-grow pt-16">
                      <Courses />
                    </main>
                    <Footer />
                  </>
                }
              />
              <Route
                path="/precios"
                element={
                  <>
                    <Navigation />
                    <main className="flex-grow pt-16">
                      <Pricing />
                    </main>
                    <Footer />
                  </>
                }
              />
              <Route
                path="/instructor/juan-gallego"
                element={
                  <>
                    <Navigation />
                    <main className="flex-grow pt-16">
                      <Instructor />
                    </main>
                    <Footer />
                  </>
                }
              />
              <Route
                path="/login"
                element={
                  <>
                    <Navigation />
                    <main className="flex-grow pt-16">
                      <Login />
                    </main>
                    <Footer />
                  </>
                }
              />
              <Route
                path="/landing-page/startup-ai"
                element={
                  <>
                    <Navigation />
                    <main className="flex-grow pt-16">
                      <StartupAILanding />
                    </main>
                    <Footer />
                  </>
                }
              />

              {/* Nueva ruta de landing pages para cursos */}
              <Route
                path="/landing-page/:cursoId"
                element={
                  <>
                    <Navigation />
                    <main className="flex-grow pt-16">
                      <CourseLandingPage />
                    </main>
                    <Footer />
                  </>
                }
              />

              {/* Nueva ruta de verificación de certificados */}
              <Route path="/verify-certificate/:certificateId" element={<VerifyCertificate />} />

              {/* Nueva ruta de checkout */}
              <Route path="/checkout" element={<Checkout />} />

              {/* Protected routes */}
              <Route path="/app" element={<AppLayout />}>
                <Route index element={<Navigate to="/app/inicio" replace />} />
                <Route path="inicio" element={<Dashboard />} />
                <Route path="cursos" element={<AppCourses />} />
                <Route path="cursos/:cursoId" element={<CourseView />} />
                <Route path="cursos/:cursoId/examen" element={<CourseExam />} />
                <Route path="cursos/:cursoId/certificado" element={<CourseCertificate />} />
                <Route path="certificados" element={<Certificates />} />
                <Route path="perfil" element={<Profile />} />
                <Route path="historial" element={<History />} />
                <Route path="notificaciones" element={<Notifications />} />
                <Route path="suscripcion" element={<Subscription />} />
                <Route path="configuracion" element={<Settings />} />
                <Route path="payment-success" element={<PaymentSuccess />} />
                <Route path="payment-cancel" element={<PaymentCancel />} />
                <Route path="chat-IA" element={<ChatIA />} />
              </Route>

              {/* Admin routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/inicio" replace />} />
                <Route path="inicio" element={<AdminDashboard />} />
                <Route path="cursos" element={<AdminCourses />} />
                <Route path="cursos/crear" element={<CreateCourse />} />
                <Route path="cursos/:cursoId/editar" element={<EditCourse />} />
                <Route path="usuarios" element={<Users />} />
                <Route path="estadisticas" element={<Statistics />} />
                <Route path="notificaciones" element={<AdminNotifications />} />
                <Route path="configuracion" element={<AdminSettings />} />
              </Route>

              {/* Catch all route - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </TooltipProvider>
    </SessionContextProvider>
  </QueryClientProvider>
);

export default App;