// Centralized Storage and API Bridge for Mezbaan Requirements & Quotations
// Supports offline localStorage persistence with seamless backend synchronization.

const REQUIREMENT_STORAGE_KEY = 'mezbaan_requirement_draft';
const QUOTATION_STORAGE_KEY = 'mezbaan_quotation_data';
const SIDEBAR_STORAGE_KEY = 'mezbaan_sidebar_collapsed';
export const DRAFT_SHEETS_STORAGE_KEY = 'mezban_draft_sheets';

/**
 * Get all submitted/logged requirement sheets from local storage
 */
export function getDraftSheets() {
  try {
    const raw = localStorage.getItem(DRAFT_SHEETS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Error reading requirement draft sheets:', err);
    return [];
  }
}

/**
 * Save or update a requirement sheet record in the local list
 */
export function saveDraftSheet(sheet) {
  try {
    if (!sheet) return { success: false, error: 'Empty sheet payload' };
    const sheets = getDraftSheets();
    const sheetId = sheet.sheet_id || `local_${Date.now()}`;
    const targetIdStr = String(sheetId);

    const updatedSheet = {
      ...sheet,
      sheet_id: sheetId,
      updated_at: new Date().toISOString()
    };

    const idx = sheets.findIndex(s => 
      String(s.sheet_id) === targetIdStr || 
      (s.customer_name === sheet.customer_name && s.mobile === sheet.mobile && String(s.sheet_id).startsWith('local_'))
    );

    if (idx >= 0) {
      sheets[idx] = { ...sheets[idx], ...updatedSheet };
    } else {
      sheets.unshift(updatedSheet);
    }

    localStorage.setItem(DRAFT_SHEETS_STORAGE_KEY, JSON.stringify(sheets.slice(0, 100)));
    return { success: true, sheet: updatedSheet };
  } catch (err) {
    console.error('Error saving draft sheet to storage:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Update the ID of a local draft sheet once synced with SQLite backend
 */
export function updateDraftSheetId(oldId, newId) {
  try {
    const sheets = getDraftSheets();
    const sheet = sheets.find(s => String(s.sheet_id) === String(oldId));
    if (sheet) {
      sheet.sheet_id = newId;
      localStorage.setItem(DRAFT_SHEETS_STORAGE_KEY, JSON.stringify(sheets));
    }
  } catch (err) {
    console.warn('Error updating draft sheet ID:', err);
  }
}

export const SAMPLE_REQUIREMENT = {
  customerName: 'Janab Tariq Farooqui & Family',
  contactPerson: 'Tariq Farooqui',
  mobile: '9822014589',
  countryCode: '+91',
  whatsappNumber: '9822014589',
  sameAsMobile: true,
  altMobile: '9423157890',
  email: 'tariq.farooqui@gmail.com',
  relationship: "Groom's Family",
  source: 'Vendor Reference',

  // Step 2: Event Details
  eventTypes: ['Walima & Reception'],
  eventDate: '2026-12-07',
  dateStatus: 'Confirmed',
  timeSlot: 'Night (Dinner)',
  timingStart: '19:30',
  timingEnd: '23:30',

  // Step 3: Venue & Location
  venueSelected: 'Yes',
  venueName: 'Royal Palace Banquet & Lawns, Jalna Road, Beed',
  venueArea: 'Jalna Road, Beed',
  venueType: 'Banquet Hall + Open Lawn',
  maxVenueBudget: '75000',

  // Step 4: Guests & Dining
  guestCount: 450,
  foodPreference: 'Both Veg & Non-Veg',
  meals: ['Dinner'],
  serviceStyle: 'Royal Buffet + Dastarkhwan VIP Area',

  // Step 5: Catering Requirements
  cuisines: ['Authentic Beed Dum Biryani', 'Mughlai Gosht', 'Roomali Roti', 'Shahi Tukda / Firni'],
  approxFoodBudget: '420',
  specialMenuNotes: 'Separate sweet dish counter, mineral water stations, hot fresh naan counter.',

  // Step 6: Décor & Theme
  decorationType: 'Royal Islamic & Modern Floral',
  preferredColors: 'Emerald Green, Royal Gold & Ivory White',
  decorationAreas: ['Main Stage', 'Grand Entrance Arch', 'VIP Dastarkhwan Area', 'Photo Booth'],
  approxDecorBudget: '45000',

  // Step 7: Media & Entertainment
  photoServices: ['Traditional Photography', 'Candid Photography', '4K Cinematic Video', 'Drone Coverage', 'Premium Album'],
  soundEntertainment: ['High-End Line Array Sound', 'Stage Warm Focus Lights', 'Wireless Handheld Mics'],
  approxMediaBudget: '55000',

  // Step 8: Logistics & Infrastructure
  stageSeating: ['VIP Royal Sofas', 'Round Tables with Silk Cover', 'Cushioned Banquet Chairs', 'Red Carpet Pathway'],
  powerBackup: 'Full Generator Backup Required',
  approxLogisticsBudget: '25000',

  // Step 9: Additional Preferences
  hospitalityNeeds: ['Uniformed Welcome Ushers (Gents & Ladies)', 'Attar & Rose Water Welcome Desk'],
  invitationNeeds: ['Digital Video E-Invite', 'WhatsApp RSVP Broadcast'],
  specialRequests: 'Elderly guest seating assistance near stage, separate prayer area arrangements.',

  // Step 10: Budget Range
  overallBudgetRange: '₹4 Lakh – ₹6 Lakh',
  approxBudget: '520000',
  budgetFlexibility: 'Slightly Flexible',
  mostImportant: ['Delicious Authentic Food', 'Grand Stage Décor', 'Smooth Timely Execution'],

  // Step 11: Notes & References
  notes: 'High-profile family gathering. Event must be managed end-to-end with zero delays.',
  referenceLinks: 'https://instagram.com/mezbaan_events_beed',

  // Internal
  status: 'Inquiry',
  updatedAt: new Date().toISOString()
};

/**
 * Get requirement draft from localStorage or fallback
 */
export function getRequirement() {
  try {
    const raw = localStorage.getItem(REQUIREMENT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading requirement draft from storage:', err);
    return null;
  }
}

/**
 * Save requirement draft to localStorage and optionally sync to backend
 */
export function saveRequirement(data) {
  try {
    const payload = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(REQUIREMENT_STORAGE_KEY, JSON.stringify(payload));
    return { success: true, data: payload };
  } catch (err) {
    console.error('Error saving requirement draft:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Calculate quotation items and summary from requirement sheet data
 */
export function generateQuotationFromRequirement(reqData) {
  const data = reqData || {};
  const guestCount = parseInt(data.guestCount || data.approxGuestCount || 450, 10);
  const items = [];

  // 1. Catering
  const foodPref = data.foodPreference || 'Both Veg & Non-Veg';
  const foodBudget = parseFloat(data.approxFoodBudget) || (foodPref === 'Veg' ? 320 : 420);
  const cateringCost = Math.round(guestCount * foodBudget * 0.82);
  const cateringPrice = Math.round(guestCount * foodBudget);
  const cateringMargin = Math.round(((cateringPrice - cateringCost) / cateringCost) * 100);

  items.push({
    service_id: 2,
    service_name: `Royal Catering & Dining (${foodPref})`,
    category: 'Catering & Dastarkhwan',
    vendor_id: 1,
    vendor_name: 'Royal Beed Dastarkhwan & Caterers',
    vendor_cost: cateringCost,
    margin_pct: cateringMargin,
    customer_price: cateringPrice,
    details: `${guestCount} Guests @ ₹${foodBudget}/plate • ${Array.isArray(data.cuisines) ? data.cuisines.join(', ') : 'Mughlai & Biryani'}`
  });

  // 2. Venue Liaison & Booking
  const venuePrice = parseFloat(data.maxVenueBudget) || 65000;
  const venueCost = Math.round(venuePrice * 0.85);
  items.push({
    service_id: 1,
    service_name: data.venueName ? `Venue Booking: ${data.venueName}` : 'Banquet Hall & Lawns',
    category: 'Venue & Hospitality',
    vendor_id: null,
    vendor_name: data.venueName || 'Mezban Partner Banquet',
    vendor_cost: venueCost,
    margin_pct: 18,
    customer_price: venuePrice,
    details: `AC Banquet, Lawn, Generator Backup & Dedicated Parking`
  });

  // 3. Décor & Theme
  const decorPrice = parseFloat(data.approxDecorBudget) || 45000;
  const decorCost = Math.round(decorPrice * 0.78);
  items.push({
    service_id: 4,
    service_name: `Theme Décor (${data.decorationType || 'Royal Islamic'})`,
    category: 'Decoration & Theme Setup',
    vendor_id: 2,
    vendor_name: 'Noor Mandap & Floral Elegance',
    vendor_cost: decorCost,
    margin_pct: 28,
    customer_price: decorPrice,
    details: `Palette: ${data.preferredColors || 'Emerald & Gold'} • Areas: ${Array.isArray(data.decorationAreas) ? data.decorationAreas.join(', ') : 'Stage & Entry'}`
  });

  // 4. Photography & Cinematography
  const mediaPrice = parseFloat(data.approxMediaBudget) || 55000;
  const mediaCost = Math.round(mediaPrice * 0.80);
  items.push({
    service_id: 6,
    service_name: 'Cinematic 4K Video, Drone & Candid Photo',
    category: 'Photography & Cinematic Media',
    vendor_id: 3,
    vendor_name: 'Al-Falah Cinematic Studio',
    vendor_cost: mediaCost,
    margin_pct: 25,
    customer_price: mediaPrice,
    details: Array.isArray(data.photoServices) ? data.photoServices.join(', ') : 'Traditional + Candid + Drone'
  });

  // 5. Sound & Lighting
  const soundCost = 16000;
  const soundPrice = 20000;
  items.push({
    service_id: 7,
    service_name: 'Pro Sound System & Ambient Stage Lighting',
    category: 'Sound, Lights & Entertainment',
    vendor_id: 5,
    vendor_name: 'Star Pro Light & Sound Systems',
    vendor_cost: soundCost,
    margin_pct: 25,
    customer_price: soundPrice,
    details: 'Digital line array, wireless mics, warm focus lights'
  });

  // 6. Logistics, Stage & Seating
  const logCost = 18000;
  const logPrice = 24000;
  items.push({
    service_id: 8,
    service_name: 'VIP Sofas, Stage Setup & Shamiana Partitions',
    category: 'Stage, Shamiana & Seating',
    vendor_id: 4,
    vendor_name: 'Marathwada Tent & Sound Hub',
    vendor_cost: logCost,
    margin_pct: 33,
    customer_price: logPrice,
    details: 'Royal VIP seating setup, carpets and privacy shamiana'
  });

  // 7. Hospitality & Guest Coordination
  const hospCost = 9000;
  const hospPrice = 12000;
  items.push({
    service_id: 1,
    service_name: 'Mezban On-Ground Coordination & Ushers',
    category: 'Venue & Hospitality',
    vendor_id: null,
    vendor_name: 'Mezban Executive Operations Team',
    vendor_cost: hospCost,
    margin_pct: 33,
    customer_price: hospPrice,
    details: 'Dedicated event manager, guest registration desk and flow management'
  });

  const totalPrice = items.reduce((sum, item) => sum + item.customer_price, 0);
  const totalCost = items.reduce((sum, item) => sum + item.vendor_cost, 0);
  const mezbaanMargin = totalPrice - totalCost;
  const advanceRequired = Math.round(totalPrice * 0.30);
  const marginPct = totalPrice > 0 ? Math.round((mezbaanMargin / totalPrice) * 100) : 0;

  return {
    quoteItems: items,
    quoteSummary: {
      totalCost,
      totalPrice,
      mezbaanMargin,
      advanceRequired,
      marginPct
    },
    requirement: data,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Get saved quotation from localStorage
 */
export function getQuotation() {
  try {
    const raw = localStorage.getItem(QUOTATION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading quotation from storage:', err);
    return null;
  }
}

/**
 * Save quotation to localStorage
 */
export function saveQuotation(data) {
  try {
    localStorage.setItem(QUOTATION_STORAGE_KEY, JSON.stringify(data));
    return { success: true, data };
  } catch (err) {
    console.error('Error saving quotation to storage:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Clear all drafts from localStorage
 */
export function clearAll() {
  try {
    localStorage.removeItem(REQUIREMENT_STORAGE_KEY);
    localStorage.removeItem(QUOTATION_STORAGE_KEY);
    return { success: true };
  } catch (err) {
    console.error('Error clearing storage:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Sidebar collapsed state helpers
 */
export function getSidebarCollapsedState() {
  try {
    return localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setSidebarCollapsedState(collapsed) {
  try {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, collapsed ? 'true' : 'false');
  } catch (e) {
    console.warn('Could not save sidebar state to storage', e);
  }
}
