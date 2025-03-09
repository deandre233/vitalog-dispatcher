import { 
  Award, 
  Clock, 
  Heart, 
  Users, 
  BookOpen, 
  ShieldCheck, 
  Truck, 
  Stethoscope, 
  Star, 
  GraduationCap, 
  Trophy, 
  Calendar, 
  Zap, 
  ThumbsUp, 
  Medal, 
  UserCheck,
  Flame,
  Crown,
  Sparkles,
  BadgeCheck,
  HeartHandshake,
  Timer,
  Navigation,
  FileText,
  Car,
  Hourglass,
  Weight,
  ClipboardCheck,
  Ambulance,
  HeartPulse,
  Syringe,
  Cross,
  Speaker,
  AlertTriangle,
  Baby,
  Fuel,
  Package
} from "lucide-react";
import { Achievement, CategorySummary, AchievementCategory } from "../types/achievementTypes";

export const achievements: Achievement[] = [
  // Years employed
  {
    id: "time-001",
    name: "Years of Service",
    description: "Completed 6 years of employment with the agency",
    icon: <Trophy className="h-8 w-8 text-amber-500" />,
    rarity: "rare",
    category: "operational",
    points: 60,
    unlocked: true,
    dateUnlocked: "2023-10-05",
    progress: 6,
    maxProgress: 10,
    criteria: "Complete years of employment with the agency"
  },
  
  // Months since last absence
  {
    id: "time-002",
    name: "Attendance Champion",
    description: "24 months since last absence",
    icon: <Calendar className="h-8 w-8 text-yellow-500" />,
    rarity: "rare",
    category: "operational",
    points: 50,
    unlocked: true,
    dateUnlocked: "2023-08-15",
    progress: 24,
    maxProgress: 36,
    criteria: "Maintain perfect attendance for consecutive months"
  },
  
  // Months without incident
  {
    id: "safety-001",
    name: "Safety Champion",
    description: "36 months without incident",
    icon: <ShieldCheck className="h-8 w-8 text-yellow-500" />,
    rarity: "epic",
    category: "operational",
    points: 75,
    unlocked: true,
    dateUnlocked: "2023-07-01",
    progress: 36,
    maxProgress: 36,
    criteria: "Maintain a safety record without incidents for 36 months"
  },
  
  // Shifts worked
  {
    id: "shifts-001",
    name: "Shift Master",
    description: "Worked 200 shifts",
    icon: <Clock className="h-8 w-8 text-green-500" />,
    rarity: "rare",
    category: "operational",
    points: 40,
    unlocked: true,
    dateUnlocked: "2023-09-30",
    progress: 202,
    maxProgress: 300,
    criteria: "Complete 200 shifts"
  },
  
  // Dispatches completed
  {
    id: "dispatch-001",
    name: "Dispatch Veteran",
    description: "Completed 500 dispatches",
    icon: <Navigation className="h-8 w-8 text-green-500" />,
    rarity: "epic",
    category: "operational",
    points: 80,
    unlocked: true,
    dateUnlocked: "2023-11-10",
    progress: 772,
    maxProgress: 1000,
    criteria: "Complete 500 dispatches"
  },
  
  // Transport miles driven
  {
    id: "miles-001",
    name: "Road Warrior",
    description: "Drove 5,000 transport miles",
    icon: <Car className="h-8 w-8 text-blue-500" />,
    rarity: "rare",
    category: "operational",
    points: 50,
    unlocked: true,
    dateUnlocked: "2023-10-22",
    progress: 5601,
    maxProgress: 10000,
    criteria: "Drive 5,000 transport miles"
  },
  
  // Emergent dispatches attended
  {
    id: "clinical-e001",
    name: "Emergency Responder",
    description: "Attended emergent dispatches",
    icon: <Ambulance className="h-8 w-8 text-blue-600" />,
    rarity: "uncommon",
    category: "clinical",
    points: 30,
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    criteria: "Attend 10 emergent dispatches"
  },
  
  // Critical dispatches attended
  {
    id: "clinical-c001",
    name: "Critical Care Provider",
    description: "Attended critical dispatches",
    icon: <AlertTriangle className="h-8 w-8 text-red-600" />,
    rarity: "rare",
    category: "clinical",
    points: 50,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    criteria: "Attend a critical dispatch"
  },
  
  // Attended an MI with CPR
  {
    id: "clinical-mi001",
    name: "Cardiac Responder",
    description: "Attended an MI with CPR",
    icon: <HeartPulse className="h-8 w-8 text-red-500" />,
    rarity: "rare",
    category: "clinical",
    points: 40,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    criteria: "Attend a myocardial infarction case requiring CPR"
  },
  
  // CPR performed
  {
    id: "clinical-cpr001",
    name: "CPR Expert",
    description: "Successfully performed CPR",
    icon: <Heart className="h-8 w-8 text-red-500" />,
    rarity: "rare",
    category: "clinical",
    points: 40,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    criteria: "Perform CPR in the field"
  },
  
  // Return of spontaneous circulation
  {
    id: "clinical-rosc001",
    name: "Life Saver",
    description: "Achieved return of spontaneous circulation",
    icon: <Sparkles className="h-8 w-8 text-yellow-500" />,
    rarity: "legendary",
    category: "clinical",
    points: 100,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    criteria: "Achieve return of spontaneous circulation during a cardiac arrest"
  },
  
  // Perfect BLS+ reports submitted
  {
    id: "documentation-001",
    name: "Documentation Excellence",
    description: "Wrote 50 perfect BLS+ reports",
    icon: <FileText className="h-8 w-8 text-blue-500" />,
    rarity: "rare",
    category: "operational",
    points: 50,
    unlocked: true,
    dateUnlocked: "2023-11-15",
    progress: 79,
    maxProgress: 100,
    criteria: "Submit 50 perfect BLS+ reports"
  },
  
  // Longest transport attended
  {
    id: "transport-long001",
    name: "Marathon Transport",
    description: "Completed 360 minute transport",
    icon: <Hourglass className="h-8 w-8 text-blue-500" />,
    rarity: "rare",
    category: "operational",
    points: 40,
    unlocked: true,
    dateUnlocked: "2023-06-10",
    criteria: "Complete a transport lasting over 6 hours"
  },
  
  // Dispatches run in one shift
  {
    id: "dispatch-shift001",
    name: "Shift Superstar",
    description: "Completed 11 dispatches in one shift",
    icon: <Zap className="h-8 w-8 text-blue-500" />,
    rarity: "rare",
    category: "operational",
    points: 45,
    unlocked: true,
    dateUnlocked: "2023-08-03",
    progress: 11,
    maxProgress: 12,
    criteria: "Complete 11 or more dispatches in a single shift"
  },
  
  // Heaviest patient transported
  {
    id: "transport-weight001",
    name: "Heavy Duty",
    description: "Transported a 300 pound patient",
    icon: <Weight className="h-8 w-8 text-orange-500" />,
    rarity: "uncommon",
    category: "operational",
    points: 30,
    unlocked: true,
    dateUnlocked: "2023-07-15",
    criteria: "Transport a patient weighing 300 pounds or more"
  },
  
  // Completed checklists in a row
  {
    id: "checklist-001",
    name: "Protocol Perfect",
    description: "Completed multiple checklists in a row",
    icon: <ClipboardCheck className="h-8 w-8 text-green-500" />,
    rarity: "uncommon",
    category: "operational",
    points: 25,
    unlocked: false,
    progress: 0,
    maxProgress: 3,
    criteria: "Complete 3 consecutive shift checklists with 100% accuracy"
  },
  
  // Guardian Angel awards
  {
    id: "recognition-001",
    name: "Guardian Angel",
    description: "Received Guardian Angel recognition",
    icon: <HeartHandshake className="h-8 w-8 text-blue-300" />,
    rarity: "rare",
    category: "community",
    points: 50,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    criteria: "Receive a Guardian Angel award from a patient or family"
  },
  
  // Critically assist a BLS+ crew
  {
    id: "teamwork-001",
    name: "Crew Support Expert",
    description: "Critically assisted a BLS+ crew",
    icon: <Users className="h-8 w-8 text-cyan-500" />,
    rarity: "uncommon",
    category: "teamwork",
    points: 30,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    criteria: "Provide critical assistance to a BLS+ crew during an emergency"
  },
  
  // IVs placed
  {
    id: "clinical-iv001",
    name: "IV Specialist",
    description: "Successfully placed an IV",
    icon: <Syringe className="h-8 w-8 text-blue-500" />,
    rarity: "uncommon",
    category: "clinical",
    points: 20,
    unlocked: true,
    dateUnlocked: "2023-05-10",
    progress: 1,
    maxProgress: 2,
    criteria: "Successfully place IVs in the field"
  },
  
  // Medical procedures performed
  {
    id: "clinical-procedures001",
    name: "Procedure Expert",
    description: "Performed various medical procedures",
    icon: <Stethoscope className="h-8 w-8 text-yellow-500" />,
    rarity: "uncommon",
    category: "clinical",
    points: 25,
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    criteria: "Perform 10 unique medical procedures in the field"
  },
  
  // Intubations performed
  {
    id: "clinical-intubation001",
    name: "Airway Expert",
    description: "Successfully performed intubation",
    icon: <Speaker className="h-8 w-8 text-orange-500" />,
    rarity: "rare",
    category: "clinical",
    points: 40,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    criteria: "Successfully perform endotracheal intubation"
  },
  
  // MVA incidents attended
  {
    id: "mva-001",
    name: "MVA Responder",
    description: "Attended motor vehicle accident incidents",
    icon: <AlertTriangle className="h-8 w-8 text-red-500" />,
    rarity: "uncommon",
    category: "clinical",
    points: 30,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    criteria: "Respond to motor vehicle accidents"
  },
  
  // Delivery of a child
  {
    id: "clinical-delivery001",
    name: "Field Delivery",
    description: "Assisted in the delivery of a child",
    icon: <Baby className="h-8 w-8 text-pink-500" />,
    rarity: "legendary",
    category: "clinical",
    points: 100,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    criteria: "Assist in the delivery of a child outside a hospital setting"
  },
  
  // CPAP/BiPAP applications
  {
    id: "clinical-cpap001",
    name: "Respiratory Support Specialist",
    description: "Applied CPAP/BiPAP treatments",
    icon: <Cross className="h-8 w-8 text-blue-500" />,
    rarity: "uncommon",
    category: "clinical",
    points: 30,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    criteria: "Successfully apply CPAP/BiPAP respiratory support"
  },
  
  // Refueled a company vehicle
  {
    id: "operational-fuel001",
    name: "Fuel Duty",
    description: "Refueled company vehicles",
    icon: <Fuel className="h-8 w-8 text-green-500" />,
    rarity: "common",
    category: "operational",
    points: 10,
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    criteria: "Refuel company vehicles"
  },
  
  // Corrected a supply room inventory
  {
    id: "operational-inventory001",
    name: "Inventory Manager",
    description: "Corrected supply room inventory",
    icon: <Package className="h-8 w-8 text-purple-500" />,
    rarity: "common",
    category: "operational",
    points: 15,
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    criteria: "Correct inventory discrepancies in the supply room"
  },

  // Clinical Excellence (from original file)
  {
    id: "c-001",
    name: "First Responder",
    description: "Completed your first 10 emergency calls",
    icon: <Stethoscope className="h-8 w-8 text-blue-500" />,
    rarity: "common",
    category: "clinical",
    points: 10,
    unlocked: true,
    dateUnlocked: "2023-09-15",
    progress: 10,
    maxProgress: 10,
    criteria: "Complete 10 emergency calls"
  },
  {
    id: "c-002",
    name: "Life Saver",
    description: "Successfully performed CPR with positive patient outcome",
    icon: <Heart className="h-8 w-8 text-red-500" />,
    rarity: "rare",
    category: "clinical",
    points: 50,
    unlocked: true,
    dateUnlocked: "2023-11-22",
    criteria: "Successfully perform CPR with positive patient outcome"
  },
  {
    id: "c-003",
    name: "Protocol Expert",
    description: "100% protocol adherence for 30 consecutive calls",
    icon: <BookOpen className="h-8 w-8 text-emerald-500" />,
    rarity: "epic",
    category: "clinical",
    points: 75,
    unlocked: false,
    progress: 22,
    maxProgress: 30,
    criteria: "Maintain 100% protocol adherence for 30 consecutive calls"
  },
  {
    id: "c-004",
    name: "Master Clinician",
    description: "Recognized by medical director for exceptional clinical care",
    icon: <Trophy className="h-8 w-8 text-amber-500" />,
    rarity: "legendary",
    category: "clinical",
    points: 100,
    unlocked: false,
    criteria: "Receive formal recognition from medical director for exceptional clinical care"
  },
  
  // Teamwork
  {
    id: "t-001",
    name: "Team Player",
    description: "Picked up 5 extra shifts to help the team",
    icon: <Users className="h-8 w-8 text-indigo-500" />,
    rarity: "common",
    category: "teamwork",
    points: 15,
    unlocked: true,
    dateUnlocked: "2023-08-30",
    progress: 5,
    maxProgress: 5,
    criteria: "Pick up 5 extra shifts within a month"
  },
  {
    id: "t-002",
    name: "Reliable Partner",
    description: "Zero tardiness for 3 consecutive months",
    icon: <Clock className="h-8 w-8 text-sky-500" />,
    rarity: "uncommon",
    category: "teamwork",
    points: 30,
    unlocked: true,
    dateUnlocked: "2023-12-01",
    criteria: "Maintain zero tardiness for 3 consecutive months"
  },
  {
    id: "t-003",
    name: "Shift Savior",
    description: "Covered 10 emergency shift vacancies",
    icon: <ShieldCheck className="h-8 w-8 text-purple-500" />,
    rarity: "rare",
    category: "teamwork",
    points: 50,
    unlocked: false,
    progress: 7,
    maxProgress: 10,
    criteria: "Cover 10 emergency shift vacancies"
  },
  
  // Education
  {
    id: "e-001",
    name: "Knowledge Seeker",
    description: "Attended all required inservice trainings for a year",
    icon: <GraduationCap className="h-8 w-8 text-green-500" />,
    rarity: "uncommon",
    category: "education",
    points: 25,
    unlocked: true,
    dateUnlocked: "2023-11-30",
    criteria: "Attend all required inservice trainings for a full year"
  },
  {
    id: "e-002",
    name: "Continuing Education Champion",
    description: "Completed 50 hours of CE beyond requirements",
    icon: <Award className="h-8 w-8 text-amber-500" />,
    rarity: "rare",
    category: "education",
    points: 40,
    unlocked: false,
    progress: 32,
    maxProgress: 50,
    criteria: "Complete 50 hours of continuing education beyond requirements"
  },
  {
    id: "e-003",
    name: "Certified Specialist",
    description: "Obtained specialty certification (FP-C, CCP-C, CCEMT-P, etc.)",
    icon: <BadgeCheck className="h-8 w-8 text-blue-600" />,
    rarity: "epic",
    category: "education",
    points: 75,
    unlocked: false,
    criteria: "Obtain a specialty certification"
  },
  
  // Operational Excellence
  {
    id: "o-001",
    name: "Documentation Pro",
    description: "100% PCR completion on time for 3 months",
    icon: <Zap className="h-8 w-8 text-amber-500" />,
    rarity: "uncommon",
    category: "operational",
    points: 30,
    unlocked: true,
    dateUnlocked: "2023-10-15",
    criteria: "Complete 100% of PCRs on time for 3 consecutive months"
  },
  {
    id: "o-002",
    name: "Safety First",
    description: "365 days without safety incidents",
    icon: <ShieldCheck className="h-8 w-8 text-green-600" />,
    rarity: "rare",
    category: "operational",
    points: 50,
    unlocked: false,
    progress: 247,
    maxProgress: 365,
    criteria: "Maintain 365 days without safety incidents or violations"
  },
  {
    id: "o-003",
    name: "Vehicle Master",
    description: "Perfect vehicle inspection record for 6 months",
    icon: <Truck className="h-8 w-8 text-blue-500" />,
    rarity: "uncommon",
    category: "operational",
    points: 35,
    unlocked: true,
    dateUnlocked: "2023-07-22",
    criteria: "Maintain perfect vehicle inspection record for 6 months"
  },
  
  // Leadership
  {
    id: "l-001",
    name: "Mentor",
    description: "Successfully mentored 3 new employees",
    icon: <UserCheck className="h-8 w-8 text-indigo-600" />,
    rarity: "uncommon",
    category: "leadership",
    points: 30,
    unlocked: true,
    dateUnlocked: "2023-08-12",
    progress: 3,
    maxProgress: 3,
    criteria: "Successfully mentor 3 new employees through orientation"
  },
  {
    id: "l-002",
    name: "Incident Commander",
    description: "Effectively managed a mass casualty incident",
    icon: <Crown className="h-8 w-8 text-amber-600" />,
    rarity: "epic",
    category: "leadership",
    points: 80,
    unlocked: false,
    criteria: "Effectively manage a mass casualty incident as designated commander"
  },
  {
    id: "l-003",
    name: "Innovation Champion",
    description: "Had a process improvement idea implemented company-wide",
    icon: <Sparkles className="h-8 w-8 text-purple-500" />,
    rarity: "rare",
    category: "leadership",
    points: 60,
    unlocked: false,
    criteria: "Have a process improvement idea implemented company-wide"
  },
  
  // Community Impact
  {
    id: "com-001",
    name: "Community Educator",
    description: "Conducted 5 public CPR/First Aid training sessions",
    icon: <HeartHandshake className="h-8 w-8 text-red-500" />,
    rarity: "rare",
    category: "community",
    points: 40,
    unlocked: false,
    progress: 3,
    maxProgress: 5,
    criteria: "Conduct 5 public CPR/First Aid training sessions"
  },
  {
    id: "com-002",
    name: "Public Health Advocate",
    description: "Participated in 3 community health screening events",
    icon: <Heart className="h-8 w-8 text-pink-500" />,
    rarity: "uncommon",
    category: "community",
    points: 25,
    unlocked: true,
    dateUnlocked: "2023-09-30",
    progress: 3,
    maxProgress: 3,
    criteria: "Participate in 3 community health screening events"
  },
  
  // Secret Achievements
  {
    id: "s-001",
    name: "Diamond in the Rough",
    description: "Received 10 patient commendations",
    icon: <Star className="h-8 w-8 text-cyan-500" />,
    rarity: "legendary",
    category: "clinical",
    points: 100,
    unlocked: false,
    progress: 7,
    maxProgress: 10,
    criteria: "Receive 10 specific patient commendations",
    isSecret: true
  },
  {
    id: "s-002",
    name: "Emergency Response Guru",
    description: "Handled 50 critical emergency responses with positive outcomes",
    icon: <Flame className="h-8 w-8 text-orange-500" />,
    rarity: "legendary",
    category: "clinical",
    points: 150,
    unlocked: false,
    progress: 28,
    maxProgress: 50,
    criteria: "Secret criteria",
    isSecret: true
  }
];

