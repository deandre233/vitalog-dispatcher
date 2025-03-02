
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  medicalRecordNumber?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  address?: string;
  phoneNumber?: string;
  emergencyContact?: string;
  notes?: string;
}

export interface Transport {
  id: string;
  patientId: string;
  pickupLocation: string;
  dropoffLocation: string;
  scheduledTime: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'routine' | 'urgent' | 'emergency';
  notes?: string;
  crewAssigned?: string[];
}

export interface Crew {
  id: string;
  name: string;
  role: 'driver' | 'emt' | 'paramedic' | 'nurse';
  status: 'available' | 'on-duty' | 'off-duty';
  certifications: string[];
  shifts?: Shift[];
}

export interface Shift {
  id: string;
  crewId: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'missed';
}

export interface Facility {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  type: 'hospital' | 'nursing-home' | 'clinic' | 'residence' | 'other';
  notes?: string;
}

export interface Billing {
  id: string;
  transportId: string;
  insuranceProvider: string;
  insuranceNumber: string;
  status: 'pending' | 'submitted' | 'approved' | 'denied' | 'paid';
  amount: number;
  submittedDate?: string;
  paidDate?: string;
  notes?: string;
}
