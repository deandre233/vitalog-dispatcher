
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquarePlus, MapPin } from "lucide-react";
import { TransportRecord } from "@/types/dispatch";

interface DispatchTableProps {
  dispatches: TransportRecord[];
  onAddNote: (dispatchId: string) => void;
}

export function DispatchTable({ dispatches, onAddNote }: DispatchTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Service Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Origin</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dispatches.map((dispatch) => (
            <TableRow key={dispatch.id} className="group hover:bg-muted/50">
              <TableCell className="font-medium">{dispatch.id}</TableCell>
              <TableCell>{dispatch.patient_first_name} {dispatch.patient_last_name}</TableCell>
              <TableCell>{dispatch.caller_phone}</TableCell>
              <TableCell>
                <Badge variant={dispatch.service_type === 'BLS' ? 'default' : 'secondary'}>
                  {dispatch.service_type}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={
                    dispatch.status === 'Active' ? 'success' :
                    dispatch.status === 'Pending' ? 'warning' : 'default'
                  }
                >
                  {dispatch.status}
                </Badge>
              </TableCell>
              <TableCell>{dispatch.origin_address}</TableCell>
              <TableCell>{dispatch.destination_address}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" onClick={() => onAddNote(dispatch.id)}>
                    <MessageSquarePlus className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