export const getCategorySummaries = (achievementsList: Achievement[] = achievements): CategorySummary[] => {
  const categories: AchievementCategory[] = ['clinical', 'teamwork', 'education', 'operational', 'leadership', 'community'];
  
  return categories.map(category => {
    const categoryAchievements = achievementsList.filter(a => a.category === category);
    const unlockedAchievements = categoryAchievements.filter(a => a.unlocked);
    const totalPoints = categoryAchievements.reduce((sum, a) => sum + a.points, 0);
    const earnedPoints = unlockedAchievements.reduce((sum, a) => {
      const basePoints = a.points;
      const prestigeBonus = a.prestigeBonus || 0;
      return sum + basePoints + prestigeBonus;
    }, 0);
    
    // Find the next achievement to unlock (first locked achievement with highest progress)
    const nextAchievement = categoryAchievements
      .filter(a => !a.unlocked && a.progress !== undefined)
      .sort((a, b) => {
        const aProgress = (a.progress || 0) / (a.maxProgress || 1);
        const bProgress = (b.progress || 0) / (b.maxProgress || 1);
        return bProgress - aProgress;
      })[0];
    
    return {
      category,
      totalAchievements: categoryAchievements.length,
      unlockedAchievements: unlockedAchievements.length,
      totalPoints,
      earnedPoints,
      nextAchievement
    };
  });
};

