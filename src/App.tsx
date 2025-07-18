
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import PosterGenerator from "./pages/PosterGenerator";
import PosterPreview from "./pages/PosterPreview";
import InvoiceGenerator from "./pages/InvoiceGenerator";
import InvoicePreview from "./pages/InvoicePreview";
import PremiumPage from "./pages/Premium";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/poster" element={<PosterGenerator />} />
            <Route path="/poster/edit/:id" element={<PosterGenerator />} />
            <Route path="/poster-preview" element={<PosterPreview />} />
            <Route path="/premium" element={<PremiumPage />} />
            <Route path="/invoice" element={<InvoiceGenerator />} />
            <Route path="/invoice/edit/:id" element={<InvoiceGenerator />} />
            <Route path="/invoice-preview" element={<InvoicePreview />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
