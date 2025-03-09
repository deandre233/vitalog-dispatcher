
import { ReactNode } from "react";

export interface EmployeePerformanceProps {
  employeeId: string;
  employeeName: string;
}

export interface PerformanceMetric {
  category: string;
  score: number;
  description: string;
  trend: string;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  departmentAvg: number;
  icon: ReactNode;
}

export interface SubjectSpecificContent {
  concern: string;
  expectations: string;
  observation: string;
  recommendations: string;
  recognition: string;
  growthOpportunities: string;
}

export interface WriteUpGenerationProps {
  employeeName: string;
  writeUpSubject: string;
  activeCategory: string;
  metric: PerformanceMetric;
}

export interface MetricCardProps {
  metric: PerformanceMetric;
  getScoreColor: (score: number) => string;
}

export interface PerformanceHighlightsProps {
  activeCategory: string;
}

export interface ImprovementPlanProps {
  activeCategory: string;
}

export interface DetailedAnalysisProps {
  activeCategory: string;
}
