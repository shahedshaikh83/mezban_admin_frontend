import React from 'react';
import { Phone, ChevronDown } from 'lucide-react';

export default function PhoneField({
  label,
  name,
  value,
  onChange,
  countryCode = '+91',
  onCountryCodeChange,
  placeholder = '9822014589',
  required = false,
  disabled = false,
  icon: Icon = Phone,
  error,
  helperText,
  labelRight,
  className = ''
}) {
  const handleNumberChange = (e) => {
    // Only allow digits up to 10
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    onChange({
      target: {
        name,
        value: raw
      }
    });
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between text-xs font-semibold text-gray-800">
          <label htmlFor={name} className="flex items-center gap-1">
            <span>{label}</span>
            {required && <span className="text-[#EF4444] text-sm">*</span>}
          </label>
          {labelRight && <div>{labelRight}</div>}
        </div>
      )}

      <div className={`relative flex items-center h-12 bg-white rounded-lg border transition-colors duration-150 overflow-hidden
        ${disabled ? 'bg-gray-100 border-gray-200 cursor-not-allowed' : 'border-gray-300 hover:border-gray-400 focus-within:border-[#0B4D3A] focus-within:ring-1 focus-within:ring-[#0B4D3A]'}
        ${error ? 'border-[#EF4444] focus-within:border-[#EF4444] focus-within:ring-[#EF4444]' : ''}
      `}>
        {/* Left Icon */}
        <div className="pl-3.5 pr-2 text-gray-500 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-gray-500" />
        </div>

        {/* Country Code Selector */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200 select-none text-gray-700 text-sm font-medium">
          <span>{countryCode}</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </div>

        {/* Number Input */}
        <input
          id={name}
          name={name}
          type="tel"
          inputMode="numeric"
          value={value ?? ''}
          onChange={handleNumberChange}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full h-full px-3 text-sm text-gray-900 bg-transparent outline-none placeholder:text-gray-400 disabled:text-gray-500 disabled:cursor-not-allowed tracking-wider"
        />
      </div>

      {error ? (
        <p className="text-[11px] text-[#EF4444] font-medium mt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-gray-500 mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
}
