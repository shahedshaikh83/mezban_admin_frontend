import React from 'react';
import { Check } from 'lucide-react';

export default function SidebarStepItem({
  step,
  stepNumber,
  isActive,
  isCompleted,
  isCollapsed,
  onClick
}) {
  const Icon = step.icon;

  if (isCollapsed) {
    return (
      <div className="relative group flex justify-center py-1">
        <button
          type="button"
          onClick={onClick}
          aria-label={`Step ${stepNumber}: ${step.title}`}
          className={`relative w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer outline-none focus:ring-2 focus:ring-[#0B4D3A] focus:ring-offset-1
            ${isActive 
              ? 'bg-[#0B4D3A] text-white shadow-md ring-2 ring-[#0B4D3A]/20 scale-105' 
              : isCompleted
                ? 'bg-[#E6F2EC] text-[#0B4D3A] hover:bg-[#d5ebdf]'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'}
          `}
        >
          <Icon className="w-5 h-5" />

          {/* Checkmark badge if completed */}
          {isCompleted && (
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs bg-emerald-600 text-white">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </span>
          )}
        </button>

        {/* Hover Tooltip when collapsed */}
        <div className="absolute left-14 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center z-50 pointer-events-none">
          <div className="bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap flex flex-col gap-0.5">
            <span>{step.title}</span>
            <span className="text-[10px] text-gray-400 font-normal">{step.subtitle}</span>
          </div>
          {/* Tooltip triangle */}
          <div className="w-2 h-2 bg-gray-900 -order-1 -mr-1 rotate-45" />
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3.5 p-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer outline-none focus:ring-2 focus:ring-[#0B4D3A]/30
        ${isActive
          ? 'bg-[#E6F2EC] text-gray-900 shadow-xs border-l-[3px] border-[#0B4D3A]'
          : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900 border-l-[3px] border-transparent'}
      `}
    >
      {/* Icon Circle */}
      <div className="relative shrink-0">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200
            ${isActive
              ? 'bg-[#0B4D3A] text-white shadow-xs'
              : isCompleted
                ? 'bg-[#E6F2EC] text-[#0B4D3A]'
                : 'bg-gray-100 text-gray-600'}
          `}
        >
          <Icon className="w-4 h-4" />
        </div>

        {/* Checkmark */}
        {isCompleted && (
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Check className="w-2.5 h-2.5 stroke-[3]" />
          </div>
        )}
      </div>

      {/* Title & Subtitle */}
      <div className="flex flex-col min-w-0 flex-1 leading-tight overflow-hidden">
        <span className={`text-xs font-bold truncate ${isActive ? 'text-[#0B4D3A]' : 'text-gray-800'}`}>
          {step.title}
        </span>
        <span className="text-[11px] text-gray-500 truncate mt-0.5 font-medium">
          {step.subtitle}
        </span>
      </div>
    </button>
  );
}
