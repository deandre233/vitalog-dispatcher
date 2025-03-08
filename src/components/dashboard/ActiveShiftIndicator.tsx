
import React from 'react';
import { Users, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActiveShiftIndicatorProps {
  count: number;
  className?: string;
}

export const ActiveShiftIndicator: React.FC<ActiveShiftIndicatorProps> = ({ 
  count, 
  className 
}) => {
  return (
    <div className={cn(
      "flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-white text-sm",
      "border border-white/20 shadow-inner shadow-white/5",
      "relative overflow-hidden",
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-blue-500/30 animate-pulse opacity-75"></div>
      <Users className="w-4 h-4 z-10" />
      <span className="z-10 font-medium">{count}</span>
      <div className="flex items-center ml-1 z-10">
        <Clock className="w-3 h-3 mr-1" />
        <span className="text-xs opacity-90">Active</span>
      </div>
    </div>
  );
};
