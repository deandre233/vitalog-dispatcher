
import { StatisticsSection } from "./performance/StatisticsSection";
import { PCRCompletenessSection } from "./performance/PCRCompletenessSection";

export function PerformanceTab() {
  return (
    <div className="space-y-8 pb-10">
      <StatisticsSection />
      <PCRCompletenessSection />
    </div>
  );
}
