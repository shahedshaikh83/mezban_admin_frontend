import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Users, IndianRupee, Check, Sparkles, AlertCircle } from 'lucide-react';

import { FALLBACK_VENUES, FALLBACK_SERVICES } from '../data/mockData';

export default function PlanEventModal({ isOpen, onClose, onEventCreated, onOpenQuotation }) {
  const [venues, setVenues] = useState(FALLBACK_VENUES);
  const [services, setServices] = useState(FALLBACK_SERVICES);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    event_type: 'Walima & Reception',
    event_date: '',
    location: 'Beed',
    guest_count: 300,
    budget: 250000,
    venue_id: '',
    selected_services: [2, 4, 6], // default: Catering, Decor, Photography
    special_requirements: 'Require separate ladies and gents dining sections with authentic Beed mutton dum biryani dastarkhwan service.'
  });

  useEffect(() => {
    if (isOpen) {
      // Fetch venues and services from backend if available
      fetch('/api/venues')
        .then(res => res.json())
        .then(data => { if (data && data.success && data.venues && data.venues.length > 0) setVenues(data.venues); })
        .catch(() => {});

      fetch('/api/services')
        .then(res => res.json())
        .then(data => { if (data && data.success && data.services && data.services.length > 0) setServices(data.services); })
        .catch(() => {});

      setSuccessData(null);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleServiceToggle = (serviceId) => {
    setFormData(prev => {
      const exists = prev.selected_services.includes(serviceId);
      if (exists) {
        return { ...prev, selected_services: prev.selected_services.filter(id => id !== serviceId) };
      } else {
        return { ...prev, selected_services: [...prev.selected_services, serviceId] };
      }
    });
  };

  // Calculate estimated quotation items based on selected services and guest count
  const calculateEstimate = (form) => {
    const guests = parseInt(form.guest_count, 10) || 300;
    const selected = Array.isArray(form.selected_services) ? form.selected_services : [];
    const items = [];

    // 1. Catering
    if (selected.includes(2) || selected.some(s => typeof s === 'string' && s.toLowerCase().includes('cater'))) {
      const cost = Math.round(guests * 380);
      items.push({
        service_id: 2,
        service_name: 'Royal Catering & Dastarkhwan (Dinner)',
        category: 'Catering & Dastarkhwan',
        customer_price: cost,
        vendor_name: 'Royal Beed Dastarkhwan & Caterers',
        details: `${guests} Guests @ ₹380/person (Authentic Beed Mughlai / Dum Biryani)`
      });
    }

    // 2. Decor
    if (selected.includes(4) || selected.some(s => typeof s === 'string' && s.toLowerCase().includes('decor'))) {
      items.push({
        service_id: 4,
        service_name: 'Royal Theme Decoration & Stage Setup',
        category: 'Decoration & Theme Setup',
        customer_price: 45000,
        vendor_name: 'Noor Mandap & Floral Elegance',
        details: 'Main stage floral setup, entrance gate, VIP backdrop, ambient lighting'
      });
    }

    // 3. Photography
    if (selected.includes(6) || selected.some(s => typeof s === 'string' && s.toLowerCase().includes('photo'))) {
      items.push({
        service_id: 6,
        service_name: 'Cinematic Photography & 4K Video Coverage',
        category: 'Photography & Cinematic Media',
        customer_price: 38000,
        vendor_name: 'Beed Royal Studio & Films',
        details: 'Traditional + Candid photographers, 4K video, Drone shoot, Premium Album'
      });
    }

    // 4. Sound & Lights
    if (selected.includes(5) || selected.some(s => typeof s === 'string' && s.toLowerCase().includes('sound'))) {
      items.push({
        service_id: 5,
        service_name: 'Acoustic Sound System & Ambient Stage Lighting',
        category: 'Sound, Lights & Entertainment',
        customer_price: 18000,
        vendor_name: 'Star Audio & Stage Lights',
        details: 'JBL Line array sound, wireless microphones, focus stage lighting'
      });
    }

    // 5. Stage & Shamiana
    if (selected.includes(3) || selected.some(s => typeof s === 'string' && s.toLowerCase().includes('tent'))) {
      items.push({
        service_id: 3,
        service_name: 'Grand Stage, VIP Sofas & Shamiana Seating',
        category: 'Stage & Seating',
        customer_price: 24000,
        vendor_name: 'Noor Mandap & Floral Elegance',
        details: `Grand elevated stage, VIP royal couches, ${guests} banquet chairs & dining tables`
      });
    }

    // 6. Venue Liaison
    if (form.venue_id) {
      const v = venues.find(vn => String(vn.venue_id) === String(form.venue_id));
      const venuePrice = v ? parseFloat(v.price_per_day || 60000) : 60000;
      items.push({
        service_id: 1,
        service_name: `Venue Liaison: ${v?.name || 'Prime Banquet Hall & Lawn'}`,
        category: 'Venue & Hospitality',
        customer_price: venuePrice,
        vendor_name: v?.name || 'Mezban Verified Venue Partner',
        details: `${v?.capacity || guests} capacity, AC Hall, generator backup, ${form.location || 'Beed'}`
      });
    }

    // 7. Mezban Supervision
    items.push({
      service_id: 1,
      service_name: 'Mezban On-Ground Event Coordination & Supervision',
      category: 'Hospitality & Coordination',
      customer_price: 25000,
      vendor_name: 'Mezban Operations Team (Beed)',
      details: 'Full day on-ground supervisor, timeline enforcement & 100% stress-free guarantee'
    });

    const totalPrice = items.reduce((sum, it) => sum + (parseFloat(it.customer_price) || 0), 0);
    const advanceRequired = Math.round(totalPrice * 0.30);
    return { items, summary: { totalPrice, advanceRequired } };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const calculatedQuote = calculateEstimate(formData);
    let createdSheetId = null;

    try {
      // 1. Submit enquiry record
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      // 2. Also register official requirement sheet with quote items in backend
      try {
        const sheetRes = await fetch('/api/requirement-sheets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            formData: {
              customerName: formData.name || 'Valued Client',
              mobile: formData.phone || '9822014589',
              email: formData.email,
              eventTypes: [formData.event_type || 'Wedding'],
              eventDate: formData.event_date || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
              approxGuestCount: formData.guest_count || 300,
              venueArea: formData.location || 'Beed',
              approxBudget: formData.budget || calculatedQuote.summary.totalPrice,
              notes: formData.special_requirements
            },
            quoteItems: calculatedQuote.items,
            quoteSummary: calculatedQuote.summary
          })
        });
        const sheetData = await sheetRes.json();
        if (sheetData.success && sheetData.sheet_id) {
          createdSheetId = sheetData.sheet_id;
        }
      } catch (sheetErr) {
        console.warn('Auto-generation of requirement sheet error:', sheetErr);
      }

      if (data.success) {
        const fullSuccessData = {
          ...data,
          sheet_id: createdSheetId,
          quote: calculatedQuote
        };
        if (onEventCreated) onEventCreated(fullSuccessData);

        // Automatically open the estimated budget page immediately upon submit!
        if (typeof onOpenQuotation === 'function') {
          onOpenQuotation(createdSheetId);
        } else {
          setSuccessData(fullSuccessData);
        }
      } else {
        setError(data.message || 'Failed to submit enquiry');
      }
    } catch {
      // In offline/Live Server mode without backend, save to local storage and open estimated budget page
      const localId = `local_${Date.now()}`;
      try {
        const existing = JSON.parse(localStorage.getItem('mezban_draft_sheets') || '[]');
        existing.unshift({
          sheet_id: localId,
          customer_name: formData.name || 'Valued Client',
          event_type: formData.event_type || 'Wedding',
          event_date: formData.event_date || new Date().toISOString().split('T')[0],
          mobile: formData.phone || '9822014589',
          form_data: formData,
          quote_items: calculatedQuote.items,
          quote_summary: calculatedQuote.summary,
          created_at: new Date().toISOString()
        });
        localStorage.setItem('mezban_draft_sheets', JSON.stringify(existing.slice(0, 50)));
      } catch {}

      if (typeof onOpenQuotation === 'function') {
        onOpenQuotation(localId);
      } else {
        const simulatedSuccess = {
          success: true,
          event_id: Math.floor(100 + Math.random() * 900),
          event_code: 'MZB-2026-' + Math.floor(1000 + Math.random() * 9000),
          message: 'Event requirement recorded successfully!',
          sheet_id: localId,
          quote: calculatedQuote
        };
        setSuccessData(simulatedSuccess);
        if (onEventCreated) onEventCreated(simulatedSuccess);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e6dfcf', paddingBottom: 16, marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', color: '#0f3d2e', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={20} color="#d4af37" /> Plan Your Event with MEZBAAN
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '4px 0 0' }}>
              Aapka Event, Hamari Zimmedari • Fill in your event details below
            </p>
          </div>
          <button onClick={onClose} style={{ color: '#9ca3af', padding: 4 }}>
            <X size={22} />
          </button>
        </div>

        {successData ? (
          <div style={{ textAlign: 'center', padding: '16px 6px' }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: '#eaf5ee',
              color: '#0e633d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
              border: '2px solid #a9dec1'
            }}>
              <Check size={32} />
            </div>
            <h3 style={{ fontSize: '1.35rem', color: '#0f3d2e', marginBottom: 6, fontWeight: 800 }}>
              Event Requirement Registered & Quotation Generated!
            </h3>
            <div style={{
              display: 'inline-block',
              background: '#fbf5df',
              border: '1px solid #ebd998',
              borderRadius: 8,
              padding: '6px 16px',
              fontWeight: 800,
              color: '#946f05',
              fontSize: '0.98rem',
              letterSpacing: '0.05em',
              marginBottom: 16
            }}>
              Reference ID: {successData.event_code || 'MEZ-2026-CONFIRMED'}
            </div>

            {/* Estimated Cost Summary Card */}
            {successData.quote && (
              <div style={{
                background: '#ffffff',
                border: '1.5px solid #d4af37',
                borderRadius: 12,
                padding: '20px',
                margin: '0 auto 20px',
                maxWidth: 520,
                textAlign: 'left',
                boxShadow: '0 4px 18px rgba(15, 61, 46, 0.08)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee5d4', paddingBottom: 12, marginBottom: 14 }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: 800, letterSpacing: '0.5px' }}>
                      Official Estimated Price
                    </span>
                    <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f3d2e', fontFamily: 'Outfit' }}>
                      ₹{Number(successData.quote.summary.totalPrice).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#92400e', fontWeight: 800 }}>
                      30% Date Lock Advance
                    </span>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#92400e', fontFamily: 'Outfit' }}>
                      ₹{Number(successData.quote.summary.advanceRequired).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', color: '#374151', marginBottom: 8, fontWeight: 700 }}>
                  Included Services ({successData.quote.items.length} Items):
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 160, overflowY: 'auto', paddingRight: 4 }}>
                  {successData.quote.items.map((it, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', padding: '4px 8px', background: '#fdfbf7', borderRadius: 6, border: '1px solid #f1eae0' }}>
                      <span style={{ color: '#1f2937', fontWeight: 600 }}>{it.service_name}</span>
                      <span style={{ color: '#0f3d2e', fontWeight: 800 }}>₹{Number(it.customer_price).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p style={{ color: '#4b5563', fontSize: '0.88rem', lineHeight: 1.55, maxWidth: 500, margin: '0 auto 20px' }}>
              Your event requirements and quotation have been registered. You can now open the complete itemized estimated cost page to edit services, download PDF, or send directly via WhatsApp.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  if (onOpenQuotation) {
                    onOpenQuotation(successData.sheet_id);
                  } else {
                    onClose();
                  }
                }}
                className="btn-gold"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 24px',
                  fontSize: '0.96rem',
                  fontWeight: 800,
                  boxShadow: '0 4px 16px rgba(15, 61, 46, 0.25)'
                }}
              >
                <Sparkles size={18} /> OPEN ESTIMATED COST PAGE & QUOTATION
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-outline"
                style={{ padding: '12px 20px', fontSize: '0.88rem' }}
              >
                Close & View Portals
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fee2e2', color: '#b91c1c', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: '0.88rem' }}>
                <AlertCircle size={18} /> {error}
              </div>
            )}

            {/* Section 1: Customer Contact */}
            <div style={{ background: '#fdfbf7', padding: 16, borderRadius: 10, border: '1px solid #eee5d4', marginBottom: 18 }}>
              <h4 style={{ fontSize: '0.9rem', color: '#b38f20', textTransform: 'uppercase', marginBottom: 12, letterSpacing: '0.05em' }}>
                1. Customer Information
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: 12 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Tariq Farooqui"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    className="form-input"
                    placeholder="e.g. 9822014589"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="tariq@gmail.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Area / Address in Beed</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Shah Ganj, Beed"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Event Details */}
            <div style={{ background: '#fdfbf7', padding: 16, borderRadius: 10, border: '1px solid #eee5d4', marginBottom: 18 }}>
              <h4 style={{ fontSize: '0.9rem', color: '#b38f20', textTransform: 'uppercase', marginBottom: 12, letterSpacing: '0.05em' }}>
                2. Event Specifics
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: 12 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Event Category *</label>
                  <select
                    className="form-select"
                    value={formData.event_type}
                    onChange={e => setFormData({ ...formData, event_type: e.target.value })}
                  >
                    <option value="Walima & Reception">Walima & Reception</option>
                    <option value="Wedding & Nikah">Wedding & Nikah</option>
                    <option value="Engagement Ceremony">Engagement Ceremony</option>
                    <option value="Kids Birthday Celebration">Kids Birthday Celebration</option>
                    <option value="Aqeeqah Function">Aqeeqah Function</option>
                    <option value="Community & Milad Gathering">Community & Milad Gathering</option>
                    <option value="Educational & School Event">Educational & School Event</option>
                    <option value="Corporate / Brand Launch">Corporate / Brand Launch</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Event Date *</label>
                  <input
                    type="date"
                    required
                    className="form-input"
                    value={formData.event_date}
                    onChange={e => setFormData({ ...formData, event_date: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Operating City</label>
                  <select
                    className="form-select"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                  >
                    <option value="Beed">Beed</option>
                    <option value="Kaij">Kaij</option>
                    <option value="Ambajogai">Ambajogai</option>
                    <option value="Gevrai">Gevrai</option>
                    <option value="Majalgaon">Majalgaon</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Expected Guest Count</label>
                  <input
                    type="number"
                    min="20"
                    step="10"
                    className="form-input"
                    value={formData.guest_count}
                    onChange={e => setFormData({ ...formData, guest_count: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Approximate Budget (₹)</label>
                  <input
                    type="number"
                    step="5000"
                    className="form-input"
                    value={formData.budget}
                    onChange={e => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Preferred Venue</label>
                  <select
                    className="form-select"
                    value={formData.venue_id}
                    onChange={e => setFormData({ ...formData, venue_id: e.target.value })}
                  >
                    <option value="">-- Let Mezbaan Recommend Suitable Venue --</option>
                    {venues.map(v => (
                      <option key={v.venue_id} value={v.venue_id}>
                        {v.name} ({v.city} - Cap: {v.capacity})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Required Services (Multi-select) */}
            <div style={{ background: '#fdfbf7', padding: 16, borderRadius: 10, border: '1px solid #eee5d4', marginBottom: 18 }}>
              <h4 style={{ fontSize: '0.9rem', color: '#b38f20', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.05em' }}>
                3. Services Required (Select all that apply)
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: 10, marginTop: 10 }}>
                {services.map(s => {
                  const isChecked = formData.selected_services.includes(s.service_id);
                  return (
                    <div
                      key={s.service_id}
                      onClick={() => handleServiceToggle(s.service_id)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 8,
                        border: isChecked ? '1.5px solid #d4af37' : '1px solid #e0d7c3',
                        background: isChecked ? '#fcf9ea' : '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{
                        width: 18,
                        height: 18,
                        borderRadius: 4,
                        border: isChecked ? '1.5px solid #b38f20' : '1.5px solid #9ca3af',
                        background: isChecked ? '#b38f20' : '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff'
                      }}>
                        {isChecked && <Check size={12} strokeWidth={3} />}
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1f2937' }}>
                        {s.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 4: Special Requirements */}
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label className="form-label">Special Notes / Menu / Partition Requirements</label>
              <textarea
                rows={3}
                className="form-textarea"
                placeholder="e.g. Separate Ladies/Gents shamiana, Mutton Dum Biryani menu, 4K Drone entry..."
                value={formData.special_requirements}
                onChange={e => setFormData({ ...formData, special_requirements: e.target.value })}
              />
            </div>

            {/* Submit Action */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button
                type="button"
                onClick={onClose}
                className="btn-outline"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-gold"
                disabled={loading}
              >
                {loading ? 'Submitting Requirement...' : 'Confirm & Submit to MEZBAAN'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
