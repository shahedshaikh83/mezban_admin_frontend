import React, { useState } from 'react';
import { Crown, Sparkles, Shield, Calendar, FileText, Menu, X, ChevronRight } from 'lucide-react';
import mezbaanLogo from '../assets/mezbaan-logo.jpg';

export default function Navbar({ activePortal, setActivePortal, openPlanModal, openRequirementSheet }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (portalId) => {
    setActivePortal(portalId);
    setMobileMenuOpen(false);
  };

  const handleActionClick = (actionFn) => {
    setMobileMenuOpen(false);
    actionFn();
  };

  const primaryNavItems = [
    {
      id: 'requirements',
      label: 'Customer Requirement',
      icon: <FileText size={15} />
    },
    {
      id: 'admin',
      label: 'Admin OS',
      icon: <Shield size={15} />
    }
  ];

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, width: '100%' }}>
      {/* Top Luxury Announcement / Region Strip */}
      <div className="portal-bar" style={{
        background: 'linear-gradient(90deg, #09261c 0%, #0e3b2c 100%)',
        color: '#ffffff',
        padding: '6px 20px',
        fontSize: '0.78rem',
        borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontWeight: 700, color: '#f3c64c' }}>
            <Crown size={14} /> MEZBAN
          </span>
          <span style={{ opacity: 0.6 }}>•</span>
          <span style={{ color: '#d1ded8', fontSize: '0.74rem' }}>
            Events and celebrations
          </span>
        </div>
      </div>

      {/* Main Brand & Unified Navigation Header */}
      <div style={{
        background: '#ffffff',
        borderBottom: '1px solid #ebdcc0',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        padding: '10px 0'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16
        }}>
          {/* Logo & Tagline */}
          <div 
            onClick={() => handleNavClick('requirements')}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flexShrink: 0 }}
          >
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              overflow: 'hidden',
              background: '#000000',
              border: '1.5px solid #d4af37',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 3px 10px rgba(212, 175, 55, 0.25)',
              flexShrink: 0
            }}>
              <img 
                src={mezbaanLogo} 
                alt="Mezban Royal Emblem" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 'clamp(1.15rem, 3.5vw, 1.45rem)', fontWeight: 800, color: '#0f3d2e', letterSpacing: '0.03em', fontFamily: 'Outfit', lineHeight: 1.1 }}>
                  MEZBAN
                </span>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#b38f20', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Events
                </span>
              </div>
              <p style={{
                fontSize: '0.7rem',
                color: '#6b7280',
                margin: '2px 0 0',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '220px'
              }}>
                Aapka Event, Hamari Zimmedari
              </p>
            </div>
          </div>

          {/* Primary 3 Navigation Options (Desktop >= 860px) */}
          <nav 
            className="global-primary-nav" 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#f9f7f2',
              padding: '4px 6px',
              borderRadius: 28,
              border: '1px solid #e7dcce'
            }}
          >
            {primaryNavItems.map(item => {
              const isActive = activePortal === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 18px',
                    borderRadius: 22,
                    fontSize: '0.86rem',
                    fontWeight: isActive ? 800 : 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                    background: isActive 
                      ? 'linear-gradient(135deg, #0f3d2e 0%, #175440 100%)' 
                      : 'transparent',
                    color: isActive ? '#f3c64c' : '#374151',
                    border: isActive ? '1.5px solid #d4af37' : '1.5px solid transparent',
                    boxShadow: isActive ? '0 2px 10px rgba(15, 61, 46, 0.25)' : 'none'
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = '#f0ebe1';
                      e.currentTarget.style.color = '#0f3d2e';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#374151';
                    }
                  }}
                >
                  <span style={{ color: isActive ? '#f3c64c' : '#b38f20', display: 'flex', alignItems: 'center' }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Desktop Right Action: Plan My Event (Visible on screens > 860px) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} className="desktop-ctas">
            <button
              onClick={() => handleActionClick(openPlanModal)}
              className="btn-gold"
              style={{ fontSize: '0.86rem', padding: '9px 20px', borderRadius: 24 }}
            >
              <Calendar size={16} /> Plan My Event
            </button>
          </div>

          {/* Mobile Right Controls (< 860px) */}
          <div style={{ display: 'none', alignItems: 'center', gap: 8 }} className="mobile-header-actions">
            <button
              onClick={() => handleActionClick(openPlanModal)}
              className="btn-gold"
              style={{ fontSize: '0.78rem', padding: '6px 12px', borderRadius: 18 }}
            >
              <Calendar size={13} /> Plan
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              style={{
                padding: '6px',
                borderRadius: 8,
                background: '#f3efe6',
                border: '1px solid #dcd3c4',
                color: '#0f3d2e',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu Overlay */}
      {mobileMenuOpen && (
        <div style={{
          background: '#ffffff',
          borderBottom: '2px solid #0f3d2e',
          boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
          padding: '16px 20px 24px',
          animation: 'fadeIn 0.2s ease-out forwards',
          display: 'flex',
          flexDirection: 'column',
          gap: 14
        }}>
          {/* Quick CTA Action */}
          <button
            onClick={() => handleActionClick(openPlanModal)}
            className="btn-gold"
            style={{ width: '100%', padding: '11px 16px', fontSize: '0.9rem', borderRadius: 8, justifyContent: 'center' }}
          >
            <Calendar size={16} /> Plan My Event
          </button>

          <div style={{ height: 1, background: '#e5e7eb', margin: '2px 0' }} />

          {/* 3 Primary Navigation Options */}
          <span style={{ fontSize: '0.72rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>
            Navigation
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {primaryNavItems.map(item => {
              const isActive = activePortal === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                    padding: '11px 14px',
                    borderRadius: 8,
                    fontSize: '0.88rem',
                    fontWeight: isActive ? 800 : 600,
                    background: isActive ? '#0f3d2e' : '#f9fafb',
                    color: isActive ? '#f3c64c' : '#374151',
                    border: isActive ? '1.5px solid #d4af37' : '1px solid #e5e7eb',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: isActive ? '#f3c64c' : '#b38f20' }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {isActive && <span style={{ fontSize: '0.72rem', color: '#f3c64c', fontWeight: 700 }}>Active</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Inline styles for responsive toggling */}
      <style>{`
        @media (max-width: 860px) {
          .global-primary-nav {
            display: none !important;
          }
          .desktop-ctas {
            display: none !important;
          }
          .mobile-header-actions {
            display: flex !important;
          }
          .market-region-tag {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
