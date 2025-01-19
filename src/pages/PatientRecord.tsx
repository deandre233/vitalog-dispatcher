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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type WarningKeys = "requiresOxygen" | "requiresIsolation" | "bariatric" | "dnrOrder";
type BarrierKeys = "hearing" | "physical" | "vision" | "cognitive" | "cultural" | "language" | "speech" | "alcohol" | "drug" | "unsupervised";

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
      travelType: "stretcher", // Default value from image
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
        state: "Georgia", // Default value from image
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
    <div className="container mx-auto p-6 bg-[#f5f7fa]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Patient</h1>
        <div className="flex gap-2">
          <Button variant="outline">PDF</Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Travel Information</h2>
              <FormField
                control={form.control}
                name="travelType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usually travels by</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select travel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stretcher">Stretcher</SelectItem>
                        <SelectItem value="wheelchair">Wheelchair</SelectItem>
                        <SelectItem value="ambulatory">Ambulatory</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Warnings</h2>
              <div className="grid grid-cols-2 gap-4">
                {(Object.keys(form.getValues().warnings) as WarningKeys[]).map((key) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={`warnings.${key}` as const}
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Barriers to EMS</h2>
              <div className="grid grid-cols-2 gap-4 bg-[#e8f5e9] p-4 rounded-md">
                {(Object.keys(form.getValues().barriers) as BarrierKeys[]).map((key) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={`barriers.${key}` as const}
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="residenceFacility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Residence Facility</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="room"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="medicalId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medical ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="address.street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
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
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Georgia">Georgia</SelectItem>
                            {/* Add other states as needed */}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Save
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}