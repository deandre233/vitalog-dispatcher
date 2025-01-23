import { Footer } from "./Footer";
import { AppSidebar } from "../navigation/AppSidebar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}