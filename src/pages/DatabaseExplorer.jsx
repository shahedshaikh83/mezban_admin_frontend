import React, { useState, useEffect } from 'react';
import { 
  Database, Table, Key, Link2, CheckCircle, RefreshCw, 
  Layers, HardDrive, ShieldCheck, ArrowRight, Server 
} from 'lucide-react';

export default function DatabaseExplorer({ viewMode = 'all' }) {
  const [tablesOverview, setTablesOverview] = useState([]);
  const [selectedTable, setSelectedTable] = useState('events');
  const [tableData, setTableData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState(viewMode);

  useEffect(() => {
    setActiveView(viewMode);
  }, [viewMode]);

  useEffect(() => {
    fetchTablesOverview();
  }, []);

  useEffect(() => {
    if (selectedTable) {
      loadTableData(selectedTable);
    }
  }, [selectedTable]);

  const fetchTablesOverview = () => {
    fetch('/api/database/overview')
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setTablesOverview(d.tables);
        }
      })
      .catch(console.error);
  };

  const loadTableData = (name) => {
    setLoading(true);
    fetch(`/api/database/table/${name}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setTableData(d);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  // Schema relationship map conforming to user ER diagram
  const erDiagramSchema = [
    {
      name: 'venues',
      purpose: 'Physical halls, banquet gardens & local properties in Beed, Kaij, Ambajogai',
      pk: 'venue_id',
      fks: [],
      fields: ['venue_id (PK)', 'name', 'address', 'city', 'capacity', 'facilities', 'status']
    },
    {
      name: 'customers',
      purpose: 'Customer profiles, contact coordinates, event history',
      pk: 'customer_id',
      fks: [],
      fields: ['customer_id (PK)', 'name', 'phone', 'email', 'address', 'status', 'created_at', 'updated_at']
    },
    {
      name: 'service_categories',
      purpose: 'Categorization of event solutions (Catering, Decor, Media, Sound, etc.)',
      pk: 'category_id',
      fks: [],
      fields: ['category_id (PK)', 'name']
    },
    {
      name: 'services',
      purpose: 'Standard service line catalogue items',
      pk: 'service_id',
      fks: ['category_id -> service_categories'],
      fields: ['service_id (PK)', 'category_id (FK)', 'name', 'description']
    },
    {
      name: 'events',
      purpose: 'Central business entity: wedding, walima, birthday, gathering',
      pk: 'event_id',
      fks: ['customer_id -> customers', 'venue_id -> venues'],
      fields: ['event_id (PK)', 'customer_id (FK)', 'venue_id (FK)', 'event_type', 'event_date', 'location', 'guest_count', 'budget', 'status', 'created_at']
    },
    {
      name: 'event_requirements',
      purpose: 'Specific service line items required by customer for their event',
      pk: 'requirement_id',
      fks: ['event_id -> events', 'service_id -> services'],
      fields: ['requirement_id (PK)', 'event_id (FK)', 'service_id (FK)', 'details', 'quantity', 'status']
    },
    {
      name: 'vendors',
      purpose: 'Verified local contractors in Beed region',
      pk: 'vendor_id',
      fks: [],
      fields: ['vendor_id (PK)', 'business_name', 'contact_person', 'phone', 'email', 'city', 'verification_status', 'rating', 'status']
    },
    {
      name: 'vendor_services',
      purpose: 'Service catalog provided by each vendor with base pricing & capacity',
      pk: 'vendor_service_id',
      fks: ['vendor_id -> vendors', 'service_id -> services'],
      fields: ['vendor_service_id (PK)', 'vendor_id (FK)', 'service_id (FK)', 'base_price', 'capacity']
    },
    {
      name: 'quotes',
      purpose: 'Commercial quotation linking total vendor cost + Mezbaan margin = selling price',
      pk: 'quote_id',
      fks: ['event_id -> events'],
      fields: ['quote_id (PK)', 'event_id (FK)', 'total_cost', 'mezbaan_margin', 'total_price', 'status', 'valid_until']
    },
    {
      name: 'quote_items',
      purpose: 'Itemized quotation breakdown with vendor cost vs customer price',
      pk: 'quote_item_id',
      fks: ['quote_id -> quotes', 'vendor_id -> vendors', 'service_id -> services'],
      fields: ['quote_item_id (PK)', 'quote_id (FK)', 'vendor_id (FK)', 'service_id (FK)', 'vendor_cost', 'customer_price']
    },
    {
      name: 'bookings',
      purpose: 'Confirmed vendor work assignments upon quote approval',
      pk: 'booking_id',
      fks: ['event_id -> events', 'vendor_id -> vendors', 'quote_id -> quotes'],
      fields: ['booking_id (PK)', 'event_id (FK)', 'vendor_id (FK)', 'quote_id (FK)', 'agreed_amount', 'status', 'booked_on']
    },
    {
      name: 'payments',
      purpose: 'Financial receipts and disbursements (Customer Advance, Vendor Payouts)',
      pk: 'payment_id',
      fks: ['event_id -> events', 'booking_id -> bookings'],
      fields: ['payment_id (PK)', 'event_id (FK)', 'booking_id (FK)', 'amount', 'payment_type', 'method', 'paid_on', 'status']
    },
    {
      name: 'expenses',
      purpose: 'Direct operational expenses per event (transport, printing, permits)',
      pk: 'expense_id',
      fks: ['event_id -> events', 'vendor_id -> vendors', 'booking_id -> bookings'],
      fields: ['expense_id (PK)', 'event_id (FK)', 'vendor_id (FK)', 'booking_id (FK)', 'description', 'amount', 'spent_on']
    }
  ];

  return (
    <div className="container fade-in" style={{ padding: '36px 24px 80px' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #09261c 0%, #0f3d2e 100%)',
        color: '#ffffff',
        borderRadius: 16,
        padding: '28px 32px',
        marginBottom: 32,
        border: '2px solid #d4af37',
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 20
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <Database size={24} color="#f3c64c" />
            <h1 style={{ fontSize: '1.75rem', color: '#ffffff', margin: 0, fontFamily: 'Outfit' }}>
              Central Relational Database & ER Architecture
            </h1>
          </div>
          <p style={{ fontSize: '0.92rem', color: '#cadbd2', margin: 0, maxWidth: 680 }}>
            Conforms 100% to the approved MEZBAAN ER Diagram. Implemented in high-performance SQLite (<code style={{ color: '#f3c64c' }}>mezbaan.db</code>) with full Foreign Key enforcement and audit tracking.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            background: 'rgba(255,255,255,0.08)',
            padding: '10px 18px',
            borderRadius: 12,
            border: '1px solid rgba(212,175,55,0.3)',
            fontSize: '0.85rem'
          }}>
            <div style={{ color: '#f3c64c', fontWeight: 700 }}>Database Engine</div>
            <div style={{ color: '#ffffff' }}>SQLite 3 (better-sqlite3)</div>
          </div>
          <button onClick={fetchTablesOverview} className="btn-gold" style={{ fontSize: '0.85rem' }}>
            <RefreshCw size={15} /> Refresh Overview
          </button>
        </div>
      </div>

      {/* View Filter Switcher Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
        background: '#f3efe6',
        padding: '6px 12px',
        borderRadius: 30,
        border: '1px solid #e2d7c0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveView('database')}
            style={{
              padding: '7px 18px',
              borderRadius: 20,
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: activeView === 'database' ? '#0f3d2e' : 'transparent',
              color: activeView === 'database' ? '#ffffff' : '#374151',
              border: activeView === 'database' ? '1px solid #0f3d2e' : '1px solid transparent',
              cursor: 'pointer'
            }}
          >
            <Table size={14} color={activeView === 'database' ? '#f3c64c' : 'currentColor'} /> Live Table Data Inspector
          </button>
          <button
            onClick={() => setActiveView('schema')}
            style={{
              padding: '7px 18px',
              borderRadius: 20,
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: activeView === 'schema' ? '#0f3d2e' : 'transparent',
              color: activeView === 'schema' ? '#ffffff' : '#374151',
              border: activeView === 'schema' ? '1px solid #0f3d2e' : '1px solid transparent',
              cursor: 'pointer'
            }}
          >
            <Layers size={14} color={activeView === 'schema' ? '#f3c64c' : 'currentColor'} /> ER Diagram & Schema (13 Entities)
          </button>
          <button
            onClick={() => setActiveView('all')}
            style={{
              padding: '7px 18px',
              borderRadius: 20,
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: activeView === 'all' ? '#0f3d2e' : 'transparent',
              color: activeView === 'all' ? '#ffffff' : '#374151',
              border: activeView === 'all' ? '1px solid #0f3d2e' : '1px solid transparent',
              cursor: 'pointer'
            }}
          >
            <Database size={14} color={activeView === 'all' ? '#f3c64c' : 'currentColor'} /> Combined Overview
          </button>
        </div>

        <div style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: 600 }}>
          {activeView === 'database' && `Inspecting: ${selectedTable}`}
          {activeView === 'schema' && '13 Schema Entities with PK/FK definitions'}
          {activeView === 'all' && 'Full Relational Model & Live Data'}
        </div>
      </div>

      {/* Quick Table Switcher Bar when in database-only view */}
      {activeView === 'database' && (
        <div style={{
          marginBottom: 20,
          background: '#ffffff',
          padding: '12px 16px',
          borderRadius: 12,
          border: '1px solid #ebdcc0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#6b7280', marginBottom: 8 }}>
            Select SQLite Table to Inspect:
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {erDiagramSchema.map(t => {
              const count = tablesOverview.find(o => o.table === t.name)?.count;
              const isSel = selectedTable === t.name;
              return (
                <button
                  key={t.name}
                  onClick={() => setSelectedTable(t.name)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    fontSize: '0.8rem',
                    fontWeight: isSel ? 800 : 600,
                    background: isSel ? '#0f3d2e' : '#f9fafb',
                    color: isSel ? '#ffffff' : '#374151',
                    border: isSel ? '1px solid #0f3d2e' : '1px solid #d1d5db',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <span>{t.name}</span>
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '1px 5px',
                    borderRadius: 4,
                    background: isSel ? '#d4af37' : '#e5e7eb',
                    color: isSel ? '#0a291f' : '#4b5563',
                    fontWeight: 700
                  }}>
                    {count !== undefined ? count : '...'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 1. ER Diagram Entity Cards Matrix (Shown for 'schema' or 'all') */}
      {(activeView === 'schema' || activeView === 'all') && (
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: '1.35rem', color: '#0f3d2e', margin: 0 }}>
              ER Schema Entities (13 Tables)
            </h2>
            <span style={{ fontSize: '0.82rem', color: '#666' }}>
              Click any table below to inspect live records in real time
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 250px), 1fr))',
            gap: 16
          }}>
            {erDiagramSchema.map(item => {
              const countInfo = tablesOverview.find(t => t.table === item.name);
              const isSelected = selectedTable === item.name;

              return (
                <div
                  key={item.name}
                  onClick={() => {
                    setSelectedTable(item.name);
                    if (activeView === 'schema') {
                      setActiveView('database');
                    }
                  }}
                  style={{
                    background: isSelected ? '#ffffff' : '#faf8f5',
                    border: isSelected ? '2px solid #d4af37' : '1px solid #ebdcc0',
                    borderRadius: 12,
                    padding: 18,
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 4px 18px rgba(212, 175, 55, 0.25)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{
                      fontSize: '1.05rem',
                      fontWeight: 800,
                      color: isSelected ? '#b38f20' : '#0f3d2e',
                      fontFamily: 'Outfit'
                    }}>
                      {item.name}
                    </span>
                    <span className={`badge ${countInfo?.count > 0 ? 'badge-green' : 'badge-gold'}`}>
                      {countInfo ? `${countInfo.count} rows` : '...'}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: '#666', lineHeight: 1.5, marginBottom: 12, minHeight: 34 }}>
                    {item.purpose}
                  </p>

                  <div style={{ fontSize: '0.72rem', color: '#444', background: '#f5f0e6', padding: '6px 10px', borderRadius: 6 }}>
                    <strong>PK:</strong> {item.pk}
                    {item.fks.length > 0 && (
                      <div style={{ marginTop: 2, color: '#0f3d2e' }}>
                        <strong>FKs:</strong> {item.fks.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Live Table Data Inspector (Shown for 'database' or 'all') */}
      {(activeView === 'database' || activeView === 'all') && tableData && (
        <div className="card-luxury">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Table size={22} color="#b38f20" />
              <div>
                <h3 style={{ fontSize: '1.3rem', color: '#0f3d2e', margin: 0 }}>
                  Table: <span style={{ color: '#b38f20' }}>{tableData.tableName}</span>
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#666' }}>
                  Showing {tableData.rows.length} records from SQLite database
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <span className="badge badge-gold">
                Columns: {tableData.columns.length}
              </span>
              <span className="badge badge-green">
                Status: Query OK
              </span>
            </div>
          </div>

          {/* Table View */}
          <div className="table-container" style={{ maxHeight: 480, overflowY: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  {tableData.columns.map(col => (
                    <th key={col.name}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {col.pk === 1 && <Key size={13} color="#d4af37" />}
                        <span>{col.name}</span>
                        <span style={{ fontSize: '0.68rem', opacity: 0.6, fontWeight: 400 }}>({col.type})</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.rows.map((row, idx) => (
                  <tr key={idx}>
                    {tableData.columns.map(col => {
                      const val = row[col.name];
                      const isPk = col.pk === 1;
                      return (
                        <td key={col.name} style={{ fontWeight: isPk ? 700 : 400, color: isPk ? '#b38f20' : 'inherit' }}>
                          {val === null || val === undefined 
                            ? <span style={{ color: '#aaa', fontStyle: 'italic' }}>NULL</span>
                            : String(val)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
