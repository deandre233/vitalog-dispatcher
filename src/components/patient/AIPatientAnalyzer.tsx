
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, Zap, AlertTriangle, HeartPulse, Activity, Pill, AlarmClock } from "lucide-react";
import { toast } from "sonner";

interface AIPatientAnalyzerProps {
  patientId: string;
  medicalHistory?: any[];
  medications?: string[];
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: string;
    temperature?: string;
    respiratoryRate?: string;
  };
}

export function AIPatientAnalyzer({ 
  patientId, 
  medicalHistory = [], 
  medications = [],
  vitalSigns = {}
}: AIPatientAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);

  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    setProgress(0);
    setResults(null);
    
    // Simulate progressive loading
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 300);
    
    // Simulate AI analysis completion after a delay
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setIsAnalyzing(false);
      
      // Generate mock AI analysis results
      const mockResults = {
        riskAssessment: {
          level: Math.random() > 0.7 ? "medium" : "low",
          score: Math.floor(Math.random() * 30) + 70,
          factors: [
            "History of hypertension",
            medications.length > 3 ? "Multiple medication interactions possible" : "Medication regimen appears stable"
          ]
        },
        recommendations: [
          "Schedule follow-up appointment in 30 days",
          "Monitor blood pressure twice daily",
          "Consider lifestyle modifications for improved outcomes"
        ],
        medicationAnalysis: {
          interactions: Math.random() > 0.5 ? [
            "Potential moderate interaction between medication A and medication B",
            "Minor interaction detected between supplements and prescribed medications"
          ] : [],
          adherenceRisk: Math.random() > 0.7 ? "high" : "low",
          suggestions: [
            "Consider medication schedule adjustment to improve adherence",
            "Evaluate effectiveness of current pain management protocol"
          ]
        },
        predictiveInsights: [
          "Patient shows 85% similarity to successful treatment outcomes with similar profiles",
          "Recommended preventative screening based on demographic and risk factors"
        ]
      };
      
      setResults(mockResults);
      
      toast.success("Patient analysis complete", {
        description: "AI has generated insights based on the patient's medical data."
      });
    }, 3000);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-950/50 to-purple-950/30 border-purple-800/30 shadow-xl backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-6 w-6 text-purple-400" />
        <h3 className="text-xl font-semibold text-white">AI Patient Analyzer</h3>
      </div>
      
      {!isAnalyzing && !results && (
        <div className="mb-6">
          <p className="text-gray-300 mb-4">
            Use advanced AI to analyze this patient's medical history, medications, and vital signs to generate personalized insights and recommendations.
          </p>
          <Button 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            onClick={simulateAnalysis}
          >
            <Zap className="mr-2 h-4 w-4" />
            Run AI Analysis
          </Button>
        </div>
      )}
      
      {isAnalyzing && (
        <div className="space-y-4">
          <Progress value={progress} className="h-2 bg-indigo-950/70" />
          
          <div className="space-y-2 text-sm text-gray-400">
            <p className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-400 animate-pulse" />
              Analyzing patient medical history...
            </p>
            <p className="flex items-center gap-2">
              <Pill className="h-4 w-4 text-green-400 animate-pulse" />
              Evaluating medication interactions...
            </p>
            <p className="flex items-center gap-2">
              <HeartPulse className="h-4 w-4 text-red-400 animate-pulse" />
              Processing vital signs data...
            </p>
            <p className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-400 animate-pulse" />
              Generating personalized insights...
            </p>
          </div>
        </div>
      )}
      
      {results && (
        <div className="space-y-6">
          {/* Risk Assessment */}
          <div className="space-y-3">
            <h4 className="text-white font-medium flex items-center gap-2">
              <AlertTriangle className={`h-4 w-4 ${
                results.riskAssessment.level === "low" ? "text-green-400" : "text-yellow-400"
              }`} />
              Risk Assessment
            </h4>
            
            <div className="flex items-center gap-4 mb-2">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-indigo-950/50 border border-indigo-800/50">
                <span className="text-xl font-bold text-white">{results.riskAssessment.score}</span>
              </div>
              
              <div>
                <p className="text-sm text-gray-300">Risk Level:</p>
                <p className={`font-medium ${
                  results.riskAssessment.level === "low" ? "text-green-400" : "text-yellow-400"
                }`}>
                  {results.riskAssessment.level.toUpperCase()}
                </p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-300 mb-1">Risk Factors:</p>
              <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
                {results.riskAssessment.factors.map((factor: string, idx: number) => (
                  <li key={idx}>{factor}</li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Recommendations */}
          <div className="space-y-3">
            <h4 className="text-white font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-400" />
              Recommendations
            </h4>
            
            <ul className="text-sm text-gray-400 space-y-2">
              {results.recommendations.map((rec: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 p-2 bg-indigo-950/30 rounded-md">
                  <AlarmClock className="h-4 w-4 text-purple-400 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Medication Analysis */}
          <div className="space-y-3">
            <h4 className="text-white font-medium flex items-center gap-2">
              <Pill className="h-4 w-4 text-blue-400" />
              Medication Analysis
            </h4>
            
            {results.medicationAnalysis.interactions.length > 0 && (
              <div>
                <p className="text-sm text-yellow-400 mb-1">Potential Interactions:</p>
                <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
                  {results.medicationAnalysis.interactions.map((interaction: string, idx: number) => (
                    <li key={idx}>{interaction}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div>
              <p className="text-sm text-gray-300 mb-1">Adherence Risk:</p>
              <p className={`text-sm font-medium ${
                results.medicationAnalysis.adherenceRisk === "low" ? "text-green-400" : "text-red-400"
              }`}>
                {results.medicationAnalysis.adherenceRisk.toUpperCase()}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-300 mb-1">Suggestions:</p>
              <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
                {results.medicationAnalysis.suggestions.map((suggestion: string, idx: number) => (
                  <li key={idx}>{suggestion}</li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Run Again Button */}
          <Button 
            className="w-full bg-indigo-900/50 hover:bg-indigo-800 text-white border border-indigo-700/50"
            onClick={simulateAnalysis}
          >
            <Brain className="mr-2 h-4 w-4" />
            Run New Analysis
          </Button>
        </div>
      )}
    </Card>
  );
}
