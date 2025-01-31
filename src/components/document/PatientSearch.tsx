import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

interface PatientSearchProps {
  onSelect: (patient: any) => void;
}

export function PatientSearch({ onSelect }: PatientSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const searchPatients = async () => {
      if (searchTerm.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`)
          .limit(10);

        if (error) throw error;
        setResults(data || []);
      } catch (error) {
        console.error('Error searching patients:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(searchPatients, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleSelect = (patient: any) => {
    onSelect(patient);
    setSearchTerm(`${patient.last_name}, ${patient.first_name}`);
    setShowResults(false);
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Search patients by name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
          />
          {isLoading && (
            <LoadingSpinner className="absolute right-2 top-2 h-5 w-5" />
          )}
        </div>
        <Button variant="secondary">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {showResults && (results.length > 0 || isLoading) && (
        <Card className="absolute z-50 w-full mt-1">
          <ScrollArea className="max-h-64">
            {results.map((patient) => (
              <div
                key={patient.id}
                className="p-2 hover:bg-accent cursor-pointer"
                onClick={() => handleSelect(patient)}
              >
                <div className="font-medium">
                  {patient.last_name}, {patient.first_name}
                </div>
                <div className="text-sm text-muted-foreground">
                  DOB: {patient.dob}
                </div>
              </div>
            ))}
          </ScrollArea>
        </Card>
      )}
    </div>
  );
}