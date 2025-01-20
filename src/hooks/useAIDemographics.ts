import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from '@/components/ui/use-toast'

interface PatientData {
  phone?: string
  email?: string
  zip?: string
  [key: string]: any
}

interface ValidationResult {
  isValid: boolean
  message?: string
}

export const useAIDemographics = (patientData: PatientData) => {
  const [isValidating, setIsValidating] = useState(false)

  const validateField = async (field: string, value: string): Promise<ValidationResult> => {
    setIsValidating(true)
    try {
      const { data, error } = await supabase.functions.invoke('analyze-demographics', {
        body: { field, value }
      })

      if (error) throw error

      if (!data.isValid) {
        toast({
          title: "Validation Warning",
          description: data.message,
          variant: "destructive"
        })
      }

      return data

    } catch (error) {
      console.error('Validation error:', error)
      return { isValid: true } // Fail open to not block user input
    } finally {
      setIsValidating(false)
    }
  }

  const handleZipCodeChange = async (zip: string) => {
    if (zip.length === 5) {
      try {
        const response = await fetch(`https://api.zippopotam.us/us/${zip}`)
        const data = await response.json()
        
        if (data.places?.[0]) {
          return {
            city: data.places[0]['place name'],
            state: data.places[0]['state abbreviation'],
            county: data.places[0].county || ''
          }
        }
      } catch (error) {
        console.error('Error fetching location data:', error)
      }
    }
    return null
  }

  return {
    validateField,
    handleZipCodeChange,
    isValidating
  }
}