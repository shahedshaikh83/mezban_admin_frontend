import React from 'react';
import { Shield, Lock } from 'lucide-react';

export default function FormSection({
  title,
  subtitle,
  internalOnly = false,
  children
}) {
  return (
    <div style={{ width: '100%' }}>
      {/* Peach Header Bar */}
      <div style={{
        background: '#f8dec6',
        borderLeft: '5px solid #0f3d2e',
        padding: '10px 16px',
        marginBottom: '20px',
        borderRadius: '6px',
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h2 style={{
            margin: 0,
            fontSize: '1.05rem',
            fontWeight: 800,
            color: '#1a1a1a',
            letterSpacing: '0.4px',
            textTransform: 'uppercase',
            fontFamily: 'inherit'
          }}>
            {title}
          </h2>
        </div>

        {internalOnly && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: '#fee2e2',
            border: '1px solid #ef4444',
            color: '#b91c1c',
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '3px 8px',
            borderRadius: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.4px'
          }}>
            <Lock size={12} /> Internal – Not Visible to Customer
          </span>
        )}
      </div>

      {subtitle && (
        <p style={{
          margin: '-12px 0 18px 4px',
          fontSize: '0.86rem',
          color: '#4b5563',
          fontStyle: 'italic'
        }}>
          {subtitle}
        </p>
      )}

      {/* Section Content */}
      <div style={{ width: '100%' }}>
        {children}
      </div>
    </div>
  );
}
