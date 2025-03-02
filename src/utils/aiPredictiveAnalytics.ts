
import { AIPrediction } from "@/types/ai-analytics";

export interface TransportPrediction {
  date: string;
  predictedVolume: number;
  actualVolume?: number;
  confidence: number;
  factors: {
    name: string;
    impact: number;
  }[];
}

export interface BillingPrediction {
  claimId: string;
  denialRisk: number;
  confidence: number;
  riskFactors: string[];
  recommendedActions: string[];
}

export interface ResourcePrediction {
  resourceType: string;
  predictedShortage: boolean;
  shortageDate?: string;
  confidence: number;
  recommendedActions: string[];
}

// Generate transport volume predictions
export function predictTransportVolume(
  historicalData: { date: string; volume: number }[],
  externalFactors: { date: string; factor: string; impact: number }[]
): TransportPrediction[] {
  // This function would implement a machine learning algorithm
  // For this example, we'll create some mock predictions
  
  const currentDate = new Date();
  const predictions: TransportPrediction[] = [];
  
  // Generate predictions for the next 7 days
  for (let i = 0; i < 7; i++) {
    const predictionDate = new Date(currentDate);
    predictionDate.setDate(predictionDate.getDate() + i);
    const dateStr = predictionDate.toISOString().split('T')[0];
    
    // Calculate base prediction (mock algorithm)
    const dayOfWeek = predictionDate.getDay();
    let baseVolume: number;
    
    // Weekend vs weekday pattern
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      baseVolume = Math.floor(Math.random() * 10) + 15; // 15-25 range for weekends
    } else {
      baseVolume = Math.floor(Math.random() * 15) + 25; // 25-40 range for weekdays
    }
    
    // Apply external factors
    const factors = externalFactors
      .filter(factor => factor.date === dateStr)
      .map(factor => ({
        name: factor.factor,
        impact: factor.impact
      }));
    
    // Apply impact of factors
    const volumeAdjustment = factors.reduce((sum, factor) => sum + factor.impact, 0);
    const predictedVolume = Math.max(0, baseVolume + volumeAdjustment);
    
    // Calculate confidence (farther in future = less confident)
    const confidence = Math.max(0.6, 0.95 - (i * 0.05));
    
    predictions.push({
      date: dateStr,
      predictedVolume: Math.round(predictedVolume),
      confidence,
      factors
    });
  }
  
  return predictions;
}

// Predict claims at risk of denial
export function predictClaimDenials(
  claims: {
    id: string;
    amount: number;
    service: string;
    documentation: string[];
    previousDenials: number;
  }[]
): BillingPrediction[] {
  const predictions: BillingPrediction[] = [];
  
  for (const claim of claims) {
    // Risk factors
    const riskFactors: string[] = [];
    
    // Documentation completeness check
    const requiredDocs = ['patient-consent', 'physician-order', 'medical-necessity'];
    const missingDocs = requiredDocs.filter(doc => !claim.documentation.includes(doc));
    
    if (missingDocs.length > 0) {
      riskFactors.push(`Missing documentation: ${missingDocs.join(', ')}`);
    }
    
    // Previous denial history
    if (claim.previousDenials > 0) {
      riskFactors.push(`Previous denial history (${claim.previousDenials} time(s))`);
    }
    
    // High value claim
    if (claim.amount > 1000) {
      riskFactors.push('High value claim (increased scrutiny)');
    }
    
    // Calculate denial risk
    let denialRisk = 0.1; // Base risk
    
    denialRisk += missingDocs.length * 0.2; // Each missing doc increases risk
    denialRisk += claim.previousDenials * 0.15; // Previous denials increase risk
    denialRisk += (claim.amount > 1000) ? 0.1 : 0; // High value increases risk
    
    // Cap at 0.95
    denialRisk = Math.min(0.95, denialRisk);
    
    // Generate recommended actions
    const recommendedActions: string[] = [];
    
    if (missingDocs.length > 0) {
      recommendedActions.push(`Obtain missing documentation: ${missingDocs.join(', ')}`);
    }
    
    if (claim.previousDenials > 0) {
      recommendedActions.push('Review previous denial reasons and address');
    }
    
    if (claim.amount > 1000) {
      recommendedActions.push('Ensure detailed documentation and justification for high-value service');
    }
    
    // Only include predictions for claims with significant risk
    if (denialRisk > 0.3) {
      predictions.push({
        claimId: claim.id,
        denialRisk,
        confidence: 0.85,
        riskFactors,
        recommendedActions
      });
    }
  }
  
  // Sort by risk (highest first)
  return predictions.sort((a, b) => b.denialRisk - a.denialRisk);
}

