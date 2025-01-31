import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AppSidebar } from "@/components/navigation/AppSidebar";

export const OperationsMap = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 flex">
        <AppSidebar />
        <div className="flex-1 bg-[#f4f7fc] overflow-auto">
          <main className="p-6">
            <h1 className="text-2xl font-semibold mb-6">Operations Map</h1>
            <p className="text-gray-500">Operations map implementation coming in next iteration</p>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};