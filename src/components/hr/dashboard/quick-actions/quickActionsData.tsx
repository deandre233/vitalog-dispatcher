
import React from "react";
import { 
  FilePlus, UserPlus, Clock, Calendar, FileCheck2, 
  AlertTriangle, Award, FileText, MessageSquare, Mail, 
  Zap, PlusCircle
} from "lucide-react";
import { QuickActionProps } from "./QuickAction";

export const getQuickActionsData = (onToast: (title: string, description: string) => void): QuickActionProps[] => [
  {
    icon: <UserPlus className="h-6 w-6 text-blue-600 group-hover:text-blue-700 transition-colors duration-200" />,
    label: "New Employee",
    onClick: () => onToast("Add Employee", "Opening new employee form..."),
    variant: "default",
    className: "bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-blue-200"
  },
  {
    icon: <FilePlus className="h-6 w-6 text-green-600 group-hover:text-green-700 transition-colors duration-200" />,
    label: "New Document",
    onClick: () => onToast("Add Document", "Opening document upload..."),
    className: "bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-green-200"
  },
  {
    icon: <Clock className="h-6 w-6 text-purple-600 group-hover:text-purple-700 transition-colors duration-200" />,
    label: "Clock-in",
    onClick: () => onToast("Manual Clock-in", "Opening manual clock-in form..."),
    badge: {
      text: "3",
      variant: "destructive"
    },
    className: "bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-purple-200"
  },
  {
    icon: <Calendar className="h-6 w-6 text-amber-600 group-hover:text-amber-700 transition-colors duration-200" />,
    label: "Schedule",
    onClick: () => onToast("Schedule Management", "Opening schedule management..."),
    className: "bg-gradient-to-br from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 border-amber-200"
  },
  {
    icon: <FileCheck2 className="h-6 w-6 text-teal-600 group-hover:text-teal-700 transition-colors duration-200" />,
    label: "Approve",
    onClick: () => onToast("Approvals", "Opening pending approvals..."),
    badge: {
      text: "5",
      variant: "secondary"
    },
    className: "bg-gradient-to-br from-teal-50 to-teal-100 hover:from-teal-100 hover:to-teal-200 border-teal-200"
  },
  {
    icon: <AlertTriangle className="h-6 w-6 text-red-600 group-hover:text-red-700 transition-colors duration-200" />,
    label: "Incident",
    onClick: () => onToast("Report Incident", "Opening incident form..."),
    className: "bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 border-red-200"
  },
  {
    icon: <Award className="h-6 w-6 text-indigo-600 group-hover:text-indigo-700 transition-colors duration-200" />,
    label: "Award",
    onClick: () => onToast("Issue Award", "Opening achievement selection..."),
    variant: "outline",
    className: "bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 border-indigo-200"
  },
  {
    icon: <FileText className="h-6 w-6 text-cyan-600 group-hover:text-cyan-700 transition-colors duration-200" />,
    label: "Report",
    onClick: () => onToast("Generate Report", "Opening report generator..."),
    className: "bg-gradient-to-br from-cyan-50 to-cyan-100 hover:from-cyan-100 hover:to-cyan-200 border-cyan-200"
  },
  {
    icon: <MessageSquare className="h-6 w-6 text-fuchsia-600 group-hover:text-fuchsia-700 transition-colors duration-200" />,
    label: "Message",
    onClick: () => onToast("Team Message", "Opening messaging interface..."),
    badge: {
      text: "2",
      variant: "info"
    },
    className: "bg-gradient-to-br from-fuchsia-50 to-fuchsia-100 hover:from-fuchsia-100 hover:to-fuchsia-200 border-fuchsia-200"
  },
  {
    icon: <Mail className="h-6 w-6 text-orange-600 group-hover:text-orange-700 transition-colors duration-200" />,
    label: "Notify All",
    onClick: () => onToast("Send Notification", "Opening notification composer..."),
    className: "bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 border-orange-200"
  },
  {
    icon: <Zap className="h-6 w-6 text-emerald-600 group-hover:text-emerald-700 transition-colors duration-200" />,
    label: "Quick Tasks",
    onClick: () => onToast("Quick Tasks", "Opening quick task creation..."),
    className: "bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 border-emerald-200"
  },
  {
    icon: <PlusCircle className="h-6 w-6 text-gray-600 group-hover:text-gray-700 transition-colors duration-200" />,
    label: "Custom",
    onClick: () => onToast("Custom Action", "Configure a custom action..."),
    className: "bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border-gray-200"
  }
];
