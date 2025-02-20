
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QueueCardProps {
  title: string;
  count: number;
  variant: 'active' | 'overdue' | 'auth' | 'request' | 'confirmation';
}

const variantStyles = {
  active: "bg-blue-700 hover:bg-blue-800",
  overdue: "bg-orange-600 hover:bg-orange-700",
  auth: "bg-red-800 hover:bg-red-900",
  request: "bg-purple-800 hover:bg-purple-900",
  confirmation: "bg-emerald-700 hover:bg-emerald-800",
};

export function QueueCard({ title, count, variant }: QueueCardProps) {
  return (
    <Card className={cn(
      "transition-all duration-200 cursor-pointer",
      "text-white text-center p-4",
      variantStyles[variant]
    )}>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-3xl font-bold">{count}</p>
    </Card>
  );
}
