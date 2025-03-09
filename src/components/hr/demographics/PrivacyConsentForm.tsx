
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface PrivacyConsentFormProps {
  consentToBackgroundCheck: boolean;
  consentToDrugTesting: boolean;
  onBackgroundCheckChange: (checked: boolean) => void;
  onDrugTestingChange: (checked: boolean) => void;
}

export function PrivacyConsentForm({ 
  consentToBackgroundCheck, 
  consentToDrugTesting,
  onBackgroundCheckChange,
  onDrugTestingChange
}: PrivacyConsentFormProps) {
  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important Information</AlertTitle>
        <AlertDescription>
          The following consents are required for employment as an emergency medical service provider.
          Please review each statement carefully before providing your consent.
        </AlertDescription>
      </Alert>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Background Check Authorization</h3>
            <p className="text-sm text-muted-foreground mt-1">
              I understand and authorize the company to conduct a comprehensive background check,
              which may include verification of my employment history, education, criminal record,
              driving record, credit history, and other information related to my suitability for employment.
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="background-check" 
              checked={consentToBackgroundCheck} 
              onCheckedChange={onBackgroundCheckChange}
            />
            <Label htmlFor="background-check" className="font-medium">
              I consent to a background check
            </Label>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Drug and Alcohol Testing Consent</h3>
            <p className="text-sm text-muted-foreground mt-1">
              I understand that, as a condition of my employment, I may be required to submit to 
              drug and alcohol testing. This may include pre-employment, random, post-accident, reasonable 
              suspicion, and return-to-duty testing. I understand that refusing to submit to testing or 
              testing positive may result in disciplinary action, up to and including termination.
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="drug-testing" 
              checked={consentToDrugTesting} 
              onCheckedChange={onDrugTestingChange}
            />
            <Label htmlFor="drug-testing" className="font-medium">
              I consent to drug and alcohol testing
            </Label>
          </div>
        </div>
        
        <Separator />
        
        <div className="pt-2">
          <p className="text-sm text-muted-foreground">
            By providing these consents, you acknowledge that you have read and understood the statements above.
            These consents will remain in effect throughout your employment unless revoked in writing.
          </p>
        </div>
      </div>
    </div>
  );
}
