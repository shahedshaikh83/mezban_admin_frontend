import React from 'react';
import { Crown } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="w-full bg-[#0B4D3A] text-white text-xs py-2 px-4 sm:px-8 border-b border-[#0f5c46]">
      <div className="max-w-7xl mx-auto flex items-center justify-center sm:justify-start">
        {/* Announcement */}
        <div className="flex items-center gap-2 tracking-wide text-center sm:text-left">
          <Crown className="w-3.5 h-3.5 text-[#F4C542] shrink-0" />
          <span className="font-bold text-[#F4C542]">MEZBAN</span>
          <span className="text-emerald-300/80 hidden sm:inline">•</span>
          <span className="text-emerald-100 font-medium">Events and celebrations</span>
        </div>
      </div>
    </div>
  );
}
