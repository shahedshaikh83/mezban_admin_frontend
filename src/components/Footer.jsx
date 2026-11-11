import React from 'react';
import { Crown, MapPin, Phone, Mail, Clock, CheckCircle } from 'lucide-react';
import mezbaanLogo from '../assets/mezbaan-logo.jpg';

export default function Footer({ openPlanModal }) {
  return (
    <footer style={{
      background: 'linear-gradient(180deg, #0f3d2e 0%, #071f17 100%)',
      color: '#ffffff',
      padding: '60px 0 30px',
      borderTop: '3px solid #d4af37',
      marginTop: 80
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: 48,
          marginBottom: 50
        }}>
          {/* Col 1: Brand Ethos */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{
                width: 38,
                height: 38,
                borderRadius: 8,
                overflow: 'hidden',
                background: '#000000',
                border: '1.5px solid #d4af37',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                flexShrink: 0
              }}>
                <img 
                  src={mezbaanLogo} 
                  alt="Mezban Royal Emblem" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f3c64c', fontFamily: 'Outfit' }}>
                MEZBAN
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#cadbd2', lineHeight: 1.7, marginBottom: 16 }}>
              Aapka Event, Hamari Zimmedari. We serve as your complete event planning, coordination, and vendor execution partner across Beed.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(212, 175, 55, 0.15)', padding: '6px 14px', borderRadius: 20, border: '1px solid rgba(212,175,55,0.3)', color: '#f5deb3', fontSize: '0.8rem', fontWeight: 600 }}>
              <CheckCircle size={14} color="#f3c64c" /> 100% Verified Local Vendors in Beed
            </div>
          </div>

          {/* Col 2: Operating Market (Beed Only) */}
          <div>
            <h4 style={{ color: '#f3c64c', fontSize: '1.05rem', marginBottom: 18, fontFamily: 'Outfit' }}>
              OPERATING MARKET
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.88rem', color: '#cadbd2', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <MapPin size={18} color="#d4af37" style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>Beed City</strong>
                  <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#9cb5a8', lineHeight: 1.5 }}>
                    Jalna Road, Near Stadium, Subhash Road, Old City & Bypass Lawns
                  </p>
                </div>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#cadbd2', fontSize: '0.84rem' }}>
                <CheckCircle size={15} color="#d4af37" style={{ flexShrink: 0 }} />
                <span>Dedicated on-ground coordination for all banquet halls & lawns across Beed</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Office */}
          <div>
            <h4 style={{ color: '#f3c64c', fontSize: '1.05rem', marginBottom: 18, fontFamily: 'Outfit' }}>
              GET IN TOUCH
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.88rem', color: '#cadbd2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Phone size={16} color="#d4af37" />
                <span>+91 98220 14589 / +91 94231 57890</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Mail size={16} color="#d4af37" />
                <span>contact@mezbaanevents.in</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Clock size={16} color="#d4af37" />
                <span>Mon - Sun: 9:00 AM - 10:00 PM</span>
              </div>
              <button
                onClick={openPlanModal}
                className="btn-gold"
                style={{ marginTop: 8, fontSize: '0.85rem' }}
              >
                Plan An Event Now
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          fontSize: '0.82rem',
          color: '#8fa99c'
        }}>
          <div>
            © {new Date().getFullYear()} MEZBAN EVENTS & CELEBRATIONS. Prepared for Rizwan, Shahid & Tausif.
          </div>
          <div>
            Built with Relational SQLite Architecture • Zero Placeholders • 100% Real Database
          </div>
        </div>
      </div>
    </footer>
  );
}
