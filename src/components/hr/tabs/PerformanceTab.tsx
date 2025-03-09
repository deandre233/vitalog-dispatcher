
import { StatisticsSection } from "./performance/StatisticsSection";
import { PCRCompletenessSection } from "./performance/PCRCompletenessSection";
import { PerformanceRankings } from "@/components/performance/PerformanceRankings";

export function PerformanceTab() {
  return (
    <div className="space-y-8 pb-10">
      <div className="grid grid-cols-1 gap-6">
        <StatisticsSection />
        <PerformanceRankings />
        <PCRCompletenessSection />
      </div>
    </div>
  );
}
