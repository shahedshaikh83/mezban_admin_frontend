import React, { useState, useEffect } from 'react';
import { 
  Briefcase, ShieldCheck, Star, MapPin, Phone, Mail, Calendar, 
  IndianRupee, CheckCircle, Clock, AlertCircle, PlusCircle, Check, Send 
} from 'lucide-react';

export default function VendorPortal() {
  const [vendors, setVendors] = useState([]);
  const [selectedVendorId, setSelectedVendorId] = useState(1);
  const [bookings, setBookings] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

  // New Vendor Form State
  const [newVendor, setNewVendor] = useState({
    business_name: '',
    contact_person: '',
    phone: '',
    email: '',
    city: 'Beed',
    service_id: 2,
    base_price: 350,
    capacity: 500
  });

  useEffect(() => {
    fetchVendors();
    fetch('/api/services')
      .then(r => r.json())
      .then(d => { if (d.success) setServicesList(d.services); })
      .catch(console.error);
  }, []);

  const fetchVendors = () => {
    fetch('/api/vendors')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.vendors.length > 0) {
          setVendors(d.vendors);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (!selectedVendorId) return;
    setLoading(true);
    fetch(`/api/bookings?vendor_id=${selectedVendorId}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setBookings(d.bookings);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedVendorId]);

  const selectedVendor = vendors.find(v => v.vendor_id === Number(selectedVendorId));

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: newVendor.business_name,
          contact_person: newVendor.contact_person,
          phone: newVendor.phone,
          email: newVendor.email,
          city: newVendor.city,
          verification_status: 'Under Review',
          rating: 4.5,
          services: [{
            service_id: Number(newVendor.service_id),
            base_price: parseFloat(newVendor.base_price),
            capacity: parseInt(newVendor.capacity)
          }]
        })
      });
      const data = await res.json();
      if (data.success) {
        setRegSuccess(true);
        fetchVendors();
        setTimeout(() => {
          setRegSuccess(false);
          setShowRegisterModal(false);
        }, 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container fade-in" style={{ padding: '40px 24px 80px' }}>
      {/* Top Banner / Vendor Switcher */}
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #fdfbf7 100%)',
        border: '1.5px solid #ebdcc0',
        borderRadius: 16,
        padding: '24px 28px',
        marginBottom: 32,
        boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0f3d2e 0%, #155440 100%)',
            color: '#d4af37',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(15,61,46,0.2)'
          }}>
            <Briefcase size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontSize: '1.45rem', color: '#0f3d2e', margin: 0 }}>
                {selectedVendor ? selectedVendor.business_name : 'Vendor Portal'}
              </h2>
              <span className="badge badge-green">
                <ShieldCheck size={13} /> {selectedVendor?.verification_status || 'Verified'}
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '4px 0 0' }}>
              Contact: <strong>{selectedVendor?.contact_person}</strong> ({selectedVendor?.phone}) • Rating: <strong>★ {selectedVendor?.rating}</strong>
            </p>
          </div>
        </div>

        {/* Vendor Profile Switcher & Register Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#4b5563' }}>
            Switch Vendor:
          </label>
          <select
            className="form-select"
            style={{ width: 'auto', padding: '6px 14px', fontSize: '0.88rem' }}
            value={selectedVendorId}
            onChange={e => setSelectedVendorId(Number(e.target.value))}
          >
            {vendors.map(v => (
              <option key={v.vendor_id} value={v.vendor_id}>
                {v.business_name} ({v.city})
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowRegisterModal(true)}
            className="btn-gold"
            style={{ fontSize: '0.82rem', padding: '8px 16px' }}
          >
            <PlusCircle size={15} /> Join As Vendor
          </button>
        </div>
      </div>

      {selectedVendor && (
        <div className="sidebar-layout">
          {/* Left Column: Vendor Profile & Catalog */}
          <div>
            <div className="card-luxury" style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span className="badge badge-gold">
                  VEN-{String(selectedVendor.vendor_id).padStart(4, '0')}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#b38f20', fontWeight: 700, fontSize: '0.88rem' }}>
                  <Star size={16} fill="#d4af37" color="#d4af37" /> {selectedVendor.rating} / 5.0
                </span>
              </div>

              <h3 style={{ fontSize: '1.2rem', color: '#0f3d2e', marginBottom: 6 }}>
                {selectedVendor.business_name}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: 16 }}>
                Primary Base: <strong>{selectedVendor.city}, Maharashtra</strong>
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.85rem', color: '#444', borderTop: '1px solid #ebdcc0', paddingTop: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Phone size={15} color="#0f3d2e" /> {selectedVendor.phone}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Mail size={15} color="#0f3d2e" /> {selectedVendor.email || 'None on file'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ShieldCheck size={15} color="#059669" /> Verification: <strong>{selectedVendor.verification_status}</strong>
                </div>
              </div>
            </div>

            {/* Offerings & Base Rate Card */}
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', color: '#0f3d2e', marginBottom: 12 }}>
                Services & Rate Card
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {selectedVendor.services?.map(s => (
                  <div
                    key={s.vendor_service_id}
                    style={{
                      padding: 12,
                      background: '#fcfaf6',
                      borderRadius: 10,
                      border: '1px solid #eee5d4'
                    }}
                  >
                    <div style={{ fontWeight: 700, color: '#0f3d2e', fontSize: '0.9rem' }}>
                      {s.service_name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#666', marginTop: 2 }}>
                      Category: {s.category_name}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 8, borderTop: '1px dashed #ebdcc0' }}>
                      <span style={{ fontSize: '0.75rem', color: '#888' }}>Base Rate:</span>
                      <strong style={{ color: '#0f3d2e', fontSize: '0.95rem' }}>
                        ₹{Number(s.base_price).toLocaleString('en-IN')}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Assigned Events & Work Orders */}
          <div>
            <div className="card" style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: '#0f3d2e', margin: 0 }}>
                    Assigned Work Orders & Bookings
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#666', margin: '2px 0 0' }}>
                    Confirmed MEZBAAN events where your services have been booked
                  </p>
                </div>
                <span className="badge badge-gold">
                  {bookings.length} Bookings
                </span>
              </div>

              {bookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 10px', background: '#faf8f4', borderRadius: 10 }}>
                  <Calendar size={36} color="#b38f20" style={{ margin: '0 auto 10px' }} />
                  <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
                    No assigned bookings currently. When a customer approves a quote containing your services, it will appear here automatically.
                  </p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>Event Type</th>
                        <th>Event Date</th>
                        <th>Location</th>
                        <th>Agreed Amount (₹)</th>
                        <th>Booking Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(b => (
                        <tr key={b.booking_id}>
                          <td>
                            <strong>BKG-2026-{String(b.booking_id).padStart(4, '0')}</strong>
                          </td>
                          <td>{b.event_type}</td>
                          <td>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <Calendar size={13} color="#b38f20" /> {b.event_date}
                            </span>
                          </td>
                          <td>{b.event_location}</td>
                          <td style={{ fontWeight: 700, color: '#0f3d2e', fontSize: '0.95rem' }}>
                            ₹{Number(b.agreed_amount).toLocaleString('en-IN')}
                          </td>
                          <td>
                            <span className="badge badge-green">
                              <CheckCircle size={12} /> {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Vendor Financial Summary */}
            <div className="card-luxury">
              <h3 style={{ fontSize: '1.2rem', color: '#0f3d2e', marginBottom: 16 }}>
                Vendor Financial Settlement Policy
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#555', lineHeight: 1.6, marginBottom: 20 }}>
                MEZBAAN operates on guaranteed milestone disbursements. Upon quote confirmation, up to 40% advance is released. The remaining balance is disbursed on the day of event completion upon supervisor checklist signoff.
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
                gap: 16,
                background: '#fcfaf5',
                padding: 16,
                borderRadius: 12,
                border: '1px solid #eee5d4'
              }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: 700 }}>Total Booked Volume</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f3d2e' }}>
                    ₹{bookings.reduce((sum, b) => sum + Number(b.agreed_amount), 0).toLocaleString('en-IN')}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: 700 }}>Disbursement Method</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0e633d' }}>
                    Direct Bank Transfer / UPI
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Register New Vendor Modal */}
      {showRegisterModal && (
        <div className="modal-overlay" onClick={() => setShowRegisterModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.35rem', color: '#0f3d2e', marginBottom: 8 }}>
              Join the MEZBAAN Vendor Network
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: 20 }}>
              Beed, Kaij, Ambajogai, and Gevrai local contractors registration
            </p>

            {regSuccess ? (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <CheckCircle size={48} color="#059669" style={{ margin: '0 auto 12px' }} />
                <h4 style={{ color: '#0f3d2e', fontSize: '1.2rem', marginBottom: 6 }}>
                  Registration Submitted!
                </h4>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  Our vendor relations team in Beed will verify your profile and activate your listing.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: 14 }}>
                  <div className="form-group">
                    <label className="form-label">Business Name *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. Al-Madina Sound Beed"
                      value={newVendor.business_name}
                      onChange={e => setNewVendor({ ...newVendor, business_name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact Person *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. Sheikh Irfan"
                      value={newVendor.contact_person}
                      onChange={e => setNewVendor({ ...newVendor, contact_person: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      className="form-input"
                      placeholder="e.g. 9822123456"
                      value={newVendor.phone}
                      onChange={e => setNewVendor({ ...newVendor, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Operating City</label>
                    <select
                      className="form-select"
                      value={newVendor.city}
                      onChange={e => setNewVendor({ ...newVendor, city: e.target.value })}
                    >
                      <option value="Beed">Beed</option>
                      <option value="Kaij">Kaij</option>
                      <option value="Ambajogai">Ambajogai</option>
                      <option value="Gevrai">Gevrai</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Primary Service Category</label>
                    <select
                      className="form-select"
                      value={newVendor.service_id}
                      onChange={e => setNewVendor({ ...newVendor, service_id: Number(e.target.value) })}
                    >
                      {servicesList.map(s => (
                        <option key={s.service_id} value={s.service_id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Base Rate / Starting Price (₹)</label>
                    <input
                      type="number"
                      required
                      className="form-input"
                      placeholder="e.g. 350 per plate or 25000"
                      value={newVendor.base_price}
                      onChange={e => setNewVendor({ ...newVendor, base_price: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 14 }}>
                  <button type="button" onClick={() => setShowRegisterModal(false)} className="btn-outline">
                    Cancel
                  </button>
                  <button type="submit" className="btn-gold">
                    Submit Onboarding Application
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
