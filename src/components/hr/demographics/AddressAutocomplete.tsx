
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Search } from "lucide-react";

interface AddressAutocompleteProps {
  onAddressSelect: (addressData: any) => void;
  currentAddress: {
    addressLine1: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export function AddressAutocomplete({ onAddressSelect, currentAddress }: AddressAutocompleteProps) {
  const [searchValue, setSearchValue] = useState(currentAddress.addressLine1 || "");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Simulated address search - in a real app, this would use Google Maps or similar API
  const searchAddresses = (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    // Mock address suggestions - replace with actual API call
    const mockSuggestions = [
      {
        description: "123 Main St, Atlanta, GA 30303",
        place_id: "mock_place_1",
        structured_formatting: {
          main_text: "123 Main St",
          secondary_text: "Atlanta, GA 30303"
        },
        address_components: {
          street_number: "123",
          route: "Main St",
          locality: "Atlanta",
          administrative_area_level_1: "Georgia",
          postal_code: "30303"
        }
      },
      {
        description: "456 Peachtree St, Atlanta, GA 30308",
        place_id: "mock_place_2",
        structured_formatting: {
          main_text: "456 Peachtree St",
          secondary_text: "Atlanta, GA 30308"
        },
        address_components: {
          street_number: "456",
          route: "Peachtree St",
          locality: "Atlanta",
          administrative_area_level_1: "Georgia",
          postal_code: "30308"
        }
      },
      {
        description: "789 Piedmont Ave, Atlanta, GA 30309",
        place_id: "mock_place_3",
        structured_formatting: {
          main_text: "789 Piedmont Ave",
          secondary_text: "Atlanta, GA 30309"
        },
        address_components: {
          street_number: "789",
          route: "Piedmont Ave",
          locality: "Atlanta",
          administrative_area_level_1: "Georgia",
          postal_code: "30309"
        }
      }
    ];

    // Filter suggestions based on user input
    const filteredSuggestions = mockSuggestions.filter(
      suggestion => suggestion.description.toLowerCase().includes(query.toLowerCase())
    );
    
    setSuggestions(filteredSuggestions);
    setShowSuggestions(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    searchAddresses(value);
  };

  const handleSelectAddress = (suggestion: any) => {
    setSearchValue(suggestion.description);
    
    // Format the address data to match the expected format
    const addressData = {
      addressLine1: `${suggestion.address_components.street_number} ${suggestion.address_components.route}`,
      city: suggestion.address_components.locality,
      state: suggestion.address_components.administrative_area_level_1,
      zipCode: suggestion.address_components.postal_code
    };
    
    onAddressSelect(addressData);
    setShowSuggestions(false);
  };

  // Update searchValue when currentAddress changes
  useEffect(() => {
    if (currentAddress.addressLine1) {
      setSearchValue(currentAddress.addressLine1);
    }
  }, [currentAddress.addressLine1]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionRef.current && 
        !suggestionRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <div className="flex">
        <div className="relative flex-grow">
          <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={searchValue}
            onChange={handleInputChange}
            className="pl-8"
            placeholder="Enter address"
          />
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          className="ml-2"
          onClick={() => searchAddresses(searchValue)}
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <Card 
          ref={suggestionRef}
          className="absolute mt-1 w-full z-50 max-h-56 overflow-auto shadow-lg"
        >
          <div className="p-1">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.place_id}
                className="p-2 hover:bg-slate-100 cursor-pointer rounded"
                onClick={() => handleSelectAddress(suggestion)}
              >
                <div className="font-medium">{suggestion.structured_formatting.main_text}</div>
                <div className="text-sm text-muted-foreground">{suggestion.structured_formatting.secondary_text}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
