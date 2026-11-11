import React from 'react';
import { Calendar, AlertCircle } from 'lucide-react';

export default function DateField({
  id,
  label,
  value = '',
  onChange,
  required = false,
  helperText,
  error,
  min,
  max,
  disabled = false,
  className = '',
  style = {}
}) {
  const inputId = id || (label ? `date-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : undefined);

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
        background: '#ffffff',
        border: error ? '1.5px solid #ef4444' : '1.5px solid #d1d5db',
        borderRadius: '6px',
        overflow: 'hidden',
        boxShadow: error ? '0 0 0 2px rgba(239, 68, 68, 0.15)' : 'none',
        transition: 'all 0.2s ease'
      }}>
        <input
          id={inputId}
          type="date"
          value={value || ''}
          onChange={e => onChange && onChange(e.target.value)}
          min={min}
          max={max}
          disabled={disabled}
          style={{
            flex: 1,
            width: '100%',
            padding: '8px 12px',
            border: 'none',
            outline: 'none',
            fontSize: '0.9rem',
            color: value ? '#111827' : '#6b7280',
            fontFamily: 'inherit',
            background: 'transparent'
          }}
        />
        <div style={{ padding: '0 10px', color: '#6b7280', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
          <Calendar size={18} />
        </div>
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
