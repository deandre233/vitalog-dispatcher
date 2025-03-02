import { format, addDays, addHours, isWeekend } from "date-fns";

export interface Employee {
  id: string;
  name: string;
  role: string;
  certifications: string[];
  preferredShifts: string[];
  availability: {
    daysOff: number[];  // 0-6 (Sunday-Saturday)
    timeRestrictions: { 
      day: number; 
      startHour: number; 
      endHour: number;
    }[];
  };
  limitations: {
    maxHoursPerWeek: number;
    maxConsecutiveDays: number;
  };
  performanceMetrics: {
    efficiencyScore: number;
    fatigueIndex: number;
    complianceScore: number;
  };
}

export interface Shift {
  id: string;
  startTime: Date;
  endTime: Date;
  role: string;
  certificationRequired: string[];
  location: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ScheduleRecommendation {
  employeeId: string;
  shiftId: string;
  compatibilityScore: number;
  reason: string[];
}

// Calculate employee-shift compatibility score
export function calculateCompatibilityScore(
  employee: Employee,
  shift: Shift
): number {
  let score = 100;
  const reasons: string[] = [];
  
  // Check certification requirements
  const hasCertification = shift.certificationRequired.every(cert => 
    employee.certifications.includes(cert)
  );
  
  if (!hasCertification) {
    score -= 100; // Immediate disqualification
    reasons.push("Missing required certification");
    return 0;
  }
  
  // Check role compatibility
  if (employee.role !== shift.role) {
    score -= 50;
    reasons.push("Role mismatch");
  }
  
  // Check day availability
  const shiftDay = shift.startTime.getDay();
  if (employee.availability.daysOff.includes(shiftDay)) {
    score -= 70;
    reasons.push("Employee prefers this day off");
  }
  
  // Check time restrictions
  const timeRestriction = employee.availability.timeRestrictions.find(r => r.day === shiftDay);
  if (timeRestriction) {
    const shiftStartHour = shift.startTime.getHours();
    const shiftEndHour = shift.endTime.getHours();
    
    if (shiftStartHour < timeRestriction.startHour || shiftEndHour > timeRestriction.endHour) {
      score -= 60;
      reasons.push("Outside of preferred hours");
    }
  }
  
  // Factor in performance metrics
  score += (employee.performanceMetrics.efficiencyScore - 50) / 10;
  
  // Factor in fatigue
  score -= employee.performanceMetrics.fatigueIndex / 5;
  
  // Adjust for weekend premium if applicable
  if (isWeekend(shift.startTime)) {
    score -= 10; // Slight penalty for weekend shifts
  }
  
  // Adjust for shift priority
  if (shift.priority === 'high') {
    // For high priority shifts, prioritize high performing employees
    score += employee.performanceMetrics.complianceScore / 10;
  }
  
  // Keep score within 0-100 range
  return Math.max(0, Math.min(100, score));
}

// Generate optimal schedule recommendations
export function generateScheduleRecommendations(
  employees: Employee[],
  shifts: Shift[]
): ScheduleRecommendation[] {
  const recommendations: ScheduleRecommendation[] = [];
  
  // Sort shifts by priority and start time
  const sortedShifts = [...shifts].sort((a, b) => {
    if (a.priority === 'high' && b.priority !== 'high') return -1;
    if (a.priority !== 'high' && b.priority === 'high') return 1;
    return a.startTime.getTime() - b.startTime.getTime();
  });
  
  // For each shift, find the best employee match
  for (const shift of sortedShifts) {
    const compatibilityScores = employees.map(employee => {
      const score = calculateCompatibilityScore(employee, shift);
      return {
        employeeId: employee.id,
        shiftId: shift.id,
        compatibilityScore: score,
        reason: score < 70 ? ["Low compatibility score"] : ["Good match"]
      };
    });
    
    // Sort by compatibility score
    const sortedScores = compatibilityScores.sort(
      (a, b) => b.compatibilityScore - a.compatibilityScore
    );
    
    // Add top recommendation
    if (sortedScores.length > 0 && sortedScores[0].compatibilityScore > 0) {
      recommendations.push(sortedScores[0]);
    }
  }
  
  return recommendations;
}

// Generate optimized weekly schedule
export function generateOptimizedSchedule(
  employees: Employee[],
  shiftTemplates: Partial<Shift>[],
  startDate: Date
): Shift[] {
  const schedule: Shift[] = [];
  
  // Generate shifts for next 7 days based on templates
  for (let day = 0; day < 7; day++) {
    const currentDate = addDays(startDate, day);
    
    for (const template of shiftTemplates) {
      // Create an actual shift from the template
      const shiftStart = new Date(currentDate);
      shiftStart.setHours(9, 0, 0, 0); // Default 9 AM start
      
      const shiftEnd = new Date(currentDate);
      shiftEnd.setHours(17, 0, 0, 0); // Default 5 PM end
      
      const shift: Shift = {
        id: `shift-${day}-${Math.random().toString(36).substring(7)}`,
        startTime: shiftStart,
        endTime: shiftEnd,
        role: template.role || 'general',
        certificationRequired: template.certificationRequired || [],
        location: template.location || 'main',
        priority: template.priority || 'medium'
      };
      
      schedule.push(shift);
    }
  }
  
  return schedule;
}

// Analyze schedule for coverage gaps
export function analyzeScheduleCoverage(
  schedule: Shift[],
  requiredCoverage: { [hour: string]: number }
): { [date: string]: { hour: number; required: number; actual: number; gap: number }[] } {
  const coverageAnalysis: { [date: string]: { hour: number; required: number; actual: number; gap: number }[] } = {};
  
  // Group shifts by date
  const shiftsByDate: { [date: string]: Shift[] } = {};
  
  for (const shift of schedule) {
    const dateStr = format(shift.startTime, 'yyyy-MM-dd');
    if (!shiftsByDate[dateStr]) {
      shiftsByDate[dateStr] = [];
    }
    shiftsByDate[dateStr].push(shift);
  }
  
  // Analyze coverage for each date
  for (const dateStr of Object.keys(shiftsByDate)) {
    const dateShifts = shiftsByDate[dateStr];
    coverageAnalysis[dateStr] = [];
    
    // Check each hour of the day
    for (let hour = 0; hour < 24; hour++) {
      const hourKey = `${hour}`;
      const required = requiredCoverage[hourKey] || 0;
      
      // Count shifts active during this hour
      let actual = 0;
      for (const shift of dateShifts) {
        const shiftStartHour = shift.startTime.getHours();
        const shiftEndHour = shift.endTime.getHours();
        
        if (hour >= shiftStartHour && hour < shiftEndHour) {
          actual++;
        }
      }
      
      const gap = required - actual;
      
      coverageAnalysis[dateStr].push({
        hour,
        required,
        actual,
        gap
      });
    }
  }
  
  return coverageAnalysis;
}

// Predict scheduling needs based on historical data
export function predictSchedulingNeeds(
  historicalData: { date: string; demand: number }[],
  seasonalFactors: { month: number; factor: number }[],
  specialEvents: { date: string; impact: number }[]
): { date: string; predictedDemand: number }[] {
  // This would implement a time series forecasting algorithm
  // For this example, we'll use a simple algorithm
  
  const predictions: { date: string; predictedDemand: number }[] = [];
  
  // Base prediction on average of historical data
  const averageDemand = historicalData.reduce((sum, item) => sum + item.demand, 0) / historicalData.length;
  
  // Generate predictions for next 30 days
  const startDate = new Date();
  
  for (let i = 0; i < 30; i++) {
    const predictionDate = addDays(startDate, i);
    const dateStr = format(predictionDate, 'yyyy-MM-dd');
    
    // Start with average demand
    let predictedDemand = averageDemand;
    
    // Apply seasonal factor
    const month = predictionDate.getMonth();
    const seasonalFactor = seasonalFactors.find(sf => sf.month === month)?.factor || 1;
    predictedDemand *= seasonalFactor;
    
    // Apply special event impact
    const specialEvent = specialEvents.find(e => e.date === dateStr);
    if (specialEvent) {
      predictedDemand += specialEvent.impact;
    }
    
    // Apply day of week factor (weekends have less demand)
    const dayOfWeek = predictionDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) { // weekend
      predictedDemand *= 0.8;
    }
    
    predictions.push({
      date: dateStr,
      predictedDemand: Math.round(predictedDemand)
    });
  }
  
  return predictions;
}
