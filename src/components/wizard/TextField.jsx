import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function TextField({
  id,
  label,
  value = '',
  onChange,
  type = 'text',
  placeholder = '',
  required = false,
  multiline = false,
  rows = 3,
  helperText,
  error,
  isPhone = false,
  prefix,
  suffix,
  min,
  max,
  readOnly = false,
  disabled = false,
  className = '',
  style = {}
}) {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : undefined);

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
        alignItems: multiline ? 'stretch' : 'center',
        background: readOnly ? '#f9fafb' : '#ffffff',
        border: error ? '1.5px solid #ef4444' : '1.5px solid #d1d5db',
        borderRadius: '6px',
        overflow: 'hidden',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: error ? '0 0 0 2px rgba(239, 68, 68, 0.15)' : 'none'
      }}>
        {/* Phone India Prefix */}
        {isPhone && (
          <span style={{
            background: '#f3efe6',
            color: '#0f3d2e',
            fontWeight: 700,
            fontSize: '0.86rem',
            padding: '8px 10px',
            borderRight: '1px solid #d1d5db',
            userSelect: 'none',
            display: 'inline-flex',
            alignItems: 'center'
          }}>
            🇮🇳 +91
          </span>
        )}

        {/* Custom Prefix */}
        {prefix && !isPhone && (
          <span style={{
            background: '#f3efe6',
            color: '#374151',
            fontWeight: 600,
            fontSize: '0.86rem',
            padding: '8px 10px',
            borderRight: '1px solid #d1d5db',
            userSelect: 'none'
          }}>
            {prefix}
          </span>
        )}

        {multiline ? (
          <textarea
            id={inputId}
            rows={rows}
            value={value || ''}
            onChange={e => onChange && onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            style={{
              flex: 1,
              width: '100%',
              padding: '8px 12px',
              border: 'none',
              outline: 'none',
              fontSize: '0.9rem',
              color: readOnly ? '#4b5563' : '#111827',
              fontFamily: 'inherit',
              resize: 'vertical',
              background: 'transparent',
              minHeight: '70px'
            }}
          />
        ) : (
          <input
            id={inputId}
            type={type}
            value={value || ''}
            onChange={e => onChange && onChange(e.target.value)}
            placeholder={placeholder}
            min={min}
            max={max}
            disabled={disabled}
            readOnly={readOnly}
            style={{
              flex: 1,
              width: '100%',
              padding: '8px 12px',
              border: 'none',
              outline: 'none',
              fontSize: '0.9rem',
              color: readOnly ? '#4b5563' : '#111827',
              fontFamily: 'inherit',
              background: 'transparent'
            }}
          />
        )}

        {/* Custom Suffix */}
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

      {/* Helper text */}
      {helperText && !error && (
        <span style={{ display: 'block', fontSize: '0.78rem', color: '#6b7280', marginTop: '4px' }}>
          {helperText}
        </span>
      )}

      {/* Inline error */}
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
