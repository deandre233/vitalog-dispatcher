
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { UserCog, PieChart as PieChartIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const departmentData = [
  { name: 'Operations', value: 35 },
  { name: 'Medical', value: 25 },
  { name: 'Admin', value: 15 },
  { name: 'Support', value: 10 },
  { name: 'Management', value: 5 },
];

const certificationData = [
  { name: 'EMT-B', count: 14 },
  { name: 'Paramedic', count: 9 },
  { name: 'AEMT', count: 6 },
  { name: 'EMR', count: 8 },
  { name: 'Instructor', count: 3 },
];

const performanceData = [
  { name: 'Jan', value: 89 },
  { name: 'Feb', value: 91 },
  { name: 'Mar', value: 87 },
  { name: 'Apr', value: 93 },
  { name: 'May', value: 94 },
  { name: 'Jun', value: 92 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#8b5cf6'];

export function HRWorkforceAnalytics() {
  return (
    <Card className="bg-gradient-to-br from-white to-blue-50 border border-blue-100">
      <CardHeader>
        <CardTitle className="flex items-center">
          <UserCog className="mr-2 h-5 w-5 text-blue-600" />
          Workforce Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="department" className="w-full">
          <TabsList className="grid grid-cols-3 w-full mb-4">
            <TabsTrigger value="department">Department</TabsTrigger>
            <TabsTrigger value="certification">Certifications</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          <TabsContent value="department">
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} employees`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2">Staff distribution across departments</p>
          </TabsContent>
          <TabsContent value="certification">
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={certificationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2">Current certification distribution among staff</p>
          </TabsContent>
          <TabsContent value="performance">
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[80, 100]} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Bar dataKey="value" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2">Average monthly performance scores (0-100)</p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
