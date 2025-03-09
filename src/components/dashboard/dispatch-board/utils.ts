
import { DispatchStatus } from "../DispatchStatusBar";

export const getProgressForStatus = (status: DispatchStatus): number => {
  switch (status) {
    case "dispatch":
      return 0;
    case "enroute":
      return 20;
    case "onscene":
      return 40;
    case "transporting":
      return 60;
    case "destination":
      return 80;
    case "available":
      return 100;
    case "canceled":
      return 0;
    default:
      return 0;
  }
};

export const getStatusColor = (status: DispatchStatus): string => {
  switch (status) {
    case "dispatch":
      return "bg-gray-100 text-gray-700";
    case "enroute":
      return "bg-blue-100 text-blue-700";
    case "onscene":
      return "bg-green-100 text-green-700";
    case "transporting":
      return "bg-orange-100 text-orange-700";
    case "destination":
      return "bg-yellow-100 text-yellow-700";
    case "available":
      return "bg-emerald-100 text-emerald-700";
    case "canceled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

// Add the missing functions for DispatchBoard.tsx
export const filterDispatches = (dispatches: any[], type: string) => {
  if (type === "unassigned") {
    return dispatches.filter(dispatch => !dispatch.assigned);
  } else if (type === "assigned") {
    return dispatches.filter(dispatch => dispatch.assigned);
  }
  return dispatches;
};

export const simulateRealTimeUpdates = async (dispatch: any) => {
  // Mock function to simulate real-time updates
  // In a real implementation, this would likely connect to a websocket or similar
  if (Math.random() > 0.8) {
    const statuses = ["dispatch", "enroute", "onscene", "transporting", "destination", "available"];
    const currentIndex = statuses.indexOf(dispatch.status);
    if (currentIndex < statuses.length - 1) {
      return {
        ...dispatch,
        status: statuses[currentIndex + 1],
        lastUpdate: new Date().toISOString()
      };
    }
  }
  return dispatch;
};
