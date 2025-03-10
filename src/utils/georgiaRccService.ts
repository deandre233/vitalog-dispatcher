interface HospitalStatus {
  name: string;
  nedocsScore?: number;
  diversionStatus: 'Open' | 'Full' | 'Partial' | 'Unknown';
  lastUpdated: string;
  specialtyDiversions?: {
    trauma?: boolean;
    stroke?: boolean;
    cardiac?: boolean;
    pediatric?: boolean;
  };
  capacity?: {
    er?: number;
    icu?: number;
    med?: number;
  };
}

export const fetchHospitalStatus = async (hospitalName: string): Promise<HospitalStatus | null> => {
  // Due to CORS restrictions and the limitations of browser-based web scraping,
  // we cannot directly fetch data from georgiarcc.org in the browser.
  // In a production environment, this should be handled by:
  // 1. A backend proxy service that fetches the data
  // 2. A dedicated API provided by Georgia RCC
  // 3. A scheduled task that updates a database with the latest status
  
  console.warn('Using mock hospital status data - production implementation required');
  return mockHospitalStatus(hospitalName);
};

const mockHospitalStatus = (hospitalName: string): HospitalStatus => ({
  name: hospitalName,
  nedocsScore: Math.floor(Math.random() * 200),
  diversionStatus: ['Open', 'Full', 'Partial'][Math.floor(Math.random() * 3)] as HospitalStatus['diversionStatus'],
  lastUpdated: new Date().toISOString(),
  specialtyDiversions: {
    trauma: Math.random() > 0.5,
    stroke: Math.random() > 0.5,
    cardiac: Math.random() > 0.5,
    pediatric: Math.random() > 0.5,
  },
  capacity: {
    er: Math.floor(Math.random() * 100),
    icu: Math.floor(Math.random() * 100),
    med: Math.floor(Math.random() * 100),
  }
});

export const getNedocsLabel = (score: number): string => {
  if (score <= 20) return 'Normal';
  if (score <= 60) return 'Busy';
  if (score <= 100) return 'Overcrowded';
  if (score <= 140) return 'Severe';
  if (score <= 180) return 'Critical';
  return 'Disaster';
};

export const getNedocsColor = (score: number): string => {
  if (score <= 20) return 'text-green-600 bg-green-100';
  if (score <= 60) return 'text-blue-600 bg-blue-100';
  if (score <= 100) return 'text-yellow-600 bg-yellow-100';
  if (score <= 140) return 'text-orange-600 bg-orange-100';
  if (score <= 180) return 'text-red-600 bg-red-100';
  return 'text-purple-600 bg-purple-100';
};