
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Menu,
  PlusCircle,
  Brain,
  StethoscopeIcon,
  ArrowLeftCircle,
  Settings,
  Activity,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAIAssistantActive, setIsAIAssistantActive] = useState(false);

  const toggleAIAssistant = () => {
    setIsAIAssistantActive(!isAIAssistantActive);
    toast.success(
      isAIAssistantActive ? "AI Assistant deactivated" : "AI Assistant activated",
      {
        description: isAIAssistantActive 
          ? "Returning to standard mode" 
          : "Enhanced AI features are now available"
      }
    );
  };

  const handleNewDispatch = () => {
    toast.success("Creating new dispatch", {
      description: "Initializing dispatch form..."
    });
  };

  return (
    <Card className={cn(
      "fixed left-0 top-0 h-screen bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700 transition-all duration-300 z-50",
      isExpanded ? "w-64" : "w-16"
    )}>
      <div className="flex flex-col h-full text-white">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ArrowLeftCircle /> : <Menu />}
          </Button>
        </div>

        {/* Main Actions */}
        <div className="p-2 space-y-2">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-white hover:bg-white/10 relative group",
              !isExpanded && "px-2"
            )}
            onClick={handleNewDispatch}
          >
            <PlusCircle className="h-5 w-5" />
            {isExpanded && <span className="ml-2">New Dispatch</span>}
            {!isExpanded && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 whitespace-nowrap">
                New Dispatch
              </div>
            )}
          </Button>

          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-white hover:bg-white/10 relative group",
              !isExpanded && "px-2",
              isAIAssistantActive && "bg-blue-500/20"
            )}
            onClick={toggleAIAssistant}
          >
            <Brain className="h-5 w-5" />
            {isExpanded && <span className="ml-2">AI Assistant</span>}
            {!isExpanded && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 whitespace-nowrap">
                AI Assistant
              </div>
            )}
          </Button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 p-2 space-y-2">
          <Link to="/monitoring">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-white hover:bg-white/10 relative group",
                !isExpanded && "px-2"
              )}
            >
              <Activity className="h-5 w-5" />
              {isExpanded && <span className="ml-2">Live Monitoring</span>}
              {!isExpanded && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 whitespace-nowrap">
                  Live Monitoring
                </div>
              )}
            </Button>
          </Link>

          <Link to="/medical">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-white hover:bg-white/10 relative group",
                !isExpanded && "px-2"
              )}
            >
              <StethoscopeIcon className="h-5 w-5" />
              {isExpanded && <span className="ml-2">Medical Overview</span>}
              {!isExpanded && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 whitespace-nowrap">
                  Medical Overview
                </div>
              )}
            </Button>
          </Link>
        </div>

        {/* Footer Actions */}
        <div className="p-2 border-t border-gray-700 space-y-2">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-white hover:bg-white/10 relative group",
              !isExpanded && "px-2"
            )}
          >
            <Settings className="h-5 w-5" />
            {isExpanded && <span className="ml-2">Settings</span>}
            {!isExpanded && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 whitespace-nowrap">
                Settings
              </div>
            )}
          </Button>

          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-white hover:bg-white/10 relative group",
              !isExpanded && "px-2"
            )}
          >
            <Info className="h-5 w-5" />
            {isExpanded && <span className="ml-2">Help & Info</span>}
            {!isExpanded && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 whitespace-nowrap">
                Help & Info
              </div>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
