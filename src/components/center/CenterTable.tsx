import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Check } from "lucide-react";
import { Center } from "@/pages/CenterList";

interface CenterTableProps {
  centers: Center[];
}

export function CenterTable({ centers }: CenterTableProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEfficiencyColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30px]"></TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Floor/Rm</TableHead>
            <TableHead>Street Address</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Zone</TableHead>
            <TableHead>Telephone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Efficiency</TableHead>
            <TableHead>Dispatches</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {centers.map((center) => (
            <TableRow key={center.id} className="hover:bg-medical-highlight/50">
              <TableCell>
                <Check className="h-4 w-4 text-green-500" />
              </TableCell>
              <TableCell className="font-mono text-sm">{center.id.slice(0, 8)}</TableCell>
              <TableCell className="font-medium">{center.name}</TableCell>
              <TableCell>{center.type}</TableCell>
              <TableCell>N/A</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{center.address}</span>
                </div>
              </TableCell>
              <TableCell>{center.city}</TableCell>
              <TableCell>{center.state}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <a href={`tel:${center.phone}`} className="text-blue-500 hover:text-blue-700">
                    <Phone className="h-4 w-4" />
                  </a>
                  <a href={`mailto:${center.email}`} className="text-blue-500 hover:text-blue-700">
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(center.status)}>{center.status}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={getEfficiencyColor(center.efficiency_score)}>
                  {center.efficiency_score}%
                </Badge>
              </TableCell>
              <TableCell className="font-mono">{center.dispatch_count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}