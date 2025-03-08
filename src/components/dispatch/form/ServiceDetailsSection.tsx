
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type UseFormRegister, type UseFormWatch, type UseFormSetValue } from "react-hook-form";
import { type DispatchFormData } from "@/types/dispatch";

interface ServiceDetailsSectionProps {
  register: UseFormRegister<DispatchFormData>;
  watch: UseFormWatch<DispatchFormData>;
  setValue: UseFormSetValue<DispatchFormData>;
  serviceComplaints: string[];
  facilities: string[];
  affiliates: string[];
}

export function ServiceDetailsSection({ 
  register, 
  watch, 
  setValue,
  serviceComplaints,
  facilities,
  affiliates 
}: ServiceDetailsSectionProps) {
  const billToFacility = watch('bill_to_facility');
  const billToAffiliate = watch('bill_to_affiliate');

  return (
    <Card className="p-6 border-l-4 border-l-[#8B5CF6] bg-gradient-to-br from-white to-[#E5DEFF] shadow-lg hover:shadow-xl transition-all duration-300">
      <h3 className="text-lg font-semibold mb-4 text-[#8B5CF6]">Service Details</h3>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Service Type</Label>
              <Select onValueChange={(value) => register("service_type").onChange({ target: { value } })}>
                <SelectTrigger className="border-medical-secondary/30">
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WC">Wheelchair</SelectItem>
                  <SelectItem value="BLS">Basic Life Support</SelectItem>
                  <SelectItem value="ALS">Advanced Life Support</SelectItem>
                  <SelectItem value="MICU">Mobile ICU</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Service Complaint</Label>
              <Select onValueChange={(value) => register("service_complaint").onChange({ target: { value } })}>
                <SelectTrigger className="border-medical-secondary/30">
                  <SelectValue placeholder="Select complaint" />
                </SelectTrigger>
                <SelectContent>
                  {serviceComplaints.map((complaint) => (
                    <SelectItem key={complaint} value={complaint}>
                      {complaint}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority Level</Label>
              <RadioGroup 
                className="flex gap-4" 
                onValueChange={(value) => register("priority_level").onChange({ target: { value } })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Critical" id="critical" />
                  <Label htmlFor="critical" className="text-red-500">Critical</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Emergency" id="emergency" />
                  <Label htmlFor="emergency" className="text-orange-500">Emergency</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Lower acuity" id="lower-acuity" />
                  <Label htmlFor="lower-acuity" className="text-yellow-600">Lower Acuity</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Scheduled" id="scheduled" />
                  <Label htmlFor="scheduled" className="text-green-600">Scheduled</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox {...register("is_billable")} id="billable" />
              <Label htmlFor="billable">Service is Billable</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox {...register("requires_pcs")} id="pcs" />
              <Label htmlFor="pcs">PCS Documentation Required</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox {...register("bill_to_insurance")} id="bill-insurance" />
              <Label htmlFor="bill-insurance">Bill to Insurance</Label>
            </div>

            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <Checkbox {...register("bill_to_facility")} id="bill-facility" />
                <Label htmlFor="bill-facility">Bill to Facility</Label>
              </div>
              <Select 
                onValueChange={(value) => setValue('billing_facility', value)}
                disabled={!billToFacility}
              >
                <SelectTrigger className="w-[200px] border-medical-secondary/30">
                  <SelectValue placeholder="Select facility" />
                </SelectTrigger>
                <SelectContent>
                  {facilities.map((facility) => (
                    <SelectItem key={facility} value={facility}>
                      {facility}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <Checkbox {...register("bill_to_affiliate")} id="bill-affiliate" />
                <Label htmlFor="bill-affiliate">Bill to Affiliate</Label>
              </div>
              <Select 
                onValueChange={(value) => setValue('billing_affiliate', value)}
                disabled={!billToAffiliate}
              >
                <SelectTrigger className="w-[200px] border-medical-secondary/30">
                  <SelectValue placeholder="Select affiliate" />
                </SelectTrigger>
                <SelectContent>
                  {affiliates.map((affiliate) => (
                    <SelectItem key={affiliate} value={affiliate}>
                      {affiliate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox {...register("bill_to_patient")} id="bill-patient" />
              <Label htmlFor="bill-patient">Bill to Patient</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox {...register("cash_upfront")} id="cash-upfront" />
              <Label htmlFor="cash-upfront">Cash Payment Required Upfront</Label>
            </div>

            <div className="space-y-2 mt-4">
              <Label>Price Quote</Label>
              <Input 
                {...register("price_quote")}
                className="border-medical-secondary/30 focus:border-medical-secondary"
                placeholder="Enter price quote"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
