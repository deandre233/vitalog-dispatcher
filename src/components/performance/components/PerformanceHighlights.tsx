
import { Badge } from "@/components/ui/badge";
import { PerformanceHighlightsProps } from "../types/performanceTypes";

export function PerformanceHighlights({ activeCategory }: PerformanceHighlightsProps) {
  return (
    <div className="bg-accent/40 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Performance Highlights</h3>
      <div className="space-y-3">
        {activeCategory === "overall" ? (
          <>
            <div className="flex justify-between items-center">
              <span>Strongest Area</span>
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">PCR Completion (93%)</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Improvement Area</span>
              <Badge variant="destructive">Inservice (85%)</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Department Rank</span>
              <Badge variant="outline">Top 15%</Badge>
            </div>
          </>
        ) : activeCategory === "pcrCompletion" ? (
          <>
            <div className="flex justify-between items-center">
              <span>24hr Completion Rate</span>
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">96%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Avg Completion Time</span>
              <Badge variant="outline">3.5 hours</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Late Submissions</span>
              <Badge variant="destructive">4%</Badge>
            </div>
          </>
        ) : activeCategory === "punctuality" ? (
          <>
            <div className="flex justify-between items-center">
              <span>On-Time Arrival</span>
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">94%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Avg Early Arrival</span>
              <Badge variant="outline">12 minutes</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Late Incidents</span>
              <Badge variant="destructive">3 this quarter</Badge>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <span>Strong Points</span>
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Above Average</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Improvement Areas</span>
              <Badge variant="outline">Consistency</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Trend</span>
              <Badge variant="outline">Positive</Badge>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
