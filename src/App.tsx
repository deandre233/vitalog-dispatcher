
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AgencyProvider } from "@/contexts/AgencyContext";
import { Index } from "@/pages/Index";
import { Sidebar } from "@/components/navigation/Sidebar";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <AgencyProvider>
          <BrowserRouter>
            <div className="flex">
              <Sidebar />
              <div className="flex-1 ml-16">
                <Index />
              </div>
            </div>
            <Toaster />
          </BrowserRouter>
        </AgencyProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
