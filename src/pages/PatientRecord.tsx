import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type WarningKeys = "requiresOxygen" | "requiresIsolation" | "bariatric" | "dnrOrder";
type BarrierKeys = "hearing" | "physical" | "vision" | "cognitive" | "cultural" | "language" | "speech" | "alcohol" | "drug" | "unsupervised";

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
    dnrOrder: z.boolean(),
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
    unsupervised: z.boolean(),
  }),
  residenceFacility: z.string(),
  room: z.string(),
  medicalId: z.string(),
  barcode: z.string(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
  }),
  phone: z.object({
    home: z.string(),
    work: z.string(),
    mobile: z.string(),
  }),
  email: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export default function PatientRecord() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      dob: "",
      gender: "",
      race: "",
      ssn: "",
      travelType: "",
      warnings: {
        requiresOxygen: false,
        requiresIsolation: false,
        bariatric: false,
        dnrOrder: false,
      },
      barriers: {
        hearing: false,
        physical: false,
        vision: false,
        cognitive: false,
        cultural: false,
        language: false,
        speech: false,
        alcohol: false,
        drug: false,
        unsupervised: false,
      },
      residenceFacility: "",
      room: "",
      medicalId: "",
      barcode: "",
      address: {
        street: "",
        city: "",
        state: "",
        zip: "",
      },
      phone: {
        home: "",
        work: "",
        mobile: "",
      },
      email: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Patient Record</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Basic Information</h2>
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient ID</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
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
                      <Input {...field} />
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
                      <Input {...field} />
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="travelType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Travel Type</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Medical Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Medical Information</h2>
              <div className="space-y-2">
                <FormLabel>Warnings</FormLabel>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(form.getValues().warnings) as WarningKeys[]).map((key) => (
                    <FormField
                      key={key}
                      control={form.control}
                      name={`warnings.${key}` as const}
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value as boolean}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="!mt-0">{key}</FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>

              <section className="space-y-4">
                <h3 className="text-lg font-semibold">Barriers to EMS</h3>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(form.getValues().barriers) as BarrierKeys[]).map((key) => (
                    <FormField
                      key={key}
                      control={form.control}
                      name={`barriers.${key}` as const}
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value as boolean}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="!mt-0">{key}</FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Contact Information</h2>
            <FormField
              control={form.control}
              name="address.street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input {...field} />
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
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone.home"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Home Phone</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input {...field} />
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
                    <Input {...field} />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit">Save Patient Record</Button>
        </form>
      </Form>
    </div>
  );
}
