
import { DispatchData, CongestionLevel } from "./types";

export const mockDispatches: DispatchData[] = [
  {
    id: "DISP-00001",
    activationTime: new Date(Date.now() - 3600000).toISOString(),
    patient: {
      id: "PAT-001",
      name: "John Smith",
      condition: "Stable - Routine Transfer"
    },
    serviceType: "BLS",
    origin: "Memorial Hospital",
    destination: "Sunset Nursing Home",
    status: "enroute",
    priority: "medium",
    assignedTo: "Unit 101",
    aiRecommendations: {
      route: "Recommended Route: Via Main St",
      crew: "Recommended Crew: BLS Team",
      billing: "Insurance: Medicare",
      insights: ["Traffic conditions favorable", "ETA within normal range"],
      trafficStatus: {
        congestionLevel: "low" as CongestionLevel,
        estimatedDelay: 5,
        alternateRouteAvailable: false
      }
    },
    eta: "15 mins",
    progress: 40,
    elapsedTime: "45 min",
    lastUpdated: new Date().toISOString(),
    efficiency: 92
  },
  {
    id: "DISP-00002",
    activationTime: new Date(Date.now() - 7200000).toISOString(),
    patient: {
      id: "PAT-002",
      name: "Mary Johnson",
      condition: "Post-Op Transfer"
    },
    serviceType: "ALS",
    origin: "City Medical Center",
    destination: "Rehabilitation Center",
    status: "transporting",
    priority: "high",
    assignedTo: "Unit 102",
    aiRecommendations: {
      route: "Recommended Route: Highway 101",
      crew: "Recommended Crew: ALS Team",
      billing: "Insurance: Blue Cross",
      insights: ["Priority case", "Monitor vital signs"],
      trafficStatus: {
        congestionLevel: "medium" as CongestionLevel,
        estimatedDelay: 10,
        alternateRouteAvailable: true
      }
    },
    eta: "20 mins",
    progress: 60,
    elapsedTime: "1h 15min",
    lastUpdated: new Date().toISOString(),
    efficiency: 88
  },
  {
    id: "DISP-00003",
    activationTime: new Date(Date.now() - 5400000).toISOString(),
    patient: {
      id: "PAT-003",
      name: "Robert Wilson",
      condition: "Dialysis Transport"
    },
    serviceType: "WC",
    origin: "Willow Creek Apartments",
    destination: "Dialysis Center",
    status: "onscene",
    priority: "medium",
    assignedTo: "Unit 103",
    aiRecommendations: {
      route: "Recommended Route: Local streets",
      crew: "Recommended Crew: Basic Transport",
      billing: "Insurance: Medicaid",
      insights: ["Regular patient", "Wheelchair assistance required"],
      trafficStatus: {
        congestionLevel: "low" as CongestionLevel,
        estimatedDelay: 3,
        alternateRouteAvailable: false
      }
    },
    eta: "30 mins",
    progress: 20,
    elapsedTime: "25 min",
    lastUpdated: new Date().toISOString(),
    efficiency: 95
  },
  {
    id: "DISP-00004",
    activationTime: new Date(Date.now() - 1800000).toISOString(),
    patient: {
      id: "PAT-004",
      name: "Sarah Davis",
      condition: "Cardiac Monitoring"
    },
    serviceType: "ALS",
    origin: "Emergency Care Clinic",
    destination: "Heart Center",
    status: "transporting",
    priority: "high",
    assignedTo: "Unit 104",
    aiRecommendations: {
      route: "Recommended Route: Express Route",
      crew: "Recommended Crew: Critical Care",
      billing: "Insurance: Private",
      insights: ["Critical transfer", "Continuous monitoring required"],
      trafficStatus: {
        congestionLevel: "low" as CongestionLevel,
        estimatedDelay: 2,
        alternateRouteAvailable: true
      }
    },
    eta: "10 mins",
    progress: 75,
    elapsedTime: "20 min",
    lastUpdated: new Date().toISOString(),
    efficiency: 98
  },
  {
    id: "DISP-00005",
    activationTime: new Date(Date.now() - 900000).toISOString(),
    patient: {
      id: "PAT-005",
      name: "James Brown",
      condition: "Physical Therapy"
    },
    serviceType: "BLS",
    origin: "Senior Living Complex",
    destination: "Physical Therapy Center",
    status: "enroute",
    priority: "medium",
    assignedTo: "Unit 105",
    aiRecommendations: {
      route: "Recommended Route: Secondary roads",
      crew: "Recommended Crew: Basic Transport",
      billing: "Insurance: Medicare",
      insights: ["Regular schedule", "Mobility assistance needed"],
      trafficStatus: {
        congestionLevel: "low" as CongestionLevel,
        estimatedDelay: 5,
        alternateRouteAvailable: false
      }
    },
    eta: "25 mins",
    progress: 30,
    elapsedTime: "10 min",
    lastUpdated: new Date().toISOString(),
    efficiency: 90
  },
  {
    id: "DISP-00006",
    activationTime: new Date().toISOString(),
    patient: {
      id: "PAT-006",
      name: "Patricia Miller",
      condition: "Scheduled Check-up"
    },
    serviceType: "BLS",
    origin: "Oakwood Residence",
    destination: "Community Health Center",
    status: "dispatch",
    priority: "medium",
    assignedTo: "Unassigned",
    aiRecommendations: {
      route: "Pending Assignment",
      crew: "Recommended: BLS Team",
      billing: "Insurance: Pending",
      insights: ["Routine transport", "No special requirements"],
      trafficStatus: {
        congestionLevel: "low" as CongestionLevel,
        estimatedDelay: 0,
        alternateRouteAvailable: false
      }
    },
    eta: "Pending",
    progress: 0,
    elapsedTime: "5 min",
    lastUpdated: new Date().toISOString(),
    efficiency: 0
  },
  {
    id: "DISP-00007",
    activationTime: new Date().toISOString(),
    patient: {
      id: "PAT-007",
      name: "Michael Clark",
      condition: "Emergency Evaluation"
    },
    serviceType: "ALS",
    origin: "Home Address",
    destination: "Emergency Room",
    status: "dispatch",
    priority: "high",
    assignedTo: "Unassigned",
    aiRecommendations: {
      route: "Pending Assignment",
      crew: "Recommended: ALS Team",
      billing: "Insurance: Pending",
      insights: ["High priority case", "Immediate response needed"],
      trafficStatus: {
        congestionLevel: "medium" as CongestionLevel,
        estimatedDelay: 0,
        alternateRouteAvailable: false
      }
    },
    eta: "Pending",
    progress: 0,
    elapsedTime: "2 min",
    lastUpdated: new Date().toISOString(),
    efficiency: 0
  },
  {
    id: "DISP-00008",
    activationTime: new Date().toISOString(),
    patient: {
      id: "PAT-008",
      name: "Elizabeth Taylor",
      condition: "Scheduled Surgery"
    },
    serviceType: "BLS",
    origin: "Assisted Living Facility",
    destination: "Surgical Center",
    status: "dispatch",
    priority: "medium",
    assignedTo: "Unassigned",
    aiRecommendations: {
      route: "Pending Assignment",
      crew: "Recommended: BLS Team",
      billing: "Insurance: Pending",
      insights: ["Pre-scheduled transport", "Surgery prep required"],
      trafficStatus: {
        congestionLevel: "low" as CongestionLevel,
        estimatedDelay: 0,
        alternateRouteAvailable: false
      }
    },
    eta: "Pending",
    progress: 0,
    elapsedTime: "8 min",
    lastUpdated: new Date().toISOString(),
    efficiency: 0
  },
  {
    id: "DISP-00009",
    activationTime: new Date().toISOString(),
    patient: {
      id: "PAT-009",
      name: "William Anderson",
      condition: "Respiratory Distress"
    },
    serviceType: "ALS",
    origin: "Urgent Care",
    destination: "Pulmonary Center",
    status: "dispatch",
    priority: "high",
    assignedTo: "Unassigned",
    aiRecommendations: {
      route: "Pending Assignment",
      crew: "Recommended: ALS Team",
      billing: "Insurance: Pending",
      insights: ["Respiratory monitoring needed", "Oxygen support required"],
      trafficStatus: {
        congestionLevel: "low" as CongestionLevel,
        estimatedDelay: 0,
        alternateRouteAvailable: false
      }
    },
    eta: "Pending",
    progress: 0,
    elapsedTime: "3 min",
    lastUpdated: new Date().toISOString(),
    efficiency: 0
  },
  {
    id: "DISP-00010",
    activationTime: new Date().toISOString(),
    patient: {
      id: "PAT-010",
      name: "Jennifer White",
      condition: "Post-Procedure"
    },
    serviceType: "WC",
    origin: "Day Surgery Center",
    destination: "Home Address",
    status: "dispatch",
    priority: "medium",
    assignedTo: "Unassigned",
    aiRecommendations: {
      route: "Pending Assignment",
      crew: "Recommended: Basic Transport",
      billing: "Insurance: Pending",
      insights: ["Wheelchair transport", "Post-procedure care"],
      trafficStatus: {
        congestionLevel: "low" as CongestionLevel,
        estimatedDelay: 0,
        alternateRouteAvailable: false
      }
    },
    eta: "Pending",
    progress: 0,
    elapsedTime: "1 min",
    lastUpdated: new Date().toISOString(),
    efficiency: 0
  }
];
