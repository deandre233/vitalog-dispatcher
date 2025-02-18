
import { AutocompleteInput } from "./AutocompleteInput";
import { Search } from "lucide-react";

interface SearchItem {
  id: string;
  type: 'dispatch' | 'patient' | 'crew';
  title: string;
  subtitle?: string;
}

// Mock data - in a real app, this would come from your backend
const searchItems: SearchItem[] = [
  { id: "1", type: "dispatch", title: "Dispatch #12345", subtitle: "Active" },
  { id: "2", type: "patient", title: "John Doe", subtitle: "DOB: 1980-01-01" },
  { id: "3", type: "crew", title: "Jane Smith", subtitle: "Paramedic" },
];

export function GlobalSearch() {
  const handleSelect = (item: SearchItem) => {
    console.log("Selected item:", item);
    // Here you would typically navigate to the appropriate page
    // based on the item type and id
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        <AutocompleteInput
          items={searchItems}
          onSelect={handleSelect}
          getDisplayValue={(item) => `${item.title}${item.subtitle ? ` - ${item.subtitle}` : ''}`}
          placeholder="Search dispatches, patients, or crew members..."
          className="pl-10 h-12"
        />
      </div>
    </div>
  );
}
