import React from 'react';

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  icon: Icon,
  error,
  helperText,
  labelRight,
  className = ''
}) {
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

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-gray-500 pointer-events-none flex items-center justify-center">
            <Icon className="w-5 h-5 text-gray-500" />
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value ?? ''}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full h-12 bg-white text-gray-900 text-sm rounded-lg border transition-colors duration-150 outline-none
            ${Icon ? 'pl-[44px] pr-4' : 'px-4'}
            ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200' : 'border-gray-300 hover:border-gray-400 focus:border-[#0B4D3A] focus:ring-1 focus:ring-[#0B4D3A]'}
            ${error ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]' : ''}
          `}
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
