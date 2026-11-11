import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function RadioGroup({
  id,
  label,
  options = [],
  value = '',
  onChange,
  required = false,
  helperText,
  error,
  className = '',
  style = {}
}) {
  const groupId = id || (label ? `rg-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : undefined);

  return (
    <div style={{ marginBottom: '16px', ...style }} className={className}>
      {label && (
        <span
          id={`${groupId}-label`}
          style={{
            display: 'block',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#374151',
            marginBottom: '8px'
          }}
        >
          {label}
          {required && <span style={{ color: '#ef4444', marginLeft: '3px' }}>*</span>}
        </span>
      )}

      {/* Segmented / Pill container */}
      <div
        role="radiogroup"
        aria-labelledby={label ? `${groupId}-label` : undefined}
        style={{
          display: 'inline-flex',
          flexWrap: 'wrap',
          gap: '8px',
          alignItems: 'center'
        }}
      >
        {options.map((opt, idx) => {
          const optValue = typeof opt === 'string' ? opt : opt.value;
          const optLabel = typeof opt === 'string' ? opt : opt.label;
          const isSelected = value === optValue;

          return (
            <label
              key={idx}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '20px',
                fontSize: '0.86rem',
                fontWeight: isSelected ? 700 : 500,
                cursor: 'pointer',
                userSelect: 'none',
                background: isSelected ? '#0f3d2e' : '#ffffff',
                color: isSelected ? '#ffffff' : '#374151',
                border: isSelected ? '1.5px solid #0f3d2e' : error ? '1.5px solid #ef4444' : '1.5px solid #d1d5db',
                boxShadow: isSelected ? '0 2px 8px rgba(15, 61, 46, 0.2)' : '0 1px 2px rgba(0,0,0,0.03)',
                transition: 'all 0.15s ease'
              }}
            >
              <input
                type="radio"
                name={groupId}
                value={optValue}
                checked={isSelected}
                onChange={() => onChange && onChange(optValue)}
                style={{
                  width: '14px',
                  height: '14px',
                  accentColor: '#0f3d2e',
                  cursor: 'pointer'
                }}
              />
              <span>{optLabel}</span>
            </label>
          );
        })}
      </div>

      {helperText && !error && (
        <span style={{ display: 'block', fontSize: '0.78rem', color: '#6b7280', marginTop: '5px' }}>
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
            marginTop: '5px',
            fontWeight: 600
          }}
        >
          <AlertCircle size={14} /> {error}
        </div>
      )}
    </div>
  );
}
