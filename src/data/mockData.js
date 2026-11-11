export const FALLBACK_VENUES = [
  {
    venue_id: 1,
    name: 'Royal Palace Banquet & Lawns',
    address: 'Jalna Road, Near Stadium',
    city: 'Beed',
    capacity: 800,
    facilities: 'Separate Ladies/Gents AC Halls, Lawn, Outside Caterer Allowed, 150 Car Parking, Power Backup',
    status: 'Verified'
  },
  {
    venue_id: 2,
    name: 'Shahi Lawn & Function Hall',
    address: 'Kaij Bypass Road',
    city: 'Kaij',
    capacity: 600,
    facilities: 'Covered Stage, Separate Dining Partition, In-house Kitchen, Generator, Valet',
    status: 'Verified'
  },
  {
    venue_id: 3,
    name: 'Diamond Heritage Banquet',
    address: 'Amba Mata Temple Road',
    city: 'Ambajogai',
    capacity: 450,
    facilities: 'AC Auditorium, Bridal Suite, Stage Lighting, Audio Setup, Kitchen Facilities',
    status: 'Verified'
  },
  {
    venue_id: 4,
    name: 'Madina Function Hall',
    address: 'Subhash Road, Old City',
    city: 'Beed',
    capacity: 350,
    facilities: 'Central Beed Location, Separate Dining Floor, Budget Friendly, Fans & Coolers',
    status: 'Verified'
  },
  {
    venue_id: 5,
    name: 'Al-Haram Green Palace',
    address: 'National Highway 52',
    city: 'Gevrai',
    capacity: 1000,
    facilities: 'Grand 2-Acre Lawn, Dual Grand Entrance Gates, Huge Cooking Yard, 300 Parking',
    status: 'Verified'
  }
];

export const FALLBACK_SERVICES = [
  {
    service_id: 1,
    category_id: 1,
    category_name: 'Venue & Hospitality',
    name: 'Venue Booking & Coordination',
    description: 'Hall and lawn discovery, booking management, and facility liaison'
  },
  {
    service_id: 2,
    category_id: 2,
    category_name: 'Catering & Dastarkhwan',
    name: 'Traditional Non-Veg Dastarkhwan',
    description: 'Authentic Beed dum biryani, mutton dalcha, naan, shahi tukda, salad with royal dastarkhwan service'
  },
  {
    service_id: 3,
    category_id: 2,
    category_name: 'Catering & Dastarkhwan',
    name: 'Deluxe Pure Vegetarian Buffet',
    description: 'Paneer specialties, dal makhani, assorted breads, pulao, gulab jamun, chaat counter'
  },
  {
    service_id: 4,
    category_id: 3,
    category_name: 'Decoration & Theme Setup',
    name: 'Royal Wedding Stage & Floral Setup',
    description: 'Custom floral backdrop, grand sofa, ambient chandeliers, VIP stage layout'
  },
  {
    service_id: 5,
    category_id: 3,
    category_name: 'Decoration & Theme Setup',
    name: 'Theme & Balloon Kids Setup',
    description: 'Custom cartoon/superhero balloon arches, photo booth, backdrop banners'
  },
  {
    service_id: 6,
    category_id: 4,
    category_name: 'Photography & Cinematic Media',
    name: 'Cinematic Photography & 4K Videography',
    description: 'Traditional + Candid photography, 4K video, Drone aerial shots, Premium hardbound album'
  },
  {
    service_id: 7,
    category_id: 5,
    category_name: 'Sound, Lights & Entertainment',
    name: 'Pro Sound & Stage Lighting System',
    description: 'Dual wireless mics, line array speakers, LED pars, profile lights, follow spot'
  },
  {
    service_id: 8,
    category_id: 6,
    category_name: 'Stage, Shamiana & Seating',
    name: 'VIP Shamiana, Sofa & Seating Setup',
    description: 'Separate gents & ladies section seating, round tables with royal linens, high-back VIP chairs'
  },
  {
    service_id: 9,
    category_id: 7,
    category_name: 'Invitations & Digital Media',
    name: 'Custom Invitation Cards & E-Invites',
    description: 'Designer Urdu/English/Marathi invitation cards, WhatsApp video invite, RSVP management'
  },
  {
    service_id: 10,
    category_id: 8,
    category_name: 'Bridal Styling & Cake',
    name: 'Bridal Makeup, Mehendi & Custom Cake',
    description: 'HD bridal makeover, intricate Arabic bridal mehendi, multi-tier designer celebration cake'
  }
];

export const FALLBACK_CUSTOMERS = [
  { customer_id: 1, name: 'Tariq Farooqui', phone: '9822014589', email: 'tariq.farooqui@gmail.com', address: 'Shah Ganj, Beed', status: 'Active' },
  { customer_id: 2, name: 'Adv. Mateen Qureshi', phone: '9423157890', email: 'mateen.q@yahoo.com', address: 'Vidya Nagar, Kaij', status: 'Active' },
  { customer_id: 3, name: 'Dr. Ayan Shaikh', phone: '9765412380', email: 'dr.ayan@shaikhclinic.in', address: 'Civil Lines, Ambajogai', status: 'Active' },
  { customer_id: 4, name: 'Imran Hashmi', phone: '9890123456', email: 'imran.h@outlook.com', address: 'Shivaji Chowk, Gevrai', status: 'Active' },
  { customer_id: 5, name: 'Zafar Patel', phone: '9158742369', email: 'zafar.patel@rediffmail.com', address: 'Subhash Road, Beed', status: 'Active' }
];

export const FALLBACK_EVENTS = [
  {
    event_id: 1,
    customer_id: 1,
    customer_name: 'Tariq Farooqui',
    phone: '9822014589',
    venue_id: 1,
    venue_name: 'Royal Palace Banquet & Lawns',
    venue_city: 'Beed',
    event_type: 'Walima & Reception',
    event_date: '2026-11-15',
    location: 'Beed',
    guest_count: 300,
    budget: 250000,
    status: 'Booked'
  },
  {
    event_id: 2,
    customer_id: 2,
    customer_name: 'Adv. Mateen Qureshi',
    phone: '9423157890',
    venue_id: 2,
    venue_name: 'Shahi Lawn & Function Hall',
    venue_city: 'Kaij',
    event_type: 'Community & Milad Program',
    event_date: '2026-11-28',
    location: 'Kaij',
    guest_count: 500,
    budget: 200000,
    status: 'Quotation Sent'
  }
];

export const FALLBACK_STATS = {
  total_events: 18,
  active_vendors: 14,
  verified_venues: 5,
  total_revenue: 1450000,
  pending_enquiries: 3
};
