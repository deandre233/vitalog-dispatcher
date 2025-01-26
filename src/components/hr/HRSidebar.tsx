import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HR_NAVIGATION_ITEMS } from "@/config/hr-navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function HRSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="absolute right-[-12px] top-7 z-20 h-6 w-6 rounded-full p-0 hover:bg-muted"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
      <aside
        className={cn(
          "group fixed left-0 top-0 z-10 h-full bg-[#2B4B8C] transition-all duration-300",
          isCollapsed ? "w-[60px]" : "w-[240px]"
        )}
      >
        <ScrollArea className="h-full w-full">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <div className="mt-3 space-y-1">
                {HR_NAVIGATION_ITEMS.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-white transition-all hover:bg-white/10",
                        isActive ? "bg-white/15" : "transparent",
                        isCollapsed && "justify-center"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!isCollapsed && (
                        <div className="flex-1">
                          <div>{item.label}</div>
                          {item.badge && (
                            <div className="text-xs text-blue-200">
                              {item.badge.text}
                            </div>
                          )}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollArea>
      </aside>
    </div>
  );
}