
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MenuCard } from "@/components/dashboard/MenuCard";
import { WideMenuCard } from "@/components/dashboard/WideMenuCard";
import { menuItems } from "@/config/menuItems";

// Move console logs outside of the component
const logStartup = () => {
  console.log("Index component starting to render...");
};

const Index = () => {
  // Log startup
  logStartup();
  console.log("Menu items loaded:", menuItems.length);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 bg-gradient-to-br from-medical-accent to-white overflow-auto">
        <main className="p-6 md:p-8 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-medical-primary mb-2">
            Welcome to Dispatch Control
          </h1>
          <p className="text-medical-primary/60 mb-8">
            Select a module to get started
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {menuItems.slice(0, -2).map((item) => (
              <MenuCard key={item.title} {...item} />
            ))}
            
            {menuItems.slice(-2).map((item) => (
              <WideMenuCard key={item.title} {...item} />
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
