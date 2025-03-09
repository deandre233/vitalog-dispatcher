
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
