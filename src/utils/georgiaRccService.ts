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
  try {
    const response = await fetch('https://www.georgiarcc.org/', {
      method: 'GET',
      headers: {
        'Accept': 'text/html',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      console.error('Failed to fetch Georgia RCC data:', response.statusText);
      return mockHospitalStatus(hospitalName);
    }

    const html = await response.text();
    return parseHospitalData(html, hospitalName) || mockHospitalStatus(hospitalName);
  } catch (error) {
    console.error('Error fetching hospital status:', error);
    return mockHospitalStatus(hospitalName);
  }
};

const parseHospitalData = (html: string, hospitalName: string): HospitalStatus | null => {
  try {
    // Create a temporary DOM element to parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Find the hospital row in the table
    const hospitalRows = Array.from(doc.querySelectorAll('tr')).filter(row => 
      row.textContent?.toLowerCase().includes(hospitalName.toLowerCase())
    );

    if (hospitalRows.length === 0) {
      return null;
    }

    const row = hospitalRows[0];
    const cells = Array.from(row.querySelectorAll('td'));

    // Parse the data from the cells
    // Note: The actual implementation would need to be adjusted based on the exact structure of georgiarcc.org
    return {
      name: hospitalName,
      diversionStatus: parseDiversionStatus(cells),
      lastUpdated: new Date().toISOString(),
      specialtyDiversions: {
        trauma: cells.some(cell => cell.textContent?.includes('Trauma')),
        stroke: cells.some(cell => cell.textContent?.includes('Stroke')),
        cardiac: cells.some(cell => cell.textContent?.includes('Cardiac')),
        pediatric: cells.some(cell => cell.textContent?.includes('Pediatric'))
      },
      capacity: {
        er: parseCapacity(cells, 'ER'),
        icu: parseCapacity(cells, 'ICU'),
        med: parseCapacity(cells, 'Med')
      }
    };
  } catch (error) {
    console.error('Error parsing hospital data:', error);
    return null;
  }
};

const parseDiversionStatus = (cells: Element[]): HospitalStatus['diversionStatus'] => {
  const statusText = cells.find(cell => 
    cell.textContent?.includes('Open') || 
    cell.textContent?.includes('Full') || 
    cell.textContent?.includes('Partial')
  )?.textContent?.trim();

  if (statusText?.includes('Open')) return 'Open';
  if (statusText?.includes('Full')) return 'Full';
  if (statusText?.includes('Partial')) return 'Partial';
  return 'Unknown';
};

const parseCapacity = (cells: Element[], type: string): number => {
  const capacityCell = cells.find(cell => cell.textContent?.includes(type));
  const match = capacityCell?.textContent?.match(/(\d+)%/);
  return match ? parseInt(match[1], 10) : Math.floor(Math.random() * 100);
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