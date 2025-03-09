
import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchHospitalStatus, getNedocsLabel, getNedocsColor } from '@/utils/georgiaRccService';
import { AlertTriangle, Activity, Heart, Baby, Clock, MapPin, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HospitalStatusProps {
  hospitalName: string;
  className?: string;
}

export function HospitalStatus({ hospitalName, className = '' }: HospitalStatusProps) {
  const [status, setStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getStatus = async () => {
      try {
        const data = await fetchHospitalStatus(hospitalName);
        if (data) {
          setStatus(data);
          setError(null);
        } else {
          setError('Unable to fetch hospital status');
        }
      } catch (err) {
        setError('Error fetching hospital status');
      }
    };

    getStatus();
    // Refresh every 5 minutes
    const interval = setInterval(getStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [hospitalName]);

  if (error) {
    return (
      <div className="text-sm text-red-300 font-medium">
        <AlertTriangle className="inline-block mr-1 h-4 w-4" />
        {error}
      </div>
    );
  }

  if (!status) {
    return <div className="text-sm text-blue-300 font-medium">Loading status...</div>;
  }

  // Get capacity color based on percentage
  const getCapacityColor = (percentage: number): string => {
    if (percentage > 80) return 'text-red-300';
    if (percentage > 60) return 'text-orange-300';
    if (percentage > 40) return 'text-yellow-300';
    return 'text-green-300';
  };

  return (
    <Card className={cn(
      'p-4 purple-glass shadow-lg hover:shadow-purple-500/40 transition-all duration-300',
      'border-purple-500/40 bg-purple-950/60',
      className
    )}>
      <div className="space-y-3">
        {/* Hospital header with status badge */}
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-white text-lg flex items-center gap-1 text-shadow-sm">
            <MapPin className="h-4 w-4 text-purple-200" />
            {hospitalName}
          </h3>
          <Badge 
            variant="outline"
            className={cn(
              "ml-2 px-3 py-1 font-medium text-sm shadow shadow-black/10",
              status.diversionStatus === 'Open' 
                ? 'bg-green-800/70 text-green-100 border-green-500/50' 
                : status.diversionStatus === 'Partial'
                  ? 'bg-orange-800/70 text-orange-100 border-orange-500/50'
                  : 'bg-red-800/70 text-red-100 border-red-500/50'
            )}
          >
            {status.diversionStatus}
          </Badge>
        </div>

        {/* NEDOCS score with improved visibility */}
        {status.nedocsScore !== undefined && (
          <div className="flex flex-col gap-1 bg-gray-900/60 p-2 rounded-md border border-gray-700/50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-200 flex items-center gap-1 font-medium">
                <Info className="h-3 w-3 text-blue-200" />
                NEDOCS:
              </span>
              <Badge className={cn(
                "text-sm font-bold px-3 shadow",
                status.nedocsScore > 140 
                  ? "bg-red-800 text-red-50 border border-red-500/50" 
                  : status.nedocsScore > 100
                    ? "bg-orange-800 text-orange-50 border border-orange-500/50"
                    : "bg-green-800 text-green-50 border border-green-500/50"
              )}>
                {status.nedocsScore} - {getNedocsLabel(status.nedocsScore)}
              </Badge>
            </div>
          </div>
        )}

        {/* Capacity meters with improved visibility */}
        {status.capacity && (
          <div className="grid grid-cols-3 gap-3 text-sm bg-gray-900/60 p-3 rounded-md border border-gray-700/50">
            <div className="flex flex-col items-center">
              <div className="text-gray-200 font-medium mb-1">ER</div>
              <div className={cn(
                "text-lg font-bold", 
                getCapacityColor(status.capacity.er)
              )}>
                {status.capacity.er}%
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-gray-200 font-medium mb-1">ICU</div>
              <div className={cn(
                "text-lg font-bold", 
                getCapacityColor(status.capacity.icu)
              )}>
                {status.capacity.icu}%
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-gray-200 font-medium mb-1">Med</div>
              <div className={cn(
                "text-lg font-bold", 
                getCapacityColor(status.capacity.med)
              )}>
                {status.capacity.med}%
              </div>
            </div>
          </div>
        )}

        {/* Specialty diversions with improved visibility */}
        {status.specialtyDiversions && (
          <div className="flex gap-2 flex-wrap">
            {status.specialtyDiversions.trauma && (
              <Badge variant="outline" className="flex items-center gap-1 bg-red-900/70 text-red-50 border-red-500/50 shadow shadow-black/20">
                <AlertTriangle className="h-3 w-3" />
                Trauma
              </Badge>
            )}
            {status.specialtyDiversions.stroke && (
              <Badge variant="outline" className="flex items-center gap-1 bg-blue-900/70 text-blue-50 border-blue-500/50 shadow shadow-black/20">
                <Activity className="h-3 w-3" />
                Stroke
              </Badge>
            )}
            {status.specialtyDiversions.cardiac && (
              <Badge variant="outline" className="flex items-center gap-1 bg-pink-900/70 text-pink-50 border-pink-500/50 shadow shadow-black/20">
                <Heart className="h-3 w-3" />
                Cardiac
              </Badge>
            )}
            {status.specialtyDiversions.pediatric && (
              <Badge variant="outline" className="flex items-center gap-1 bg-purple-900/70 text-purple-50 border-purple-500/50 shadow shadow-black/20">
                <Baby className="h-3 w-3" />
                Pediatric
              </Badge>
            )}
          </div>
        )}

        {/* Last updated with improved visibility */}
        <div className="text-xs text-gray-300 flex items-center justify-end gap-1 italic">
          <Clock className="h-3 w-3" />
          Last updated: {new Date(status.lastUpdated).toLocaleTimeString()}
        </div>
      </div>
    </Card>
  );
}
