import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Form schema
const formSchema = z.object({
  id: z.string(),
  dob: z.string(),
  gender: z.string(),
  race: z.string(),
  ssn: z.string(),
  travelType: z.string(),
  warnings: z.object({
    requiresOxygen: z.boolean(),
    requiresIsolation: z.boolean(),
    bariatric: z.boolean(),
    dnrOrder: z.boolean()
  }),
  barriers: z.object({
    hearing: z.boolean(),
    physical: z.boolean(),
    vision: z.boolean(),
    cognitive: z.boolean(),
    cultural: z.boolean(),
    language: z.boolean(),
    speech: z.boolean(),
    alcohol: z.boolean(),
    drug: z.boolean(),
    unsupervised: z.boolean()
  }),
  residenceFacility: z.string(),
  room: z.string(),
  medicalId: z.string(),
  barcode: z.string(),
  address: z.object({
    street: z.string(),
    floor: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    county: z.string()
  }),
  phone: z.object({
    home: z.string(),
    work: z.string(),
    mobile: z.string()
  }),
  email: z.string().email().optional()
});

type FormValues = z.infer<typeof formSchema>;

export default function PatientRecord() {
  const { patientName } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
  });

  const onSubmit = (values: FormValues) => {
    toast.success("Patient information updated successfully");
    setIsEditing(false);
    console.log(values);
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Demographics Section */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" /> Demographics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient ID</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={!isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={!isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="race"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Race</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={!isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ssn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SSN</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={!isEditing} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            {/* Travel Details */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertCircle className="h-5 w-5" /> Travel Details
              </h3>
              <FormField
                control={form.control}
                name="travelType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Travel Type</FormLabel>
                    <FormControl>
                      <RadioGroup disabled={!isEditing} value={field.value} onValueChange={field.onChange}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Stretcher" id="stretcher" />
                          <label htmlFor="stretcher">Stretcher</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Wheelchair" id="wheelchair" />
                          <label htmlFor="wheelchair">Wheelchair</label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Warnings */}
              <div className="space-y-2">
                <FormLabel>Warnings</FormLabel>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(form.getValues().warnings).map(([key, value]) => (
                    <FormField
                      key={key}
                      control={form.control}
                      name={`warnings.${key}` as keyof FormValues}
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id={key} 
                            checked={field.value as boolean} 
                            onCheckedChange={field.onChange}
                            disabled={!isEditing}
                          />
                          <label htmlFor={key}>
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </label>
                        </div>
                      )}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Barriers to EMS */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold">Barriers to EMS</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(form.getValues().barriers).map(([key, value]) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={`barriers.${key}` as keyof FormValues}
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={`barrier-${key}`} 
                          checked={field.value as boolean} 
                          onCheckedChange={field.onChange}
                          disabled={!isEditing}
                        />
                        <label htmlFor={`barrier-${key}`}>
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </label>
                      </div>
                    )}
                  />
                ))}
              </div>
            </section>

            {/* Residence Facility */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Building className="h-5 w-5" /> Residence Facility
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="residenceFacility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facility Name</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={!isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="room"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Number</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={!isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            {/* Medical Information */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" /> Medical Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="medicalId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medical ID</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={!isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="barcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Barcode</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input {...field} readOnly={!isEditing} />
                        </FormControl>
                        {isEditing && (
                          <Button variant="outline">
                            <Barcode className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            {/* Contact Information */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Phone className="h-5 w-5" /> Contact Information
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="phone.home"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Home Phone</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={!isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone.work"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work Phone</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={!isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone.mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Phone</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={!isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={!isEditing} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            {/* Address Information */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold">Address</h3>
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="address.street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={!isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address.floor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Floor/Room</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={!isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="address.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly={!isEditing} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly={!isEditing} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address.zip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP Code</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly={!isEditing} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address.county"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>County</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly={!isEditing} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </section>

            {isEditing && (
              <div className="flex justify-end gap-4 mt-6">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        </Form>
      </Card>
    </div>
  );
}
