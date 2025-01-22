import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  ClipboardCheck, FileSearch, FilePlus2, Send, AlertTriangle, Scale,
  Car, Clock, FileText, Building2, Users, User, Upload, FileUp,
  DollarSign, List, ExternalLink, CircleDollarSign, ChevronLeft, ChevronRight
} from "lucide-react";

const routes = [
  {
    label: "Quality Review Queue",
    icon: ClipboardCheck,
    href: "/qa-review",
    count: "124"
  },
  {
    label: "Coverage Review Queue",
    icon: FileSearch,
    href: "/insurance-review",
    count: "65"
  },
  {
    label: "Coverage Filing Queue",
    icon: FilePlus2,
    href: "/insurance-filing",
    count: "136"
  },
  {
    label: "Coverage Trans Queue",
    icon: Send,
    href: "/insurance-trans",
    count: "4,323+204"
  },
  {
    label: "Coverage Exception Queue",
    icon: AlertTriangle,
    href: "/insurance-exception",
    count: "1"
  },
  {
    label: "Coverage Appeal Queue",
    icon: Scale,
    href: "/insurance-appeal"
  },
  {
    label: "Holding Area",
    icon: Car,
    href: "/parking-lot"
  },
  {
    label: "Payment Tracking",
    icon: Clock,
    href: "/payment-finder"
  },
  {
    label: "Pre-Approvals On File",
    icon: FileText,
    href: "/prior-auths"
  },
  {
    label: "Centers List",
    icon: Building2,
    href: "/facilities"
  },
  {
    label: "Partners List",
    icon: Users,
    href: "/affiliates"
  },
  {
    label: "Client List",
    icon: User,
    href: "/patients"
  },
  {
    label: "Client Document Upload",
    icon: Upload,
    href: "/document-upload"
  },
  {
    label: "Import EDI Document",
    icon: FileUp,
    href: "/import-edi"
  },
  {
    label: "Record Payment Event",
    icon: DollarSign,
    href: "/record-payment"
  },
  {
    label: "Coverage Provider IDs",
    icon: List,
    href: "/payor-list"
  },
  {
    label: "Pricing",
    icon: CircleDollarSign,
    href: "/pricing"
  }
];

export function BillingSidebar() {
  const pathname = useLocation().pathname;
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "border-r bg-white text-medical-primary transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4">
          {!isCollapsed && <h2 className="text-lg font-semibold">Billing</h2>}
          <Button
            variant="ghost"
            size="icon"
            className="text-medical-primary hover:bg-medical-accent/20"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex-1 px-2 py-2">
          <div className="space-y-1">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-medical-primary hover:bg-medical-accent/20",
                  pathname === route.href && "bg-medical-accent/30",
                  isCollapsed && "px-2"
                )}
                asChild
              >
                <Link to={route.href} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <route.icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                    {!isCollapsed && <span>{route.label}</span>}
                  </div>
                  {!isCollapsed && route.count && (
                    <span className="ml-auto text-xs bg-medical-accent/30 px-2 py-1 rounded-full">
                      {route.count}
                    </span>
                  )}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}