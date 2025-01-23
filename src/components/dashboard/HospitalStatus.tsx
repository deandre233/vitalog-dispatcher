import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchHospitalStatus, getNedocsLabel, getNedocsColor } from '@/utils/georgiaRccService';
import { AlertTriangle, Activity, Heart, Baby } from 'lucide-react';

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
      <div className="text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!status) {
    return <div className="text-sm">Loading status...</div>;
  }

  return (
    <Card className={`p-4 ${className}`}>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">{hospitalName}</h3>
          <Badge 
            variant={status.diversionStatus === 'Open' ? 'default' : 'destructive'}
            className="ml-2"
          >
            {status.diversionStatus}
          </Badge>
        </div>

        {status.nedocsScore !== undefined && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">NEDOCS:</span>
            <Badge className={getNedocsColor(status.nedocsScore)}>
              {status.nedocsScore} - {getNedocsLabel(status.nedocsScore)}
            </Badge>
          </div>
        )}

        {status.specialtyDiversions && (
          <div className="flex gap-2 flex-wrap">
            {status.specialtyDiversions.trauma && (
              <Badge variant="outline" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Trauma
              </Badge>
            )}
            {status.specialtyDiversions.stroke && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                Stroke
              </Badge>
            )}
            {status.specialtyDiversions.cardiac && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                Cardiac
              </Badge>
            )}
            {status.specialtyDiversions.pediatric && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Baby className="h-3 w-3" />
                Pediatric
              </Badge>
            )}
          </div>
        )}

        {status.capacity && (
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <div className="text-gray-600">ER</div>
              <div className={status.capacity.er > 80 ? 'text-red-600' : 'text-green-600'}>
                {status.capacity.er}%
              </div>
            </div>
            <div>
              <div className="text-gray-600">ICU</div>
              <div className={status.capacity.icu > 80 ? 'text-red-600' : 'text-green-600'}>
                {status.capacity.icu}%
              </div>
            </div>
            <div>
              <div className="text-gray-600">Med</div>
              <div className={status.capacity.med > 80 ? 'text-red-600' : 'text-green-600'}>
                {status.capacity.med}%
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500">
          Last updated: {new Date(status.lastUpdated).toLocaleTimeString()}
        </div>
      </div>
    </Card>
  );
}