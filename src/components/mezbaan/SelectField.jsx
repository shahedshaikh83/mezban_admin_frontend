import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function SelectField({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  required = false,
  disabled = false,
  icon: Icon,
  error,
  helperText,
  className = ''
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={name} className="flex items-center gap-1 text-xs font-semibold text-gray-800">
          <span>{label}</span>
          {required && <span className="text-[#EF4444] text-sm">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-gray-500 pointer-events-none flex items-center justify-center">
            <Icon className="w-5 h-5 text-gray-500" />
          </div>
        )}

        <select
          id={name}
          name={name}
          value={value ?? ''}
          onChange={onChange}
          disabled={disabled}
          className={`w-full h-12 bg-white text-gray-900 text-sm rounded-lg border appearance-none transition-colors duration-150 outline-none cursor-pointer
            ${Icon ? 'pl-[44px] pr-10' : 'px-4 pr-10'}
            ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200' : 'border-gray-300 hover:border-gray-400 focus:border-[#0B4D3A] focus:ring-1 focus:ring-[#0B4D3A]'}
            ${error ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]' : ''}
          `}
        >
          {placeholder && (
            <option value="" disabled className="text-gray-400">
              {placeholder}
            </option>
          )}
          {options.map((opt) => {
            const optVal = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={optVal} value={optVal}>
                {optLabel}
              </option>
            );
          })}
        </select>

        <div className="absolute right-3.5 text-gray-400 pointer-events-none">
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </div>
      </div>

      {error ? (
        <p className="text-[11px] text-[#EF4444] font-medium mt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-gray-500 mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
}
