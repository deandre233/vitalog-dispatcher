
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface SummaryCardProps {
  icon: LucideIcon;
  title: string;
  iconColor?: string;
  children: ReactNode;
}

export function SummaryCard({ icon: Icon, title, iconColor = "text-blue-500", children }: SummaryCardProps) {
  return (
    <Card className="bg-slate-50/70">
      <CardHeader className="py-4">
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${iconColor}`} />
          <CardTitle className="text-md">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="py-0">
        {children}
      </CardContent>
    </Card>
  );
}
