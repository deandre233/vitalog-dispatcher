
import { StatisticsSection } from "./performance/StatisticsSection";
import { PCRCompletenessSection } from "./performance/PCRCompletenessSection";
import { CertificationsSection } from "./performance/CertificationsSection";
import { ContinuingEducationSection } from "./performance/ContinuingEducationSection";

export function PerformanceTab() {
  return (
    <div className="space-y-8 pb-10">
      <StatisticsSection />
      <PCRCompletenessSection />
      <CertificationsSection />
      <ContinuingEducationSection />
    </div>
  );
}
