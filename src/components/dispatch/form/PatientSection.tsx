
import { UserCircle2, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { type UseFormRegister, type UseFormWatch, type UseFormSetValue } from "react-hook-form";
import { type DispatchFormData } from "@/types/dispatch";

interface PatientSectionProps {
  register: UseFormRegister<DispatchFormData>;
  watch: UseFormWatch<DispatchFormData>;
  setValue: UseFormSetValue<DispatchFormData>;
  foundPatient: { id: string; first_name: string; last_name: string } | null;
  isSearchingPatient: boolean;
  handlePatientSearch: () => void;
  handleCreatePatient: () => void;
}

export function PatientSection({ 
  register, 
  watch, 
  setValue, 
  foundPatient, 
  isSearchingPatient, 
  handlePatientSearch, 
  handleCreatePatient 
}: PatientSectionProps) {
  return (
    <Card className="p-6 border-l-4 border-l-[#D946EF] bg-gradient-to-br from-white to-[#FFDEE2] shadow-lg hover:shadow-xl transition-all duration-300">
      <h3 className="text-lg font-semibold mb-4 text-[#D946EF] flex items-center gap-2">
        <UserCircle2 className="w-5 h-5" />
        Patient / Customer Information
      </h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="patient_last_name">Last Name</Label>
            <div className="relative">
              <Input
                id="patient_last_name"
                {...register("patient_last_name")}
                className="border-medical-secondary/30 focus:border-medical-secondary"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="patient_first_name">First Name</Label>
            <Input
              id="patient_first_name"
              {...register("patient_first_name")}
              className="border-medical-secondary/30 focus:border-medical-secondary"
            />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex-1">
            {foundPatient && (
              <Link 
                to={`/patient/${encodeURIComponent(`${foundPatient.last_name}, ${foundPatient.first_name} (PAT-${foundPatient.id.slice(0, 5)})`)}` }
                className="text-medical-secondary hover:text-medical-secondary/80 font-medium flex items-center gap-2"
              >
                <UserCircle2 className="w-4 h-4" />
                View {foundPatient.first_name} {foundPatient.last_name}'s Profile
              </Link>
            )}
          </div>
          <Button
            type="button"
            onClick={handlePatientSearch}
            disabled={isSearchingPatient}
            className="flex items-center gap-2 bg-medical-secondary text-white hover:bg-medical-secondary/90"
          >
            <Search className="w-4 h-4" />
            {isSearchingPatient ? "Searching..." : "Search Patient"}
          </Button>
        </div>
        <div className="space-y-2">
          <Label htmlFor="patient_dob">Date of Birth</Label>
          <Input
            id="patient_dob"
            type="date"
            {...register("patient_dob")}
            className="border-medical-secondary/30 focus:border-medical-secondary"
          />
        </div>
        {!foundPatient && (
          <>
            <p className="text-sm text-gray-500 italic">
              A new patient record will be created when you save this dispatch.
            </p>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCreatePatient}
              className="w-full bg-medical-highlight text-medical-primary hover:bg-medical-highlight/90"
            >
              Create Patient Record Now
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}
