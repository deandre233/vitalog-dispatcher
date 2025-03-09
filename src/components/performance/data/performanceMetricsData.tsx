
import { PerformanceMetric } from "../types/performanceTypes";
import { Award, FileText, Clock, Calendar, Star, BookOpen, Users2, TrendingUp } from "lucide-react";

export const getPerformanceMetrics = (): Record<string, PerformanceMetric> => {
  return {
    overall: {
      category: "Overall Performance",
      score: 89,
      description: "Combined performance across all categories",
      trend: "Improved by 2.4% this quarter",
      grade: 'B',
      departmentAvg: 84,
      icon: <Award className="h-5 w-5 text-primary" />
    },
    pcrCompletion: {
      category: "PCR Completion",
      score: 93,
      description: "% of PCRs completed within 24 hours",
      trend: "Improved by 5.2% this quarter",
      grade: 'A',
      departmentAvg: 82,
      icon: <FileText className="h-5 w-5 text-primary" />
    },
    pcrQuality: {
      category: "PCR Quality",
      score: 87,
      description: "Quality scoring from QA reviews",
      trend: "Stable (+0.3%) this quarter",
      grade: 'B',
      departmentAvg: 80,
      icon: <Star className="h-5 w-5 text-primary" />
    },
    punctuality: {
      category: "Punctuality",
      score: 92,
      description: "On-time arrival percentage",
      trend: "Improved by 3.1% this quarter",
      grade: 'A',
      departmentAvg: 87,
      icon: <Clock className="h-5 w-5 text-primary" />
    },
    inserviceAttendance: {
      category: "Inservice Attendance",
      score: 85,
      description: "% of required inservice hours attended",
      trend: "Declined by 2.5% this quarter",
      grade: 'B',
      departmentAvg: 79,
      icon: <Calendar className="h-5 w-5 text-primary" />
    },
    patientFeedback: {
      category: "Patient Feedback",
      score: 90,
      description: "Average patient satisfaction score",
      trend: "Improved by 4.2% this quarter",
      grade: 'A',
      departmentAvg: 83,
      icon: <TrendingUp className="h-5 w-5 text-primary" />
    },
    protocolAdherence: {
      category: "Protocol Adherence",
      score: 88,
      description: "% adherence to clinical protocols",
      trend: "Improved by 1.7% this quarter",
      grade: 'B',
      departmentAvg: 85,
      icon: <BookOpen className="h-5 w-5 text-primary" />
    },
    teamwork: {
      category: "Teamwork",
      score: 91,
      description: "Peer and supervisor evaluations",
      trend: "Improved by 3.8% this quarter",
      grade: 'A',
      departmentAvg: 80,
      icon: <Users2 className="h-5 w-5 text-primary" />
    }
  };
};
