import React from 'react';

export default function Badge({ children, variant = 'gold', className = '' }) {
  const variantStyles = {
    gold: 'bg-[#FFF8E1] text-amber-900 border-[#F3DFA2]',
    primary: 'bg-[#E6F2EC] text-[#0B4D3A] border-[#b8dfce]',
    gray: 'bg-gray-100 text-gray-700 border-gray-200',
    danger: 'bg-red-50 text-red-700 border-red-200'
  };

  return (
    <span
      className={`inline-flex items-center text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md border ${variantStyles[variant] || variantStyles.gold} ${className}`}
    >
      {children}
    </span>
  );
}
