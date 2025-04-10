
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import BrowsePage from "./pages/BrowsePage";
import HistoryPage from "./pages/HistoryPage";
import SupportPage from "./pages/SupportPage";
import SubmitPage from "./pages/SubmitPage";
import NotFound from "./pages/NotFound";
import MessagePage from "./pages/MessagePage";
import SpotifyCallback from "./pages/SpotifyCallback";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="browse" element={<BrowsePage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="submit" element={<SubmitPage />} />
            <Route path="message/:id" element={<MessagePage />} />
            <Route path="callback" element={<SpotifyCallback />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
