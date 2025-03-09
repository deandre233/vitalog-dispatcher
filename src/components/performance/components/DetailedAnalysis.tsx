
import { DetailedAnalysisProps } from "../types/performanceTypes";

export function DetailedAnalysis({ activeCategory }: DetailedAnalysisProps) {
  return (
    <div className="bg-accent/40 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Detailed Analysis</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-background p-4 rounded-md">
          <h4 className="font-medium mb-2">Strengths</h4>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            {activeCategory === "overall" ? (
              <>
                <li>Consistently high PCR completion rate</li>
                <li>Excellent punctuality record</li>
                <li>Strong patient feedback ratings</li>
              </>
            ) : activeCategory === "pcrCompletion" ? (
              <>
                <li>96% completion within 24 hours</li>
                <li>Detailed and accurate documentation</li>
                <li>Minimal revision requests from QA</li>
              </>
            ) : (
              <>
                <li>Performance above department average</li>
                <li>Consistent improvement over time</li>
                <li>Positive feedback from supervisors</li>
              </>
            )}
          </ul>
        </div>
        
        <div className="bg-background p-4 rounded-md">
          <h4 className="font-medium mb-2">Areas for Growth</h4>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            {activeCategory === "overall" ? (
              <>
                <li>Inservice attendance could be improved</li>
                <li>Protocol adherence has room for improvement</li>
                <li>PCR quality good but could be more detailed</li>
              </>
            ) : activeCategory === "inserviceAttendance" ? (
              <>
                <li>Attendance rate below personal target</li>
                <li>Missing 2 required sessions this quarter</li>
                <li>Schedule conflicts identified as main issue</li>
              </>
            ) : (
              <>
                <li>Some inconsistency in performance</li>
                <li>Minor areas of improvement identified</li>
                <li>Additional training may be beneficial</li>
              </>
            )}
          </ul>
        </div>
        
        <div className="bg-background p-4 rounded-md">
          <h4 className="font-medium mb-2">Recommendations</h4>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            {activeCategory === "overall" ? (
              <>
                <li>Schedule inservice sessions in advance</li>
                <li>Review clinical protocols quarterly</li>
                <li>Consider additional CE opportunities</li>
              </>
            ) : activeCategory === "protocolAdherence" ? (
              <>
                <li>Review updated cardiac protocols</li>
                <li>Attend advanced clinical sessions</li>
                <li>Consider protocol update study group</li>
              </>
            ) : (
              <>
                <li>Set specific improvement goals</li>
                <li>Request feedback from supervisors</li>
                <li>Track progress with monthly reviews</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
