import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Search, Check, AlertCircle } from 'lucide-react';

export default function MultiSelectDropdown({
  id,
  label,
  options = [],
  selectedValues = [],
  onChange,
  placeholder = 'Select options',
  required = false,
  helperText,
  error,
  otherValue = '',
  onOtherChange,
  maxVisibleChips = 3,
  className = '',
  style = {}
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  const selectedArray = Array.isArray(selectedValues) ? selectedValues : [];
  const hasOther = options.includes('Other');
  const isOtherSelected = selectedArray.includes('Other');

  // Filter options if search term exists
  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  // Close on outside click or Esc
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      // Auto-focus search input if present
      if (options.length > 8 && searchInputRef.current) {
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, options.length]);

  const toggleOption = (option) => {
    let next;
    if (selectedArray.includes(option)) {
      next = selectedArray.filter(item => item !== option);
    } else {
      next = [...selectedArray, option];
    }
    onChange && onChange(next);
  };

  const handleSelectAll = () => {
    onChange && onChange([...options]);
  };

  const handleClearAll = () => {
    onChange && onChange([]);
  };

  const handleRemoveChip = (e, option) => {
    e.stopPropagation();
    onChange && onChange(selectedArray.filter(item => item !== option));
  };

  const dropdownId = id || (label ? `ms-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : undefined);

  return (
    <div
      ref={containerRef}
      style={{ marginBottom: '16px', position: 'relative', ...style }}
      className={className}
    >
      {label && (
        <label
          htmlFor={dropdownId}
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

      {/* Closed / Interactive Field Box */}
      <div
        id={dropdownId}
        role="button"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        style={{
          minHeight: '42px',
          padding: '5px 10px',
          background: '#ffffff',
          border: error ? '1.5px solid #ef4444' : isOpen ? '1.5px solid #0f3d2e' : '1.5px solid #d1d5db',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          boxShadow: error ? '0 0 0 2px rgba(239, 68, 68, 0.15)' : isOpen ? '0 0 0 2px rgba(15, 61, 46, 0.1)' : 'none',
          transition: 'all 0.2s ease',
          gap: '8px'
        }}
      >
        {/* Selected Chips or Placeholder */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '5px',
          alignItems: 'center',
          flex: 1
        }}>
          {selectedArray.length === 0 ? (
            <span style={{ color: '#9ca3af', fontSize: '0.88rem' }}>
              {placeholder}
            </span>
          ) : (
            <>
              {selectedArray.slice(0, maxVisibleChips).map((item, idx) => (
                <span
                  key={idx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: '#f3efe6',
                    color: '#0f3d2e',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    border: '1px solid #dcd3c4',
                    lineHeight: 1.2
                  }}
                >
                  {item}
                  <button
                    type="button"
                    aria-label={`Remove ${item}`}
                    onClick={(e) => handleRemoveChip(e, item)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      color: '#4b5563',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <X size={13} />
                  </button>
                </span>
              ))}

              {selectedArray.length > maxVisibleChips && (
                <span style={{
                  background: '#e5e7eb',
                  color: '#374151',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '3px 7px',
                  borderRadius: '12px'
                }}>
                  +{selectedArray.length - maxVisibleChips} more
                </span>
              )}
            </>
          )}
        </div>

        {/* Right Controls: Clear & Chevron */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6b7280' }}>
          {selectedArray.length > 0 && (
            <button
              type="button"
              aria-label="Clear all selections"
              onClick={(e) => {
                e.stopPropagation();
                handleClearAll();
              }}
              style={{
                background: 'none',
                border: 'none',
                padding: '2px',
                cursor: 'pointer',
                color: '#9ca3af',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Clear all"
            >
              <X size={15} />
            </button>
          )}
          <ChevronDown
            size={18}
            style={{
              transition: 'transform 0.2s',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
            }}
          />
        </div>
      </div>

      {/* Floating Dropdown Panel */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0,
          right: 0,
          background: '#ffffff',
          border: '1.5px solid #cbd5e1',
          borderRadius: '8px',
          boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
          zIndex: 100,
          maxHeight: '340px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Search Box if > 8 options */}
          {options.length > 8 && (
            <div style={{
              padding: '8px 10px',
              borderBottom: '1px solid #f1f5f9',
              background: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Search size={15} color="#94a3b8" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search options..."
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.85rem',
                  background: 'transparent'
                }}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          )}

          {/* Quick Actions Toolbar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '6px 12px',
            background: '#fafafa',
            borderBottom: '1px solid #f1f5f9',
            fontSize: '0.78rem'
          }}>
            <span style={{ color: '#6b7280', fontWeight: 600 }}>
              {selectedArray.length} of {options.length} selected
            </span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={handleSelectAll}
                style={{
                  color: '#0f3d2e',
                  fontWeight: 700,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Select all
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                style={{
                  color: '#ef4444',
                  fontWeight: 600,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Clear
              </button>
            </div>
          </div>

          {/* Scrollable Checkbox Options List */}
          <div style={{
            overflowY: 'auto',
            padding: '6px',
            maxHeight: '220px'
          }}>
            {filteredOptions.length === 0 ? (
              <div style={{ padding: '16px', textAlign: 'center', color: '#9ca3af', fontSize: '0.85rem' }}>
                No options match "{searchTerm}"
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = selectedArray.includes(opt);
                return (
                  <label
                    key={opt}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleOption(opt);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '7px 10px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '0.86rem',
                      color: isSelected ? '#0f3d2e' : '#374151',
                      fontWeight: isSelected ? 700 : 400,
                      background: isSelected ? '#fbf8ee' : 'transparent',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      style={{
                        width: '16px',
                        height: '16px',
                        accentColor: '#0f3d2e',
                        cursor: 'pointer'
                      }}
                    />
                    <span style={{ flex: 1 }}>{opt}</span>
                    {isSelected && <Check size={14} color="#0f3d2e" />}
                  </label>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* If "Other" is checked, reveal text input "Please specify" */}
      {hasOther && isOtherSelected && onOtherChange && (
        <div style={{ marginTop: '8px', paddingLeft: '4px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', display: 'block', marginBottom: '4px' }}>
            Please specify Other:
          </label>
          <input
            type="text"
            value={otherValue || ''}
            onChange={(e) => onOtherChange(e.target.value)}
            placeholder="Please specify custom details..."
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
