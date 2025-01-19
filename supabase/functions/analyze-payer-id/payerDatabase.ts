// This is a simplified version of the payer database
// In production, this would be much more comprehensive
export const payerDatabase = [
  {
    payerId: "00001",
    carrierName: "Medicare",
    carrierType: "Medicare",
    policyType: "Medicare part B [MB]"
  },
  {
    payerId: "00002",
    carrierName: "Medicaid",
    carrierType: "Medicaid",
    policyType: "Medicaid [MC]"
  },
  {
    payerId: "00003",
    carrierName: "Blue Cross Blue Shield",
    carrierType: "Blue Cross",
    policyType: "Blue Cross [BL]"
  },
  {
    payerId: "00004",
    carrierName: "Aetna",
    carrierType: "Commercial",
    policyType: "Commercial Insurance [CI]"
  },
  {
    payerId: "00005",
    carrierName: "UnitedHealthcare",
    carrierType: "Commercial",
    policyType: "Commercial Insurance [CI]"
  },
  {
    payerId: "00006",
    carrierName: "Cigna",
    carrierType: "Commercial",
    policyType: "Commercial Insurance [CI]"
  },
  {
    payerId: "00007",
    carrierName: "Humana",
    carrierType: "Commercial",
    policyType: "Commercial Insurance [CI]"
  },
  {
    payerId: "00008",
    carrierName: "Kaiser Permanente",
    carrierType: "HMO",
    policyType: "Health Maint Organization [HM]"
  },
  {
    payerId: "00009",
    carrierName: "Anthem",
    carrierType: "Commercial",
    policyType: "Commercial Insurance [CI]"
  },
  {
    payerId: "00010",
    carrierName: "Veterans Affairs",
    carrierType: "VA",
    policyType: "Veteran Affairs [VA]"
  },
  // Common Medicare Advantage payer IDs
  {
    payerId: "32001",
    carrierName: "Medicare Advantage - UnitedHealthcare",
    carrierType: "Medicare",
    policyType: "Medicare part C [ME]"
  },
  {
    payerId: "32002",
    carrierName: "Medicare Advantage - Humana",
    carrierType: "Medicare",
    policyType: "Medicare part C [ME]"
  },
  // Common Blue Cross Blue Shield payer IDs
  {
    payerId: "84001",
    carrierName: "BCBS of Georgia",
    carrierType: "Blue Cross",
    policyType: "Blue Cross [BL]"
  },
  {
    payerId: "84002",
    carrierName: "BCBS of Florida",
    carrierType: "Blue Cross",
    policyType: "Blue Cross [BL]"
  },
  // Common Medicaid payer IDs
  {
    payerId: "77001",
    carrierName: "Georgia Medicaid",
    carrierType: "Medicaid",
    policyType: "Medicaid [MC]"
  },
  {
    payerId: "77002",
    carrierName: "Florida Medicaid",
    carrierType: "Medicaid",
    policyType: "Medicaid [MC]"
  },
  // Add more payer IDs as needed...
]