
import { CongestionLevel } from "../../../types/service-queue";

export const simulateRealTimeUpdates = async (dispatch: any): Promise<any> => {
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
        ...dispatch.aiRecommendations.trafficStatus,
        congestionLevel: randomCongestionLevel
      }
    }
  };
};

export const filterDispatches = (dispatches: any[], status: "assigned" | "unassigned"): any[] => {
  return dispatches.filter(dispatch => {
    const isAssigned = dispatch.assignedTo && dispatch.assignedTo !== "Unassigned";
    return status === "assigned" ? isAssigned : !isAssigned;
  });
};
