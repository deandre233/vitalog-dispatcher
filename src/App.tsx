
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AgencyProvider } from "@/contexts/AgencyContext";
import { Index } from "@/pages/Index";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <AgencyProvider>
          <BrowserRouter>
            <Index />
            <Toaster />
          </BrowserRouter>
        </AgencyProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
