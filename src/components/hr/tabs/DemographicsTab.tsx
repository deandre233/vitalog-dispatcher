import { useState, useEffect } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, CheckCircle, AlertTriangle, Info, Map, Calendar, Flag, MapPin, Phone, AtSign } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AIInsightsPanel } from "@/components/dispatch/ai/AIInsightsPanel";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import type { AIInsight } from "@/types/ai";
import type { Employee } from "@/types/employee";
import { CertificationSelector } from "@/components/hr/demographics/CertificationSelector";
import { AddressAutocomplete } from "@/components/hr/demographics/AddressAutocomplete";
import { PrivacyConsentForm } from "@/components/hr/demographics/PrivacyConsentForm";
import { DemographicsSummary } from "@/components/hr/demographics/DemographicsSummary";

interface DemographicsTabProps {
  employee: Employee;
  isLoading: boolean;
  onSave: (data: Partial<Employee>) => void;
}

// List of US states
const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", 
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", 
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", 
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", 
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", 
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", 
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

// Race/ethnicity options following US Census categories
const RACE_ETHNICITY_OPTIONS = [
  "American Indian or Alaska Native",
  "Asian",
  "Black or African American",
  "Hispanic or Latino",
  "Native Hawaiian or Other Pacific Islander",
  "White",
  "Two or More Races",
  "Prefer not to say"
];

// Certification levels
const CERTIFICATION_LEVELS = [
  "EMR (Emergency Medical Responder)",
  "EMT-Basic",
  "EMT-Intermediate",
  "AEMT (Advanced EMT)",
  "Paramedic",
  "Critical Care Paramedic",
  "Flight Paramedic"
];

// Generate AI insights based on demographics data
const generateDemographicInsights = (formData: any): AIInsight[] => {
  const insights: AIInsight[] = [];
  
  // Check certification expiration
  if (formData.certification_expiry) {
    const expiryDate = new Date(formData.certification_expiry);
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 30) {
      insights.push({
        type: 'warning',
        message: `${formData.certification_level} certification expires in ${daysUntilExpiry} days. Renewal process should begin immediately.`,
        confidence: 0.95,
        impact: 'high'
      });
    } else if (daysUntilExpiry < 90) {
      insights.push({
        type: 'warning',
        message: `${formData.certification_level} certification expires in ${daysUntilExpiry} days. Plan for renewal.`,
        confidence: 0.95,
        impact: 'medium'
      });
    }
  }
  
  // Address completion check
  if (!formData.address_line1 || !formData.city || !formData.state || !formData.zip_code) {
    insights.push({
      type: 'optimization',
      message: 'Complete address information is essential for emergency contact and scheduling purposes.',
      confidence: 0.9,
      impact: 'medium'
    });
  }
  
  // Demographic data completeness
  const requiredFields = ['first_name', 'last_name', 'date_of_birth', 'gender', 'mobile'];
  const missingFields = requiredFields.filter(field => !formData[field]);
  
  if (missingFields.length > 0) {
    insights.push({
      type: 'optimization',
      message: `${missingFields.length} essential profile fields are incomplete. Complete profile improves scheduling accuracy.`,
      confidence: 0.85,
      impact: 'medium'
    });
  }
  
  // Location-based insight
  if (formData.zip_code) {
    insights.push({
      type: 'optimization',
      message: `Based on location data, employee may qualify for regional certification opportunities in the ${formData.state} area.`,
      confidence: 0.75,
      impact: 'medium'
    });
  }
  
  // Training recommendation
  if (formData.certification_level && formData.years_experience) {
    const nextLevel = getNextCertificationLevel(formData.certification_level);
    if (nextLevel && formData.years_experience >= 2) {
      insights.push({
        type: 'prediction',
        message: `With ${formData.years_experience} years experience, consider advancement to ${nextLevel} certification.`,
        confidence: 0.8,
        impact: 'high'
      });
    }
  }
  
  return insights;
};

