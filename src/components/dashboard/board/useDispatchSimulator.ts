
import { useState, useEffect } from 'react';
import { DispatchData, CongestionLevel } from './types';

export function useDispatchSimulator(initialDispatches: DispatchData[]) {
  const [dispatches, setDispatches] = useState<DispatchData[]>(initialDispatches);

  const simulateRealTimeUpdates = async (dispatch: DispatchData): Promise<DispatchData> => {
    const now = new Date();
    const activationTime = new Date(dispatch.activationTime);
    const elapsedMinutes = Math.floor((now.getTime() - activationTime.getTime()) / (1000 * 60));
    
    let progress = Number(dispatch.progress || 0);
    if (dispatch.assignedTo !== "Unassigned") {
      progress = Math.min(100, progress + Math.random() * 5);
    }

    let status = dispatch.status;
    if (progress === 100) {
      status = "available";
    } else if (progress > 0) {
      status = "transporting";
    }

    const congestionLevels: CongestionLevel[] = ["low", "medium", "high"];
    const randomCongestionLevel = congestionLevels[Math.floor(Math.random() * congestionLevels.length)];

    return {
      ...dispatch,
      status,
      progress,
      elapsedTime: `${elapsedMinutes} min`,
      lastUpdated: now.toISOString(),
      efficiency: Math.random() * 100,
      aiRecommendations: {
        ...dispatch.aiRecommendations,
        trafficStatus: {
          ...dispatch.aiRecommendations.trafficStatus!,
          congestionLevel: randomCongestionLevel
        }
      }
    };
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const updatedDispatches = await Promise.all(
        dispatches.map(dispatch => simulateRealTimeUpdates(dispatch))
      );
      setDispatches(updatedDispatches);
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatches]);

  return { dispatches, setDispatches };
}
