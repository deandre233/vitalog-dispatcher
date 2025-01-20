import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'

interface PatientInsightsProps {
  patientId: string
}

interface Analysis {
  completeness: {
    demographic: 'complete' | 'incomplete'
    contact: 'complete' | 'incomplete'
    insurance: 'complete' | 'incomplete'
    medical: 'complete' | 'incomplete'
  }
  suggestions: string[]
  warnings: string[]
}

export const PatientInsights = ({ patientId }: PatientInsightsProps) => {
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('analyze-demographics', {
          body: { patientId }
        })

        if (error) throw error
        setAnalysis(data)
      } catch (error) {
        console.error('Error fetching analysis:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (patientId) {
      fetchAnalysis()
    }
  }, [patientId])

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </Card>
    )
  }

  if (!analysis) return null

  return (
    <Card className="p-4 space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Info className="h-5 w-5" />
        Profile Insights
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Profile Completeness</h4>
          <div className="space-y-2">
            {Object.entries(analysis.completeness).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm capitalize">{key}</span>
                <Badge variant={value === 'complete' ? 'default' : 'secondary'}>
                  {value === 'complete' ? (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  ) : (
                    <AlertTriangle className="h-3 w-3 mr-1" />
                  )}
                  {value}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Suggestions & Warnings</h4>
          <div className="space-y-2">
            {analysis.warnings.map((warning, index) => (
              <div key={index} className="flex items-start gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{warning}</span>
              </div>
            ))}
            {analysis.suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start gap-2 text-muted-foreground">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{suggestion}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}