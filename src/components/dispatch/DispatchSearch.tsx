
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DispatchSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function DispatchSearch({ value, onChange }: DispatchSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search dispatches..."
        className="pl-8"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
