import React from 'react';

export default function StepHeader({
  stepNumber,
  title,
  subtitle,
  icon: Icon
}) {
  return (
    <div className="bg-[#E6F2EC] p-4 sm:p-5 rounded-xl flex items-center gap-4 transition-all duration-200">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-[#0B4D3A] text-white flex items-center justify-center shrink-0 shadow-sm">
          <Icon className="w-6 h-6 text-white" />
        </div>
      )}
      <div className="flex flex-col min-w-0">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight leading-snug">
          {stepNumber ? `${stepNumber}. ` : ''}{title}
        </h2>
        {subtitle && (
          <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
