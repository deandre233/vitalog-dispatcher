import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { format } from "date-fns";
import type { AuthorizationRequest } from "@/types/authorization";

interface AuthorizationTableProps {
  authorizations: AuthorizationRequest[];
  isLoading: boolean;
}

export const AuthorizationTable = ({ authorizations, isLoading }: AuthorizationTableProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'denied':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRemainingDays = (validThrough: string) => {
    const days = Math.ceil((new Date(validThrough).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document ID</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Valid On</TableHead>
              <TableHead>Valid Through</TableHead>
              <TableHead>Remaining</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {authorizations?.map((auth) => (
              <TableRow key={auth.id}>
                <TableCell className="font-medium">{auth.id}</TableCell>
                <TableCell>
                  {auth.patients?.first_name} {auth.patients?.last_name}
                </TableCell>
                <TableCell>{auth.service_type}</TableCell>
                <TableCell>{auth.destination_type}</TableCell>
                <TableCell>{auth.valid_from ? format(new Date(auth.valid_from), 'yyyy MMM dd') : '-'}</TableCell>
                <TableCell>{auth.valid_until ? format(new Date(auth.valid_until), 'yyyy MMM dd') : '-'}</TableCell>
                <TableCell>{auth.valid_until ? `${getRemainingDays(auth.valid_until)} days` : '-'}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <FileText className="h-4 w-4" />
                    View
                  </Button>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(auth.status)}>
                    {auth.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Renew
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};