
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useEmployeeDetails } from "@/hooks/useEmployeeDetails";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Legend, TooltipProps, Label
} from "recharts";
import { format, subWeeks } from "date-fns";
import { Download, Calendar, FileSpreadsheet, TrendingUp, AlertCircle, HelpCircle } from "lucide-react";
import { 
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Custom tooltip component for the chart
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-md shadow-md">
        <p className="text-sm font-medium">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <p className="text-sm">{`${entry.name}: ${(entry.value as number).toFixed(1)}%`}</p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Generate some realistic mock data for PCR completeness
const generateMockData = () => {
  const weeks = 12;
  const now = new Date();
  
  return Array.from({ length: weeks }).map((_, index) => {
    const date = subWeeks(now, weeks - 1 - index);
    
    // Add some randomness but with an upward trend for vitals and assessments
    const vitalsBase = 85 + (index / weeks) * 10;
    const assessmentsBase = 80 + (index / weeks) * 12;
    const proceduresBase = 75 + (index / weeks) * 8;
    const followupBase = 70 + (index / weeks) * 15;
    
    return {
      date: format(date, "MM/dd/yyyy"),
      Vitals: Math.min(100, Math.max(0, vitalsBase + (Math.random() * 10 - 5))),
      Assessments: Math.min(100, Math.max(0, assessmentsBase + (Math.random() * 12 - 6))),
      Procedures: Math.min(100, Math.max(0, proceduresBase + (Math.random() * 15 - 7.5))),
      Followup: Math.min(100, Math.max(0, followupBase + (Math.random() * 18 - 9))),
    };
  });
};

// Generate insights based on the data
const generateInsights = (data: any[]) => {
  if (data.length < 2) return [];

  const latest = data[data.length - 1];
  const previous = data[data.length - 2];
  const insights = [];

  // Check for improvements or declining metrics
  const categories = ["Vitals", "Assessments", "Procedures", "Followup"] as const;
  
  // Calculate overall average for the most recent entry
  const latestAvg = categories.reduce((sum, cat) => sum + latest[cat], 0) / categories.length;
  
  // Check if overall performance is high
  if (latestAvg > 95) {
    insights.push({
      type: "success",
      message: "Excellent overall PCR completeness across all categories."
    });
  }
  
  for (const category of categories) {
    const change = latest[category] - previous[category];
    
    // Significant improvement
    if (change > 5) {
      insights.push({
        type: "success",
        message: `${category} completeness has improved significantly (${change.toFixed(1)}% increase).`
      });
    }
    
    // Significant decline
    if (change < -5) {
      insights.push({
        type: "warning",
        message: `${category} completeness has declined (${Math.abs(change).toFixed(1)}% decrease).`
      });
    }
    
    // Low performance
    if (latest[category] < 80) {
      insights.push({
        type: "error",
        message: `${category} completeness is below target (${latest[category].toFixed(1)}%).`
      });
    }
  }
  
  return insights;
};

export function PCRCompletenessSection() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { employee } = useEmployeeDetails(employeeId);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [data] = useState(generateMockData());
  const [insights] = useState(generateInsights(data));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const employeeName = `${employee?.first_name || ''} ${employee?.last_name || ''}`;

  // Get the latest metrics from the data
  const latestMetrics = data.length > 0 ? data[data.length - 1] : null;

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>{employeeName}'s PCR completeness over time</CardTitle>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <HelpCircle className="h-4 w-4 text-gray-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    This chart shows the completeness of Patient Care Reports (PCRs) submitted by this employee.
                    Higher percentages indicate better documentation quality.
                  </p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <Calendar className="h-4 w-4" />
              {showDatePicker ? "Hide Filters" : "Filter by Date"}
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <FileSpreadsheet className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>
        
        {showDatePicker && (
          <div className="flex items-center gap-2 mt-3">
            <span className="text-sm text-gray-500">From:</span>
            <input 
              type="date" 
              value={startDate || ''} 
              onChange={e => setStartDate(e.target.value)}
              className="border rounded-md px-2 py-1 text-sm"
            />
            <span className="text-sm text-gray-500">To:</span>
            <input 
              type="date" 
              value={endDate || ''} 
              onChange={e => setEndDate(e.target.value)}
              className="border rounded-md px-2 py-1 text-sm"
            />
            <Button variant="default" size="sm">Apply Filter</Button>
            <Button variant="ghost" size="sm" onClick={() => {
              setStartDate(null);
              setEndDate(null);
            }}>Clear</Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="relative h-[400px] w-full bg-white">
          <div className="absolute top-0 left-0 flex items-center gap-4 p-2">
            <div className="flex items-center gap-1">
              <span className="inline-block w-4 h-[2px] bg-blue-500"></span>
              <span className="text-sm text-gray-700">Vitals</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-block w-4 h-[2px] bg-amber-500"></span>
              <span className="text-sm text-gray-700">Assessments</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-block w-4 h-[2px] bg-red-500"></span>
              <span className="text-sm text-gray-700">Procedures</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-block w-4 h-[2px] bg-indigo-600"></span>
              <span className="text-sm text-gray-700">Followup</span>
            </div>
          </div>
          
          {/* Real chart using recharts */}
          <div className="mt-10 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
              >
                <defs>
                  <linearGradient id="colorVitals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAssessments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProcedures" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorFollowup" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tickMargin={10}
                  padding={{ left: 20, right: 20 }}
                >
                  <Label 
                    value="Date" 
                    position="insideBottom" 
                    offset={-20} 
                    style={{ textAnchor: 'middle', fontSize: 12 }}
                  />
                </XAxis>
                <YAxis 
                  tickCount={6} 
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                >
                  <Label 
                    value="Completeness %" 
                    angle={-90}
                    position="insideLeft"
                    style={{ textAnchor: 'middle', fontSize: 12 }}
                  />
                </YAxis>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36} />
                <Area 
                  type="monotone" 
                  dataKey="Vitals" 
                  stroke="#3b82f6" 
                  fillOpacity={1}
                  fill="url(#colorVitals)" 
                  activeDot={{ r: 6 }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="Assessments" 
                  stroke="#f59e0b" 
                  fillOpacity={1}
                  fill="url(#colorAssessments)" 
                  activeDot={{ r: 6 }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="Procedures" 
                  stroke="#ef4444" 
                  fillOpacity={1}
                  fill="url(#colorProcedures)" 
                  activeDot={{ r: 6 }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="Followup" 
                  stroke="#4f46e5" 
                  fillOpacity={1}
                  fill="url(#colorFollowup)" 
                  activeDot={{ r: 6 }} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {/* Current metrics summary */}
          {latestMetrics && (
            <div className="mt-2 grid grid-cols-4 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-2">
                <div className="text-xs text-gray-600 mb-1">Vitals Completeness</div>
                <div className="text-lg font-semibold text-blue-600">{latestMetrics.Vitals.toFixed(1)}%</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-md p-2">
                <div className="text-xs text-gray-600 mb-1">Assessments Completeness</div>
                <div className="text-lg font-semibold text-amber-600">{latestMetrics.Assessments.toFixed(1)}%</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-md p-2">
                <div className="text-xs text-gray-600 mb-1">Procedures Completeness</div>
                <div className="text-lg font-semibold text-red-600">{latestMetrics.Procedures.toFixed(1)}%</div>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 rounded-md p-2">
                <div className="text-xs text-gray-600 mb-1">Followup Completeness</div>
                <div className="text-lg font-semibold text-indigo-600">{latestMetrics.Followup.toFixed(1)}%</div>
              </div>
            </div>
          )}
          
          {/* AI Insights */}
          {insights.length > 0 && (
            <div className="mt-4 border border-gray-200 rounded-md p-3">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <h3 className="font-medium text-sm text-gray-700">AI Insights</h3>
              </div>
              <div className="space-y-2">
                {insights.map((insight, i) => (
                  <div 
                    key={i} 
                    className={`text-sm flex items-start gap-1.5 ${
                      insight.type === 'success' ? 'text-green-600' : 
                      insight.type === 'warning' ? 'text-amber-600' : 'text-red-600'
                    }`}
                  >
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{insight.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-8 text-center">
            <Button variant="link" className="text-blue-600">
              <Download className="mr-1 h-4 w-4" />
              Export {employeeName}'s list of PCR procedures performed
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
