import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SubmitAnnouncement from "./pages/SubmitAnnouncement";            //baru
import { AnnouncementProvider } from "@/context/AnnouncementContext";   //baru
import CalendarPage from "@/pages/Calendar";                            //baru
import About from "./pages/About";                                      //baru
import Login from "@/pages/Login";                                      //baru
import { ProtectedRoute } from "@/components/ProtectedRoute";           //baru
import Landing from "@/pages/Landing";                                  //baru
import Signup from "@/pages/Signup";                                    //baru


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AnnouncementProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/hub" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />

            <Route path="/submit-announcement" element={
              <ProtectedRoute>
                <SubmitAnnouncement />
              </ProtectedRoute>
            } />

            <Route path="/calendar" element={
              <ProtectedRoute>
                <CalendarPage />
              </ProtectedRoute>
            } />

            <Route path="/about" element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AnnouncementProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
