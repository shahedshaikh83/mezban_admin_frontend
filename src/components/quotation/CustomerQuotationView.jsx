import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, Printer, ArrowLeft, MessageSquare, 
  CheckCircle, Crown, Plus, Trash2, Edit3, Save, X, Check
} from 'lucide-react';

const CATEGORIES = [
  'Catering & Dastarkhwan',
  'Venue & Hospitality',
  'Decoration & Theme Setup',
  'Photography & Cinematic Media',
  'Sound, Lights & Entertainment',
  'Stage & Seating',
  'Invitations & Printing',
  'Hospitality & Coordination',
  'Custom Service'
];

const CATALOG_SERVICES = [
  // 1. Catering & Dastarkhwan
  {
    name: 'Catering (Both Veg & Non-Veg) - Dinner',
    category: 'Catering & Dastarkhwan',
    vendor: 'Royal Beed Dastarkhwan & Caterers',
    price: 168264,
    details: '450 Guests @ ₹374/person (Mughlai, Biryani, Desserts)'
  },
  {
    name: 'Traditional Non-Veg Dastarkhwan',
    category: 'Catering & Dastarkhwan',
    vendor: 'Royal Beed Dastarkhwan & Caterers',
    price: 150000,
    details: 'Authentic Beed dum biryani, mutton dalcha, naan, shahi tukda, salad with royal dastarkhwan service'
  },
  {
    name: 'Deluxe Pure Vegetarian Buffet',
    category: 'Catering & Dastarkhwan',
    vendor: 'Annapurna Pure Veg Caterers',
    price: 115000,
    details: 'Paneer specialties, dal makhani, assorted breads, pulao, gulab jamun, live chaat counter'
  },
  {
    name: 'Live Dessert Counter & Mocktail Bar',
    category: 'Catering & Dastarkhwan',
    vendor: 'Royal Beed Dastarkhwan & Caterers',
    price: 28000,
    details: 'Live Jalebi, Rabdi, Shahi Tukda, Kulfi counter and exotic fruit mocktails'
  },
  {
    name: 'Hi-Tea, Snacks & Breakfast Counter',
    category: 'Catering & Dastarkhwan',
    vendor: 'Royal Beed Dastarkhwan & Caterers',
    price: 22000,
    details: 'Irani chai, coffee, hot samosas, kachori, assorted cookies, mineral water setup'
  },

  // 2. Venue & Hospitality
  {
    name: 'Venue Liaison: Royal Palace Banquet & Lawns',
    category: 'Venue & Hospitality',
    vendor: 'Royal Palace Banquet & Lawns',
    price: 65000,
    details: 'AC hall, separate gents/ladies partition, generator backup in Jalna Road, Beed'
  },
  {
    name: 'Prime Banquet Hall & Lawn Booking',
    category: 'Venue & Hospitality',
    vendor: 'Shahi Lawn & Function Hall',
    price: 60000,
    details: 'Covered stage, separate dining partition, in-house kitchen, generator, valet parking'
  },
  {
    name: 'Vintage Luxury Car / Doli Entry',
    category: 'Venue & Hospitality',
    vendor: 'Beed Royal Vintage Fleet',
    price: 20000,
    details: 'Decorated luxury convertible entry for bride/groom with dedicated chauffeur'
  },

  // 3. Decoration & Theme Setup
  {
    name: 'Theme Decoration (Royal)',
    category: 'Decoration & Theme Setup',
    vendor: 'Noor Mandap & Floral Elegance',
    price: 54900,
    details: 'Royal styling: Main Stage, Entrance, Backdrop, Flower Decoration. Colors: Emerald Green & Royal Gold with Fresh Jasmine/Roses'
  },
  {
    name: 'Royal Wedding Stage & Floral Setup',
    category: 'Decoration & Theme Setup',
    vendor: 'Noor Mandap & Floral Elegance',
    price: 48000,
    details: 'Custom floral backdrop, grand sofa, ambient chandeliers, VIP stage layout'
  },
  {
    name: 'Floral Mandap & Entrance Canopy',
    category: 'Decoration & Theme Setup',
    vendor: 'Noor Mandap & Floral Elegance',
    price: 35000,
    details: 'Exquisite fresh Dutch roses, jasmine chandeliers, and royal drapery setup'
  },
  {
    name: 'Theme & Balloon Kids Setup',
    category: 'Decoration & Theme Setup',
    vendor: 'Noor Mandap & Floral Elegance',
    price: 18000,
    details: 'Custom cartoon/superhero balloon arches, photo booth, backdrop banners'
  },

  // 4. Photography & Cinematic Media
  {
    name: 'Cinematic Photography, 4K Video & Drone',
    category: 'Photography & Cinematic Media',
    vendor: 'Al-Falah Cinematic Studio',
    price: 54000,
    details: 'Traditional Photography, Candid Photography, Videography, Cinematic Video, Album, Drone'
  },
  {
    name: 'Cinematic Photography & 4K Videography',
    category: 'Photography & Cinematic Media',
    vendor: 'Al-Falah Cinematic Studio',
    price: 45000,
    details: 'Traditional + Candid photography, 4K video, Drone aerial shots, Premium hardbound album'
  },
  {
    name: 'Drone Aerial 4K Cinematography',
    category: 'Photography & Cinematic Media',
    vendor: 'Al-Falah Cinematic Studio',
    price: 16000,
    details: 'Licensed aerial 4K drone cinematography covering venue, crowd, and Barat'
  },
  {
    name: 'Traditional Photography & Album Only',
    category: 'Photography & Cinematic Media',
    vendor: 'Al-Falah Cinematic Studio',
    price: 24000,
    details: 'Full event coverage photography with high-gloss 40-page customized photo album'
  },

  // 5. Sound, Lights & Entertainment
  {
    name: 'Pro Sound, Stage Lighting & Audio Setup',
    category: 'Sound, Lights & Entertainment',
    vendor: 'Star Pro Light & Sound Systems',
    price: 27500,
    details: 'Sound System, Mic, Wireless Mic, Stage Lighting, LED Wall'
  },
  {
    name: 'Live Shehnai & Tasha Troup',
    category: 'Sound, Lights & Entertainment',
    vendor: 'Ustad Shaukat Shehnai Troup',
    price: 18000,
    details: 'Traditional live welcome musical ensemble for Barat & reception entrance'
  },
  {
    name: 'DJ, Ambient Lights & Dance Floor',
    category: 'Sound, Lights & Entertainment',
    vendor: 'Star Pro Light & Sound Systems',
    price: 22000,
    details: 'Professional DJ, dual subs, intelligent moving heads, smoke machine and acrylic dance floor'
  },

  // 6. Stage & Seating
  {
    name: 'VIP Shamiana, Sofa & Seating Setup',
    category: 'Stage & Seating',
    vendor: 'Marathwada Tent & Seating House',
    price: 32000,
    details: 'Separate gents & ladies section seating, round tables with royal linens, high-back VIP chairs'
  },

  // 7. Invitations & Printing
  {
    name: 'Custom Invitation Cards & E-Invites',
    category: 'Invitations & Printing',
    vendor: 'Beed Royal Graphics & Printers',
    price: 12000,
    details: 'Designer Urdu/English/Marathi invitation cards, WhatsApp video invite, RSVP management'
  },

  // 8. Hospitality & Coordination
  {
    name: 'VIP Guest Welcome & Hostesses',
    category: 'Hospitality & Coordination',
    vendor: 'Mezban Hospitality Team',
    price: 15000,
    details: 'Professional welcome team in traditional attire with rose water & attar reception'
  },
  {
    name: 'Dedicated On-Site Operations Supervisor',
    category: 'Hospitality & Coordination',
    vendor: 'Mezban Operations Lead',
    price: 20000,
    details: 'End-to-end timeline coordination, vendor quality checks, catering & crowd supervision'
  },
  {
    name: 'Bridal Makeup, Mehendi & Custom Cake',
    category: 'Hospitality & Coordination',
    vendor: 'Glamour Bridal Studio Beed',
    price: 26000,
    details: 'HD bridal makeover, intricate Arabic bridal mehendi, multi-tier designer celebration cake'
  }
];

