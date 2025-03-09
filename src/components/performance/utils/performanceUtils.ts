
export const getScoreColor = (score: number) => {
  if (score >= 90) return "text-green-600";
  if (score >= 80) return "text-blue-600";
  if (score >= 70) return "text-amber-600";
  return "text-red-600";
};

export const getGradeColor = (grade: string) => {
  switch (grade) {
    case 'A': return "bg-green-100 text-green-800 border-green-300";
    case 'B': return "bg-blue-100 text-blue-800 border-blue-300";
    case 'C': return "bg-amber-100 text-amber-800 border-amber-300";
    case 'D': return "bg-orange-100 text-orange-800 border-orange-300";
    case 'F': return "bg-red-100 text-red-800 border-red-300";
    default: return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

export const getTrendBadge = (trend: string) => {
  if (trend.includes("Improved")) {
    return "bg-green-100 text-green-800 border-green-300";
  } else if (trend.includes("Declined")) {
    return "destructive";
  } else {
    return "outline";
  }
};

export const getSubjectDisplayName = (subject: string): string => {
  const subjectMap: Record<string, string> = {
    "general": "General Performance",
    "missed-punches": "Missed Time Clock Punches",
    "tardiness": "Tardiness",
    "inservice": "Inservice Attendance",
    "pcr-completion": "PCR Completion Time",
    "pcr-quality": "PCR Documentation Quality",
    "protocol-adherence": "Protocol Adherence",
    "vehicle-inspections": "Vehicle Inspection Compliance",
    "uniform-compliance": "Uniform Compliance",
    "attendance": "Shift Attendance",
    "patient-care": "Patient Care Quality"
  };
  
  return subjectMap[subject] || "General Performance";
};
