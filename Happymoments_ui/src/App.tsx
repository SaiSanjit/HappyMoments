
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Vendor from "./pages/vendor";
import { PrimeReactProvider } from 'primereact/api';
const queryClient = new QueryClient();

const App = () => (
  <PrimeReactProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* Redirect category pages to home for now */}
          <Route path="/category/:categoryName" element={<Navigate to="/" />} />
          <Route path="/categories" element={<Navigate to="/" />} />
          {/* Redirect vendor pages to home for now */}
          <Route path="/vendors/:vendorId" element={<Navigate to="/" />} />
          <Route path="/vendor" element={<Vendor/>} />
          {/* Redirect blog pages to home for now */}
          <Route path="/blog/:blogId" element={<Navigate to="/" />} />
          <Route path="/blog" element={<Navigate to="/" />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </PrimeReactProvider>
);

export default App;
