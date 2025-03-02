
import React from "react";
import { Badge } from "@/components/ui/badge";

export const getCapabilityDisplay = (capability: string) => {
  switch (capability) {
    case 'CPR':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">CPR</Badge>;
    case 'ACLS':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">ACLS</Badge>;
    case 'PALS':
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">PALS</Badge>;
    case 'BLS':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">BLS</Badge>;
    case 'EMT-B':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">EMT-B</Badge>;
    case 'EMT-P':
      return <Badge className="bg-red-100 text-red-800">EMT-P</Badge>;
    case 'PHTLS':
      return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">PHTLS</Badge>;
    default:
      return <Badge variant="outline">{capability}</Badge>;
  }
};

export const getRandomCapabilities = () => {
  const allCapabilities = ['CPR', 'ACLS', 'PALS', 'BLS', 'EMT-B', 'EMT-P', 'PHTLS'];
  const count = Math.floor(Math.random() * 5) + 1;
  const selectedCapabilities = [];
  for (let i = 0; i < count; i++) {
    const random = Math.floor(Math.random() * allCapabilities.length);
    selectedCapabilities.push(allCapabilities[random]);
  }
  return selectedCapabilities;
};

export const getRandomStatus = (): 'available' | 'on-duty' | 'off-duty' | 'on-break' => {
  const statuses = ['available', 'on-duty', 'off-duty', 'on-break'] as const;
  return statuses[Math.floor(Math.random() * statuses.length)];
};
