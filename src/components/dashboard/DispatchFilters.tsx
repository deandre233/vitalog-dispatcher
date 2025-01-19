interface DispatchFiltersProps {
  className?: string;
}

export function DispatchFilters({ className }: DispatchFiltersProps) {
  return (
    <div className={`flex gap-2 ${className}`}>
      <input type="date" className="px-3 py-1 border rounded-md" />
      <select className="px-3 py-1 border rounded-md">
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="enroute">En Route</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  );
}