// Predict resource shortages
export function predictResourceShortages(
  currentInventory: { type: string; quantity: number; usageRate: number }[],
  upcomingDemand: { date: string; additionalDemand: { [resourceType: string]: number } }[]
): ResourcePrediction[] {
  const predictions: ResourcePrediction[] = [];
  
  // For each resource, predict if there will be a shortage
  for (const resource of currentInventory) {
    // Calculate how long current inventory will last at normal usage rate
    const daysRemaining = resource.quantity / resource.usageRate;
    
    // Check if upcoming demand will deplete resources faster
    let shortageDetected = false;
    let shortageDate = '';
    
    let remainingQuantity = resource.quantity;
    const currentDate = new Date();
    
    for (let i = 0; i < 30 && !shortageDetected; i++) {
      const checkDate = new Date(currentDate);
      checkDate.setDate(checkDate.getDate() + i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      // Subtract normal usage
      remainingQuantity -= resource.usageRate;
      
      // Subtract additional demand if any
      const demandForDate = upcomingDemand.find(d => d.date === dateStr);
      if (demandForDate && demandForDate.additionalDemand[resource.type]) {
        remainingQuantity -= demandForDate.additionalDemand[resource.type];
      }
      
      // Check for shortage
      if (remainingQuantity <= 0 && !shortageDetected) {
        shortageDetected = true;
        shortageDate = dateStr;
      }
    }
    
    // Generate recommendations
    const recommendedActions: string[] = [];
    
    if (shortageDetected) {
      recommendedActions.push(`Order additional ${resource.type} before ${shortageDate}`);
      recommendedActions.push(`Required order quantity: ${Math.ceil(resource.usageRate * 30)}`);
    } else if (daysRemaining < 14) {
      recommendedActions.push(`Monitor ${resource.type} levels closely`);
      recommendedActions.push(`Consider restocking within ${Math.floor(daysRemaining)} days`);
    }
    
    // Add prediction if there's a potential issue
    if (shortageDetected || daysRemaining < 14) {
      predictions.push({
        resourceType: resource.type,
        predictedShortage: shortageDetected,
        shortageDate: shortageDetected ? shortageDate : undefined,
        confidence: 0.9,
        recommendedActions
      });
    }
  }
  
  return predictions;
}

// Convert domain-specific predictions to AIPrediction format
export function convertToAIPredictions(
  transportPredictions: TransportPrediction[],
  billingPredictions: BillingPrediction[],
  resourcePredictions: ResourcePrediction[]
): AIPrediction[] {
  const predictions: AIPrediction[] = [];
  
  // Convert transport predictions
  for (const pred of transportPredictions) {
    if (pred.confidence > 0.75) {
      predictions.push({
        id: `transport-${pred.date}`,
        type: 'transport',
        confidence: pred.confidence,
        prediction: `Expected ${pred.predictedVolume} transports on ${pred.date}`,
        recommendation: pred.predictedVolume > 30 
          ? "Consider scheduling additional crews" 
          : "Regular staffing should be sufficient",
        createdAt: new Date().toISOString(),
        metadata: {
          predictedVolume: pred.predictedVolume,
          factors: pred.factors
        }
      });
    }
  }
  
  // Convert billing predictions
  for (const pred of billingPredictions) {
    if (pred.denialRisk > 0.5) {
      predictions.push({
        id: `billing-${pred.claimId}`,
        type: 'billing',
        confidence: pred.confidence,
        prediction: `Claim ${pred.claimId} has a ${Math.round(pred.denialRisk * 100)}% risk of denial`,
        recommendation: pred.recommendedActions[0] || "Review claim before submission",
        createdAt: new Date().toISOString(),
        metadata: {
          claimId: pred.claimId,
          denialRisk: pred.denialRisk,
          riskFactors: pred.riskFactors,
          recommendedActions: pred.recommendedActions
        }
      });
    }
  }
  
  // Convert resource predictions
  for (const pred of resourcePredictions) {
    predictions.push({
      id: `resource-${pred.resourceType}`,
      type: 'resource',
      confidence: pred.confidence,
      prediction: pred.predictedShortage 
        ? `${pred.resourceType} shortage predicted by ${pred.shortageDate}` 
        : `${pred.resourceType} levels need attention soon`,
      recommendation: pred.recommendedActions[0] || "Review inventory levels",
      createdAt: new Date().toISOString(),
      metadata: {
        resourceType: pred.resourceType,
        predictedShortage: pred.predictedShortage,
        shortageDate: pred.shortageDate,
        recommendedActions: pred.recommendedActions
      }
    });
  }
  
  return predictions;
}
