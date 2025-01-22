import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link, useLocation } from "react-router-dom";
import {
  ClipboardCheck,
  FileSearch,
  FilePlus2,
  Send,
  AlertTriangle,
  Scale,
  Car,
  Clock,
  FileText,
  Building2,
  Users,
  User,
  Upload,
  FileUp,
  DollarSign,
  List,
  ExternalLink,
  FileStack,
  CircleDollarSign
} from "lucide-react";

const routes = [
  {
    label: "QA Review Queue",
    icon: ClipboardCheck,
    href: "/qa-review",
    count: "124"
  },
  {
    label: "Insurance Review Queue",
    icon: FileSearch,
    href: "/insurance-review",
    count: "65"
  },
  {
    label: "Insurance Filing Queue",
    icon: FilePlus2,
    href: "/insurance-filing",
    count: "136"
  },
  {
    label: "Insurance Trans Queue",
    icon: Send,
    href: "/insurance-trans",
    count: "4,323+204"
  },
  {
    label: "Insurance Exception Queue",
    icon: AlertTriangle,
    href: "/insurance-exception",
    count: "1"
  },
  {
    label: "Insurance Appeal Queue",
    icon: Scale,
    href: "/insurance-appeal"
  },
  {
    label: "Parking Lot",
    icon: Car,
    href: "/parking-lot"
  },
  {
    label: "Payment Event Finder",
    icon: Clock,
    href: "/payment-finder"
  },
  {
    label: "Prior Auths On File",
    icon: FileText,
    href: "/prior-auths"
  },
  {
    label: "Facilities List",
    icon: Building2,
    href: "/facilities"
  },
  {
    label: "Affiliates List",
    icon: Users,
    href: "/affiliates"
  },
  {
    label: "Patients List",
    icon: User,
    href: "/patients"
  },
  {
    label: "Patient Document Upload",
    icon: Upload,
    href: "/document-upload"
  },
  {
    label: "Import an EDI Document",
    icon: FileUp,
    href: "/import-edi"
  },
  {
    label: "Record a Payment Event",
    icon: DollarSign,
    href: "/record-payment"
  },
  {
    label: "Insurance Payor ID List",
    icon: List,
    href: "/payor-list"
  },
  {
    label: "Pricing",
    icon: CircleDollarSign,
    href: "/pricing"
  },
  {
    label: "Custom Link 1",
    icon: ExternalLink,
    href: "/custom-link-1"
  }
];

export function BillingSidebar() {
  const pathname = useLocation().pathname;

  return (
    <div className="w-64 border-r bg-medical-primary text-white">
      <div className="space-y-2 py-2">
        <h2 className="px-4 text-lg font-semibold">Billing Navigation</h2>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="space-y-1 px-2">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-white hover:bg-medical-secondary/20",
                  pathname === route.href && "bg-medical-secondary/30"
                )}
                asChild
              >
                <Link to={route.href} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <route.icon className="mr-2 h-4 w-4" />
                    <span>{route.label}</span>
                  </div>
                  {route.count && (
                    <span className="ml-auto text-xs bg-medical-secondary/30 px-2 py-1 rounded-full">
                      {route.count}
                    </span>
                  )}
                </Link>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}