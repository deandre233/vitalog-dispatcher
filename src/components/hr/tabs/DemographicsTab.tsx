
import { useState } from "react";
import { Employee } from "@/types/employee";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UseMutationResult } from "@tanstack/react-query";
import { AddressAutocomplete } from "../demographics/AddressAutocomplete";
import { DemographicsSummary } from "../demographics/DemographicsSummary";
import { MapPin, Calendar, User, Phone, Mail, Flag } from "lucide-react";

interface DemographicsTabProps {
  employee: Employee | undefined;
  isLoading: boolean;
  onSave: UseMutationResult<void, Error, Partial<Employee>, unknown>["mutate"];
}

export function DemographicsTab({ employee, isLoading, onSave }: DemographicsTabProps) {
  const [formValues, setFormValues] = useState<Partial<Employee>>({
    date_of_birth: employee?.date_of_birth || "",
    gender: employee?.gender || "",
    address_line1: employee?.address_line1 || "",
    address_line2: employee?.address_line2 || "",
    city: employee?.city || "",
    state: employee?.state || "",
    zip_code: employee?.zip_code || "",
    race_ethnicity: employee?.race_ethnicity || "",
    secondary_race: employee?.secondary_race || "",
    citizenship: employee?.citizenship || "",
    certification_expiry: employee?.certification_expiry || "",
    years_experience: employee?.years_experience || 0,
    email: employee?.email || "",
    home_phone: employee?.home_phone || "",
    work_phone: employee?.work_phone || "",
    mobile: employee?.mobile || "",
    emergency_contact_name: employee?.emergency_contact_name || "",
    emergency_contact_phone: employee?.emergency_contact_phone || "",
    preferred_contact_method: employee?.preferred_contact_method || "",
  });

  const handleInputChange = (field: keyof typeof formValues, value: any) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formValues);
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
    
    return age;
  };

  return (
    <TabsContent value="demographics" className="animate-in fade-in-50">
      <div className="p-4 md:p-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Panel - Form Fields */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-medical-secondary" />
                  Demographics Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-5">
                  {/* Address Section */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Address Information</h3>
                    
                    <div className="grid gap-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <Label htmlFor="address_line1" className="text-right text-xs">Street address:</Label>
                        </div>
                        <AddressAutocomplete
                          onAddressSelect={(address) => {
                            setFormValues((prev) => ({
                              ...prev,
                              address_line1: address.addressLine1,
                              city: address.city,
                              state: address.state,
                              zip_code: address.zipCode,
                            }));
                          }}
                          currentAddress={{
                            addressLine1: formValues.address_line1 || "",
                            city: formValues.city || "",
                            state: formValues.state || "",
                            zipCode: formValues.zip_code || "",
                          }}
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <Label htmlFor="address_line2" className="text-right text-xs">Address Line 2:</Label>
                        </div>
                        <Input
                          id="address_line2"
                          placeholder="Apartment, suite, unit, etc."
                          value={formValues.address_line2}
                          onChange={(e) => handleInputChange("address_line2", e.target.value)}
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-1">
                          <div className="flex justify-between mb-1">
                            <Label htmlFor="city" className="text-right text-xs">City:</Label>
                          </div>
                          <Input
                            id="city"
                            placeholder="City"
                            value={formValues.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                          />
                        </div>
                        
                        <div className="col-span-1">
                          <div className="flex justify-between mb-1">
                            <Label htmlFor="state" className="text-right text-xs">State:</Label>
                          </div>
                          <Select
                            value={formValues.state}
                            onValueChange={(value) => handleInputChange("state", value)}
                          >
                            <SelectTrigger id="state">
                              <SelectValue placeholder="State" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="AL">Alabama</SelectItem>
                              <SelectItem value="AK">Alaska</SelectItem>
                              <SelectItem value="AZ">Arizona</SelectItem>
                              <SelectItem value="AR">Arkansas</SelectItem>
                              <SelectItem value="CA">California</SelectItem>
                              <SelectItem value="CO">Colorado</SelectItem>
                              <SelectItem value="CT">Connecticut</SelectItem>
                              <SelectItem value="DE">Delaware</SelectItem>
                              <SelectItem value="FL">Florida</SelectItem>
                              <SelectItem value="GA">Georgia</SelectItem>
                              <SelectItem value="HI">Hawaii</SelectItem>
                              <SelectItem value="ID">Idaho</SelectItem>
                              <SelectItem value="IL">Illinois</SelectItem>
                              <SelectItem value="IN">Indiana</SelectItem>
                              <SelectItem value="IA">Iowa</SelectItem>
                              <SelectItem value="KS">Kansas</SelectItem>
                              <SelectItem value="KY">Kentucky</SelectItem>
                              <SelectItem value="LA">Louisiana</SelectItem>
                              <SelectItem value="ME">Maine</SelectItem>
                              <SelectItem value="MD">Maryland</SelectItem>
                              <SelectItem value="MA">Massachusetts</SelectItem>
                              <SelectItem value="MI">Michigan</SelectItem>
                              <SelectItem value="MN">Minnesota</SelectItem>
                              <SelectItem value="MS">Mississippi</SelectItem>
                              <SelectItem value="MO">Missouri</SelectItem>
                              <SelectItem value="MT">Montana</SelectItem>
                              <SelectItem value="NE">Nebraska</SelectItem>
                              <SelectItem value="NV">Nevada</SelectItem>
                              <SelectItem value="NH">New Hampshire</SelectItem>
                              <SelectItem value="NJ">New Jersey</SelectItem>
                              <SelectItem value="NM">New Mexico</SelectItem>
                              <SelectItem value="NY">New York</SelectItem>
                              <SelectItem value="NC">North Carolina</SelectItem>
                              <SelectItem value="ND">North Dakota</SelectItem>
                              <SelectItem value="OH">Ohio</SelectItem>
                              <SelectItem value="OK">Oklahoma</SelectItem>
                              <SelectItem value="OR">Oregon</SelectItem>
                              <SelectItem value="PA">Pennsylvania</SelectItem>
                              <SelectItem value="RI">Rhode Island</SelectItem>
                              <SelectItem value="SC">South Carolina</SelectItem>
                              <SelectItem value="SD">South Dakota</SelectItem>
                              <SelectItem value="TN">Tennessee</SelectItem>
                              <SelectItem value="TX">Texas</SelectItem>
                              <SelectItem value="UT">Utah</SelectItem>
                              <SelectItem value="VT">Vermont</SelectItem>
                              <SelectItem value="VA">Virginia</SelectItem>
                              <SelectItem value="WA">Washington</SelectItem>
                              <SelectItem value="WV">West Virginia</SelectItem>
                              <SelectItem value="WI">Wisconsin</SelectItem>
                              <SelectItem value="WY">Wyoming</SelectItem>
                              <SelectItem value="DC">District of Columbia</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="col-span-1">
                          <div className="flex justify-between mb-1">
                            <Label htmlFor="zip_code" className="text-right text-xs">ZIP:</Label>
                          </div>
                          <Input
                            id="zip_code"
                            placeholder="#####"
                            value={formValues.zip_code}
                            onChange={(e) => handleInputChange("zip_code", e.target.value)}
                            maxLength={10}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Personal Information</h3>
                    
                    <div className="grid gap-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <Label htmlFor="dob" className="text-right text-xs">Date of birth:</Label>
                          {formValues.date_of_birth && (
                            <span className="text-xs text-muted-foreground">
                              ({calculateAge(formValues.date_of_birth)} years old)
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            id="dob"
                            type="date"
                            className="flex-grow"
                            value={formValues.date_of_birth}
                            onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
                          />
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <Label htmlFor="citizenship" className="text-right text-xs">Citizenship:</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input 
                            id="citizenship"
                            placeholder="US"
                            value={formValues.citizenship}
                            onChange={(e) => handleInputChange("citizenship", e.target.value)}
                            className="flex-grow"
                          />
                          <Flag className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <Label htmlFor="gender" className="text-right text-xs">Gender:</Label>
                        </div>
                        <Select
                          value={formValues.gender}
                          onValueChange={(value) => handleInputChange("gender", value)}
                        >
                          <SelectTrigger id="gender">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="non-binary">Non-binary</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <Label htmlFor="race" className="text-right text-xs">Race:</Label>
                        </div>
                        <Select
                          value={formValues.race_ethnicity}
                          onValueChange={(value) => handleInputChange("race_ethnicity", value)}
                        >
                          <SelectTrigger id="race">
                            <SelectValue placeholder="Select race/ethnicity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="american-indian">American Indian or Alaska Native</SelectItem>
                            <SelectItem value="asian">Asian</SelectItem>
                            <SelectItem value="black">Black or African American</SelectItem>
                            <SelectItem value="hispanic">Hispanic or Latino</SelectItem>
                            <SelectItem value="native-hawaiian">Native Hawaiian or Pacific Islander</SelectItem>
                            <SelectItem value="white">White</SelectItem>
                            <SelectItem value="multiple">Two or More Races</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <Label htmlFor="secondary_race" className="text-right text-xs">Secondary Race:</Label>
                        </div>
                        <Select
                          value={formValues.secondary_race}
                          onValueChange={(value) => handleInputChange("secondary_race", value)}
                        >
                          <SelectTrigger id="secondary_race">
                            <SelectValue placeholder="Not recorded" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="not-recorded">Not recorded</SelectItem>
                            <SelectItem value="american-indian">American Indian or Alaska Native</SelectItem>
                            <SelectItem value="asian">Asian</SelectItem>
                            <SelectItem value="black">Black or African American</SelectItem>
                            <SelectItem value="hispanic">Hispanic or Latino</SelectItem>
                            <SelectItem value="native-hawaiian">Native Hawaiian or Pacific Islander</SelectItem>
                            <SelectItem value="white">White</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Certification */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Certification Information</h3>
                    
                    <div className="grid gap-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <Label htmlFor="certification_expiry" className="text-right text-xs">Certification Expiry:</Label>
                        </div>
                        <Input
                          id="certification_expiry"
                          type="date"
                          value={formValues.certification_expiry}
                          onChange={(e) => handleInputChange("certification_expiry", e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <Label htmlFor="years_experience" className="text-right text-xs">Years of Experience:</Label>
                        </div>
                        <Input
                          id="years_experience"
                          type="number"
                          value={formValues.years_experience?.toString() || "0"}
                          onChange={(e) => handleInputChange("years_experience", parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Contact Information</h3>
                    
                    <div className="grid gap-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <Label htmlFor="email" className="text-right text-xs">Other email:</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            id="email"
                            type="email"
                            placeholder="optional"
                            value={formValues.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="flex-grow"
                          />
                          <Mail className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          This email address is for your reference only.
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <Label htmlFor="home_phone" className="text-right text-xs">Home Phone:</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            id="home_phone"
                            placeholder="###-###-####"
                            value={formValues.home_phone}
                            onChange={(e) => handleInputChange("home_phone", e.target.value)}
                            className="flex-grow"
                          />
                          <span className="text-xs text-muted-foreground whitespace-nowrap">home</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <Label htmlFor="work_phone" className="text-right text-xs">Work Phone:</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            id="work_phone"
                            placeholder="###-###-####"
                            value={formValues.work_phone}
                            onChange={(e) => handleInputChange("work_phone", e.target.value)}
                            className="flex-grow"
                          />
                          <span className="text-xs text-muted-foreground whitespace-nowrap">work</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <Label htmlFor="mobile" className="text-right text-xs">Mobile Phone:</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            id="mobile"
                            placeholder="###-###-####"
                            value={formValues.mobile}
                            onChange={(e) => handleInputChange("mobile", e.target.value)}
                            className="flex-grow"
                          />
                          <span className="text-xs text-muted-foreground whitespace-nowrap">mobile</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <Label htmlFor="preferred_contact" className="text-right text-xs">Preferred Contact:</Label>
                        </div>
                        <Select
                          value={formValues.preferred_contact_method}
                          onValueChange={(value) => handleInputChange("preferred_contact_method", value)}
                        >
                          <SelectTrigger id="preferred_contact">
                            <SelectValue placeholder="Select preferred contact method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="home_phone">Home Phone</SelectItem>
                            <SelectItem value="work_phone">Work Phone</SelectItem>
                            <SelectItem value="mobile">Mobile</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Emergency Contact */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Emergency Contact</h3>
                    
                    <div className="grid gap-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <Label htmlFor="emergency_contact_name" className="text-right text-xs">Name:</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            id="emergency_contact_name"
                            value={formValues.emergency_contact_name}
                            onChange={(e) => handleInputChange("emergency_contact_name", e.target.value)}
                            className="flex-grow"
                          />
                          <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <Label htmlFor="emergency_contact_phone" className="text-right text-xs">Phone:</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            id="emergency_contact_phone"
                            placeholder="###-###-####"
                            value={formValues.emergency_contact_phone}
                            onChange={(e) => handleInputChange("emergency_contact_phone", e.target.value)}
                            className="flex-grow"
                          />
                          <Phone className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button onClick={handleSave} disabled={isLoading} className="w-full">
                      Save Demographics Information
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Panel - Summary */}
          <div>
            <DemographicsSummary 
              data={employee || {}} 
              onEdit={() => {}} 
              insights={0} 
            />
          </div>
        </div>
      </div>
    </TabsContent>
  );
}
