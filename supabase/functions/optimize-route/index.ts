import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Location {
  lat: number;
  lng: number;
}

interface RouteRequest {
  origin: Location;
  destination: Location;
  departureTime: string;
  serviceType: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { origin, destination, departureTime, serviceType } = await req.json() as RouteRequest;

    // Mock AI optimization logic - in production, this would use real ML models
    const trafficMultiplier = new Date(departureTime).getHours() >= 16 ? 1.5 : 1;
    const distance = calculateDistance(origin, destination);
    const baseTime = (distance / 50) * 60; // minutes at 50km/h
    
    const optimizedRoute = {
      route: {
        coordinates: [
          [origin.lng, origin.lat],
          [destination.lng, destination.lat]
        ],
        distance: distance,
        duration: baseTime * trafficMultiplier
      },
      trafficPrediction: {
        congestionLevel: trafficMultiplier > 1.2 ? "high" : "medium",
        predictedDelayMinutes: Math.round((trafficMultiplier - 1) * baseTime),
        confidence: 0.85
      },
      recommendations: [
        `Consider ${serviceType === 'emergency' ? 'alternate emergency routes' : 'surface streets'} during peak hours`,
        `Expected delays of ${Math.round((trafficMultiplier - 1) * baseTime)} minutes due to traffic`
      ]
    };

    return new Response(JSON.stringify(optimizedRoute), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in optimize-route function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function calculateDistance(loc1: Location, loc2: Location): number {
  const R = 6371; // Earth's radius in km
  const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
  const dLon = (loc2.lng - loc1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}