// Helper function to determine next certification level
const getNextCertificationLevel = (currentLevel: string): string | null => {
  const index = CERTIFICATION_LEVELS.indexOf(currentLevel);
  if (index >= 0 && index < CERTIFICATION_LEVELS.length - 1) {
    return CERTIFICATION_LEVELS[index + 1];
  }
  return null;
};

export function DemographicsTab({ employee, isLoading, onSave }: DemographicsTabProps) {
  const [expandedInsights, setExpandedInsights] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(
    employee?.date_of_birth ? new Date(employee.date_of_birth) : undefined
  );
  const [certificationExpiry, setCertificationExpiry] = useState<Date | undefined>(
    employee?.certification_expiry ? new Date(employee.certification_expiry) : undefined
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isCertExpiryOpen, setIsCertExpiryOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: employee?.first_name || "",
    last_name: employee?.last_name || "",
    address_line1: employee?.address_line1 || "",
    address_line2: employee?.address_line2 || "",
    city: employee?.city || "",
    state: employee?.state || "Georgia",
    zip_code: employee?.zip_code || "",
    date_of_birth: employee?.date_of_birth || "",
    citizenship: employee?.citizenship || "US",
    gender: employee?.gender || "",
    race_ethnicity: employee?.race_ethnicity || "",
    secondary_race: employee?.secondary_race || "",
    certification_level: employee?.certification_level || "",
    certification_number: employee?.certification_number || "",
    certification_expiry: employee?.certification_expiry || "",
    years_experience: employee?.years_experience || 0,
    email: employee?.email || "",
    mobile: employee?.mobile || "",
    home_phone: employee?.home_phone || "",
    work_phone: employee?.work_phone || "",
    emergency_contact_name: employee?.emergency_contact_name || "",
    emergency_contact_phone: employee?.emergency_contact_phone || "",
    preferred_contact_method: employee?.preferred_contact_method || "mobile",
    consent_to_background_check: employee?.consent_to_background_check || false,
    consent_to_drug_testing: employee?.consent_to_drug_testing || false
  });

  // Generate AI insights based on current form data
  const demographicInsights = generateDemographicInsights(formData);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSelectChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const handleDateOfBirthChange = (date?: Date) => {
    setDateOfBirth(date);
    if (date) {
      setFormData({
        ...formData,
        date_of_birth: format(date, 'yyyy-MM-dd')
      });
    }
    setIsCalendarOpen(false);
  };
  
  const handleCertExpiryChange = (date?: Date) => {
    setCertificationExpiry(date);
    if (date) {
      setFormData({
        ...formData,
        certification_expiry: format(date, 'yyyy-MM-dd')
      });
    }
    setIsCertExpiryOpen(false);
  };
  
  const handleSwitchChange = (field: string, checked: boolean) => {
    setFormData({
      ...formData,
      [field]: checked
    });
  };
  
  const handleAddressAutocomplete = (addressData: any) => {
    setFormData({
      ...formData,
      address_line1: addressData.street_number + ' ' + addressData.route,
      city: addressData.locality,
      state: addressData.administrative_area_level_1,
      zip_code: addressData.postal_code
    });
  };
  
  const handleSubmit = () => {
    onSave(formData);
    toast({
      title: "Demographics updated",
      description: "Employee demographic information has been successfully updated."
    });
  };
  
  const calculateAge = (birthDate: string) => {
    if (!birthDate) return "";
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return `(${age} years old)`;
  };

  return (
    <TabsContent value="demographics" className="mt-0 animate-in fade-in-50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Demographics</h2>
            <p className="text-muted-foreground">Manage employee demographic information</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowSummary(!showSummary)}>
              {showSummary ? "Edit Details" : "View Summary"}
            </Button>
          </div>
        </div>
        
        {/* AI Insights Panel */}
        <Card className="mb-6 border-blue-100 bg-blue-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-500" />
              <span>Demographics AI Insights</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-2 h-6 w-6 p-0 rounded-full" 
                onClick={() => setExpandedInsights(!expandedInsights)}
              >
                {expandedInsights ? "-" : "+"}
              </Button>
            </CardTitle>
            {!expandedInsights && (
              <CardDescription>
                {demographicInsights.length > 0 
                  ? demographicInsights[0].message 
                  : "No insights available for the current demographic information."}
              </CardDescription>
            )}
          </CardHeader>
          {expandedInsights && (
            <CardContent>
              <AIInsightsPanel insights={demographicInsights} />
            </CardContent>
          )}
        </Card>
        
        {showSummary ? (
          <DemographicsSummary
            data={formData}
            onEdit={() => setShowSummary(false)}
            insights={demographicInsights.length}
          />
        ) : (
          <div className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-500" />
                  Personal Information
                </CardTitle>
                <CardDescription>Basic personal and identifying information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input 
                      id="first_name" 
                      name="first_name" 
                      value={formData.first_name} 
                      onChange={handleInputChange}
                      placeholder="First name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input 
                      id="last_name" 
                      name="last_name" 
                      value={formData.last_name} 
                      onChange={handleInputChange}
                      placeholder="Last name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <div className="relative">
                      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !dateOfBirth && "text-muted-foreground"
                            )}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {dateOfBirth ? format(dateOfBirth, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={dateOfBirth}
                            onSelect={handleDateOfBirthChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1940-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {dateOfBirth && (
                        <span className="text-sm text-muted-foreground mt-1 block">
                          {calculateAge(formData.date_of_birth)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="citizenship">Citizenship</Label>
                    <Input 
                      id="citizenship" 
                      name="citizenship" 
                      value={formData.citizenship} 
                      onChange={handleInputChange}
                      placeholder="Country of citizenship"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select 
                      value={formData.gender} 
                      onValueChange={(value) => handleSelectChange("gender", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Non-binary">Non-binary</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="race_ethnicity">Race/Ethnicity</Label>
                    <Select 
                      value={formData.race_ethnicity} 
                      onValueChange={(value) => handleSelectChange("race_ethnicity", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select race/ethnicity" />
                      </SelectTrigger>
                      <SelectContent>
                        {RACE_ETHNICITY_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="secondary_race">Secondary Race/Ethnicity (if applicable)</Label>
                    <Select 
                      value={formData.secondary_race} 
                      onValueChange={(value) => handleSelectChange("secondary_race", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select secondary race/ethnicity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=" ">None</SelectItem>
                        {RACE_ETHNICITY_OPTIONS.filter(option => option !== formData.race_ethnicity).map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Address Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5 text-blue-500" />
                  Address Information
                </CardTitle>
                <CardDescription>Residential and mailing address details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <AddressAutocomplete onAddressSelect={handleAddressAutocomplete} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address_line1">Street Address Line 1</Label>
                    <Input 
                      id="address_line1" 
                      name="address_line1" 
                      value={formData.address_line1} 
                      onChange={handleInputChange}
                      placeholder="Street address, P.O. box, company name"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address_line2">Street Address Line 2</Label>
                    <Input 
                      id="address_line2" 
                      name="address_line2" 
                      value={formData.address_line2} 
                      onChange={handleInputChange}
                      placeholder="Apartment, suite, unit, building, floor, etc."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city" 
                      name="city" 
                      value={formData.city} 
                      onChange={handleInputChange}
                      placeholder="City"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select 
                      value={formData.state} 
                      onValueChange={(value) => handleSelectChange("state", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {US_STATES.map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="zip_code">ZIP Code</Label>
                    <Input 
                      id="zip_code" 
                      name="zip_code" 
                      value={formData.zip_code} 
                      onChange={handleInputChange}
                      placeholder="ZIP code"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                  Professional Information
                </CardTitle>
                <CardDescription>Certification and experience details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="certification_level">Certification Level</Label>
                    <CertificationSelector 
                      value={formData.certification_level}
                      onChange={(value) => handleSelectChange("certification_level", value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="certification_number">Provider-issued ID Number</Label>
                    <Input 
                      id="certification_number" 
                      name="certification_number" 
                      value={formData.certification_number} 
                      onChange={handleInputChange}
                      placeholder="If different than patch number"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="certification_expiry">Certification Expiry Date</Label>
                    <div className="relative">
                      <Popover open={isCertExpiryOpen} onOpenChange={setIsCertExpiryOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !certificationExpiry && "text-muted-foreground"
                            )}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {certificationExpiry ? format(certificationExpiry, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={certificationExpiry}
                            onSelect={handleCertExpiryChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {certificationExpiry && 
                        new Date(certificationExpiry) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) && (
                        <Badge variant="destructive" className="mt-2">
                          Expires soon
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="years_experience">Years of Experience</Label>
                    <Input 
                      id="years_experience" 
                      name="years_experience" 
                      type="number"
                      value={formData.years_experience.toString()}
                      onChange={handleInputChange}
                      placeholder="Years of experience"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-500" />
                  Contact Information
                </CardTitle>
                <CardDescription>Contact details and emergency contacts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <AtSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        name="email" 
                        type="email"
                        className="pl-8"
                        value={formData.email} 
                        onChange={handleInputChange}
                        placeholder="Email address"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Phone</Label>
                    <Input 
                      id="mobile" 
                      name="mobile" 
                      value={formData.mobile} 
                      onChange={handleInputChange}
                      placeholder="Mobile phone number"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="home_phone">Home Phone</Label>
                    <Input 
                      id="home_phone" 
                      name="home_phone" 
                      value={formData.home_phone} 
                      onChange={handleInputChange}
                      placeholder="Home phone number"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="work_phone">Work Phone</Label>
                    <Input 
                      id="work_phone" 
                      name="work_phone" 
                      value={formData.work_phone} 
                      onChange={handleInputChange}
                      placeholder="Work phone number"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
                    <Input 
                      id="emergency_contact_name" 
                      name="emergency_contact_name" 
                      value={formData.emergency_contact_name} 
                      onChange={handleInputChange}
                      placeholder="Emergency contact name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
                    <Input 
                      id="emergency_contact_phone" 
                      name="emergency_contact_phone" 
                      value={formData.emergency_contact_phone} 
                      onChange={handleInputChange}
                      placeholder="Emergency contact phone"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label>Preferred Contact Method</Label>
                    <ToggleGroup 
                      type="single" 
                      value={formData.preferred_contact_method}
                      onValueChange={(value) => {
                        if (value) handleSelectChange("preferred_contact_method", value);
                      }}
                      className="justify-start"
                    >
                      <ToggleGroupItem value="mobile">
                        Mobile
                      </ToggleGroupItem>
                      <ToggleGroupItem value="email">
                        Email
                      </ToggleGroupItem>
                      <ToggleGroupItem value="home">
                        Home
                      </ToggleGroupItem>
                      <ToggleGroupItem value="work">
                        Work
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Consents and Agreements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-blue-500" />
                  Consents and Agreements
                </CardTitle>
                <CardDescription>Required consents for employment</CardDescription>
              </CardHeader>
              <CardContent>
                <PrivacyConsentForm 
                  consentToBackgroundCheck={formData.consent_to_background_check}
                  consentToDrugTesting={formData.consent_to_drug_testing}
                  onBackgroundCheckChange={(checked) => handleSwitchChange("consent_to_background_check", checked)}
                  onDrugTestingChange={(checked) => handleSwitchChange("consent_to_drug_testing", checked)}
                />
              </CardContent>
            </Card>
            
            <div className="flex justify-end space-x-4">
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </TabsContent>
  );
}