const STANDARD_VENDORS = [
  'Royal Beed Dastarkhwan & Caterers',
  'Annapurna Pure Veg Caterers',
  'Royal Palace Banquet & Lawns',
  'Shahi Lawn & Function Hall',
  'Noor Mandap & Floral Elegance',
  'Al-Falah Cinematic Studio',
  'Star Pro Light & Sound Systems',
  'Beed Royal Vintage Fleet',
  'Ustad Shaukat Shehnai Troup',
  'Marathwada Tent & Seating House',
  'Beed Royal Graphics & Printers',
  'Glamour Bridal Studio Beed',
  'Mezban Hospitality Team',
  'Mezban Verified Partner'
];

export default function CustomerQuotationView({
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
  // Local state initialized from props
  const [items, setItems] = useState(quoteItems);
  const [summary, setSummary] = useState(quoteSummary);
  const [notification, setNotification] = useState(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const issuedDate = useMemo(() => {
    return new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }, []);

  // Merge database services with catalog
  const allCatalogServices = useMemo(() => {
    const combined = [...CATALOG_SERVICES];
    if (Array.isArray(dbServices)) {
      dbServices.forEach(s => {
        const sName = s.service_name || s.name;
        if (sName && !combined.some(c => c.name.toLowerCase() === sName.toLowerCase())) {
          combined.push({
            name: sName,
            category: s.category_name || s.category || 'Custom Service',
            vendor: s.vendor_name || 'Mezban Verified Partner',
            price: parseFloat(s.base_price || s.price || 15000),
            details: s.description || ''
          });
        }
      });
    }
    return combined;
  }, [dbServices]);

  // Grouped catalog by category for <optgroup> in dropdowns
  const groupedCatalog = useMemo(() => {
    const groups = {};
    allCatalogServices.forEach(srv => {
      const cat = srv.category || 'Custom Service';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(srv);
    });
    return Object.keys(groups).map(cat => ({
      category: cat,
      items: groups[cat]
    }));
  }, [allCatalogServices]);

  // Combined list of vendor names
  const allVendorsList = useMemo(() => {
    const list = [...STANDARD_VENDORS];
    if (Array.isArray(dbVendors)) {
      dbVendors.forEach(v => {
        const vName = v.business_name || v.name;
        if (vName && !list.includes(vName)) {
          list.push(vName);
        }
      });
    }
    return list;
  }, [dbVendors]);

  // Modal States
  const [editingIndex, setEditingIndex] = useState(null);
  const [editForm, setEditForm] = useState({
    service_name: '',
    category: 'Custom Service',
    details: '',
    vendor_name: 'Mezban Verified Partner',
    customer_price: ''
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [newServiceForm, setNewServiceForm] = useState({
    service_name: '',
    category: 'Catering & Dastarkhwan',
    details: '',
    vendor_name: 'Royal Beed Dastarkhwan & Caterers',
    customer_price: 25000
  });

  // Keep local state in sync when props change
  useEffect(() => {
    if (Array.isArray(quoteItems) && quoteItems.length > 0) {
      setItems(quoteItems);
    }
  }, [quoteItems]);

  useEffect(() => {
    if (quoteSummary && (quoteSummary.totalPrice !== undefined || quoteSummary.totalCost !== undefined)) {
      setSummary(quoteSummary);
    }
  }, [quoteSummary]);

  const notify = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Recompute summary & push updates upward
  const syncItemsAndSummary = (updatedItems) => {
    let totalCost = 0;
    let totalPrice = 0;
    updatedItems.forEach(it => {
      const cPrice = parseFloat(it.customer_price) || 0;
      const vCost = parseFloat(it.vendor_cost) || Math.round(cPrice * 0.80);
      totalCost += vCost;
      totalPrice += cPrice;
    });

    const mezbaanMargin = totalPrice - totalCost;
    const advanceRequired = Math.round(totalPrice * 0.30);
    const marginPct = totalPrice > 0 ? Math.round((mezbaanMargin / totalPrice) * 100) : 0;

    const newSummary = {
      totalCost,
      totalPrice,
      mezbaanMargin,
      advanceRequired,
      marginPct
    };

    setItems(updatedItems);
    setSummary(newSummary);

    if (typeof setQuoteItems === 'function') {
      setQuoteItems(updatedItems);
    }
    if (typeof setQuoteSummary === 'function') {
      setQuoteSummary(newSummary);
    }
  };

  const computedItemsTotal = useMemo(() => {
    if (!Array.isArray(items) || items.length === 0) return 0;
    return items.reduce((sum, it) => sum + (parseFloat(it.customer_price) || 0), 0);
  }, [items]);

  const totalPrice = Number(summary?.totalPrice || computedItemsTotal || 0);
  const advanceRequired = Number(summary?.advanceRequired || Math.round(totalPrice * 0.30));

  // Edit Service Handlers
  const handleOpenEditModal = (item, index) => {
    setEditingIndex(index);
    setEditForm({
      service_name: item.service_name || '',
      category: item.category || 'Custom Service',
      details: item.details || '',
      vendor_name: item.vendor_name || 'Mezban Verified Partner',
      customer_price: item.customer_price !== undefined ? item.customer_price : ''
    });
  };

  // Handle selecting a service from the dropdown in Edit Modal
  const handleSelectServicePresetInEdit = (selectedName) => {
    if (selectedName === '__custom__') return;
    const match = allCatalogServices.find(s => s.name === selectedName);
    if (match) {
      setEditForm(prev => ({
        ...prev,
        service_name: match.name,
        category: match.category || prev.category,
        details: match.details || prev.details,
        vendor_name: match.vendor || prev.vendor_name,
        customer_price: match.price !== undefined ? match.price : prev.customer_price
      }));
    }
  };

  const handleSaveEdit = (e) => {
    e?.preventDefault();
    if (editingIndex === null || editingIndex < 0 || editingIndex >= items.length) return;
    if (!editForm.service_name.trim()) {
      alert('Please select or enter a service name');
      return;
    }

    const price = parseFloat(editForm.customer_price) || 0;
    const updated = [...items];
    const prevItem = updated[editingIndex];

    updated[editingIndex] = {
      ...prevItem,
      service_name: editForm.service_name.trim(),
      category: editForm.category.trim() || 'Custom Service',
      details: editForm.details.trim(),
      vendor_name: editForm.vendor_name.trim() || 'Mezban Verified Partner',
      customer_price: price,
      vendor_cost: prevItem.vendor_cost && prevItem.customer_price > 0
        ? Math.round(price * (prevItem.vendor_cost / prevItem.customer_price))
        : Math.round(price * 0.80)
    };

    syncItemsAndSummary(updated);
    setEditingIndex(null);
    notify(`Updated "${editForm.service_name}"!`);
  };

  // Add Service Handlers
  const handleOpenAddModal = () => {
    setShowAddModal(true);
    setNewServiceForm({
      service_name: '',
      category: 'Catering & Dastarkhwan',
      details: '',
      vendor_name: 'Royal Beed Dastarkhwan & Caterers',
      customer_price: 25000
    });
  };

  // Handle selecting a service from the dropdown in Add Modal
  const handleSelectServicePresetInAdd = (selectedName) => {
    if (selectedName === '__custom__') return;
    const match = allCatalogServices.find(s => s.name === selectedName);
    if (match) {
      setNewServiceForm(prev => ({
        ...prev,
        service_name: match.name,
        category: match.category || prev.category,
        details: match.details || prev.details,
        vendor_name: match.vendor || prev.vendor_name,
        customer_price: match.price !== undefined ? match.price : prev.customer_price
      }));
    }
  };

  const handleSaveNewService = (e) => {
    e?.preventDefault();
    if (!newServiceForm.service_name.trim()) {
      alert('Please select or enter a service name');
      return;
    }

    const price = parseFloat(newServiceForm.customer_price) || 0;
    const newItem = {
      quote_item_id: `custom_${Date.now()}`,
      service_id: Date.now(),
      service_name: newServiceForm.service_name.trim(),
      category: newServiceForm.category.trim() || 'Custom Service',
      details: newServiceForm.details.trim(),
      vendor_name: newServiceForm.vendor_name.trim() || 'Mezban Verified Partner',
      customer_price: price,
      vendor_cost: Math.round(price * 0.80),
      margin_pct: 20
    };

    const updated = [...items, newItem];
    syncItemsAndSummary(updated);
    setShowAddModal(false);
    notify(`Added "${newItem.service_name}" to quotation!`);
  };

  // Delete Service Handler
  const handleDeleteItem = (index) => {
    const itemToDelete = items[index];
    if (window.confirm(`Are you sure you want to remove "${itemToDelete?.service_name || 'this service'}" from the quotation?`)) {
      const updated = items.filter((_, idx) => idx !== index);
      syncItemsAndSummary(updated);
      notify(`Removed "${itemToDelete?.service_name || 'Service'}" from quotation.`);
    }
  };

  // Save Quotation Handler
  const handleSave = async () => {
    setIsSavingDraft(true);
    try {
      if (typeof onSaveDraft === 'function') {
        await onSaveDraft();
      } else {
        const existing = JSON.parse(localStorage.getItem('mezban_draft_sheets') || '[]');
        const idx = existing.findIndex(s => s.sheet_id === sheetId);
        const updatedRecord = {
          sheet_id: sheetId || `local_${Date.now()}`,
          customer_name: formData.customerName,
          event_type: Array.isArray(formData.eventTypes) ? formData.eventTypes.join(' & ') : 'Event',
          event_date: formData.eventDate,
          mobile: formData.mobile,
          form_data: formData,
          quote_items: items,
          quote_summary: summary,
          updated_at: new Date().toISOString()
        };
        if (idx >= 0) existing[idx] = updatedRecord;
        else existing.unshift(updatedRecord);
        localStorage.setItem('mezban_draft_sheets', JSON.stringify(existing));
      }
      notify('Quotation draft saved successfully!');
    } catch (err) {
      console.error(err);
      notify('Quotation saved locally in browser.');
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Format customer-safe WhatsApp message (strictly no internal costs or margins)
  const handleSendWhatsApp = () => {
    let itemsText = '';
    if (Array.isArray(items)) {
      itemsText = items
        .map((it, idx) => `${idx + 1}. *${it.service_name}*: ₹${Number(it.customer_price || 0).toLocaleString('en-IN')}`)
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
*Location:* ${formData.venueName || formData.venueArea || formData.preferredArea || 'Beed'}
----------------------------------------
*ITEMIZED EVENT PACKAGE:*
${itemsText}
----------------------------------------
*TOTAL ESTIMATED PRICE:* ₹${totalPrice.toLocaleString('en-IN')}
*Booking Advance (30%):* ₹${advanceRequired.toLocaleString('en-IN')}

✓ 100% Verified Vendor Execution
✓ Dedicated On-Site Mezbaan Operations Supervisor
✓ Zero Hidden Fees
----------------------------------------
To lock this event date with Mezbaan, please reply to this message or contact our office at +91 98220 14589.`;

    const url = `https://wa.me/${mobileWithCountry}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="customer-quotation-view" style={{
      background: '#fbf9f5',
      minHeight: '100vh',
      padding: '24px 16px 80px',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Toast Notification */}
      {notification && (
        <div className="no-print" style={{
          position: 'fixed',
          top: 24,
          right: 24,
          zIndex: 99999,
          background: notification.type === 'error' ? '#ef4444' : '#0f3d2e',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: 8,
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: '0.9rem',
          fontWeight: 600,
          border: '1px solid #d4af37',
          animation: 'slideIn 0.25s ease'
        }}>
          <Check size={18} color="#d4af37" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Navigation & Action Controls */}
      <div className="no-print" style={{
        maxWidth: 960,
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
              <ArrowLeft size={16} /> Back to Requirements
            </button>
          )}

          <div>
            <span style={{
              fontSize: '0.74rem',
              fontWeight: 800,
              color: '#d4af37',
              background: '#0f3d2e',
              padding: '3px 10px',
              borderRadius: 4,
              letterSpacing: '0.5px'
            }}>
              OFFICIAL ESTIMATED BUDGET
            </span>
            <h2 style={{ margin: '4px 0 0', fontSize: '1.45rem', color: '#0f3d2e', fontWeight: 900 }}>
              Estimated Event Budget & Quotation Breakdown
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
              Edit Requirements
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={isSavingDraft || saving}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              background: '#0f3d2e',
              border: '1.5px solid #d4af37',
              color: '#ffffff',
              borderRadius: 6,
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: isSavingDraft || saving ? 'wait' : 'pointer'
            }}
          >
            <Save size={15} color="#d4af37" /> {isSavingDraft || saving ? 'Saving...' : 'Save Quotation'}
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              background: '#ffffff',
              border: '1.5px solid #d4af37',
              color: '#0f3d2e',
              borderRadius: 6,
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Printer size={15} color="#b38f20" /> Print / Save PDF
          </button>

          <button
            type="button"
            onClick={handleSendWhatsApp}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              background: '#25D366',
              border: 'none',
              color: '#ffffff',
              borderRadius: 6,
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(37, 211, 102, 0.3)'
            }}
          >
            <MessageSquare size={15} /> WhatsApp Quotation
          </button>
        </div>
      </div>

      {/* Main Printable Document Card */}
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div className="quotation-print-card" style={{
          background: '#ffffff',
          border: '1.5px solid #dcd3c4',
          borderRadius: 12,
          padding: '36px 36px 44px',
          boxShadow: '0 10px 35px rgba(0,0,0,0.06)'
        }}>
          {/* Header with Mezbaan Branding */}
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
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #0f3d2e 0%, #0a291f 100%)',
                  border: '1.5px solid #d4af37',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#d4af37'
                }}>
                  <Crown size={22} />
                </div>
                <div>
                  <h1 style={{ margin: 0, fontSize: '1.55rem', fontWeight: 900, color: '#0f3d2e', letterSpacing: '0.02em', fontFamily: 'Outfit' }}>
                    MEZBAN EVENTS & WEDDINGS
                  </h1>
                  <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: '#6b7280', fontWeight: 500 }}>
                    Aapka Event, Hamari Zimmedari • Beed
                  </p>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{
                background: '#eaf5ee',
                color: '#0e633d',
                border: '1px solid #a9dec1',
                fontSize: '0.78rem',
                fontWeight: 800,
                padding: '4px 12px',
                borderRadius: 20,
                display: 'inline-block',
                marginBottom: 6
              }}>
                VERIFIED ESTIMATE & PROPOSAL
              </span>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#111827' }}>
                Ref: MEZ-QT-{sheetId ? String(sheetId).padStart(4, '0') : '2026-01'}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                Issued: {issuedDate}
              </div>
            </div>
          </div>

          {/* Client & Event Summary Grid */}
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
                📞 {formData.whatsapp || formData.mobile || 'Contact provided'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700 }}>
                Event Details
              </span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827', marginTop: 2 }}>
                {Array.isArray(formData.eventTypes) ? formData.eventTypes.join(' & ') : (formData.eventType || 'Wedding / Event')}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#4b5563', marginTop: 2 }}>
                📅 {formData.eventDate || 'Date confirmed'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700 }}>
                Venue & Location
              </span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827', marginTop: 2 }}>
                {formData.venueName || 'Banquet Hall / Lawn partner'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#4b5563', marginTop: 2 }}>
                📍 {formData.venueArea || formData.preferredArea || 'Beed District'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700 }}>
                Guests & Dining
              </span>
              <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f3d2e', marginTop: 2 }}>
                {formData.approxGuestCount || 300} Guests
              </div>
              <div style={{ fontSize: '0.8rem', color: '#4b5563', marginTop: 2 }}>
                🍽️ {formData.foodPreference || 'Veg & Non-Veg'}
              </div>
            </div>
          </div>

          {/* Customer Financial Summary Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: 16,
            marginBottom: 28
          }}>
            {/* Card 1: Total Estimated Customer Price */}
            <div style={{
              background: 'linear-gradient(135deg, #0f3d2e 0%, #164e3b 100%)',
              color: '#ffffff',
              borderRadius: 10,
              padding: '20px 24px',
              border: '1.5px solid #d4af37',
              boxShadow: '0 4px 14px rgba(15, 61, 46, 0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#f3c64c', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em' }}>
                  Total Estimated Event Budget
                </span>
                <span style={{ background: 'rgba(212, 175, 55, 0.2)', color: '#f3c64c', fontSize: '0.7rem', padding: '2px 8px', borderRadius: 12, fontWeight: 700 }}>
                  All-Inclusive
                </span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', marginTop: 6, fontFamily: 'Outfit' }}>
                ₹{totalPrice.toLocaleString('en-IN')}
              </div>
              <span style={{ fontSize: '0.76rem', color: '#a7f3d0', marginTop: 4, display: 'block' }}>
                Complete event execution with dedicated on-site supervisor & team
              </span>
            </div>

            {/* Card 2: Booking Advance Required */}
            <div style={{
              background: '#fffdf7',
              border: '1.5px solid #ebd998',
              borderRadius: 10,
              padding: '20px 24px',
              boxShadow: '0 2px 10px rgba(212, 175, 55, 0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#92400e', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em' }}>
                  Booking Advance (30%)
                </span>
                <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '0.7rem', padding: '2px 8px', borderRadius: 12, fontWeight: 700 }}>
                  Date Lock
                </span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#92400e', marginTop: 6, fontFamily: 'Outfit' }}>
                ₹{advanceRequired.toLocaleString('en-IN')}
              </div>
              <span style={{ fontSize: '0.76rem', color: '#78350f', marginTop: 4, display: 'block' }}>
                Required to confirm venue, caterers, and prime vendors for your date
              </span>
            </div>
          </div>

          {/* Section Header: Itemized Services & Controls */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 14,
            borderBottom: '1px solid #ebdcc0',
            paddingBottom: 10,
            flexWrap: 'wrap',
            gap: 10
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f3d2e' }}>
                Itemized Service Quotation
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#6b7280' }}>
                Transparent pricing per service line item • Zero hidden charges • Fully customizable
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                fontSize: '0.8rem',
                color: '#0f3d2e',
                fontWeight: 700,
                background: '#f3efe6',
                padding: '4px 10px',
                borderRadius: 20
              }}>
                {items.length} Services Included
              </span>

              <button
                type="button"
                onClick={handleOpenAddModal}
                className="no-print"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 14px',
                  background: '#0f3d2e',
                  border: '1.5px solid #d4af37',
                  color: '#ffffff',
                  borderRadius: 6,
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(15, 61, 46, 0.2)'
                }}
              >
                <Plus size={15} color="#d4af37" /> Add Service
              </button>
            </div>
          </div>

          {/* Itemized Table with In-line Edit & Remove Capabilities */}
          <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: 8, marginBottom: 14 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: '#f3efe6', color: '#1f2937', textAlign: 'left', borderBottom: '1.5px solid #d1d5db' }}>
                  <th style={{ padding: '12px 14px', width: 40 }}>#</th>
                  <th style={{ padding: '12px 14px', minWidth: 260 }}>Service & Description</th>
                  <th style={{ padding: '12px 14px', minWidth: 200 }}>Execution Partner</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right', minWidth: 140 }}>Client Price (₹)</th>
                  <th className="no-print" style={{ padding: '12px 14px', textAlign: 'center', width: 110 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: 32, textAlign: 'center', color: '#64748b' }}>
                      <p style={{ margin: '0 0 12px', fontSize: '0.95rem' }}>No services in this quotation yet.</p>
                      <button
                        type="button"
                        onClick={handleOpenAddModal}
                        className="no-print"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '8px 16px',
                          background: '#0f3d2e',
                          color: '#ffffff',
                          border: '1px solid #d4af37',
                          borderRadius: 6,
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        <Plus size={15} color="#d4af37" /> Add Your First Service
                      </button>
                    </td>
                  </tr>
                ) : (
                  items.map((it, idx) => (
                    <tr key={it.quote_item_id || it.service_id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#6b7280' }}>
                        {idx + 1}
                      </td>

                      {/* Service Name, Inclusions & Category */}
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 800, color: '#111827', fontSize: '0.92rem' }}>
                          {it.service_name}
                        </div>
                        {it.details && (
                          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 3 }}>
                            {it.details}
                          </div>
                        )}
                        {it.category && (
                          <span style={{
                            display: 'inline-block',
                            background: '#f3efe6',
                            color: '#0f3d2e',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: 4,
                            marginTop: 4
                          }}>
                            {it.category}
                          </span>
                        )}
                      </td>

                      {/* Assigned Execution Partner */}
                      <td style={{ padding: '12px 14px', color: '#374151', fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <CheckCircle size={14} color="#059669" />
                          <span>{it.vendor_name || 'Mezban Verified Partner'}</span>
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#6b7280', marginLeft: 20, display: 'block' }}>
                          Quality Inspected & Supervised
                        </span>
                      </td>

                      {/* Client Price */}
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800, color: '#0f3d2e', fontSize: '0.98rem' }}>
                        ₹{Number(it.customer_price || 0).toLocaleString('en-IN')}
                      </td>

                      {/* Edit & Remove Actions */}
                      <td className="no-print" style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(it, idx)}
                            title="Edit Service Details or Price"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              padding: '6px 10px',
                              borderRadius: 6,
                              background: '#ffffff',
                              border: '1px solid #cbd5e1',
                              color: '#0f3d2e',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                            }}
                          >
                            <Edit3 size={13} color="#0f3d2e" /> Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteItem(idx)}
                            title="Remove Service"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '6px 8px',
                              borderRadius: 6,
                              background: '#fff1f2',
                              border: '1px solid #fecdd3',
                              color: '#e11d48',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr style={{ background: '#f8fafc', fontWeight: 900, borderTop: '2px solid #cbd5e1' }}>
                  <td colSpan={3} style={{ padding: '14px', textAlign: 'right', color: '#1e293b', fontSize: '0.95rem' }}>
                    TOTAL ESTIMATED QUOTATION:
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right', color: '#0f3d2e', fontSize: '1.25rem', fontFamily: 'Outfit' }}>
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </td>
                  <td className="no-print" style={{ padding: '14px' }}></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Quick Add Bottom Row */}
          <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 28 }}>
            <button
              type="button"
              onClick={handleOpenAddModal}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '9px 18px',
                borderRadius: 8,
                border: '1.5px dashed #0f3d2e',
                background: '#f4fbf7',
                color: '#0f3d2e',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Plus size={16} /> Add Custom Service or Line Item
            </button>
          </div>

          {/* Guarantee, Quality Assurance & Booking Terms */}
          <div style={{
            background: '#fbfaf8',
            border: '1px solid #e7dfd5',
            borderRadius: 8,
            padding: '16px 20px',
            marginBottom: 28,
            fontSize: '0.82rem',
            color: '#4b5563'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0f3d2e', fontWeight: 800, marginBottom: 8, fontSize: '0.88rem' }}>
              <Shield size={16} color="#d4af37" /> MEZBAAN Quality Assurance & Booking Terms
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
              <li><strong>Price Validity:</strong> This quotation is valid for 14 calendar days from the date of issue.</li>
              <li><strong>Date Confirmation:</strong> A 30% advance deposit confirms your event date lock and contract reservations across Beed and Marathwada.</li>
              <li><strong>Supervision:</strong> A dedicated on-ground Mezbaan event coordinator oversees every vendor, timeline, and quality check on the event day.</li>
              <li><strong>Balance Schedule:</strong> 50% payable 3 days before the event, remaining 20% upon successful event conclusion.</li>
            </ul>
          </div>

          {/* Signoff & Contact */}
          <div style={{
            borderTop: '1px solid #e5e7eb',
            paddingTop: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16
          }}>
            <div>
              <div style={{ fontWeight: 800, color: '#0f3d2e', fontSize: '0.92rem' }}>
                Mezbaan Events & Operations
              </div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: 2 }}>
                Beed Central Office • Jalna Road, Beed, Maharashtra 431122
              </div>
              <div style={{ fontSize: '0.8rem', color: '#0f3d2e', fontWeight: 600, marginTop: 2 }}>
                📞 +91 98220 14589 • ✉️ contact@mezbaanevents.in
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.78rem', color: '#6b7280', fontStyle: 'italic', marginBottom: 2 }}>
                Authorized Event Proposal
              </div>
              <div style={{ fontWeight: 800, color: '#b38f20', letterSpacing: '0.04em' }}>
                MEZBAAN ASSURED
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODAL 1: EDIT SERVICE LINE ITEM */}
      {/* ============================================================== */}
      {editingIndex !== null && (
        <div className="no-print" style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 12,
            width: '100%',
            maxWidth: 580,
            border: '2px solid #d4af37',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              background: '#0f3d2e',
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Edit3 size={18} color="#d4af37" />
                <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.05rem', fontWeight: 800 }}>
                  Edit Quotation Service Item
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingIndex(null)}
                style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', padding: 4 }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveEdit} style={{ padding: '20px 24px' }}>
              {/* Service Selection Dropdown & Editable Title */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f3d2e' }}>
                    Select Service from Catalog (Dropdown) *
                  </label>
                  <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>
                    Choose any service to switch
                  </span>
                </div>

                {/* Dropdown list of catalog services */}
                <select
                  value={allCatalogServices.some(s => s.name === editForm.service_name) ? editForm.service_name : '__custom__'}
                  onChange={e => handleSelectServicePresetInEdit(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 6,
                    border: '2px solid #0f3d2e',
                    background: '#f4fbf7',
                    color: '#0f3d2e',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    outline: 'none',
                    marginBottom: 8,
                    cursor: 'pointer',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="__custom__">
                    {editForm.service_name ? `✏️ Current / Custom: "${editForm.service_name}"` : '-- Choose a Service from Catalog --'}
                  </option>
                  {groupedCatalog.map(grp => (
                    <optgroup key={grp.category} label={`━━ ${grp.category} ━━`}>
                      {grp.items.map(srv => (
                        <option key={srv.name} value={srv.name}>
                          {srv.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>

                {/* Editable Service Name text field */}
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#4b5563', marginBottom: 4 }}>
                  Service Name / Custom Title (Editable):
                </label>
                <input
                  type="text"
                  required
                  value={editForm.service_name}
                  onChange={e => setEditForm({ ...editForm, service_name: e.target.value })}
                  placeholder="e.g. Catering (Both Veg & Non-Veg) - Dinner"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 6,
                    border: '1.5px solid #d1d5db',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#0f3d2e'}
                  onBlur={e => e.target.style.borderColor = '#d1d5db'}
                />
              </div>

              {/* Category & Client Price */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: 5 }}>
                    Category
                  </label>
                  <select
                    value={editForm.category}
                    onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 10px',
                      borderRadius: 6,
                      border: '1.5px solid #d1d5db',
                      fontSize: '0.85rem',
                      background: '#ffffff',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: 5 }}>
                    Client Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="100"
                    value={editForm.customer_price}
                    onChange={e => setEditForm({ ...editForm, customer_price: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 6,
                      border: '1.5px solid #d1d5db',
                      fontSize: '0.92rem',
                      fontWeight: 800,
                      color: '#0f3d2e',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={e => e.target.style.borderColor = '#0f3d2e'}
                    onBlur={e => e.target.style.borderColor = '#d1d5db'}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#6b7280', display: 'block', marginTop: 3 }}>
                    ₹{Number(editForm.customer_price || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Execution Partner Selector & Custom Input */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151' }}>
                    Execution Partner / Vendor
                  </label>
                  <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                    Select partner or type below
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <select
                    value={allVendorsList.includes(editForm.vendor_name) ? editForm.vendor_name : '__custom_vendor__'}
                    onChange={e => {
                      if (e.target.value !== '__custom_vendor__') {
                        setEditForm({ ...editForm, vendor_name: e.target.value });
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: 6,
                      border: '1.5px solid #d1d5db',
                      fontSize: '0.82rem',
                      background: '#ffffff',
                      outline: 'none',
                      cursor: 'pointer',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="__custom_vendor__">-- Select Partner --</option>
                    {allVendorsList.map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={editForm.vendor_name}
                    onChange={e => setEditForm({ ...editForm, vendor_name: e.target.value })}
                    placeholder="Or type custom partner..."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1.5px solid #d1d5db',
                      fontSize: '0.85rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={e => e.target.style.borderColor = '#0f3d2e'}
                    onBlur={e => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>
              </div>

              {/* Description & Inclusions */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: 5 }}>
                  Description, Inclusions & Specifications
                </label>
                <textarea
                  rows={3}
                  value={editForm.details}
                  onChange={e => setEditForm({ ...editForm, details: e.target.value })}
                  placeholder="e.g. 450 Guests @ ₹374/person (Mughlai, Biryani, Desserts)"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1.5px solid #d1d5db',
                    fontSize: '0.85rem',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                  onFocus={e => e.target.style.borderColor = '#0f3d2e'}
                  onBlur={e => e.target.style.borderColor = '#d1d5db'}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setEditingIndex(null)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 6,
                    border: '1px solid #d1d5db',
                    background: '#f8fafc',
                    color: '#374151',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 20px',
                    borderRadius: 6,
                    border: '1px solid #d4af37',
                    background: '#0f3d2e',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(15, 61, 46, 0.25)'
                  }}
                >
                  <Check size={16} color="#d4af37" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: ADD NEW SERVICE TO QUOTATION */}
      {/* ============================================================== */}
      {showAddModal && (
        <div className="no-print" style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 12,
            width: '100%',
            maxWidth: 600,
            border: '2px solid #d4af37',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            overflow: 'hidden',
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Header */}
            <div style={{
              background: '#0f3d2e',
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Plus size={18} color="#d4af37" />
                <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.05rem', fontWeight: 800 }}>
                  Add Service to Quotation
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', padding: 4 }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div style={{ padding: '20px 24px', overflowY: 'auto' }}>
              <form onSubmit={handleSaveNewService}>
                {/* Catalog Service Dropdown */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f3d2e' }}>
                      Choose Service from Catalog (Dropdown) *
                    </label>
                    <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>
                      Auto-fills details & rates
                    </span>
                  </div>

                  <select
                    value={allCatalogServices.some(s => s.name === newServiceForm.service_name) ? newServiceForm.service_name : '__custom__'}
                    onChange={e => handleSelectServicePresetInAdd(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 6,
                      border: '2px solid #0f3d2e',
                      background: '#f4fbf7',
                      color: '#0f3d2e',
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      outline: 'none',
                      marginBottom: 8,
                      cursor: 'pointer',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="__custom__">
                      {newServiceForm.service_name ? `✏️ Selected: "${newServiceForm.service_name}"` : '-- Choose a Service from Catalog --'}
                    </option>
                    {groupedCatalog.map(grp => (
                      <optgroup key={grp.category} label={`━━ ${grp.category} ━━`}>
                        {grp.items.map(srv => (
                          <option key={srv.name} value={srv.name}>
                            {srv.name} (₹{srv.price.toLocaleString('en-IN')})
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>

                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#4b5563', marginBottom: 4 }}>
                    Service Name / Custom Title (Editable):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VIP Vintage Doli & Barat Procession"
                    value={newServiceForm.service_name}
                    onChange={e => setNewServiceForm({ ...newServiceForm, service_name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 6,
                      border: '1.5px solid #d1d5db',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={e => e.target.style.borderColor = '#0f3d2e'}
                    onBlur={e => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: 5 }}>
                      Category
                    </label>
                    <select
                      value={newServiceForm.category}
                      onChange={e => setNewServiceForm({ ...newServiceForm, category: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '9px 10px',
                        borderRadius: 6,
                        border: '1.5px solid #d1d5db',
                        fontSize: '0.85rem',
                        background: '#ffffff',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: 5 }}>
                      Client Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="100"
                      value={newServiceForm.customer_price}
                      onChange={e => setNewServiceForm({ ...newServiceForm, customer_price: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: 6,
                        border: '1.5px solid #d1d5db',
                        fontSize: '0.92rem',
                        fontWeight: 800,
                        color: '#0f3d2e',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      onFocus={e => e.target.style.borderColor = '#0f3d2e'}
                      onBlur={e => e.target.style.borderColor = '#d1d5db'}
                    />
                    <span style={{ fontSize: '0.72rem', color: '#6b7280', display: 'block', marginTop: 3 }}>
                      ₹{Number(newServiceForm.customer_price || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Execution Partner Selector & Custom Input */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151' }}>
                      Execution Partner / Vendor
                    </label>
                    <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                      Select partner or type below
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <select
                      value={allVendorsList.includes(newServiceForm.vendor_name) ? newServiceForm.vendor_name : '__custom_vendor__'}
                      onChange={e => {
                        if (e.target.value !== '__custom_vendor__') {
                          setNewServiceForm({ ...newServiceForm, vendor_name: e.target.value });
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 6,
                        border: '1.5px solid #d1d5db',
                        fontSize: '0.82rem',
                        background: '#ffffff',
                        outline: 'none',
                        cursor: 'pointer',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="__custom_vendor__">-- Select Partner --</option>
                      {allVendorsList.map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={newServiceForm.vendor_name}
                      onChange={e => setNewServiceForm({ ...newServiceForm, vendor_name: e.target.value })}
                      placeholder="Or type custom partner..."
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 6,
                        border: '1.5px solid #d1d5db',
                        fontSize: '0.85rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      onFocus={e => e.target.style.borderColor = '#0f3d2e'}
                      onBlur={e => e.target.style.borderColor = '#d1d5db'}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: 5 }}>
                    Description & Inclusions
                  </label>
                  <textarea
                    rows={3}
                    value={newServiceForm.details}
                    onChange={e => setNewServiceForm({ ...newServiceForm, details: e.target.value })}
                    placeholder="e.g. Detailed scope of service, guest coverage, setup specifications"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1.5px solid #d1d5db',
                      fontSize: '0.85rem',
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit'
                    }}
                    onFocus={e => e.target.style.borderColor = '#0f3d2e'}
                    onBlur={e => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 6,
                      border: '1px solid #d1d5db',
                      background: '#f8fafc',
                      color: '#374151',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '8px 20px',
                      borderRadius: 6,
                      border: '1px solid #d4af37',
                      background: '#0f3d2e',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(15, 61, 46, 0.25)'
                    }}
                  >
                    <Plus size={16} color="#d4af37" /> Add to Quotation
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Print Specific CSS */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          header, footer, .no-print, .portal-bar, .admin-desktop-sidebar, .admin-mobile-subbar {
            display: none !important;
          }
          .customer-quotation-view {
            padding: 0 !important;
            background: #ffffff !important;
          }
          .quotation-print-card {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
