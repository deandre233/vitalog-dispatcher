
import { AlertCircle, Clock, CheckCircle2, XCircle, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bulletin } from "@/types/announcements";

interface AnnouncementsTableProps {
  announcements: Bulletin[];
}

export function AnnouncementsTable({ announcements }: AnnouncementsTableProps) {
  return (
    <Card className="bg-white/80 backdrop-blur-lg shadow-xl border-none overflow-hidden">
      <CardHeader className="bg-gray-50/50 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-gray-800">Active Broadcasts</CardTitle>
          <Button variant="outline" className="bg-white">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="font-semibold text-gray-700">ID</TableHead>
              <TableHead className="font-semibold text-gray-700">Title</TableHead>
              <TableHead className="font-semibold text-gray-700">Target Groups</TableHead>
              <TableHead className="font-semibold text-gray-700">Expiry</TableHead>
              <TableHead className="font-semibold text-gray-700">Status</TableHead>
              <TableHead className="font-semibold text-gray-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {announcements.map((announcement) => (
              <TableRow 
                key={announcement.id} 
                className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
              >
                <TableCell className="font-medium">{announcement.id}</TableCell>
                <TableCell className="max-w-md">
                  <div className="flex items-center gap-2">
                    {announcement.title}
                    {announcement.priority === 'high' && (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    By {announcement.author} • {announcement.seenBy} views
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {announcement.targetGroups.map((group) => (
                      <Badge 
                        key={group} 
                        variant="secondary" 
                        className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                      >
                        {group}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{announcement.expiry}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={announcement.status === 'active' ? 'default' : 'destructive'}
                    className={announcement.status === 'active' 
                      ? 'bg-green-50 text-green-700 hover:bg-green-100' 
                      : 'bg-red-50 text-red-700 hover:bg-red-100'}
                  >
                    <div className="flex items-center gap-1">
                      {announcement.status === 'active' ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <XCircle className="h-3 w-3" />
                      )}
                      {announcement.status}
                    </div>
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
