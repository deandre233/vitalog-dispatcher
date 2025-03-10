
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, UserCheck, Clock, MapPin, BarChart, X } from "lucide-react";
import { motion } from "framer-motion";

interface AIDirectoryInsightsProps {
  isVisible: boolean;
  onClose: () => void;
  employeeCount: number;
  certificationCounts: Record<string, number>;
  stationCounts: Record<string, number>;
}

export function AIDirectoryInsights({ 
  isVisible, 
  onClose, 
  employeeCount, 
  certificationCounts, 
  stationCounts 
}: AIDirectoryInsightsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'recommendations' | 'analytics'>('overview');

  if (!isVisible) return null;

  const topCertifications = Object.entries(certificationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const topStations = Object.entries(stationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const generateInsight = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mb-6"
    >
      <Card className="border border-[#E5DEFF] shadow-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#F1F0FB] to-white pb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Sparkles className="h-5 w-5 text-[#8B5CF6] mr-2" />
              <CardTitle className="text-lg font-medium">AI Directory Insights</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            AI-powered analytics and insights about your personnel
          </CardDescription>
          
          <div className="flex space-x-1 mt-4">
            <Button 
              variant={activeTab === 'overview' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setActiveTab('overview')}
              className={activeTab === 'overview' ? 'bg-[#8B5CF6] hover:bg-[#7c4feb] text-white' : ''}
            >
              Overview
            </Button>
            <Button 
              variant={activeTab === 'recommendations' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setActiveTab('recommendations')}
              className={activeTab === 'recommendations' ? 'bg-[#8B5CF6] hover:bg-[#7c4feb] text-white' : ''}
            >
              Recommendations
            </Button>
            <Button 
              variant={activeTab === 'analytics' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setActiveTab('analytics')}
              className={activeTab === 'analytics' ? 'bg-[#8B5CF6] hover:bg-[#7c4feb] text-white' : ''}
            >
              Analytics
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#F1F0FB]/50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <UserCheck className="h-5 w-5 text-[#8B5CF6] mr-2" />
                  <h3 className="font-medium">Staffing Overview</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  You currently have {employeeCount} personnel across multiple stations and certification levels.
                </p>
                <div className="space-y-2">
                  {topCertifications.map(([cert, count]) => (
                    <div key={cert} className="flex justify-between items-center">
                      <span className="text-sm">{cert || 'Uncertified'}</span>
                      <Badge variant="outline" className="bg-white">
                        {count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-[#F1F0FB]/50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <MapPin className="h-5 w-5 text-[#8B5CF6] mr-2" />
                  <h3 className="font-medium">Station Distribution</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Personnel are distributed across multiple stations with varied coverage.
                </p>
                <div className="space-y-2">
                  {topStations.map(([station, count]) => (
                    <div key={station} className="flex justify-between items-center">
                      <span className="text-sm">{station || 'Unassigned'}</span>
                      <Badge variant="outline" className="bg-white">
                        {count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-[#F1F0FB]/50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Clock className="h-5 w-5 text-[#8B5CF6] mr-2" />
                  <h3 className="font-medium">Experience Overview</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  The average experience level across your personnel is 4.5 years.
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                  <div className="bg-[#8B5CF6] h-2.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>New hires: 12</span>
                  <span>5+ years: 15</span>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'recommendations' && (
            <div className="space-y-4">
              <div className="bg-[#F1F0FB]/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Staffing Recommendations</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-[#8B5CF6] mr-2">•</span>
                    <span>Consider hiring 2 more EMTs to balance the team ratio</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#8B5CF6] mr-2">•</span>
                    <span>Station 3 is understaffed by 3 personnel based on call volume</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#8B5CF6] mr-2">•</span>
                    <span>4 certifications will expire in the next 30 days - prompt renewals</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-[#F1F0FB]/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Coverage Optimization</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Based on historical data, we recommend the following shifts:
                </p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Mon-Fri Peak Hours (8am-6pm)</span>
                    <span className="font-medium">12 staff</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weekend Coverage</span>
                    <span className="font-medium">8 staff</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overnight (10pm-6am)</span>
                    <span className="font-medium">5 staff</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'analytics' && (
            <div className="space-y-4">
              <div className="bg-[#F1F0FB]/50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <BarChart className="h-5 w-5 text-[#8B5CF6] mr-2" />
                  <h3 className="font-medium">Personnel Analytics</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Certification Distribution</p>
                    <div className="w-full h-8 bg-gray-100 rounded-md overflow-hidden flex">
                      <div className="bg-green-400 h-full" style={{ width: '45%' }} title="Paramedic: 45%"></div>
                      <div className="bg-blue-400 h-full" style={{ width: '30%' }} title="EMT: 30%"></div>
                      <div className="bg-yellow-400 h-full" style={{ width: '15%' }} title="Driver: 15%"></div>
                      <div className="bg-purple-400 h-full" style={{ width: '10%' }} title="Other: 10%"></div>
                    </div>
                    <div className="flex text-xs mt-1 justify-between">
                      <span>Paramedic: 45%</span>
                      <span>EMT: 30%</span>
                      <span>Driver: 15%</span>
                      <span>Other: 10%</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Experience Levels</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>0-1 years</span>
                          <span>15%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-[#8B5CF6] h-1.5 rounded-full" style={{ width: '15%' }}></div>
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>1-3 years</span>
                          <span>30%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-[#8B5CF6] h-1.5 rounded-full" style={{ width: '30%' }}></div>
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>3+ years</span>
                          <span>55%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-[#8B5CF6] h-1.5 rounded-full" style={{ width: '55%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="bg-gradient-to-r from-white to-[#F1F0FB]/50 pt-2">
          <Button 
            onClick={generateInsight} 
            className="bg-[#8B5CF6] hover:bg-[#7c4feb] text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate New Insights
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
