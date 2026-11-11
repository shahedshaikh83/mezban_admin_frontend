import React from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

export default function SelectField({
  id,
  label,
  value = '',
  onChange,
  options = [],
  placeholder = '-- Select an option --',
  required = false,
  helperText,
  error,
  otherValue = '',
  onOtherChange,
  className = '',
  style = {}
}) {
  const selectId = id || (label ? `select-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : undefined);
  const isOtherSelected = value === 'Other';

  return (
    <div style={{ marginBottom: '16px', ...style }} className={className}>
      {label && (
        <label
          htmlFor={selectId}
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
        position: 'relative',
        background: '#ffffff',
        border: error ? '1.5px solid #ef4444' : '1.5px solid #d1d5db',
        borderRadius: '6px',
        overflow: 'hidden',
        boxShadow: error ? '0 0 0 2px rgba(239, 68, 68, 0.15)' : 'none'
      }}>
        <select
          id={selectId}
          value={value || ''}
          onChange={e => onChange && onChange(e.target.value)}
          style={{
            width: '100%',
            padding: '9px 36px 9px 12px',
            border: 'none',
            outline: 'none',
            fontSize: '0.9rem',
            color: value ? '#111827' : '#6b7280',
            fontFamily: 'inherit',
            background: 'transparent',
            appearance: 'none',
            cursor: 'pointer'
          }}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt, idx) => {
            const val = typeof opt === 'string' ? opt : opt.value;
            const text = typeof opt === 'string' ? opt : opt.label;
            return (
              <option key={idx} value={val} style={{ color: '#111827' }}>
                {text}
              </option>
            );
          })}
        </select>

        <div style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          color: '#6b7280',
          display: 'flex',
          alignItems: 'center'
        }}>
          <ChevronDown size={18} />
        </div>
      </div>

      {/* If "Other" is selected, reveal text input "Please specify" */}
      {isOtherSelected && onOtherChange && (
        <div style={{ marginTop: '8px', paddingLeft: '4px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', display: 'block', marginBottom: '4px' }}>
            Please specify:
          </label>
          <input
            type="text"
            value={otherValue || ''}
            onChange={e => onOtherChange(e.target.value)}
            placeholder="Please specify details..."
            style={{
              width: '100%',
              padding: '6px 10px',
              border: '1.5px solid #0f3d2e',
              borderRadius: '4px',
              fontSize: '0.88rem',
              outline: 'none'
            }}
          />
        </div>
      )}

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
