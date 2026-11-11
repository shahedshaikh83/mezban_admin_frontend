import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export default function MoneyField({
  id,
  label,
  value = '',
  onChange,
  placeholder = '0',
  required = false,
  helperText,
  error,
  suffix,
  readOnly = false,
  disabled = false,
  className = '',
  style = {}
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState('');

  // Format number in Indian numbering system: 3,50,000
  const formatIndianNumber = (numStr) => {
    if (!numStr && numStr !== 0) return '';
    const clean = String(numStr).replace(/[^\d.]/g, '');
    if (!clean) return '';
    const parts = clean.split('.');
    const integerPart = parts[0];
    const decimalPart = parts.length > 1 ? `.${parts[1]}` : '';

    if (integerPart.length <= 3) {
      return integerPart + decimalPart;
    }
    const lastThree = integerPart.substring(integerPart.length - 3);
    const otherNumbers = integerPart.substring(0, integerPart.length - 3);
    const formattedOther = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    return `${formattedOther},${lastThree}${decimalPart}`;
  };

  useEffect(() => {
    if (isFocused) {
      setDisplayValue(value !== undefined && value !== null ? String(value) : '');
    } else {
      setDisplayValue(formatIndianNumber(value));
    }
  }, [value, isFocused]);

  const handleChange = (e) => {
    const raw = e.target.value;
    // Allow digits and single decimal
    const cleanDigits = raw.replace(/[^\d.]/g, '');
    setDisplayValue(raw);
    onChange && onChange(cleanDigits);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setDisplayValue(value ? String(value) : '');
  };

  const handleBlur = () => {
    setIsFocused(false);
    setDisplayValue(formatIndianNumber(value));
  };

  const inputId = id || (label ? `money-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : undefined);

  return (
    <div style={{ marginBottom: '16px', ...style }} className={className}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            display: 'block',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#374151',
            marginBottom: '6px'
          }}
        >
          {label}
          {required && <span style={{ color: '#ef4444', marginLeft: '3px' }}>*</span>}
        </label>
      )}

      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: readOnly ? '#f9fafb' : '#ffffff',
        border: error ? '1.5px solid #ef4444' : isFocused ? '1.5px solid #0f3d2e' : '1.5px solid #d1d5db',
        borderRadius: '6px',
        overflow: 'hidden',
        boxShadow: error ? '0 0 0 2px rgba(239, 68, 68, 0.15)' : isFocused ? '0 0 0 2px rgba(15, 61, 46, 0.1)' : 'none',
        transition: 'all 0.2s ease'
      }}>
        {/* ₹ Prefix */}
        <span style={{
          background: '#f3efe6',
          color: '#0f3d2e',
          fontWeight: 800,
          fontSize: '1rem',
          padding: '8px 12px',
          borderRight: '1px solid #d1d5db',
          userSelect: 'none'
        }}>
          ₹
        </span>

        <input
          id={inputId}
          type={isFocused ? 'number' : 'text'}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          style={{
            flex: 1,
            width: '100%',
            padding: '8px 12px',
            border: 'none',
            outline: 'none',
            fontSize: '0.95rem',
            fontWeight: 600,
            color: readOnly ? '#4b5563' : '#0f3d2e',
            fontFamily: 'inherit',
            background: 'transparent'
          }}
        />

        {suffix && (
          <span style={{
            background: '#f9fafb',
            color: '#6b7280',
            fontSize: '0.82rem',
            fontWeight: 500,
            padding: '8px 10px',
            borderLeft: '1px solid #e5e7eb',
            userSelect: 'none'
          }}>
            {suffix}
          </span>
        )}
      </div>

      {helperText && !error && (
        <span style={{ display: 'block', fontSize: '0.78rem', color: '#6b7280', marginTop: '4px' }}>
          {helperText}
        </span>
      )}

      {error && (
        <div
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.8rem',
            color: '#ef4444',
            marginTop: '4px',
            fontWeight: 600
          }}
        >
          <AlertCircle size={14} /> {error}
        </div>
      )}
    </div>
  );
}
