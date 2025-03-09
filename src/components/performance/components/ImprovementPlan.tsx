
import { ImprovementPlanProps } from "../types/performanceTypes";

export function ImprovementPlan({ activeCategory }: ImprovementPlanProps) {
  return (
    <div className="bg-accent/40 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Improvement Plan</h3>
      <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
        {activeCategory === "overall" ? (
          <>
            <li>Focus on increasing inservice attendance</li>
            <li>Maintain high PCR completion standards</li>
            <li>Continue improving protocol adherence</li>
          </>
        ) : activeCategory === "pcrCompletion" ? (
          <>
            <li>Maintain excellent completion rate</li>
            <li>Reduce late submissions by 2%</li>
            <li>Consider mentoring other team members</li>
          </>
        ) : activeCategory === "punctuality" ? (
          <>
            <li>Maintain excellent on-time record</li>
            <li>Consider adjusting commute to avoid traffic</li>
            <li>Current performance is exceeding expectations</li>
          </>
        ) : activeCategory === "inserviceAttendance" ? (
          <>
            <li>Improve attendance by 5% next quarter</li>
            <li>Schedule attendance in advance</li>
            <li>Consider online options when in-person is difficult</li>
          </>
        ) : (
          <>
            <li>Continue current improvement trajectory</li>
            <li>Schedule quarterly review of progress</li>
            <li>Consider additional training opportunities</li>
          </>
        )}
      </ul>
    </div>
  );
}
