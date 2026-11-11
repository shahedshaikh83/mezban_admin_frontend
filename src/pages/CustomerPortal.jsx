import React, { useState, useEffect } from 'react';
import { 
  User, Calendar, Clock, MapPin, CheckCircle, AlertCircle, FileText, 
  IndianRupee, Phone, MessageSquare, Star, ArrowRight, ShieldCheck, 
  Check, RefreshCw, Send 
} from 'lucide-react';

export default function CustomerPortal({ openPlanModal }) {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(1); // Default to Tariq Farooqui
  const [events, setEvents] = useState([]);
  const [activeEventDetails, setActiveEventDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackNote, setFeedbackNote] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    fetch('/api/customers')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.customers.length > 0) {
          setCustomers(d.customers);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedCustomerId) return;
    setLoading(true);
    fetch(`/api/events?customer_id=${selectedCustomerId}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setEvents(d.events);
          if (d.events.length > 0) {
            loadEventDetails(d.events[0].event_id);
          } else {
            setActiveEventDetails(null);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedCustomerId]);

  const loadEventDetails = (eventId) => {
    fetch(`/api/events/${eventId}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setActiveEventDetails(d);
        }
      })
      .catch(console.error);
  };

  const handleApproveQuote = async (quoteId) => {
    try {
      const res = await fetch(`/api/quotes/${quoteId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Approved' })
      });
      const data = await res.json();
      if (data.success && activeEventDetails) {
        loadEventDetails(activeEventDetails.event.event_id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMakePayment = async (e) => {
    e.preventDefault();
    if (!activeEventDetails || !paymentAmount) return;

    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: activeEventDetails.event.event_id,
          amount: parseFloat(paymentAmount),
          payment_type: 'Customer Installment',
          method: paymentMethod,
          status: 'Completed'
        })
      });
      const data = await res.json();
      if (data.success) {
        setPaymentSuccess(true);
        setPaymentAmount('');
        loadEventDetails(activeEventDetails.event.event_id);
        setTimeout(() => setPaymentSuccess(false), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackSubmitted(false);
      setFeedbackNote('');
    }, 4000);
  };

  const selectedCustomer = customers.find(c => c.customer_id === Number(selectedCustomerId));

  return (
    <div className="container fade-in" style={{ padding: '40px 24px 80px' }}>
      {/* Top Banner / Customer Switcher */}
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
            <User size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontSize: '1.45rem', color: '#0f3d2e', margin: 0 }}>
                {selectedCustomer ? selectedCustomer.name : 'Customer Portal'}
              </h2>
              <span className="badge badge-gold">
                CUS-{String(selectedCustomerId).padStart(4, '0')}
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '4px 0 0' }}>
              {selectedCustomer?.phone} • {selectedCustomer?.address || 'Beed, Maharashtra'}
            </p>
          </div>
        </div>

        {/* Switch Customer Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#4b5563' }}>
            Switch Customer:
          </label>
          <select
            className="form-select"
            style={{ width: 'auto', padding: '6px 14px', fontSize: '0.88rem' }}
            value={selectedCustomerId}
            onChange={e => setSelectedCustomerId(Number(e.target.value))}
          >
            {customers.map(c => (
              <option key={c.customer_id} value={c.customer_id}>
                {c.name} ({c.phone})
              </option>
            ))}
          </select>
          <button onClick={openPlanModal} className="btn-gold" style={{ fontSize: '0.82rem', padding: '8px 16px' }}>
            + New Event
          </button>
        </div>
      </div>

      {/* Main Events Area */}
      {events.length === 0 ? (
        <div className="card-luxury" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Calendar size={48} color="#b38f20" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.3rem', color: '#0f3d2e', marginBottom: 8 }}>
            No Active Events Found for this Profile
          </h3>
          <p style={{ color: '#666', fontSize: '0.92rem', marginBottom: 20 }}>
            Submit an event requirement to view your customized quotation and track coordination.
          </p>
          <button onClick={openPlanModal} className="btn-gold">
            Plan An Event Now
          </button>
        </div>
      ) : (
        <div className="sidebar-layout">
          {/* Left Column: Events List */}
          <div>
            <h3 style={{ fontSize: '1.1rem', color: '#0f3d2e', marginBottom: 14 }}>
              My Events ({events.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {events.map(ev => {
                const isSelected = activeEventDetails?.event?.event_id === ev.event_id;
                return (
                  <div
                    key={ev.event_id}
                    onClick={() => loadEventDetails(ev.event_id)}
                    style={{
                      background: isSelected ? '#ffffff' : '#f9f6ef',
                      border: isSelected ? '2px solid #d4af37' : '1px solid #ebdcc0',
                      borderRadius: 12,
                      padding: 16,
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 4px 15px rgba(212,175,55,0.18)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                        MEZ-EVT-2026-{String(ev.event_id).padStart(4, '0')}
                      </span>
                      <span className={`badge ${ev.status === 'Confirmed' ? 'badge-green' : 'badge-blue'}`}>
                        {ev.status}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', color: '#0f3d2e', marginBottom: 6 }}>
                      {ev.event_type}
                    </h4>

                    <div style={{ fontSize: '0.8rem', color: '#666', display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Calendar size={13} color="#b38f20" /> {ev.event_date}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <MapPin size={13} color="#b38f20" /> {ev.venue_name || ev.location}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <User size={13} color="#b38f20" /> {ev.guest_count} Guests
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Coordinator Info Box */}
            <div style={{
              marginTop: 24,
              background: '#0f3d2e',
              color: '#ffffff',
              borderRadius: 14,
              padding: 20,
              border: '1px solid #d4af37'
            }}>
              <span className="badge badge-gold" style={{ marginBottom: 10 }}>
                Assigned Coordinator
              </span>
              <h4 style={{ fontSize: '1.1rem', color: '#f3c64c', marginBottom: 4 }}>
                Shahid Shaikh
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#cadbd2', marginBottom: 14 }}>
                Mezbaan Lead Operations • Beed District
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.85rem' }}>
                <a href="tel:9822014589" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ffffff' }}>
                  <Phone size={15} color="#d4af37" /> +91 98220 14589
                </a>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#cadbd2' }}>
                  <Clock size={15} color="#d4af37" /> Available 24/7 for this event
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Event Detail & Quotations */}
          {activeEventDetails && (
            <div>
              {/* Event Header */}
              <div className="card-luxury" style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14, marginBottom: 16 }}>
                  <div>
                    <span className="badge badge-gold" style={{ marginBottom: 8 }}>
                      Active Event Overview
                    </span>
                    <h2 style={{ fontSize: '1.6rem', color: '#0f3d2e', margin: 0 }}>
                      {activeEventDetails.event.event_type}
                    </h2>
                    <p style={{ fontSize: '0.88rem', color: '#666', marginTop: 4 }}>
                      Date: <strong>{activeEventDetails.event.event_date}</strong> • Expected Guests: <strong>{activeEventDetails.event.guest_count}</strong>
                    </p>
                  </div>

                  <span className={`badge ${activeEventDetails.event.status === 'Confirmed' ? 'badge-green' : 'badge-gold'}`} style={{ fontSize: '0.85rem', padding: '6px 16px' }}>
                    Status: {activeEventDetails.event.status}
                  </span>
                </div>

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
                    <span style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', fontWeight: 700 }}>Venue</span>
                    <div style={{ fontWeight: 700, color: '#0f3d2e', fontSize: '0.95rem' }}>
                      {activeEventDetails.event.venue_name || 'To Be Finalized'}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#666' }}>
                      {activeEventDetails.event.venue_city}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', fontWeight: 700 }}>Customer Target Budget</span>
                    <div style={{ fontWeight: 700, color: '#0f3d2e', fontSize: '0.95rem' }}>
                      ₹{Number(activeEventDetails.event.budget).toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#666' }}>Declared Range</div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', fontWeight: 700 }}>Event Code</span>
                    <div style={{ fontWeight: 700, color: '#b38f20', fontSize: '0.95rem' }}>
                      MEZ-EVT-2026-{String(activeEventDetails.event.event_id).padStart(4, '0')}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#666' }}>Relational DB Key</div>
                  </div>
                </div>
              </div>

              {/* Requirements Submitted */}
              <div className="card" style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: '1.15rem', color: '#0f3d2e', marginBottom: 14 }}>
                  Submitted Requirements & Preferences ({activeEventDetails.requirements.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {activeEventDetails.requirements.map(req => (
                    <div
                      key={req.requirement_id}
                      style={{
                        padding: '12px 16px',
                        background: '#faf8f4',
                        border: '1px solid #ebdcc0',
                        borderRadius: 10,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 12
                      }}
                    >
                      <div>
                        <strong style={{ color: '#0f3d2e', fontSize: '0.92rem' }}>
                          {req.service_name}
                        </strong>
                        <div style={{ fontSize: '0.82rem', color: '#555', marginTop: 2 }}>
                          {req.details}
                        </div>
                      </div>
                      <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>
                        {req.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quotations Section (Section 30 & 44 compliance: Customer Price ONLY, No internal vendor cost) */}
              <div className="card" style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: '#0f3d2e', margin: 0 }}>
                      Official Quotation from MEZBAAN
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#666', margin: '2px 0 0' }}>
                      Itemized breakdown with clear customer pricing & service commitments
                    </p>
                  </div>
                  {activeEventDetails.quotes.length > 0 && (
                    <span className={`badge ${activeEventDetails.quotes[0].status === 'Approved' ? 'badge-green' : 'badge-gold'}`}>
                      {activeEventDetails.quotes[0].status}
                    </span>
                  )}
                </div>

                {activeEventDetails.quotes.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px 10px', background: '#faf8f4', borderRadius: 10 }}>
                    <Clock size={32} color="#b38f20" style={{ margin: '0 auto 10px' }} />
                    <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
                      MEZBAAN team is currently finalizing vendor pricing and preparing your formal quotation.
                    </p>
                  </div>
                ) : (
                  <div>
                    {activeEventDetails.quotes.map(q => (
                      <div key={q.quote_id} style={{ border: '1px solid #ebdcc0', borderRadius: 12, overflow: 'hidden' }}>
                        {/* Table of items */}
                        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
                          <table className="data-table">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Service</th>
                                <th>Scope & Inclusions</th>
                                <th style={{ textAlign: 'right' }}>Price (₹)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {q.items?.map((item, idx) => (
                                <tr key={item.quote_item_id || idx}>
                                  <td>{idx + 1}</td>
                                  <td><strong>{item.service_name}</strong></td>
                                  <td style={{ color: '#555', fontSize: '0.82rem' }}>
                                    Standard MEZBAAN verified execution with dedicated on-site supervisor
                                  </td>
                                  <td style={{ textAlign: 'right', fontWeight: 700, color: '#0f3d2e' }}>
                                    ₹{Number(item.customer_price).toLocaleString('en-IN')}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Quote Summary Footer */}
                        <div style={{
                          background: '#fdfbf7',
                          padding: '16px 20px',
                          borderTop: '2px solid #ebdcc0',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: 16
                        }}>
                          <div>
                            <div style={{ fontSize: '0.8rem', color: '#666' }}>
                              Valid Until: <strong>{q.valid_until || '2026-11-15'}</strong>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#888' }}>
                              Includes transport, service staff, and event-day management.
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontSize: '0.78rem', color: '#666', textTransform: 'uppercase', fontWeight: 700 }}>
                                Total Package Price
                              </span>
                              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f3d2e', fontFamily: 'Outfit' }}>
                                ₹{Number(q.total_price).toLocaleString('en-IN')}
                              </div>
                            </div>

                            {q.status !== 'Approved' && (
                              <button
                                onClick={() => handleApproveQuote(q.quote_id)}
                                className="btn-gold"
                              >
                                <Check size={16} /> Approve Quotation
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Payments & Account Summary */}
              <div className="card" style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: '1.15rem', color: '#0f3d2e', marginBottom: 14 }}>
                  Payment Tracking & Receipts
                </h3>

                {/* Calculation Cards */}
                {(() => {
                  const quotePrice = activeEventDetails.quotes[0]?.total_price || activeEventDetails.event.budget || 0;
                  const totalPaid = activeEventDetails.payments
                    ?.filter(p => p.payment_type.includes('Customer'))
                    .reduce((sum, p) => sum + Number(p.amount), 0) || 0;
                  const balanceDue = Math.max(0, quotePrice - totalPaid);

                  return (
                    <div>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))',
                        gap: 14,
                        marginBottom: 20
                      }}>
                        <div style={{ background: '#f5f0e6', padding: 14, borderRadius: 10, border: '1px solid #ebdcc0' }}>
                          <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: 700 }}>Total Event Bill</span>
                          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f3d2e' }}>
                            ₹{Number(quotePrice).toLocaleString('en-IN')}
                          </div>
                        </div>

                        <div style={{ background: '#eaf5ee', padding: 14, borderRadius: 10, border: '1px solid #a9dec1' }}>
                          <span style={{ fontSize: '0.75rem', color: '#0e633d', fontWeight: 700 }}>Total Paid / Received</span>
                          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0e633d' }}>
                            ₹{Number(totalPaid).toLocaleString('en-IN')}
                          </div>
                        </div>

                        <div style={{ background: '#fef2f2', padding: 14, borderRadius: 10, border: '1px solid #fecaca' }}>
                          <span style={{ fontSize: '0.75rem', color: '#991b1b', fontWeight: 700 }}>Pending Balance</span>
                          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#991b1b' }}>
                            ₹{Number(balanceDue).toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>

                      {/* Payment History List */}
                      {activeEventDetails.payments?.length > 0 && (
                        <div className="table-container" style={{ marginBottom: 20 }}>
                          <table className="data-table">
                            <thead>
                              <tr>
                                <th>Receipt ID</th>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Method</th>
                                <th>Amount</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {activeEventDetails.payments.map(p => (
                                <tr key={p.payment_id}>
                                  <td>REC-{String(p.payment_id).padStart(5, '0')}</td>
                                  <td>{p.paid_on}</td>
                                  <td>{p.payment_type}</td>
                                  <td>{p.method}</td>
                                  <td style={{ fontWeight: 700, color: '#0f3d2e' }}>
                                    ₹{Number(p.amount).toLocaleString('en-IN')}
                                  </td>
                                  <td>
                                    <span className="badge badge-green">{p.status}</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Online Payment Simulator */}
                      {balanceDue > 0 && (
                        <form onSubmit={handleMakePayment} style={{ background: '#faf8f5', padding: 16, borderRadius: 12, border: '1px solid #ebdcc0' }}>
                          <h4 style={{ fontSize: '0.9rem', color: '#0f3d2e', marginBottom: 10 }}>
                            Make / Record Milestone Payment
                          </h4>
                          {paymentSuccess && (
                            <div style={{ background: '#eaf5ee', color: '#0e633d', padding: '8px 12px', borderRadius: 8, marginBottom: 12, fontSize: '0.85rem' }}>
                              Payment successfully recorded in MEZBAAN ledger!
                            </div>
                          )}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: 12, alignItems: 'flex-end' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label">Payment Amount (₹)</label>
                              <input
                                type="number"
                                required
                                max={balanceDue}
                                className="form-input"
                                placeholder={`Up to ${balanceDue}`}
                                value={paymentAmount}
                                onChange={e => setPaymentAmount(e.target.value)}
                              />
                            </div>

                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label">Payment Method</label>
                              <select
                                className="form-select"
                                value={paymentMethod}
                                onChange={e => setPaymentMethod(e.target.value)}
                              >
                                <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                                <option value="Bank Transfer">NEFT / RTGS Bank Transfer</option>
                                <option value="Cash">Cash Receipt at Beed Office</option>
                                <option value="Cheque">Cheque</option>
                              </select>
                            </div>

                            <button type="submit" className="btn-gold" style={{ height: 44 }}>
                              Submit Payment
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Feedback Form */}
              <div className="card">
                <h3 style={{ fontSize: '1.15rem', color: '#0f3d2e', marginBottom: 10 }}>
                  Event Feedback & Experience Rating
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: 16 }}>
                  Help us continually refine our vendor coordination quality in Beed.
                </p>

                {feedbackSubmitted ? (
                  <div style={{ background: '#eaf5ee', color: '#0e633d', padding: '12px 16px', borderRadius: 8, fontSize: '0.88rem' }}>
                    Thank you! Your feedback has been recorded in the MEZBAAN quality management ledger.
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f3d2e' }}>Rating:</span>
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          size={24}
                          onClick={() => setFeedbackRating(star)}
                          style={{
                            cursor: 'pointer',
                            fill: star <= feedbackRating ? '#d4af37' : 'none',
                            color: star <= feedbackRating ? '#d4af37' : '#ccc'
                          }}
                        />
                      ))}
                    </div>

                    <div className="form-group">
                      <textarea
                        rows={2}
                        className="form-textarea"
                        placeholder="Share your comments on the food, stage decoration, timing, and coordinator support..."
                        value={feedbackNote}
                        onChange={e => setFeedbackNote(e.target.value)}
                      />
                    </div>

                    <button type="submit" className="btn-green" style={{ fontSize: '0.85rem' }}>
                      <Send size={14} /> Submit Feedback
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
