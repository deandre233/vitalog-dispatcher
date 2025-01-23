import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const { metrics } = await req.json();
    console.log('Analyzing metrics:', metrics);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an advanced medical billing AI analyst. Analyze billing metrics and provide detailed insights in this structured format:
            1. Key Performance Indicators (KPIs):
               - Analysis of current metrics
               - Benchmarks comparison
               - Trends and patterns
               - Areas needing attention
            
            2. Workflow Efficiency Analysis:
               - Process bottlenecks
               - Resource utilization
               - Staff productivity metrics
               - Automation opportunities
            
            3. Revenue Cycle Insights:
               - Collection rates
               - Days in AR
               - Denial patterns
               - Payment velocity
            
            4. Risk Alerts:
               - Compliance issues
               - Deadline warnings
               - Missing documentation
               - Financial risks
            
            5. Optimization Recommendations:
               - Process improvements
               - Revenue opportunities
               - Cost reduction strategies
               - Technology adoption suggestions
            
            Keep insights data-driven, actionable, and focused on improving financial performance.`
          },
          {
            role: "user",
            content: `Analyze these billing metrics and provide structured insights: ${JSON.stringify(metrics)}`
          }
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    console.log('AI Analysis Response:', data);

    // Process the response to ensure it's properly structured
    const insights = data.choices[0].message.content;
    const sections = insights.split('\n\n').map(section => section.trim());

    // Add detailed metrics and benchmarks
    const enrichedSections = sections.map(section => {
      const title = section.split('\n')[0];
      const content = section.split('\n').slice(1).join('\n');
      
      return {
        title: title.replace(/^\d+\.\s+/, '').trim(),
        content: content,
        metrics: generateMetricsForSection(title, metrics),
        benchmarks: generateBenchmarksForSection(title),
        recommendations: generateRecommendationsForSection(title, metrics),
      };
    });

    return new Response(JSON.stringify({ 
      insights,
      sections: enrichedSections,
      timestamp: new Date().toISOString(),
      metrics_analyzed: Object.keys(metrics).length,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-billing function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

function generateMetricsForSection(title: string, metrics: any) {
  // Add specific metrics based on the section
  switch (title) {
    case 'Key Performance Indicators (KPIs)':
      return {
        revenue_per_claim: calculateAverageRevenue(metrics),
        claims_processed: metrics.masterQueue?.value || 0,
        denial_rate: calculateDenialRate(metrics),
        average_reimbursement: calculateAverageReimbursement(metrics),
      };
    case 'Workflow Efficiency Analysis':
      return {
        processing_time: calculateProcessingTime(metrics),
        backlog_rate: calculateBacklogRate(metrics),
        staff_productivity: calculateStaffProductivity(metrics),
        automation_rate: calculateAutomationRate(metrics),
      };
    case 'Revenue Cycle Insights':
      return {
        days_in_ar: calculateDaysInAR(metrics),
        collection_rate: calculateCollectionRate(metrics),
        clean_claim_rate: calculateCleanClaimRate(metrics),
        payment_velocity: calculatePaymentVelocity(metrics),
      };
    case 'Risk Alerts':
      return {
        compliance_score: calculateComplianceScore(metrics),
        risk_level: calculateRiskLevel(metrics),
        deadline_proximity: calculateDeadlineProximity(metrics),
        documentation_completeness: calculateDocumentationCompleteness(metrics),
      };
    case 'Optimization Recommendations':
      return {
        potential_savings: calculatePotentialSavings(metrics),
        revenue_opportunity: calculateRevenueOpportunity(metrics),
        efficiency_gain: calculateEfficiencyGain(metrics),
        roi_estimate: calculateROIEstimate(metrics),
      };
    default:
      return {};
  }
}

function generateBenchmarksForSection(title: string) {
  // Add industry benchmarks based on the section
  switch (title) {
    case 'Key Performance Indicators (KPIs)':
      return {
        industry_avg_revenue: '$1,200 per claim',
        optimal_denial_rate: '< 5%',
        target_clean_claim_rate: '> 95%',
        benchmark_processing_time: '< 48 hours',
      };
    case 'Workflow Efficiency Analysis':
      return {
        optimal_processing_time: '24-48 hours',
        target_backlog_rate: '< 10%',
        expected_productivity: '50-60 claims per day',
        industry_automation_rate: '60-70%',
      };
    case 'Revenue Cycle Insights':
      return {
        target_days_in_ar: '< 30 days',
        expected_collection_rate: '> 95%',
        industry_clean_claim_rate: '96%',
        optimal_payment_velocity: '< 14 days',
      };
    case 'Risk Alerts':
      return {
        compliance_threshold: '98%',
        acceptable_risk_level: 'Low to Medium',
        standard_documentation_rate: '> 99%',
        industry_error_rate: '< 3%',
      };
    case 'Optimization Recommendations':
      return {
        average_cost_reduction: '15-20%',
        typical_revenue_increase: '10-15%',
        standard_efficiency_gain: '25-30%',
        expected_roi: '3x-5x',
      };
    default:
      return {};
  }
}

function generateRecommendationsForSection(title: string, metrics: any) {
  // Generate specific recommendations based on metrics
  switch (title) {
    case 'Key Performance Indicators (KPIs)':
      return [
        'Implement real-time KPI tracking dashboard',
        'Set up automated alerts for metric deviations',
        'Establish daily metric review processes',
        'Create action plans for underperforming KPIs',
      ];
    case 'Workflow Efficiency Analysis':
      return [
        'Automate repetitive billing tasks',
        'Optimize staff scheduling based on volume',
        'Implement workflow monitoring tools',
        'Reduce manual data entry points',
      ];
    case 'Revenue Cycle Insights':
      return [
        'Enhance pre-submission claim verification',
        'Implement automated payment posting',
        'Optimize denial management workflow',
        'Improve patient payment processes',
      ];
    case 'Risk Alerts':
      return [
        'Strengthen compliance monitoring',
        'Implement proactive risk assessment',
        'Enhance documentation protocols',
        'Develop contingency plans',
      ];
    case 'Optimization Recommendations':
      return [
        'Invest in AI-powered claim scrubbing',
        'Implement predictive analytics',
        'Enhance staff training programs',
        'Upgrade billing technology stack',
      ];
    default:
      return [];
  }
}

// Helper functions for metric calculations
function calculateAverageRevenue(metrics: any) {
  return ((metrics.openInvoices?.value || 0) / (metrics.masterQueue?.value || 1)).toFixed(2);
}

function calculateDenialRate(metrics: any) {
  return (((metrics.exceptionQueue?.value || 0) / (metrics.masterQueue?.value || 1)) * 100).toFixed(2);
}

function calculateAverageReimbursement(metrics: any) {
  return ((metrics.openInvoices?.value || 0) / (metrics.masterQueue?.value || 1)).toFixed(2);
}

function calculateProcessingTime(metrics: any) {
  return Math.round((metrics.reviewQueue?.value || 0) / 10);
}

function calculateBacklogRate(metrics: any) {
  return (((metrics.reviewQueue?.value || 0) / (metrics.masterQueue?.value || 1)) * 100).toFixed(2);
}

function calculateStaffProductivity(metrics: any) {
  return Math.round((metrics.masterQueue?.value || 0) / 5);
}

function calculateAutomationRate(metrics: any) {
  return ((metrics.transmissionQueue?.value || 0) / (metrics.masterQueue?.value || 1) * 100).toFixed(2);
}

function calculateDaysInAR(metrics: any) {
  return Math.round((metrics.openInvoices?.value || 0) / 10);
}

function calculateCollectionRate(metrics: any) {
  return (((metrics.masterQueue?.value || 0) - (metrics.exceptionQueue?.value || 0)) / (metrics.masterQueue?.value || 1) * 100).toFixed(2);
}

function calculateCleanClaimRate(metrics: any) {
  return (((metrics.transmissionQueue?.value || 0) / (metrics.masterQueue?.value || 1)) * 100).toFixed(2);
}

function calculatePaymentVelocity(metrics: any) {
  return Math.round((metrics.openInvoices?.value || 0) / 15);
}

function calculateComplianceScore(metrics: any) {
  return (100 - ((metrics.exceptionQueue?.value || 0) / (metrics.masterQueue?.value || 1) * 100)).toFixed(2);
}

function calculateRiskLevel(metrics: any) {
  const riskScore = (metrics.exceptionQueue?.value || 0) / (metrics.masterQueue?.value || 1) * 100;
  if (riskScore < 5) return 'Low';
  if (riskScore < 10) return 'Medium';
  return 'High';
}

function calculateDeadlineProximity(metrics: any) {
  return Math.round((metrics.reviewQueue?.value || 0) / 5);
}

function calculateDocumentationCompleteness(metrics: any) {
  return (100 - ((metrics.missingDemographics?.value || 0) / (metrics.masterQueue?.value || 1) * 100)).toFixed(2);
}

function calculatePotentialSavings(metrics: any) {
  return Math.round((metrics.openInvoices?.value || 0) * 0.15);
}

function calculateRevenueOpportunity(metrics: any) {
  return Math.round((metrics.openInvoices?.value || 0) * 0.2);
}

function calculateEfficiencyGain(metrics: any) {
  return Math.round((1 - (metrics.exceptionQueue?.value || 0) / (metrics.masterQueue?.value || 1)) * 100);
}

function calculateROIEstimate(metrics: any) {
  return ((calculateRevenueOpportunity(metrics) / calculatePotentialSavings(metrics)) * 100).toFixed(2);
}