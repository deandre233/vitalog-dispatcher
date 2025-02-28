
import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { 
  AlertTriangle, 
  ArrowUpDown, 
  Clock, 
  Eye, 
  FileSignature, 
  MessageSquare, 
  Shield, 
  Trash, 
  UserCog, 
  Users, 
  Pencil,
  Calendar,
  CheckCircle,
  XCircle
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AnnouncementViewDialog } from "./AnnouncementViewDialog";
import { AnnouncementForm } from "./AnnouncementForm";

export type AnnouncementStatus = "draft" | "active" | "scheduled" | "expired" | "all";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  expiresAt: string;
  status: "draft" | "active" | "scheduled" | "expired";
  targetGroups: string[];
  requiresSignature: boolean;
  seenBy: number;
  totalTargetUsers: number;
}

export const AnnouncementList = ({ status = "all" }: { status?: AnnouncementStatus }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    // Simulating data fetching
    setTimeout(() => {
      const mockData: Announcement[] = [
        {
          id: "1",
          title: "New Billing System Implementation",
          content: "We're rolling out a new billing system next week. Training sessions will be held on Monday and Tuesday.",
          author: "Finance Department",
          createdAt: "2023-06-15T08:00:00Z",
          expiresAt: "2023-07-15T08:00:00Z",
          status: "active",
          targetGroups: ["Billing", "Supervisors", "HR"],
          requiresSignature: true,
          seenBy: 18,
          totalTargetUsers: 24
        },
        {
          id: "2",
          title: "Updated Emergency Response Protocol",
          content: "Please review the updated emergency response protocol attached to this announcement.",
          author: "Safety Team",
          createdAt: "2023-06-01T10:30:00Z",
          expiresAt: "2023-08-01T10:30:00Z",
          status: "active",
          targetGroups: ["Crew", "Dispatchers", "Supervisors"],
          requiresSignature: true,
          seenBy: 45,
          totalTargetUsers: 56
        },
        {
          id: "3",
          title: "System Maintenance This Weekend",
          content: "The system will be undergoing maintenance from Saturday 10PM to Sunday 2AM.",
          author: "IT Department",
          createdAt: "2023-06-10T14:00:00Z",
          expiresAt: "2023-06-25T14:00:00Z",
          status: "active",
          targetGroups: ["All Staff"],
          requiresSignature: false,
          seenBy: 72,
          totalTargetUsers: 98
        },
        {
          id: "4",
          title: "Holiday Schedule Changes",
          content: "Please note the changes to the schedule for the upcoming holiday weekend.",
          author: "HR Department",
          createdAt: "2023-05-15T08:00:00Z",
          expiresAt: "2023-05-30T08:00:00Z",
          status: "expired",
          targetGroups: ["All Staff"],
          requiresSignature: false,
          seenBy: 95,
          totalTargetUsers: 98
        },
        {
          id: "5",
          title: "New Equipment Training Sessions",
          content: "Training sessions for the new defibrillators will be held next month.",
          author: "Training Department",
          createdAt: "2023-06-20T09:15:00Z",
          expiresAt: "2023-07-20T09:15:00Z",
          status: "scheduled",
          targetGroups: ["Crew", "Supervisors"],
          requiresSignature: true,
          seenBy: 0,
          totalTargetUsers: 42
        }
      ];

      // Filter based on status if not "all"
      const filteredData = status === "all" 
        ? mockData 
        : mockData.filter(item => item.status === status);
      
      setAnnouncements(filteredData);
      setLoading(false);
    }, 1000);
  }, [status]);

  const columns: ColumnDef<Announcement>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span className="font-medium">{row.getValue("id")}</span>,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "author",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Author
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "expiresAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="whitespace-nowrap"
        >
          Expires
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("expiresAt"));
        return <div className="font-medium">{date.toLocaleDateString()}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant={
            status === "active" ? "default" : 
            status === "scheduled" ? "secondary" : 
            status === "draft" ? "outline" : 
            "destructive"
          }>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "targetGroups",
      header: "Target Groups",
      cell: ({ row }) => {
        const targetGroups = row.getValue("targetGroups") as string[];
        return (
          <div className="flex flex-wrap gap-1">
            {targetGroups.map((group, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {group}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "requiresSignature",
      header: "Sign?",
      cell: ({ row }) => {
        const requiresSignature = row.getValue("requiresSignature") as boolean;
        return requiresSignature ? (
          <div className="flex justify-center">
            <FileSignature className="h-4 w-4 text-blue-500" />
          </div>
        ) : null;
      },
    },
    {
      accessorKey: "seenBy",
      header: "Seen By",
      cell: ({ row }) => {
        const seenBy = row.getValue("seenBy") as number;
        const totalTargetUsers = row.original.totalTargetUsers;
        const percentage = Math.round((seenBy / totalTargetUsers) * 100);
        
        return (
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span>{`${seenBy}/${totalTargetUsers} (${percentage}%)`}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const announcement = row.original;
        
        return (
          <div className="flex gap-2 justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedAnnouncement(announcement);
                setShowViewDialog(true);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedAnnouncement(announcement);
                setShowEditDialog(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="text-sm text-gray-500">
            Showing {announcements.length} announcement{announcements.length !== 1 ? 's' : ''}
          </div>
        </div>
        <div className="p-0">
          <DataTable 
            columns={columns} 
            data={announcements} 
            searchKey="title"
          />
        </div>
      </div>

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedAnnouncement && (
            <AnnouncementViewDialog 
              announcement={selectedAnnouncement} 
              onClose={() => setShowViewDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
            <DialogDescription>
              Make changes to your announcement here.
            </DialogDescription>
          </DialogHeader>
          {selectedAnnouncement && (
            <AnnouncementForm 
              announcement={selectedAnnouncement} 
              onSuccess={() => setShowEditDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
