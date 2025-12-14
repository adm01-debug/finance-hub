import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ContasReceber from "./pages/ContasReceber";
import ContasPagar from "./pages/ContasPagar";
import CentroCustos from "./pages/CentroCustos";
import FluxoCaixa from "./pages/FluxoCaixa";
import Cobrancas from "./pages/Cobrancas";
import Conciliacao from "./pages/Conciliacao";
import Alertas from "./pages/Alertas";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/contas-receber" element={<ContasReceber />} />
          <Route path="/contas-pagar" element={<ContasPagar />} />
          <Route path="/centro-custos" element={<CentroCustos />} />
          <Route path="/fluxo-caixa" element={<FluxoCaixa />} />
          <Route path="/cobrancas" element={<Cobrancas />} />
          <Route path="/conciliacao" element={<Conciliacao />} />
          <Route path="/alertas" element={<Alertas />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
