
import { ReactNode } from "react";

interface InfoRowProps {
  label: string;
  value: ReactNode;
}

export function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="text-sm font-medium">{label}:</div>
      <div className="text-sm">{value}</div>
    </div>
  );
}

interface InfoGridProps {
  children: ReactNode;
}

export function InfoGrid({ children }: InfoGridProps) {
  return (
    <div className="space-y-2">
      {children}
    </div>
  );
}
