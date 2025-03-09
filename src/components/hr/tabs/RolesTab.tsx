
import { useState } from "react";
import { EmployeeRole } from "@/types/employee";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TabsContent } from "@/components/ui/tabs";
import { UseMutationResult } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, AlertTriangle, Brain, Info } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RolesTabProps {
  roles: EmployeeRole | undefined;
  updateRole: UseMutationResult<void, Error, Partial<EmployeeRole>, unknown>;
}

export function RolesTab({ roles, updateRole }: RolesTabProps) {
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("operational");

  // AI role recommendations based on current selections
  const getAIRecommendations = () => {
    if (!roles) return [];
    
    const recommendations = [];
    
    if (roles.is_crew_member && !roles.is_supervisor) {
      recommendations.push("Based on experience patterns, crew members often benefit from QA Reviewer privileges to improve service quality.");
    }
    
    if (roles.is_dispatcher && !roles.can_see_non_emergent) {
      recommendations.push("Dispatchers typically need access to non-emergent calls for comprehensive scheduling.");
    }
    
    if (roles.is_supervisor && roles.supervisor_role === "Captain") {
      recommendations.push("Captains often need administrator access for team management. Consider granting limited administrative privileges.");
    }
    
    if (roles.is_onlooker && !roles.onlooker_facility && !roles.onlooker_city) {
      recommendations.push("Onlooker role is incomplete. Please specify facility and location information.");
    }
    
    return recommendations.length > 0 ? recommendations : ["No specific role recommendations at this time."];
  };

  const roleCategories = [
    { id: "operational", label: "Operational Roles", icon: <Shield className="h-4 w-4 mr-2" /> },
    { id: "administrative", label: "Administrative Roles", icon: <Info className="h-4 w-4 mr-2" /> },
    { id: "special", label: "Special Access", icon: <AlertTriangle className="h-4 w-4 mr-2" /> }
  ];

  return (
    <TabsContent value="roles" className="mt-0 animate-in fade-in-50">
      <div className="p-6">
        <div className="flex gap-6 flex-col lg:flex-row">
          {/* Left column - Role categories */}
          <div className="bg-white rounded-lg shadow p-6 lg:w-1/4">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-primary" />
              Role Categories
            </h2>
            <div className="space-y-2">
              {roleCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center ${
                    selectedCategory === category.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {category.icon}
                  {category.label}
                </button>
              ))}
            </div>

            {/* AI Recommendations Toggle */}
            <div className="mt-6 border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-purple-500" />
                  <span className="font-medium">AI Role Insights</span>
                </div>
                <Switch
                  checked={showAIRecommendations}
                  onCheckedChange={setShowAIRecommendations}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Enable AI to analyze and suggest optimal role configurations
              </p>
            </div>
          </div>

          {/* Right column - Role settings */}
          <div className="bg-white rounded-lg shadow p-6 lg:flex-1">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">
                {selectedCategory === "operational" && "Operational Roles"}
                {selectedCategory === "administrative" && "Administrative Roles"}
                {selectedCategory === "special" && "Special Access"}
              </h2>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a 
                      href="#" 
                      className="text-sm text-primary underline flex items-center"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Info className="h-4 w-4 mr-1" /> 
                      Roles Guide
                    </a>
                  </TooltipTrigger>
                  <TooltipContent className="w-80 p-4">
                    <h3 className="font-bold mb-2">About Employee Roles</h3>
                    <p className="text-sm">
                      Roles determine what actions an employee can perform in the system.
                      Multiple roles can be assigned to create custom permission sets.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* AI Recommendations Panel */}
            {showAIRecommendations && (
              <div className="mb-6 bg-purple-50 border border-purple-200 rounded-md p-4">
                <div className="flex items-center mb-2">
                  <Brain className="h-5 w-5 mr-2 text-purple-600" />
                  <h3 className="font-medium text-purple-800">AI Role Recommendations</h3>
                </div>
                <ul className="space-y-2 text-sm text-purple-700">
                  {getAIRecommendations().map((rec, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Operational Roles */}
            {selectedCategory === "operational" && (
              <div className="space-y-6">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between group">
                    <div>
                      <label className="font-medium flex items-center">
                        Crew Member
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 ml-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-60">Employee joins shifts and runs calls</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                    </div>
                    <Switch
                      checked={roles?.is_crew_member}
                      onCheckedChange={() => updateRole.mutate({is_crew_member: !roles?.is_crew_member})}
                    />
                  </div>

                  <div className="flex items-center justify-between group">
                    <div>
                      <label className="font-medium flex items-center">
                        Supervisor
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 ml-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-60">Can supervise other employees and approve schedule changes</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                    </div>
                    <Switch
                      checked={roles?.is_supervisor}
                      onCheckedChange={() => updateRole.mutate({is_supervisor: !roles?.is_supervisor})}
                    />
                  </div>

                  {roles?.is_supervisor && (
                    <div className="ml-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                      <label className="font-medium block mb-3">Supervisor Role</label>
                      <RadioGroup 
                        value={roles.supervisor_role} 
                        onValueChange={(value: "Captain" | "Lieutenant" | "Full privileges" | "Call-taker / Self-dispatch") => 
                          updateRole.mutate({supervisor_role: value})
                        }
                        className="space-y-3"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Captain" id="captain" />
                          <label htmlFor="captain" className="text-sm font-medium">Captain</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Lieutenant" id="lieutenant" />
                          <label htmlFor="lieutenant" className="text-sm font-medium">Lieutenant</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Full privileges" id="full" />
                          <label htmlFor="full" className="text-sm font-medium">Full privileges</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Call-taker / Self-dispatch" id="calltaker" />
                          <label htmlFor="calltaker" className="text-sm font-medium">Call-taker / Self-dispatch</label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  <div className="flex items-center justify-between group">
                    <div>
                      <label className="font-medium flex items-center">
                        Dispatcher
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 ml-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-60">Can assign crews to calls and manage dispatch board</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                    </div>
                    <Switch
                      checked={roles?.is_dispatcher}
                      onCheckedChange={() => updateRole.mutate({is_dispatcher: !roles?.is_dispatcher})}
                    />
                  </div>

                  <div className="flex items-center justify-between group">
                    <div>
                      <label className="font-medium flex items-center">
                        QA Reviewer
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 ml-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-60">Can review and approve report quality</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                    </div>
                    <Switch
                      checked={roles?.is_qa_reviewer}
                      onCheckedChange={() => updateRole.mutate({is_qa_reviewer: !roles?.is_qa_reviewer})}
                    />
                  </div>

                  <div className="flex items-center justify-between group">
                    <div>
                      <label className="font-medium flex items-center">
                        Mechanic
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 ml-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-60">Can manage vehicle maintenance and repairs</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                    </div>
                    <Switch
                      checked={roles?.is_mechanic}
                      onCheckedChange={() => updateRole.mutate({is_mechanic: !roles?.is_mechanic})}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Administrative Roles */}
            {selectedCategory === "administrative" && (
              <div className="space-y-6">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between group">
                    <div>
                      <label className="font-medium flex items-center">
                        HR
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 ml-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-60">Can manage employee information and permissions</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                    </div>
                    <Switch
                      checked={roles?.is_hr}
                      onCheckedChange={() => updateRole.mutate({is_hr: !roles?.is_hr})}
                    />
                  </div>

                  <div className="flex items-center justify-between group">
                    <div>
                      <label className="font-medium flex items-center">
                        Biller
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 ml-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-60">Can process payments and manage billing records</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                    </div>
                    <Switch
                      checked={roles?.is_biller}
                      onCheckedChange={() => updateRole.mutate({is_biller: !roles?.is_biller})}
                    />
                  </div>

                  <div className="flex items-center justify-between group">
                    <div>
                      <label className="font-medium flex items-center">
                        Salesperson
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 ml-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-60">Can manage sales accounts and contracts</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                    </div>
                    <Switch
                      checked={roles?.is_salesperson}
                      onCheckedChange={() => updateRole.mutate({is_salesperson: !roles?.is_salesperson})}
                    />
                  </div>

                  <div className="flex items-center justify-between group">
                    <div>
                      <label className="font-medium flex items-center">
                        Medical Director
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 ml-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-60">Reviews completed run reports for medical protocol compliance</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                    </div>
                    <Switch
                      checked={roles?.is_medical_director}
                      onCheckedChange={() => updateRole.mutate({is_medical_director: !roles?.is_medical_director})}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Special Access */}
            {selectedCategory === "special" && (
              <div className="space-y-6">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between group border-b pb-4">
                    <div>
                      <label className="font-medium flex items-center">
                        Onlooker
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 ml-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-60">Can view (but not modify) the active dispatch board with restrictions</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                    </div>
                    <Switch
                      checked={roles?.is_onlooker}
                      onCheckedChange={() => updateRole.mutate({is_onlooker: !roles?.is_onlooker})}
                    />
                  </div>

                  {roles?.is_onlooker && (
                    <div className="ml-6 space-y-4 bg-gray-50 p-4 rounded-md border border-gray-200">
                      <div>
                        <label className="font-medium block mb-2 text-sm">Facility</label>
                        <Input
                          type="text"
                          value={roles.onlooker_facility}
                          onChange={(e) => updateRole.mutate({ onlooker_facility: e.target.value })}
                          placeholder="Enter facility name"
                          className="max-w-md"
                        />
                      </div>
                      <div>
                        <label className="font-medium block mb-2 text-sm">City</label>
                        <Input
                          type="text"
                          value={roles.onlooker_city}
                          onChange={(e) => updateRole.mutate({ onlooker_city: e.target.value })}
                          placeholder="Enter city"
                          className="max-w-md"
                        />
                      </div>
                      <div>
                        <label className="font-medium block mb-2 text-sm">County</label>
                        <Select
                          value={roles.onlooker_county}
                          onValueChange={(value) => updateRole.mutate({ onlooker_county: value })}
                        >
                          <SelectTrigger className="w-full max-w-md">
                            <SelectValue placeholder="Select county" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">No limit</SelectItem>
                            <SelectItem value="Fulton">Fulton</SelectItem>
                            <SelectItem value="DeKalb">DeKalb</SelectItem>
                            <SelectItem value="Cobb">Cobb</SelectItem>
                            <SelectItem value="Gwinnett">Gwinnett</SelectItem>
                            <SelectItem value="Clayton">Clayton</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2 pt-2">
                        <Checkbox 
                          id="non-emergent"
                          checked={roles.can_see_non_emergent}
                          onCheckedChange={() => updateRole.mutate({can_see_non_emergent: !roles?.can_see_non_emergent})}
                        />
                        <label 
                          htmlFor="non-emergent" 
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Allow to also see non-emergent calls
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between group border-b pb-4 pt-4">
                    <div>
                      <label className="font-medium flex items-center">
                        <span className="flex items-center">
                          Administrator
                          <AlertTriangle className="h-4 w-4 ml-1 text-amber-500" />
                        </span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 ml-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-60">
                                <span className="font-bold text-amber-500">Caution:</span> Unlimited access with no safeguards
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <p className="text-xs text-gray-500 mt-1">Unlimited access, no safeguards</p>
                    </div>
                    <Switch
                      checked={roles?.is_administrator}
                      onCheckedChange={() => updateRole.mutate({is_administrator: !roles?.is_administrator})}
                    />
                  </div>

                  <div className="flex items-center justify-between group border-b pb-4">
                    <div>
                      <label className="font-medium flex items-center">
                        <span className="flex items-center">
                          Principal
                          <AlertTriangle className="h-4 w-4 ml-1 text-amber-500" />
                        </span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 ml-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-60">
                                <span className="font-bold text-amber-500">Caution:</span> Can modify core system settings
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <p className="text-xs text-gray-500 mt-1">Can sign agreements and modify system settings</p>
                    </div>
                    <Switch
                      checked={roles?.is_principal}
                      onCheckedChange={() => updateRole.mutate({is_principal: !roles?.is_principal})}
                    />
                  </div>

                  <div className="flex items-center justify-between group pt-4">
                    <div>
                      <label className="font-medium flex items-center">
                        Provisional
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 ml-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-60">Limited access only when at a company facility</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <p className="text-xs text-gray-500 mt-1">Access only when at a company facility</p>
                    </div>
                    <Switch
                      checked={roles?.is_provisional}
                      onCheckedChange={() => updateRole.mutate({is_provisional: !roles?.is_provisional})}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </TabsContent>
  );
}
