
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
  HeartHandshake
} from "lucide-react";
import { Achievement, CategorySummary, AchievementCategory } from "../types/achievementTypes";

export const achievements: Achievement[] = [
  // Clinical Excellence
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

export const getCategorySummaries = (): CategorySummary[] => {
  const categories: AchievementCategory[] = ['clinical', 'teamwork', 'education', 'operational', 'leadership', 'community'];
  
  return categories.map(category => {
    const categoryAchievements = achievements.filter(a => a.category === category);
    const unlockedAchievements = categoryAchievements.filter(a => a.unlocked);
    const totalPoints = categoryAchievements.reduce((sum, a) => sum + a.points, 0);
    const earnedPoints = unlockedAchievements.reduce((sum, a) => sum + a.points, 0);
    
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

export const getAchievementsSummary = () => {
  const categorySummaries = getCategorySummaries();
  const totalAchievements = achievements.length;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const totalPoints = achievements.reduce((sum, a) => sum + a.points, 0);
  const earnedPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);
  
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
