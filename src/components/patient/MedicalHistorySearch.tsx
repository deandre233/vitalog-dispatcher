import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Search, Plus, Loader2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"

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

    // Clear existing timeout
    if (searchTimeout) {
      window.clearTimeout(searchTimeout)
    }

    // Set new timeout for search
    if (value.length >= 2) {
      const timeout = window.setTimeout(() => {
        handleSearch(value)
      }, 300)
      setSearchTimeout(timeout as unknown as number)
    }
  }

  const handleAddMedication = async (medication: any) => {
    if (onMedicationAdd) {
      onMedicationAdd(medication)
      
      // If there are recommendations, show them
      if (medication.recommendations?.length > 0) {
        toast({
          title: "Recommended Medications",
          description: `Common complementary medications: ${medication.recommendations.map((m: any) => m.generic_name).join(', ')}`,
        })
      }
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
      <div className="flex gap-2">
        <Input
          placeholder="Start typing to search medical conditions (min 2 characters)..."
          value={searchTerm}
          onChange={handleSearchInputChange}
          className="flex-1"
        />
        {isProcessing && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
      </div>

      <ScrollArea className="h-[300px] border rounded-md p-4">
        {searchResults.map((result, index) => (
          <div key={index} className="py-2 border-b last:border-0">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">{result.code || result.generic_name}</h4>
                <p className="text-sm text-muted-foreground">
                  {result.description || result.medication_class}
                </p>
                {result.recommendations && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Common complementary medications:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {result.recommendations.map((rec: any, i: number) => (
                        <Badge key={i} variant="outline" className="cursor-pointer hover:bg-primary/10"
                          onClick={() => handleAddMedication(rec)}>
                          {rec.generic_name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => result.generic_name ? handleAddMedication(result) : onHistoryAdd(result)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}