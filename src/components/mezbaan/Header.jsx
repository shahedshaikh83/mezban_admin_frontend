import React from 'react';
import { Crown, FileText, Shield, Calendar } from 'lucide-react';

import mezbaanLogo from '../../assets/mezbaan-logo.jpg';

export default function Header({ 
  activeTab = 'customer-requirement', 
  onNavigate, 
  onOpenPlanModal 
}) {
  const handleNav = (tab) => {
    if (onNavigate) {
      onNavigate(tab);
    } else {
      if (tab === 'customer-requirement' || tab === 'website') window.location.hash = '#/customer-requirement';
      else if (tab === 'admin') window.location.hash = '#/admin/dashboard';
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-200/80 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Title */}
        <div 
          onClick={() => handleNav('customer-requirement')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-black flex items-center justify-center shadow-md border border-[#d4af37]/60 group-hover:scale-105 transition-transform duration-200 shrink-0">
            <img 
              src={mezbaanLogo} 
              alt="Mezban Royal Emblem" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-extrabold text-xl tracking-tight text-[#0B4D3A]">
                MEZBAN
              </span>
              <span className="text-xs font-bold text-[#F4C542] tracking-wider uppercase bg-[#FFF8E1] px-1.5 py-0.5 rounded border border-[#F3DFA2]">
                EVENTS
              </span>
            </div>
            <span className="text-[11px] text-gray-500 font-medium tracking-normal mt-0.5">
              Aapka Event, Hamari Zimmedari
            </span>
          </div>
        </div>

        {/* Center: Pill Navigation */}
        <nav className="hidden md:flex items-center bg-gray-100/90 p-1 rounded-full border border-gray-200/80 shadow-inner">
          {/* Customer Requirement */}
          <button
            type="button"
            onClick={() => handleNav('customer-requirement')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
              activeTab === 'customer-requirement'
                ? 'bg-[#0B4D3A] text-[#F4C542] shadow-sm'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200/70'
            }`}
          >
            <FileText className="w-4 h-4 text-[#F4C542]" />
            <span>Customer Requirement</span>
          </button>

          {/* 3. Admin OS */}
          <button
            type="button"
            onClick={() => handleNav('admin')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
              activeTab === 'admin'
                ? 'bg-[#0B4D3A] text-[#F4C542] shadow-sm'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200/70'
            }`}
          >
            <Shield className="w-4 h-4 text-gray-500" />
            <span>Admin OS</span>
          </button>
        </nav>

        {/* Right: Plan My Event & User Avatar */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenPlanModal}
            className="flex items-center gap-2 bg-[#F4C542] hover:bg-[#ebbb32] text-[#0B4D3A] font-bold text-xs sm:text-sm px-4 py-2 rounded-full shadow-sm hover:shadow transition-all duration-200 active:scale-95"
          >
            <Calendar className="w-4 h-4 text-[#0B4D3A]" />
            <span>Plan My Event</span>
          </button>

          <div 
            title="Logged In Admin Profile (R)"
            className="w-9 h-9 rounded-full bg-[#0B4D3A] text-white font-bold flex items-center justify-center text-sm shadow-sm border-2 border-emerald-100"
          >
            R
          </div>
        </div>
      </div>
    </header>
  );
}
