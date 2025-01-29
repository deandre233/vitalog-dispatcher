import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";

export const ExternalLink = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">External Link</h1>
          <p className="text-gray-600">
            This page will handle external link functionality.
          </p>
        </Card>
      </main>
      <Footer />
    </div>
  );
}