export const getAchievementsSummary = (achievementsList: Achievement[] = achievements) => {
  const categorySummaries = getCategorySummaries(achievementsList);
  const totalAchievements = achievementsList.length;
  const unlockedAchievements = achievementsList.filter(a => a.unlocked).length;
  const totalPoints = achievementsList.reduce((sum, a) => sum + a.points, 0);
  const earnedPoints = achievementsList.filter(a => a.unlocked).reduce((sum, a) => {
    const basePoints = a.points;
    const prestigeBonus = a.prestigeBonus || 0;
    return sum + basePoints + prestigeBonus;
  }, 0);
  
  return {
    totalAchievements,
    unlockedAchievements,
    totalPoints,
    earnedPoints,
    categorySummaries
  };
};

export const getRarityColor = (rarity: string): string => {
  switch(rarity) {
    case 'common': return 'from-gray-400 to-gray-500';
    case 'uncommon': return 'from-green-400 to-green-600';
    case 'rare': return 'from-blue-400 to-blue-600';
    case 'epic': return 'from-purple-400 to-purple-600';
    case 'legendary': return 'from-amber-400 to-amber-600';
    default: return 'from-gray-400 to-gray-500';
  }
};

export const getCategoryIcon = (category: AchievementCategory) => {
  switch(category) {
    case 'clinical': return <Stethoscope className="h-5 w-5" />;
    case 'teamwork': return <Users className="h-5 w-5" />;
    case 'education': return <GraduationCap className="h-5 w-5" />;
    case 'operational': return <Zap className="h-5 w-5" />;
    case 'leadership': return <Trophy className="h-5 w-5" />;
    case 'community': return <Heart className="h-5 w-5" />;
    default: return <Award className="h-5 w-5" />;
  }
};

export const getCategoryColor = (category: AchievementCategory): string => {
  switch(category) {
    case 'clinical': return 'text-blue-500';
    case 'teamwork': return 'text-indigo-500';
    case 'education': return 'text-green-500';
    case 'operational': return 'text-amber-500';
    case 'leadership': return 'text-purple-500';
    case 'community': return 'text-red-500';
    default: return 'text-gray-500';
  }
};

export const getCategoryBgColor = (category: AchievementCategory): string => {
  switch(category) {
    case 'clinical': return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'teamwork': return 'bg-indigo-100 text-indigo-800 border-indigo-300';
    case 'education': return 'bg-green-100 text-green-800 border-green-300';
    case 'operational': return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'leadership': return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'community': return 'bg-red-100 text-red-800 border-red-300';
    default: return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};
