import React, { useState } from 'react';
import { 
  Shield, Printer, ArrowLeft, Plus, Trash2, Send, 
  Phone, Mail, MessageSquare, Check, AlertCircle, Edit3
} from 'lucide-react';

export default function AdminQuotationView({
  formData = {},
  quoteItems = [],
  setQuoteItems,
  quoteSummary = {},
  setQuoteSummary,
  sheetId = null,
  dbVendors = [],
  dbServices = [],
  onEditRequirements,
  onSaveDraft,
  onClose,
  saving = false
}) {
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [newServiceItem, setNewServiceItem] = useState({
    service_id: '',
    service_name: '',
    category: 'Custom Service',
    vendor_id: '',
    vendor_name: '',
    vendor_cost: 5000,
    margin_pct: 20,
    customer_price: 6000,
    details: ''
  });

  // Handle dynamic cell recalculations
  const handleItemFieldChange = (index, field, value) => {
    const updated = [...quoteItems];
    const current = { ...updated[index] };

    if (field === 'vendor_cost') {
      const vCost = parseFloat(value) || 0;
      current.vendor_cost = vCost;
      const margin = parseFloat(current.margin_pct) || 20;
      current.customer_price = Math.round(vCost * (1 + margin / 100));
    } else if (field === 'margin_pct') {
      const margin = parseFloat(value) || 0;
      current.margin_pct = margin;
      const vCost = parseFloat(current.vendor_cost) || 0;
      current.customer_price = Math.round(vCost * (1 + margin / 100));
    } else if (field === 'customer_price') {
      const cPrice = parseFloat(value) || 0;
      current.customer_price = cPrice;
      const vCost = parseFloat(current.vendor_cost) || 0;
      if (vCost > 0) {
        current.margin_pct = Math.round(((cPrice - vCost) / vCost) * 100);
      }
    } else {
      current[field] = value;
    }

    updated[index] = current;
    setQuoteItems(updated);

    // Recompute total summary
    let totalCost = 0;
    let totalPrice = 0;
    updated.forEach(it => {
      totalCost += parseFloat(it.vendor_cost || 0);
      totalPrice += parseFloat(it.customer_price || 0);
    });

    const mezbaanMargin = totalPrice - totalCost;
    const advanceRequired = Math.round(totalPrice * 0.30);
    const marginPct = totalPrice > 0 ? Math.round((mezbaanMargin / totalPrice) * 100) : 0;

    setQuoteSummary({
      totalCost,
      totalPrice,
      mezbaanMargin,
      advanceRequired,
      marginPct
    });
  };

  const handleDeleteItem = (index) => {
    const updated = quoteItems.filter((_, idx) => idx !== index);
    setQuoteItems(updated);

    let totalCost = 0;
    let totalPrice = 0;
    updated.forEach(it => {
      totalCost += parseFloat(it.vendor_cost || 0);
      totalPrice += parseFloat(it.customer_price || 0);
    });

    const mezbaanMargin = totalPrice - totalCost;
    const advanceRequired = Math.round(totalPrice * 0.30);
    const marginPct = totalPrice > 0 ? Math.round((mezbaanMargin / totalPrice) * 100) : 0;

    setQuoteSummary({
      totalCost,
      totalPrice,
      mezbaanMargin,
      advanceRequired,
      marginPct
    });
  };

  const handleAddNewItem = (e) => {
    e.preventDefault();
    if (!newServiceItem.service_name.trim()) return;

    const vCost = parseFloat(newServiceItem.vendor_cost) || 0;
    const margin = parseFloat(newServiceItem.margin_pct) || 20;
    const cPrice = parseFloat(newServiceItem.customer_price) || Math.round(vCost * (1 + margin / 100));

    const itemToAdd = {
      ...newServiceItem,
      vendor_cost: vCost,
      margin_pct: margin,
      customer_price: cPrice
    };

    const updated = [...quoteItems, itemToAdd];
    setQuoteItems(updated);

    let totalCost = 0;
    let totalPrice = 0;
    updated.forEach(it => {
      totalCost += parseFloat(it.vendor_cost || 0);
      totalPrice += parseFloat(it.customer_price || 0);
    });

    const mezbaanMargin = totalPrice - totalCost;
    const advanceRequired = Math.round(totalPrice * 0.30);
    const marginPct = totalPrice > 0 ? Math.round((mezbaanMargin / totalPrice) * 100) : 0;

    setQuoteSummary({
      totalCost,
      totalPrice,
      mezbaanMargin,
      advanceRequired,
      marginPct
    });

    setShowAddServiceModal(false);
    setNewServiceItem({
      service_id: '',
      service_name: '',
      category: 'Custom Service',
      vendor_id: '',
      vendor_name: '',
      vendor_cost: 5000,
      margin_pct: 20,
      customer_price: 6000,
      details: ''
    });
  };

  const handleSendWhatsApp = () => {
    let itemsText = '';
    if (Array.isArray(quoteItems)) {
      itemsText = quoteItems
        .map((it, idx) => `${idx + 1}. *${it.service_name}*: ₹${Number(it.customer_price).toLocaleString('en-IN')}`)
        .join('\n');
    }

    const cleanMobile = (formData.whatsapp || formData.mobile || '').replace(/\D/g, '');
    const mobileWithCountry = cleanMobile.startsWith('91') ? cleanMobile : (cleanMobile ? `91${cleanMobile}` : '919822014589');

    const message = 
`👑 *MEZBAAN EVENTS & WEDDINGS*
*Official Customer Event Quotation*
----------------------------------------
*Client:* ${formData.customerName || 'Valued Client'}
*Event:* ${Array.isArray(formData.eventTypes) ? formData.eventTypes.join(' & ') : (formData.eventType || 'Wedding / Event')}
*Date:* ${formData.eventDate || 'Upcoming'}
*Guests:* ${formData.approxGuestCount || 300}
----------------------------------------
*ITEMIZED SERVICES:*
${itemsText}
----------------------------------------
*TOTAL ESTIMATED QUOTE:* ₹${Number(quoteSummary.totalPrice || 0).toLocaleString('en-IN')}
*Advance Required (30%):* ₹${Number(quoteSummary.advanceRequired || 0).toLocaleString('en-IN')}

✓ Transparent Pricing • Zero Hidden Charges
✓ 100% Verified Quality Vendors & Supervised Execution
----------------------------------------
To confirm this booking, reply to this message or call Mezban Support: +91 98220 14589`;

    const url = `https://wa.me/${mobileWithCountry}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="admin-quotation-view" style={{
      background: '#fbf9f5',
      minHeight: '100vh',
      padding: '24px 16px 80px',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Top Bar with Admin Badge */}
      <div className="no-print" style={{
        maxWidth: 1040,
        margin: '0 auto 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 8,
                background: '#ffffff',
                border: '1px solid #d1d5db',
                color: '#374151',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={16} /> Back to Admin OS
            </button>
          )}

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#f3c64c',
                background: '#09261c',
                border: '1px solid #d4af37',
                padding: '3px 8px',
                borderRadius: 4,
                letterSpacing: '0.5px'
              }}>
                ADMIN INTERNAL COSTING ENGINE
              </span>
              <span style={{ fontSize: '0.74rem', color: '#047857', background: '#ecfdf5', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
                FULL MARGIN & COST ACCESS
              </span>
            </div>
            <h2 style={{ margin: '4px 0 0', fontSize: '1.4rem', color: '#0f3d2e', fontWeight: 900 }}>
              Quotation, Costing & Margin Control
            </h2>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {onEditRequirements && (
            <button
              type="button"
              onClick={onEditRequirements}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                background: '#ffffff',
                border: '1px solid #d1d5db',
                color: '#374151',
                borderRadius: 6,
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Edit3 size={14} /> Edit Requirements Form
            </button>
          )}

          <button
            type="button"
            onClick={() => window.print()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              background: '#ffffff',
              border: '1px solid #d1d5db',
              color: '#374151',
              borderRadius: 6,
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Printer size={15} /> Print Internal Costing
          </button>

          <button
            type="button"
            onClick={onSaveDraft}
            disabled={saving}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              background: '#0f3d2e',
              border: '1.5px solid #d4af37',
              color: '#ffffff',
              borderRadius: 6,
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: saving ? 'wait' : 'pointer',
              boxShadow: '0 2px 8px rgba(15, 61, 46, 0.25)'
            }}
          >
            <Check size={15} color="#d4af37" /> {saving ? 'Saving...' : 'Save Updated Rates & Allocations'}
          </button>
        </div>
      </div>

      {/* Main Internal Document Card */}
      <div style={{ maxWidth: 1040, margin: '0 auto' }}>
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #dcd3c4',
          borderRadius: 12,
          padding: '36px 36px 44px',
          boxShadow: '0 10px 35px rgba(0,0,0,0.06)'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '2px solid #0f3d2e',
            paddingBottom: 20,
            marginBottom: 24,
            flexWrap: 'wrap',
            gap: 16
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: 8,
                  background: '#0f3d2e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#d4af37'
                }}>
                  <Shield size={20} />
                </div>
                <div>
                  <h1 style={{ margin: 0, fontSize: '1.55rem', fontWeight: 900, color: '#0f3d2e' }}>
                    MEZBAN EVENTS & WEDDINGS
                  </h1>
                  <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: '#6b7280' }}>
                    Central Operating Engine • Internal Margin & Allocation Sheet
                  </p>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{
                background: '#fef3c7',
                color: '#92400e',
                fontSize: '0.78rem',
                fontWeight: 800,
                padding: '4px 12px',
                borderRadius: 20,
                display: 'inline-block',
                marginBottom: 4
              }}>
                INTERNAL ADMIN MASTER
              </span>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827' }}>
                Quote Ref: MEZ-QT-{sheetId ? String(sheetId).padStart(4, '0') : '2026-01'}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Client & Event Coordinates */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
            gap: 16,
            background: '#fcfaf6',
            border: '1px solid #ebdcc5',
            borderRadius: 8,
            padding: '16px 20px',
            marginBottom: 24
          }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700 }}>
                Client / Family
              </span>
              <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f3d2e', marginTop: 2 }}>
                {formData.customerName || 'Valued Client'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#4b5563', marginTop: 2 }}>
                📞 {formData.whatsapp || formData.mobile}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700 }}>
                Event Details
              </span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827', marginTop: 2 }}>
                {Array.isArray(formData.eventTypes) ? formData.eventTypes.join(' & ') : 'Wedding / Event'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#4b5563', marginTop: 2 }}>
                📅 {formData.eventDate || 'Date Tentative'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700 }}>
                Venue & Location
              </span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827', marginTop: 2 }}>
                {formData.venueName || 'Banquet / Lawn to be confirmed'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#4b5563', marginTop: 2 }}>
                📍 {formData.venueArea || formData.preferredArea || 'Beed'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700 }}>
                Guests & Dining
              </span>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f3d2e', marginTop: 2 }}>
                {formData.approxGuestCount || 300} Guests
              </div>
              <div style={{ fontSize: '0.8rem', color: '#4b5563', marginTop: 2 }}>
                🍽️ {formData.foodPreference || 'Veg & Non-Veg'}
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* COMPLETE ADMIN FINANCIAL KPI CARDS (ALL 4 CARDS) */}
          {/* ============================================================== */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 210px), 1fr))',
            gap: 14,
            marginBottom: 28
          }}>
            {/* Card 1: Total Customer Price */}
            <div style={{ background: '#0f3d2e', color: '#ffffff', borderRadius: 8, padding: '16px 20px' }}>
              <span style={{ fontSize: '0.74rem', color: '#d4af37', textTransform: 'uppercase', fontWeight: 700 }}>
                Total Estimated Customer Price
              </span>
              <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#ffffff', marginTop: 4 }}>
                ₹{Number(quoteSummary.totalPrice || 0).toLocaleString('en-IN')}
              </div>
              <span style={{ fontSize: '0.72rem', color: '#a7f3d0' }}>All-inclusive proposal</span>
            </div>

            {/* Card 2: Vendor Base Cost (Internal) */}
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: '16px 20px' }}>
              <span style={{ fontSize: '0.74rem', color: '#475569', textTransform: 'uppercase', fontWeight: 700 }}>
                Vendor Base Cost (Internal)
              </span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', marginTop: 4 }}>
                ₹{Number(quoteSummary.totalCost || 0).toLocaleString('en-IN')}
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Total payable to contractors</span>
            </div>

            {/* Card 3: MEZBAAN Gross Margin */}
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 8, padding: '16px 20px' }}>
              <span style={{ fontSize: '0.74rem', color: '#047857', textTransform: 'uppercase', fontWeight: 700 }}>
                Mezban Gross Margin
              </span>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#065f46', marginTop: 4 }}>
                ₹{Number(quoteSummary.mezbaanMargin || 0).toLocaleString('en-IN')}
              </div>
              <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 800 }}>
                {quoteSummary.marginPct || 0}% Projected Gross Margin
              </span>
            </div>

            {/* Card 4: Booking Advance */}
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '16px 20px' }}>
              <span style={{ fontSize: '0.74rem', color: '#b45309', textTransform: 'uppercase', fontWeight: 700 }}>
                Booking Advance (30%)
              </span>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#92400e', marginTop: 4 }}>
                ₹{Number(quoteSummary.advanceRequired || 0).toLocaleString('en-IN')}
              </div>
              <span style={{ fontSize: '0.72rem', color: '#b45309' }}>Required for date lock</span>
            </div>
          </div>

          {/* Table Header Controls */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 14,
            flexWrap: 'wrap',
            gap: 10
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f3d2e' }}>
                Itemized Service Quotation & Vendor Allocations
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#6b7280' }}>
                Admin controls: edit vendor costs, margin %, customer prices, and contractor allocations in real time.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddServiceModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: '#0f3d2e',
                color: '#ffffff',
                border: '1.5px solid #d4af37',
                padding: '8px 16px',
                borderRadius: 6,
                fontSize: '0.85rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              <Plus size={16} color="#d4af37" /> Add Service Item
            </button>
          </div>

          {/* Full Admin Editable Table */}
          <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: 8, marginBottom: 24 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: '#f3efe6', color: '#1f2937', textAlign: 'left', borderBottom: '1.5px solid #d1d5db' }}>
                  <th style={{ padding: '10px 12px', width: 36 }}>#</th>
                  <th style={{ padding: '10px 12px', minWidth: 220 }}>Service & Category</th>
                  <th style={{ padding: '10px 12px', minWidth: 190 }}>Vendor Assigned</th>
                  <th style={{ padding: '10px 12px', minWidth: 120 }}>Vendor Cost (₹)</th>
                  <th style={{ padding: '10px 12px', width: 85 }}>Margin %</th>
                  <th style={{ padding: '10px 12px', minWidth: 130 }}>Client Price (₹)</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', width: 60 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {quoteItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: 24, textAlign: 'center', color: '#9ca3af' }}>
                      No services in this quotation. Click "Add Service Item" to add.
                    </td>
                  </tr>
                ) : (
                  quoteItems.map((it, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: '#6b7280' }}>
                        {idx + 1}
                      </td>

                      {/* Service Name & Details */}
                      <td style={{ padding: '10px 12px' }}>
                        <input
                          type="text"
                          value={it.service_name}
                          onChange={e => handleItemFieldChange(idx, 'service_name', e.target.value)}
                          style={{
                            width: '100%',
                            fontWeight: 700,
                            color: '#111827',
                            border: '1px solid transparent',
                            borderRadius: 4,
                            padding: '3px 6px',
                            fontSize: '0.88rem'
                          }}
                          onFocus={e => e.target.style.borderColor = '#94a3b8'}
                          onBlur={e => e.target.style.borderColor = 'transparent'}
                        />
                        <input
                          type="text"
                          value={it.details || ''}
                          onChange={e => handleItemFieldChange(idx, 'details', e.target.value)}
                          placeholder="Specifications / notes"
                          style={{
                            width: '100%',
                            color: '#64748b',
                            border: '1px solid transparent',
                            borderRadius: 4,
                            padding: '2px 6px',
                            fontSize: '0.78rem',
                            marginTop: 2
                          }}
                          onFocus={e => e.target.style.borderColor = '#94a3b8'}
                          onBlur={e => e.target.style.borderColor = 'transparent'}
                        />
                      </td>

                      {/* Vendor Selector */}
                      <td style={{ padding: '10px 12px' }}>
                        <select
                          value={it.vendor_id || ''}
                          onChange={e => {
                            const vId = e.target.value ? Number(e.target.value) : null;
                            const vObj = dbVendors.find(v => v.vendor_id === vId);
                            handleItemFieldChange(idx, 'vendor_id', vId);
                            handleItemFieldChange(idx, 'vendor_name', vObj ? vObj.business_name : 'Mezban Direct Partner');
                          }}
                          style={{
                            width: '100%',
                            padding: '5px 8px',
                            border: '1px solid #d1d5db',
                            borderRadius: 4,
                            fontSize: '0.82rem',
                            background: '#ffffff'
                          }}
                        >
                          <option value="">{it.vendor_name || 'Mezban Direct'}</option>
                          {dbVendors.map(v => (
                            <option key={v.vendor_id} value={v.vendor_id}>
                              {v.business_name} ({v.city || 'Beed'})
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Vendor Cost (Internal) */}
                      <td style={{ padding: '10px 12px' }}>
                        <input
                          type="number"
                          value={it.vendor_cost}
                          onChange={e => handleItemFieldChange(idx, 'vendor_cost', e.target.value)}
                          style={{
                            width: 105,
                            padding: '5px 8px',
                            border: '1px solid #cbd5e1',
                            borderRadius: 4,
                            fontSize: '0.86rem',
                            color: '#1e293b'
                          }}
                        />
                      </td>

                      {/* Margin % */}
                      <td style={{ padding: '10px 12px' }}>
                        <input
                          type="number"
                          value={it.margin_pct || 0}
                          onChange={e => handleItemFieldChange(idx, 'margin_pct', e.target.value)}
                          style={{
                            width: 65,
                            padding: '5px 8px',
                            border: '1px solid #cbd5e1',
                            borderRadius: 4,
                            fontSize: '0.86rem',
                            textAlign: 'center',
                            fontWeight: 700,
                            color: '#059669'
                          }}
                        />
                      </td>

                      {/* Client Price */}
                      <td style={{ padding: '10px 12px' }}>
                        <input
                          type="number"
                          value={it.customer_price}
                          onChange={e => handleItemFieldChange(idx, 'customer_price', e.target.value)}
                          style={{
                            width: 120,
                            padding: '5px 8px',
                            border: '1.5px solid #0f3d2e',
                            borderRadius: 4,
                            fontWeight: 800,
                            color: '#0f3d2e',
                            fontSize: '0.92rem'
                          }}
                        />
                      </td>

                      {/* Delete Action */}
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(idx)}
                          title="Remove Service"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            padding: 4,
                            borderRadius: 4
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr style={{ background: '#f8fafc', fontWeight: 800, borderTop: '2px solid #cbd5e1' }}>
                  <td colSpan={3} style={{ padding: '12px', textAlign: 'right', color: '#1e293b' }}>
                    TOTAL COST & CLIENT PRICE:
                  </td>
                  <td style={{ padding: '12px', color: '#1e293b', fontWeight: 800 }}>
                    ₹{Number(quoteSummary.totalCost || 0).toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', color: '#059669', fontWeight: 800 }}>
                    {quoteSummary.marginPct || 0}%
                  </td>
                  <td style={{ padding: '12px', color: '#0f3d2e', fontSize: '1.15rem', fontWeight: 900 }}>
                    ₹{Number(quoteSummary.totalPrice || 0).toLocaleString('en-IN')}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Action Buttons */}
          <div style={{
            borderTop: '2px solid #0f3d2e',
            paddingTop: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16
          }}>
            <div style={{ display: 'flex', gap: 10 }}>
              {onEditRequirements && (
                <button
                  type="button"
                  onClick={onEditRequirements}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '10px 18px',
                    borderRadius: 8,
                    background: '#ffffff',
                    border: '1px solid #d1d5db',
                    color: '#374151',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer'
                  }}
                >
                  <ArrowLeft size={16} /> Edit Requirements Form
                </button>
              )}

              <button
                type="button"
                onClick={onSaveDraft}
                disabled={saving}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '10px 18px',
                  borderRadius: 8,
                  background: '#f3efe6',
                  border: '1px solid #d4af37',
                  color: '#0f3d2e',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: saving ? 'wait' : 'pointer'
                }}
              >
                <Check size={16} color="#0f3d2e" /> Save Quotation Draft
              </button>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                onClick={handleSendWhatsApp}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 20px',
                  borderRadius: 8,
                  background: '#25D366',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
                }}
              >
                <MessageSquare size={17} /> Send Customer Quote (WhatsApp)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add Service Item */}
      {showAddServiceModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 12,
            padding: 24,
            maxWidth: 520,
            width: '100%',
            boxShadow: '0 12px 30px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ margin: '0 0 16px', color: '#0f3d2e', fontSize: '1.25rem' }}>
              Add Service Item to Quotation
            </h3>
            <form onSubmit={handleAddNewItem}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>
                  Select Catalogue Service or Type Custom *
                </label>
                <select
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6, marginBottom: 8 }}
                  value={newServiceItem.service_id}
                  onChange={e => {
                    const sId = Number(e.target.value);
                    const sObj = dbServices.find(s => s.service_id === sId);
                    setNewServiceItem({
                      ...newServiceItem,
                      service_id: sId,
                      service_name: sObj ? sObj.name : newServiceItem.service_name,
                      category: sObj ? sObj.category_name : 'Custom Service'
                    });
                  }}
                >
                  <option value="">-- Choose Catalogue Item --</option>
                  {dbServices.map(s => (
                    <option key={s.service_id} value={s.service_id}>
                      {s.name} ({s.category_name})
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Service Name / Custom Item Name"
                  required
                  value={newServiceItem.service_name}
                  onChange={e => setNewServiceItem({ ...newServiceItem, service_name: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6, boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>
                  Assign Vendor (Optional)
                </label>
                <select
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6 }}
                  value={newServiceItem.vendor_id}
                  onChange={e => {
                    const vId = e.target.value ? Number(e.target.value) : '';
                    const vObj = dbVendors.find(v => v.vendor_id === vId);
                    setNewServiceItem({
                      ...newServiceItem,
                      vendor_id: vId,
                      vendor_name: vObj ? vObj.business_name : 'Mezban Direct Partner'
                    });
                  }}
                >
                  <option value="">-- Assign Vendor --</option>
                  {dbVendors.map(v => (
                    <option key={v.vendor_id} value={v.vendor_id}>
                      {v.business_name} ({v.city || 'Beed'})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: 4 }}>
                    Vendor Cost (₹)
                  </label>
                  <input
                    type="number"
                    value={newServiceItem.vendor_cost}
                    onChange={e => {
                      const cost = parseFloat(e.target.value) || 0;
                      const margin = parseFloat(newServiceItem.margin_pct) || 20;
                      setNewServiceItem({
                        ...newServiceItem,
                        vendor_cost: cost,
                        customer_price: Math.round(cost * (1 + margin / 100))
                      });
                    }}
                    style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: 6, boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: 4 }}>
                    Margin %
                  </label>
                  <input
                    type="number"
                    value={newServiceItem.margin_pct}
                    onChange={e => {
                      const margin = parseFloat(e.target.value) || 0;
                      const cost = parseFloat(newServiceItem.vendor_cost) || 0;
                      setNewServiceItem({
                        ...newServiceItem,
                        margin_pct: margin,
                        customer_price: Math.round(cost * (1 + margin / 100))
                      });
                    }}
                    style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: 6, boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: 4 }}>
                    Customer Price (₹)
                  </label>
                  <input
                    type="number"
                    value={newServiceItem.customer_price}
                    onChange={e => {
                      const price = parseFloat(e.target.value) || 0;
                      const cost = parseFloat(newServiceItem.vendor_cost) || 0;
                      const margin = cost > 0 ? Math.round(((price - cost) / cost) * 100) : 20;
                      setNewServiceItem({
                        ...newServiceItem,
                        customer_price: price,
                        margin_pct: margin
                      });
                    }}
                    style={{ width: '100%', padding: '8px', border: '1.5px solid #0f3d2e', borderRadius: 6, fontWeight: 800, boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowAddServiceModal(false)}
                  style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #d1d5db', background: '#ffffff', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', borderRadius: 6, border: 'none', background: '#0f3d2e', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
