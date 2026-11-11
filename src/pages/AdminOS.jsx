import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, Briefcase, Database, Layers, 
  Shield, Menu, X, ChevronRight, FileText, Sparkles, Server, CheckCircle
} from 'lucide-react';
import AdminPortal from './AdminPortal';
import CustomerPortal from './CustomerPortal';
import VendorPortal from './VendorPortal';
import DatabaseExplorer from './DatabaseExplorer';

export default function AdminOS({ 
  activeSection = 'dashboard', 
  onSectionChange, 
  openPlanModal,
  onNavigatePortal 
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      subtitle: 'Events Pipeline & P&L',
      icon: <LayoutDashboard size={18} />
    },
    {
      id: 'customer',
      label: 'Customer Portal',
      subtitle: 'Quotes & Invoices',
      icon: <Users size={18} />
    },
    {
      id: 'vendor',
      label: 'Vendor Portal',
      subtitle: 'Partners & Work Orders',
      icon: <Briefcase size={18} />
    },
    {
      id: 'database',
      label: 'ER Database',
      subtitle: 'SQLite Live Tables',
      icon: <Database size={18} />
    },
    {
      id: 'schema',
      label: 'Schema',
      subtitle: '13 Relational Entities',
      icon: <Layers size={18} />
    }
  ];

  const handleSelectSection = (sectionId) => {
    if (onSectionChange) {
      onSectionChange(sectionId);
    }
    setMobileSidebarOpen(false);
  };

  const currentItem = navItems.find(item => item.id === activeSection) || navItems[0];

  return (
    <div className="admin-os-container" style={{
      display: 'flex',
      minHeight: 'calc(100vh - 120px)',
      background: '#f8f6f0',
      position: 'relative'
    }}>
      {/* ============================================================== */}
      {/* 1. DESKTOP PERMANENT SIDEBAR (Screens >= 992px) */}
      {/* ============================================================== */}
      <aside className="admin-desktop-sidebar" style={{
        width: 270,
        flexShrink: 0,
        background: 'linear-gradient(180deg, #09261c 0%, #0d3829 100%)',
        color: '#ffffff',
        borderRight: '2px solid rgba(212, 175, 55, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 16px',
        boxShadow: '4px 0 20px rgba(0,0,0,0.08)',
        zIndex: 20
      }}>
        <div>
          {/* Admin OS Brand Badge */}
          <div style={{
            padding: '0 8px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            marginBottom: 20
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 38,
                height: 38,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #0f3d2e 0%, #061912 100%)',
                border: '1.5px solid #d4af37',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#d4af37',
                boxShadow: '0 2px 10px rgba(212, 175, 55, 0.25)',
                flexShrink: 0
              }}>
                <Shield size={20} />
              </div>
              <div>
                <span style={{
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  color: '#f3c64c',
                  letterSpacing: '0.04em',
                  fontFamily: 'Outfit',
                  display: 'block',
                  lineHeight: 1.1
                }}>
                  ADMIN OS
                </span>
                <span style={{
                  fontSize: '0.7rem',
                  color: '#cadbd2',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  fontWeight: 600
                }}>
                  Central Console
                </span>
              </div>
            </div>

            <div style={{
              marginTop: 12,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(212, 175, 55, 0.12)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              padding: '3px 10px',
              borderRadius: 20,
              fontSize: '0.72rem',
              color: '#f5deb3',
              fontWeight: 600
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              Beed Hub • Live Operations
            </div>
          </div>

          {/* Section Category Title */}
          <div style={{
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#8fa89b',
            fontWeight: 800,
            padding: '0 8px 10px'
          }}>
            Operating Engines
          </div>

          {/* Sidebar Menu Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {navItems.map(item => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectSection(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: isActive ? '1.5px solid #d4af37' : '1.5px solid transparent',
                    background: isActive 
                      ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.22) 0%, rgba(212, 175, 55, 0.08) 100%)' 
                      : 'transparent',
                    color: isActive ? '#ffffff' : '#cadbd2',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.18s ease',
                    boxShadow: isActive ? '0 4px 14px rgba(0,0,0,0.2)' : 'none'
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                      e.currentTarget.style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#cadbd2';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      color: isActive ? '#f3c64c' : '#9ca3af',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{
                        fontSize: '0.9rem',
                        fontWeight: isActive ? 800 : 600,
                        lineHeight: 1.2
                      }}>
                        {item.label}
                      </div>
                      <div style={{
                        fontSize: '0.72rem',
                        color: isActive ? '#f5deb3' : '#718096',
                        marginTop: 2
                      }}>
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                  {isActive && (
                    <ChevronRight size={16} color="#f3c64c" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Info */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 10
        }}>
          <div style={{
            background: 'rgba(0,0,0,0.25)',
            border: '1px solid rgba(212,175,55,0.2)',
            borderRadius: 8,
            padding: '10px 12px',
            fontSize: '0.74rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f3c64c', fontWeight: 700 }}>
              <Server size={12} /> SQLite Database
            </div>
            <div style={{ color: '#cadbd2', marginTop: 3 }}>
              mezbaan.db • 13 Tables Verified
            </div>
          </div>

          {onNavigatePortal && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button
                onClick={() => onNavigatePortal('requirements')}
                style={{
                  background: 'transparent',
                  border: '1px dashed rgba(212,175,55,0.4)',
                  borderRadius: 6,
                  padding: '8px 10px',
                  color: '#f5deb3',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <FileText size={13} color="#f3c64c" /> Intake Requirement Sheet
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ============================================================== */}
      {/* 2. MOBILE / TABLET TOP SUB-BAR (< 992px) */}
      {/* ============================================================== */}
      <div className="admin-mobile-subbar" style={{
        display: 'none',
        flexDirection: 'column',
        width: '100%',
        background: '#09261c',
        borderBottom: '2px solid #d4af37',
        padding: '10px 16px',
        position: 'sticky',
        top: 60,
        zIndex: 30
      }}>
        {/* Mobile Header Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#d4af37', display: 'flex', alignItems: 'center' }}>
              <Shield size={18} />
            </span>
            <span style={{ color: '#ffffff', fontWeight: 800, fontSize: '0.92rem', fontFamily: 'Outfit' }}>
              ADMIN OS
            </span>
            <span style={{
              background: 'rgba(212,175,55,0.2)',
              color: '#f3c64c',
              fontSize: '0.7rem',
              padding: '2px 8px',
              borderRadius: 12,
              fontWeight: 700
            }}>
              {currentItem.label}
            </span>
          </div>

          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(212,175,55,0.3)',
              color: '#ffffff',
              padding: '5px 10px',
              borderRadius: 6,
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer'
            }}
          >
            {mobileSidebarOpen ? <X size={14} /> : <Menu size={14} />}
            <span>Sections</span>
          </button>
        </div>

        {/* Horizontal Quick-Switch Pill Bar for Mobile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          paddingBottom: 2
        }}>
          {navItems.map(item => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectSection(item.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 20,
                  fontSize: '0.78rem',
                  fontWeight: isActive ? 800 : 600,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  background: isActive ? 'linear-gradient(135deg, #dfbc46 0%, #c49d27 100%)' : 'rgba(255,255,255,0.08)',
                  color: isActive ? '#0a291f' : '#d1ded8',
                  border: isActive ? '1px solid #f3c64c' : '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer'
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. MOBILE SLIDE-OVER DRAWER OVERLAY */}
      {/* ============================================================== */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 9999,
            display: 'flex',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              width: '82%',
              maxWidth: 320,
              height: '100%',
              background: '#09261c',
              color: '#ffffff',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '4px 0 24px rgba(0,0,0,0.4)',
              overflowY: 'auto'
            }}
          >
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: 16,
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                marginBottom: 20
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Shield size={22} color="#d4af37" />
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f3c64c', fontFamily: 'Outfit' }}>
                    MEZBAAN OS
                  </span>
                </div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    padding: 4,
                    cursor: 'pointer'
                  }}
                >
                  <X size={22} />
                </button>
              </div>

              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#8fa89b', fontWeight: 800, marginBottom: 12 }}>
                Admin Operating Sections
              </div>

              <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {navItems.map(item => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectSection(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        borderRadius: 8,
                        background: isActive ? '#0f3d2e' : 'rgba(255,255,255,0.05)',
                        border: isActive ? '1.5px solid #d4af37' : '1px solid rgba(255,255,255,0.1)',
                        color: isActive ? '#ffffff' : '#cadbd2',
                        fontSize: '0.9rem',
                        fontWeight: isActive ? 800 : 600,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ color: isActive ? '#f3c64c' : '#9ca3af' }}>{item.icon}</span>
                        <div>
                          <div>{item.label}</div>
                          <div style={{ fontSize: '0.72rem', color: '#8fa89b', marginTop: 2 }}>{item.subtitle}</div>
                        </div>
                      </div>
                      {isActive && <CheckCircle size={16} color="#f3c64c" />}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div style={{ paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '0.74rem', color: '#8fa89b', marginBottom: 8 }}>
                SQLite 3 Engine • Beed Region
              </div>
              {onNavigatePortal && (
                <button
                  onClick={() => { setMobileSidebarOpen(false); onNavigatePortal('requirements'); }}
                  style={{
                    width: '100%',
                    background: 'rgba(212, 175, 55, 0.15)',
                    border: '1px solid #d4af37',
                    borderRadius: 8,
                    padding: '10px 14px',
                    color: '#f5deb3',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    cursor: 'pointer'
                  }}
                >
                  <FileText size={16} color="#f3c64c" /> Take Customer Requirement
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. MAIN WORKSPACE / CONTENT AREA */}
      {/* ============================================================== */}
      <main style={{
        flex: 1,
        minWidth: 0,
        overflowY: 'auto',
        position: 'relative'
      }}>
        {/* Breadcrumb Context Bar */}
        <div style={{
          background: '#ffffff',
          borderBottom: '1px solid #ebdcc0',
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.82rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#6b7280' }}>
            <span style={{ fontWeight: 700, color: '#0f3d2e', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Shield size={14} color="#b38f20" /> Admin OS
            </span>
            <ChevronRight size={14} />
            <span style={{ fontWeight: 800, color: '#b38f20' }}>
              {currentItem.label}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              fontSize: '0.74rem',
              color: '#0e633d',
              background: '#eaf5ee',
              padding: '2px 8px',
              borderRadius: 4,
              fontWeight: 700
            }}>
              INTERNAL MANAGEMENT
            </span>
          </div>
        </div>

        {/* View Switcher based on Active Section */}
        <div>
          {activeSection === 'dashboard' && (
            <AdminPortal />
          )}

          {activeSection === 'customer' && (
            <CustomerPortal openPlanModal={openPlanModal} />
          )}

          {activeSection === 'vendor' && (
            <VendorPortal />
          )}

          {activeSection === 'database' && (
            <DatabaseExplorer viewMode="database" />
          )}

          {activeSection === 'schema' && (
            <DatabaseExplorer viewMode="schema" />
          )}
        </div>
      </main>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 991px) {
          .admin-os-container {
            flex-direction: column !important;
          }
          .admin-desktop-sidebar {
            display: none !important;
          }
          .admin-mobile-subbar {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
