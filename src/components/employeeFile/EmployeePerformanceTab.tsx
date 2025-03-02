
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line 
} from "recharts";

// Mock data for performance metrics - in a real app, this would come from an API
const performanceData = [
  { month: 'Jan', efficiency: 85, communication: 78, teamwork: 90, technical: 82 },
  { month: 'Feb', efficiency: 75, communication: 80, teamwork: 88, technical: 85 },
  { month: 'Mar', efficiency: 80, communication: 82, teamwork: 85, technical: 88 },
  { month: 'Apr', efficiency: 90, communication: 85, teamwork: 92, technical: 90 },
  { month: 'May', efficiency: 85, communication: 88, teamwork: 90, technical: 92 },
  { month: 'Jun', efficiency: 95, communication: 90, teamwork: 95, technical: 94 },
];

const shiftData = [
  { date: '01/15', shifts: 3, onTime: 3, lateArrival: 0 },
  { date: '01/22', shifts: 5, onTime: 4, lateArrival: 1 },
  { date: '01/29', shifts: 4, onTime: 4, lateArrival: 0 },
  { date: '02/05', shifts: 5, onTime: 3, lateArrival: 2 },
  { date: '02/12', shifts: 4, onTime: 4, lateArrival: 0 },
  { date: '02/19', shifts: 5, onTime: 5, lateArrival: 0 },
];

interface EmployeePerformanceTabProps {
  employeeId: string;
}

export const EmployeePerformanceTab: React.FC<EmployeePerformanceTabProps> = ({
  employeeId
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <Tabs defaultValue="performance">
          <TabsList className="mb-4">
            <TabsTrigger value="performance">Performance Analysis</TabsTrigger>
            <TabsTrigger value="shifts">Shift Records</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">AI Performance Analysis</h3>
              <p className="text-gray-600 mb-4">
                AI-driven analysis of employee performance based on shift records, incident reports, and peer feedback.
              </p>
              
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={performanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="efficiency" fill="#8884d8" name="Efficiency" />
                  <Bar dataKey="communication" fill="#82ca9d" name="Communication" />
                  <Bar dataKey="teamwork" fill="#ffc658" name="Teamwork" />
                  <Bar dataKey="technical" fill="#ff8042" name="Technical Skills" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-semibold mb-2">AI-Generated Insights</h4>
              <p className="text-gray-700">
                This employee has shown consistent improvement in communication skills over the past 3 months. 
                Their technical skills are excellent, particularly in emergency response scenarios. 
                Consider offering advanced certification opportunities to further develop their potential.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Areas of Excellence</h4>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-green-100 text-green-800">Emergency Response</Badge>
                <Badge className="bg-green-100 text-green-800">Patient Care</Badge>
                <Badge className="bg-green-100 text-green-800">Team Coordination</Badge>
                <Badge className="bg-green-100 text-green-800">Documentation</Badge>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Growth Opportunities</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Leadership Training</Badge>
                <Badge variant="outline">Advanced Life Support</Badge>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="shifts">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Shift History</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={shiftData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="shifts" stroke="#8884d8" name="Total Shifts" />
                    <Line type="monotone" dataKey="onTime" stroke="#82ca9d" name="On Time" />
                    <Line type="monotone" dataKey="lateArrival" stroke="#ff8042" name="Late Arrivals" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="border rounded-md">
                <div className="grid grid-cols-5 gap-4 p-3 font-medium bg-gray-50 rounded-t-md">
                  <div>Date</div>
                  <div>Shift</div>
                  <div>Clock In</div>
                  <div>Clock Out</div>
                  <div>Status</div>
                </div>
                <div className="divide-y">
                  <div className="grid grid-cols-5 gap-4 p-3">
                    <div>02/19/2023</div>
                    <div>7am - 7pm</div>
                    <div>6:52 AM</div>
                    <div>7:05 PM</div>
                    <div><Badge variant="outline" className="bg-green-50 text-green-700">Completed</Badge></div>
                  </div>
                  <div className="grid grid-cols-5 gap-4 p-3">
                    <div>02/17/2023</div>
                    <div>7am - 7pm</div>
                    <div>6:55 AM</div>
                    <div>7:10 PM</div>
                    <div><Badge variant="outline" className="bg-green-50 text-green-700">Completed</Badge></div>
                  </div>
                  <div className="grid grid-cols-5 gap-4 p-3">
                    <div>02/15/2023</div>
                    <div>7am - 7pm</div>
                    <div>7:05 AM</div>
                    <div>7:08 PM</div>
                    <div><Badge variant="outline" className="bg-green-50 text-green-700">Completed</Badge></div>
                  </div>
                  <div className="grid grid-cols-5 gap-4 p-3">
                    <div>02/13/2023</div>
                    <div>7am - 7pm</div>
                    <div>6:58 AM</div>
                    <div>7:02 PM</div>
                    <div><Badge variant="outline" className="bg-green-50 text-green-700">Completed</Badge></div>
                  </div>
                  <div className="grid grid-cols-5 gap-4 p-3">
                    <div>02/11/2023</div>
                    <div>7am - 7pm</div>
                    <div>7:12 AM</div>
                    <div>7:05 PM</div>
                    <div><Badge variant="outline" className="bg-amber-50 text-amber-700">Late Arrival</Badge></div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="feedback">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Supervisor Feedback</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Quarterly Review - Q1 2023</span>
                      <span className="text-gray-500">03/31/2023</span>
                    </div>
                    <p className="text-gray-700">
                      Demonstrates excellent patient care skills and professionalism. 
                      Has shown significant improvement in communication with team members. 
                      Could benefit from additional training in advanced life support techniques.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Quarterly Review - Q4 2022</span>
                      <span className="text-gray-500">12/15/2022</span>
                    </div>
                    <p className="text-gray-700">
                      Consistently reliable and punctual. Works well in high-pressure situations. 
                      Shows good judgment in emergency scenarios. 
                      Recommended for consideration for supervisor training in the next year.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Peer Feedback</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-700 italic">
                    "One of the most reliable team members I've worked with. Always willing to help and share knowledge."
                  </p>
                  <div className="text-right text-gray-500 mt-2">- Anonymous Peer Review, Feb 2023</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
