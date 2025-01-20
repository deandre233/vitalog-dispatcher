import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Search, Plus, Loader2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { Card } from "@/components/ui/card"

interface MedicalHistorySearchProps {
  patientId: string;
  onHistoryAdd: (history: { code: string; description: string }) => void;
  onMedicationAdd?: (medication: any) => void;
}

export function MedicalHistorySearch({ patientId, onHistoryAdd, onMedicationAdd }: MedicalHistorySearchProps) {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [searchResults, setSearchResults] = useState<Array<any>>([])
  const [searchTimeout, setSearchTimeout] = useState<number | null>(null)

  const handleSearch = async (term: string) => {
    if (!term.trim() || term.length < 2) {
      setSearchResults([])
      return
    }

    setIsProcessing(true)
    try {
      const { data, error } = await supabase.functions.invoke('analyze-medical-search', {
        body: { searchTerm: term, type: 'condition' }
      })

      if (error) throw error

      setSearchResults(data.results)
      if (data.results.length > 0) {
        toast({
          title: "Search Results",
          description: `Found ${data.results.length} matching conditions`,
        })
      }
    } catch (error) {
      console.error('Error searching:', error)
      toast({
        title: "Error",
        description: "Failed to search medical history",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)

    if (searchTimeout) {
      window.clearTimeout(searchTimeout)
    }

    if (value.length >= 2) {
      const timeout = window.setTimeout(() => {
        handleSearch(value)
      }, 300)
      setSearchTimeout(timeout as unknown as number)
    }
  }

  const handleAddMedication = async (medication: any) => {
    if (!patientId) {
      toast({
        title: "Error",
        description: "Patient ID is required to add medication",
        variant: "destructive",
      })
      return
    }

    if (onMedicationAdd) {
      onMedicationAdd(medication)
      
      if (medication.recommendations?.length > 0) {
        toast({
          title: "Recommended Medications",
          description: `Common complementary medications: ${medication.recommendations.map((m: any) => m.generic_name).join(', ')}`,
        })
      }
    }
  }

  const handleAddHistory = async (history: { code: string; description: string }) => {
    if (!patientId) {
      toast({
        title: "Error",
        description: "Patient ID is required to add medical history",
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase
        .from('medical_history')
        .insert({
          patient_id: patientId,
          type: 'condition',
          description: `${history.code} - ${history.description}`
        })

      if (error) throw error

      onHistoryAdd(history)
      toast({
        title: "Success",
        description: "Medical history has been added to the patient's record.",
      })
    } catch (error) {
      console.error('Error adding medical history:', error)
      toast({
        title: "Error",
        description: "Failed to add medical history",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        window.clearTimeout(searchTimeout)
      }
    }
  }, [searchTimeout])

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Input
            placeholder="Start typing to search medical conditions (min 2 characters)..."
            value={searchTerm}
            onChange={handleSearchInputChange}
            className="pl-10"
          />
          <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
        </div>
        {isProcessing && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
      </div>

      {searchResults.length > 0 && (
        <Card className="p-4 border shadow-sm">
          <ScrollArea className="h-[300px]">
            <div className="space-y-3">
              {searchResults.map((result, index) => (
                <div 
                  key={index} 
                  className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">
                          {result.code || result.generic_name}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 hover:bg-gray-100"
                          onClick={() => result.generic_name ? handleAddMedication(result) : handleAddHistory(result)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {result.description || result.medication_class}
                      </p>
                      {result.recommendations && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-muted-foreground">Common complementary medications:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {result.recommendations.map((rec: any, i: number) => (
                              <Badge 
                                key={i} 
                                variant="outline" 
                                className="text-xs cursor-pointer hover:bg-primary/10"
                                onClick={() => handleAddMedication(rec)}
                              >
                                {rec.generic_name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      )}
    </div>
  )
}