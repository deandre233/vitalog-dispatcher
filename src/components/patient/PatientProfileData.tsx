import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PatientProfileProps {
  patientId: string;
  initialData: {
    firstName: string;
    lastName: string;
    dob: string;
    gender: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  onSave: (data: any) => void;
  isEditing: boolean;
}

export const PatientProfileData = ({ 
  patientId, 
  initialData, 
  onSave,
  isEditing 
}: PatientProfileProps) => {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState(initialData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!patientId) {
      toast({
        title: "Error",
        description: "No patient ID available",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('patients')
        .update({
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          dob: profileData.dob,
          gender: profileData.gender,
          phone: profileData.phone,
          email: profileData.email,
          address: profileData.address,
          city: profileData.city,
          state: profileData.state,
          zip: profileData.zip,
        })
        .eq('id', patientId);

      if (error) {
        console.error('Error updating patient:', error);
        toast({
          title: "Error",
          description: "Failed to save patient data",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Patient profile updated successfully",
      });
      
      onSave(profileData);
    } catch (err) {
      console.error('Error in handleSave:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            value={profileData.firstName}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            value={profileData.lastName}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth</Label>
          <Input
            id="dob"
            name="dob"
            type="date"
            value={profileData.dob}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Input
            id="gender"
            name="gender"
            value={profileData.gender}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            value={profileData.phone}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={profileData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2 col-span-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            value={profileData.address}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={profileData.city}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            name="state"
            value={profileData.state}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zip">ZIP Code</Label>
          <Input
            id="zip"
            name="zip"
            value={profileData.zip}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
      </div>
      {isEditing && (
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave}>
            Save Profile
          </Button>
        </div>
      )}
    </Card>
  );
};