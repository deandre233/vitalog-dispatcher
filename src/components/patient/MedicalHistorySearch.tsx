import { useState } from "react"
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
}

export function MedicalHistorySearch({ patientId, onHistoryAdd }: MedicalHistorySearchProps) {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [searchResults, setSearchResults] = useState<Array<{ code: string; description: string }>>([])

  const handleSearch = async () => {
    if (!searchTerm.trim()) return

    setIsProcessing(true)
    try {
      const { data, error } = await supabase.functions.invoke('analyze-medical-history', {
        body: { searchTerm }
      })

      if (error) throw error

      setSearchResults(data.results)
      toast({
        title: "Search Results",
        description: `Found ${data.results.length} matching conditions`,
      })
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

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search medical conditions or procedures..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Button 
          variant="secondary" 
          onClick={handleSearch}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4 mr-2" />
          )}
          Search
        </Button>
      </div>

      <ScrollArea className="h-[300px] border rounded-md p-4">
        {searchResults.map((result, index) => (
          <div key={index} className="py-2 border-b last:border-0">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">{result.code}</h4>
                <p className="text-sm text-muted-foreground">{result.description}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onHistoryAdd(result)}
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