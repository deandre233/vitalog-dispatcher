export interface AIAnalysisSection {
  title: string;
  content: string;
  metrics: Record<string, string | number>;
  benchmarks: Record<string, string | number>;
  recommendations: string[];
}

export interface AIAnalysisResponse {
  sections: AIAnalysisSection[];
}