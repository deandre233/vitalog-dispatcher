
import { useState } from "react";
import { Employee } from "@/types/employee";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UseMutationResult } from "@tanstack/react-query";
import { AddressAutocomplete } from "../demographics/AddressAutocomplete";
import { DemographicsSummary } from "../demographics/DemographicsSummary";

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
    certification_number: employee?.certification_number || "",
    certification_expiry: employee?.certification_expiry || "",
    years_experience: employee?.years_experience || 0,
    email: employee?.email || "",
    home_phone: employee?.home_phone || "",
    work_phone: employee?.work_phone || "",
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

  return (
    <TabsContent value="demographics" className="mt-0 animate-in fade-in-50">
      <div className="p-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Summary Card */}
          <DemographicsSummary employee={employee} />

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="dob">Date of Birth</label>
                    <Input
                      id="dob"
                      type="date"
                      value={formValues.date_of_birth}
                      onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="gender">Gender</label>
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
                  <div className="grid gap-2">
                    <label htmlFor="race">Race/Ethnicity</label>
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
                  <div className="grid gap-2">
                    <label htmlFor="citizenship">Citizenship Status</label>
                    <Select
                      value={formValues.citizenship}
                      onValueChange={(value) => handleInputChange("citizenship", value)}
                    >
                      <SelectTrigger id="citizenship">
                        <SelectValue placeholder="Select citizenship status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us-citizen">U.S. Citizen</SelectItem>
                        <SelectItem value="permanent-resident">Permanent Resident</SelectItem>
                        <SelectItem value="work-visa">Work Visa</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AddressAutocomplete
                  onAddressSelected={(address) => {
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
                <div className="grid gap-2">
                  <label htmlFor="address_line2">Address Line 2</label>
                  <Input
                    id="address_line2"
                    value={formValues.address_line2}
                    onChange={(e) => handleInputChange("address_line2", e.target.value)}
                    placeholder="Apartment, suite, unit, etc."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certification */}
          <Card>
            <CardHeader>
              <CardTitle>Certification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="certification_number">Certification Number</label>
                  <Input
                    id="certification_number"
                    value={formValues.certification_number}
                    onChange={(e) => handleInputChange("certification_number", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="certification_expiry">Certification Expiry</label>
                  <Input
                    id="certification_expiry"
                    type="date"
                    value={formValues.certification_expiry}
                    onChange={(e) => handleInputChange("certification_expiry", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="years_experience">Years of Experience</label>
                  <Input
                    id="years_experience"
                    type="number"
                    value={formValues.years_experience?.toString() || "0"}
                    onChange={(e) => handleInputChange("years_experience", parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="email">Email</label>
                  <Input
                    id="email"
                    type="email"
                    value={formValues.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="home_phone">Home Phone</label>
                  <Input
                    id="home_phone"
                    value={formValues.home_phone}
                    onChange={(e) => handleInputChange("home_phone", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="work_phone">Work Phone</label>
                  <Input
                    id="work_phone"
                    value={formValues.work_phone}
                    onChange={(e) => handleInputChange("work_phone", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="preferred_contact">Preferred Contact Method</label>
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
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="emergency_contact_name">Name</label>
                  <Input
                    id="emergency_contact_name"
                    value={formValues.emergency_contact_name}
                    onChange={(e) => handleInputChange("emergency_contact_name", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="emergency_contact_phone">Phone</label>
                  <Input
                    id="emergency_contact_phone"
                    value={formValues.emergency_contact_phone}
                    onChange={(e) => handleInputChange("emergency_contact_phone", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-2 flex justify-end">
            <Button onClick={handleSave} disabled={isLoading}>
              Save Demographics Information
            </Button>
          </div>
        </div>
      </div>
    </TabsContent>
  );
}
