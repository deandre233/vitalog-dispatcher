
import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DirectionsTab } from "@/components/dashboard/dispatch/DirectionsTab";

interface RoutePreviewSectionProps {
  pickupLocation: string;
  dropoffLocation: string;
}

export function RoutePreviewSection({ 
  pickupLocation, 
  dropoffLocation 
}: RoutePreviewSectionProps) {
  if (!pickupLocation || !dropoffLocation) return null;
  
  return (
    <Card className="p-6 border-l-4 border-l-[#4B5563] bg-gradient-to-br from-white to-[#F3F4F6] shadow-lg hover:shadow-xl transition-all duration-300">
      <h3 className="text-lg font-semibold mb-4 text-[#4B5563] flex items-center gap-2">
        <MapPin className="w-5 h-5" />
        Route Preview
      </h3>
      <div className="w-full h-[400px] rounded-lg overflow-hidden">
        <DirectionsTab
          transportId=""
          pickupLocation={pickupLocation}
          dropoffLocation={dropoffLocation}
        />
      </div>
    </Card>
  );
}
