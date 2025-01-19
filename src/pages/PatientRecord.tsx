import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Calendar, Phone, Mail, Barcode, AlertCircle, Building, FileText } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";

// Mock data - In a real app, this would come from an API
const patientData = {
  "Turner, Angela": {
    id: "12345",
    dob: "1967-08-17",
    gender: "Female",
    race: "Black or African American",
    ssn: "XXX-XX-1234",
    travelType: "Stretcher",
    warnings: {
      requiresOxygen: true,
      requiresIsolation: false,
      bariatric: false,
      dnrOrder: false
    },
    barriers: {
      hearing: true,
      physical: true,
      vision: false,
      cognitive: false,
      cultural: false,
      language: false,
      speech: false,
      alcohol: false,
      drug: false,
      unsupervised: false
    },
    residenceFacility: "CROSSING AT EASTLAKE",
    room: "205",
    medicalId: "2HD2-QU6-TU95",
    barcode: "",
    address: {
      street: "855 Fayetteville Rd Se",
      floor: "",
      city: "ATLANTA",
      state: "Georgia",
      zip: "30316-2925",
      county: "DeKalb"
    },
    phone: {
      home: "6788875912",
      work: "",
      mobile: ""
    },
    email: ""
  }
};

export default function PatientRecord() {
  const { patientName } = useParams();
  const navigate = useNavigate();
  const patient = patientData[patientName as keyof typeof patientData];
  const [isEditing, setIsEditing] = useState(false);

  if (!patient) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Patient not found</h2>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </Card>
      </div>
    );
  }

  const handleSave = () => {
    toast.success("Patient information updated successfully");
    setIsEditing(false);
  };

  return (
    <div className="p-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <h2 className="text-2xl font-semibold">Patient Record: {patientName}</h2>
          </div>
          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Cancel Edit" : "Edit Patient"}
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Demographics Section */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" /> Demographics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <FormItem>
                <FormLabel>Patient ID</FormLabel>
                <Input value={patient.id} readOnly={!isEditing} />
              </FormItem>
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Input value={patient.gender} readOnly={!isEditing} />
              </FormItem>
              <FormItem>
                <FormLabel>Race</FormLabel>
                <Input value={patient.race} readOnly={!isEditing} />
              </FormItem>
              <FormItem>
                <FormLabel>SSN</FormLabel>
                <Input value={patient.ssn} readOnly={!isEditing} type="password" />
              </FormItem>
            </div>
          </section>

          {/* Travel Details */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <AlertCircle className="h-5 w-5" /> Travel Details
            </h3>
            <FormItem>
              <FormLabel>Travel Type</FormLabel>
              <RadioGroup disabled={!isEditing} value={patient.travelType}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Stretcher" id="stretcher" />
                  <label htmlFor="stretcher">Stretcher</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Wheelchair" id="wheelchair" />
                  <label htmlFor="wheelchair">Wheelchair</label>
                </div>
              </RadioGroup>
            </FormItem>

            {/* Warnings */}
            <div className="space-y-2">
              <FormLabel>Warnings</FormLabel>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(patient.warnings).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox 
                      id={key} 
                      checked={value} 
                      disabled={!isEditing}
                    />
                    <label htmlFor={key}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Barriers to EMS */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold">Barriers to EMS</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(patient.barriers).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`barrier-${key}`} 
                    checked={value} 
                    disabled={!isEditing}
                  />
                  <label htmlFor={`barrier-${key}`}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </label>
                </div>
              ))}
            </div>
          </section>

          {/* Residence Facility */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Building className="h-5 w-5" /> Residence Facility
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <FormItem>
                <FormLabel>Facility Name</FormLabel>
                <Input value={patient.residenceFacility} readOnly={!isEditing} />
              </FormItem>
              <FormItem>
                <FormLabel>Room Number</FormLabel>
                <Input value={patient.room} readOnly={!isEditing} />
              </FormItem>
            </div>
          </section>

          {/* Medical Information */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" /> Medical Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <FormItem>
                <FormLabel>Medical ID</FormLabel>
                <Input value={patient.medicalId} readOnly={!isEditing} />
              </FormItem>
              <FormItem>
                <FormLabel>Barcode</FormLabel>
                <div className="flex gap-2">
                  <Input value={patient.barcode} readOnly={!isEditing} />
                  {isEditing && (
                    <Button variant="outline">
                      <Barcode className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </FormItem>
            </div>
          </section>

          {/* Contact Information */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Phone className="h-5 w-5" /> Contact Information
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <FormItem>
                <FormLabel>Home Phone</FormLabel>
                <Input value={patient.phone.home} readOnly={!isEditing} />
              </FormItem>
              <FormItem>
                <FormLabel>Work Phone</FormLabel>
                <Input value={patient.phone.work} readOnly={!isEditing} />
              </FormItem>
              <FormItem>
                <FormLabel>Mobile Phone</FormLabel>
                <Input value={patient.phone.mobile} readOnly={!isEditing} />
              </FormItem>
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <Input value={patient.email} readOnly={!isEditing} type="email" />
              </FormItem>
            </div>
          </section>

          {/* Address Information */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold">Address</h3>
            <div className="grid grid-cols-1 gap-4">
              <FormItem>
                <FormLabel>Street Address</FormLabel>
                <Input value={patient.address.street} readOnly={!isEditing} />
              </FormItem>
              <FormItem>
                <FormLabel>Floor/Room</FormLabel>
                <Input value={patient.address.floor} readOnly={!isEditing} />
              </FormItem>
              <div className="grid grid-cols-2 gap-4">
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <Input value={patient.address.city} readOnly={!isEditing} />
                </FormItem>
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <Input value={patient.address.state} readOnly={!isEditing} />
                </FormItem>
                <FormItem>
                  <FormLabel>ZIP Code</FormLabel>
                  <Input value={patient.address.zip} readOnly={!isEditing} />
                </FormItem>
                <FormItem>
                  <FormLabel>County</FormLabel>
                  <Input value={patient.address.county} readOnly={!isEditing} />
                </FormItem>
              </div>
            </div>
          </section>

          {isEditing && (
            <div className="flex justify-end gap-4 mt-6">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}