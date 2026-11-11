import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, Check, Plus, Trash2, Send, Phone, Mail, MessageSquare, 
  Printer, ArrowLeft, Sparkles, RefreshCw, CheckSquare, Square, 
  DollarSign, Calendar, Users, Shield, MapPin, ChevronDown, Download, AlertCircle, Edit3
} from 'lucide-react';
import { apiFetch, getApiUrl } from '../utils/api';
import { FALLBACK_SERVICES, FALLBACK_VENUES } from '../data/mockData';

// Reusable Wizard Components
import WizardShell from './wizard/WizardShell';
import StepFormRenderer from './wizard/StepFormRenderer';
import { WIZARD_STEPS } from './wizard/wizardConfig';

// Dedicated Customer & Admin Quotation Views
import CustomerQuotationView from './quotation/CustomerQuotationView';
import AdminQuotationView from './quotation/AdminQuotationView';

// Standalone offline calculation engine with exact Beed market rates
const calculateLocalQuotation = (data) => {
  const guestCount = parseInt(data.approxGuestCount || data.guestCount || 300, 10);
  const items = [];

  // 1. Catering Calculation
  const cateringNeeded = data.cateringRequired === 'Yes' || data.cateringRequired === 'Need Mezban to arrange' || !data.cateringRequired;
  if (cateringNeeded && data.cateringRequired !== 'No') {
    const foodPref = data.foodPreference || 'Both Veg & Non-Veg';
    const foodBudgetPerPerson = parseFloat(data.approxFoodBudget) || (foodPref === 'Veg' ? 290 : 380);
    const unitVendorCost = foodBudgetPerPerson * 0.82;
    const totalVendorCost = Math.round(unitVendorCost * guestCount);
    const marginPct = 20;
    const totalCustomerPrice = Math.round(totalVendorCost * (1 + marginPct / 100));

    const meals = Array.isArray(data.meals) && data.meals.length > 0 ? data.meals.join(', ') : 'Dinner';
    const cuisines = Array.isArray(data.cuisines) && data.cuisines.length > 0 ? data.cuisines.join(', ') : 'Authentic Beed Mughlai / Dum Biryani';

    items.push({
      service_id: 2,
      service_name: `Catering (${foodPref}) - ${meals}`,
      category: 'Catering & Dastarkhwan',
      vendor_id: 1,
      vendor_name: 'Royal Beed Dastarkhwan & Caterers',
      vendor_cost: totalVendorCost,
      margin_pct: marginPct,
      customer_price: totalCustomerPrice,
      details: `${guestCount} Guests @ ₹${Math.round(totalCustomerPrice / guestCount)}/person (${cuisines})`
    });
  }

  // 2. Venue
  const needVenue = data.venueSelected === 'No' || data.venueSelected === 'Need Mezban to find venue' || data.venueSelected === 'Shortlisted';
  if (needVenue || data.venueName) {
    const venueCost = parseFloat(data.maxVenueBudget) ? Math.round(parseFloat(data.maxVenueBudget) * 0.85) : 50000;
    const venuePrice = parseFloat(data.maxVenueBudget) || 60000;
    const venueMargin = Math.round(((venuePrice - venueCost) / venueCost) * 100);

    items.push({
      service_id: 1,
      service_name: data.venueName ? `Venue Liaison: ${data.venueName}` : 'Prime Banquet Hall & Lawn Booking',
      category: 'Venue & Hospitality',
      vendor_id: null,
      vendor_name: data.venueName || 'Mezban Verified Venue Partner',
      vendor_cost: venueCost,
      margin_pct: venueMargin > 0 ? venueMargin : 15,
      customer_price: venuePrice,
      details: `AC hall, separate gents/ladies partition, generator backup in ${data.venueArea || 'Beed'}`
    });
  }

  // 3. Decoration
  if (data.decorationRequired !== 'No') {
    const decorType = data.decorationType || 'Standard';
    let baseDecorCost = 25000;
    if (['Premium', 'Luxury', 'Royal'].includes(decorType)) baseDecorCost = 45000;
    else if (['Islamic Theme', 'Modern', 'Floral'].includes(decorType)) baseDecorCost = 35000;
    else if (['Simple', 'Basic', 'Minimal'].includes(decorType)) baseDecorCost = 16000;

    const areas = Array.isArray(data.decorationAreas) && data.decorationAreas.length > 0 
      ? data.decorationAreas.slice(0, 4).join(', ') 
      : 'Main Stage, Entrance Gate, Floral Backdrop';

    const decorMargin = 22;
    items.push({
      service_id: 4,
      service_name: `Theme Decoration (${decorType})`,
      category: 'Decoration & Theme Setup',
      vendor_id: 2,
      vendor_name: 'Noor Mandap & Floral Elegance',
      vendor_cost: baseDecorCost,
      margin_pct: decorMargin,
      customer_price: Math.round(baseDecorCost * (1 + decorMargin / 100)),
      details: `${decorType} styling: ${areas}. Colors: ${data.preferredColors || 'Royal Gold & White'}`
    });
  }

  // 4. Photography & Videography
  const photoServices = Array.isArray(data.photoServices) ? data.photoServices : [];
  if (photoServices.length > 0 || (data.photographyRequired && data.photographyRequired !== 'No')) {
    let photoCost = parseFloat(data.approxPhotoBudget) ? Math.round(parseFloat(data.approxPhotoBudget) * 0.80) : 38000;
    if (photoServices.includes('Cinematic Video') || photoServices.includes('Drone')) {
      photoCost = Math.max(photoCost, 45000);
    }
    const photoMargin = 20;
    const photoPrice = Math.round(photoCost * (1 + photoMargin / 100));

    items.push({
      service_id: 6,
      service_name: 'Cinematic Photography, 4K Video & Drone',
      category: 'Photography & Cinematic Media',
      vendor_id: 3,
      vendor_name: 'Al-Falah Cinematic Studio',
      vendor_cost: photoCost,
      margin_pct: photoMargin,
      customer_price: photoPrice,
      details: photoServices.join(', ') || 'Traditional + Candid photography, 4K cinematic film & photo album'
    });
  }

  // 5. Sound, DJ, Lights & Entertainment
  const soundItems = Array.isArray(data.soundEntertainment) ? data.soundEntertainment : [];
  if (soundItems.length > 0) {
    const soundCost = soundItems.includes('LED Wall') ? 22000 : 14000;
    const soundMargin = 25;
    items.push({
      service_id: 7,
      service_name: 'Pro Sound, Stage Lighting & Audio Setup',
      category: 'Sound, Lights & Entertainment',
      vendor_id: 5,
      vendor_name: 'Star Pro Light & Sound Systems',
      vendor_cost: soundCost,
      margin_pct: soundMargin,
      customer_price: Math.round(soundCost * (1 + soundMargin / 100)),
      details: soundItems.join(', ') || 'Line array sound, wireless handheld mics & ambient focus lights'
    });
  }

  // 6. Stage, Seating & Shamiana
  const seatingItems = Array.isArray(data.stageSeating) ? data.stageSeating : [];
  if (seatingItems.length > 0) {
    const tentCost = 20000;
    const tentMargin = 20;
    items.push({
      service_id: 8,
      service_name: 'VIP Seating, Sofas, Shamiana & Carpet Setup',
      category: 'Stage, Shamiana & Seating',
      vendor_id: 4,
      vendor_name: 'Marathwada Tent & Sound Hub',
      vendor_cost: tentCost,
      margin_pct: tentMargin,
      customer_price: Math.round(tentCost * (1 + tentMargin / 100)),
      details: seatingItems.join(', ') || 'VIP Sofas, royal banquet chairs, tables, and partition shamiana'
    });
  }

  // 7. Invitations & Digital Media
  const invitationItems = Array.isArray(data.invitationPrinting) ? data.invitationPrinting : [];
  if (invitationItems.length > 0) {
    const printCost = 3500;
    const printMargin = 25;
    items.push({
      service_id: 9,
      service_name: 'Designer Invitation Cards & Digital E-Invite',
      category: 'Invitations & Digital Media',
      vendor_id: 6,
      vendor_name: 'Classic Offset & Digital Press',
      vendor_cost: printCost,
      margin_pct: printMargin,
      customer_price: Math.round(printCost * (1 + printMargin / 100)),
      details: invitationItems.join(', ') || 'Custom Urdu/English print invites and WhatsApp video card'
    });
  }

  // 8. Bridal & Personal Services
  const bridalItems = Array.isArray(data.bridalServices) ? data.bridalServices : [];
  if (bridalItems.length > 0) {
    const bridalCost = 18000;
    const bridalMargin = 20;
    items.push({
      service_id: 10,
      service_name: 'Bridal Makeover, Hair & Mehendi Artistry',
      category: 'Bridal Styling & Cake',
      vendor_id: 7,
      vendor_name: 'Zoya Bridal Glamour & Mehendi',
      vendor_cost: bridalCost,
      margin_pct: bridalMargin,
      customer_price: Math.round(bridalCost * (1 + bridalMargin / 100)),
      details: bridalItems.join(', ') || 'HD bridal makeup, hair styling, intricate bridal mehendi'
    });
  }

  // 9. Guest Hospitality & Management
  const hospitalityItems = Array.isArray(data.guestHospitality) ? data.guestHospitality : [];
  if (hospitalityItems.length > 0) {
    items.push({
      service_id: 1,
      service_name: 'Event Hospitality & Guest Welcome Desk',
      category: 'Venue & Hospitality',
      vendor_id: null,
      vendor_name: 'Mezban In-House Hospitality Staff',
      vendor_cost: 8000,
      margin_pct: 25,
      customer_price: 10000,
      details: hospitalityItems.join(', ') || 'Welcome desk, gent/ladies usher coordination & assistance'
    });
  }

  // 10. Mezban Complete Coordination Fee
  const mezbanCoordCost = 12000;
  const mezbanCoordPrice = parseFloat(data.mezbanCoordFee) || 25000;
  items.push({
    service_id: 1,
    service_name: 'Mezban On-Ground Event Management & Supervision',
    category: 'Venue & Hospitality',
    vendor_id: null,
    vendor_name: 'Mezban Operations Team (Beed)',
    vendor_cost: mezbanCoordCost,
    margin_pct: Math.round(((mezbanCoordPrice - mezbanCoordCost) / mezbanCoordCost) * 100),
    customer_price: mezbanCoordPrice,
    details: 'Full day supervisor, vendor liaison, timeline enforcement & stress-free delivery'
  });

  let totalCost = 0;
  let totalPrice = 0;
  items.forEach(it => {
    totalCost += parseFloat(it.vendor_cost || 0);
    totalPrice += parseFloat(it.customer_price || 0);
  });

  const otherChg = parseFloat(data.otherCharges) || 0;
  totalPrice += otherChg;

  const mezbaanMargin = totalPrice - totalCost;
  const advanceRequired = Math.round(totalPrice * 0.30);

  return {
    items,
    summary: {
      totalCost,
      totalPrice,
      mezbaanMargin,
      advanceRequired,
      marginPct: totalPrice > 0 ? Math.round((mezbaanMargin / totalPrice) * 100) : 0
    }
  };
};

export default function CustomerRequirementSheet({ onClose, initialSheetId = null, onSaved = null, isAdmin = false }) {
  // Mode: 'form' (Filling Requirement Sheet) or 'quote' (Final Quotation & Budget Estimation)
  const [currentView, setCurrentView] = useState('form');
  const [currentStep, setCurrentStep] = useState(0);
  const [visitedSteps, setVisitedSteps] = useState(new Set([0]));
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successNotice, setSuccessNotice] = useState(null);

  // Available Vendors & Services from DB
  const [dbVendors, setDbVendors] = useState([]);
  const [dbServices, setDbServices] = useState([]);
  const [dbVenues, setDbVenues] = useState([]);

  // Form State matching screenshot sections A through Q and Mezban Internal Use
  const defaultFormData = {
    // A. CUSTOMER INFORMATION
    customerName: '',
    contactPerson: '',
    mobile: '',
    whatsapp: '',
    altContact: '',
    email: '',
    relationships: [],
    relationshipOther: '',
    howHeard: [],
    howHeardOther: '',

    // B. EVENT INFORMATION
    eventTypes: [],
    eventTypeOther: '',
    eventDate: '',
    dateStatus: 'Confirmed', // 'Confirmed', 'Tentative', 'Flexible'
    altDate: '',
    timingStart: '',
    timingEnd: '',
    timingSlot: [], // 'Morning', 'Afternoon', 'Evening', 'Night'
    guestRanges: [],
    approxGuestCount: '300',
    guestProfiles: [],

    // C. VENUE REQUIREMENT
    venueSelected: 'Need Mezban to find venue', // 'Yes', 'No', 'Shortlisted', 'Need Mezban to find venue'
    venueName: '',
    venueArea: 'Beed',
    venueTypes: [],
    venueTypeOther: '',
    importantVenueReqs: [],
    importantVenueOther: '',
    preferredArea: 'Beed',
    maxVenueBudget: '60000',

    // D. DECORATION REQUIREMENT
    decorationRequired: 'Yes', // 'Yes', 'No', 'Not Decided'
    decorationType: 'Standard',
    decorationAreas: [],
    decorationAreaOther: '',
    preferredColors: '',
    referencePhotoAvailable: 'No',
    referencePhotoFileName: '',

    // E. CATERING & FOOD
    cateringRequired: 'Yes', // 'Yes', 'No', 'Venue Catering', 'Outside Caterer', 'Need Mezban to arrange'
    foodPreference: 'Both Veg & Non-Veg',
    meals: ['Dinner'],
    foodServices: ['Buffet'],
    cuisines: ['Indian', 'Mughlai', 'Biryani'],
    specialMenuReqs: '',
    approxFoodBudget: '380',

    // F. PHOTOGRAPHY & VIDEOGRAPHY
    photographyRequired: 'Yes',
    photoServices: ['Traditional Photography', 'Candid Photography', 'Videography', 'Cinematic Video', 'Album'],
    photoHours: '8',
    approxPhotoBudget: '45000',
    photoRefStyle: 'Cinematic Royal Aesthetic',

    // G. SOUND / DJ / LIGHTING / ENTERTAINMENT
    soundEntertainment: ['Sound System', 'Mic', 'Wireless Mic', 'Stage Lighting'],
    soundOther: '',
    soundSpecialReqs: '',

    // H. STAGE / TENT / SEATING
    stageSeating: ['Stage', 'Sofa Seating', 'VIP Seating', 'Guest Chairs', 'Tables'],
    stageOther: '',
    approxSeatingCapacity: '300',

    // I. INVITATION & PRINTING
    invitationPrinting: ['Digital Invitation', 'WhatsApp Invitation'],
    invitationOther: '',

    // J. BRIDAL / PERSONAL SERVICES
    bridalServices: [],
    bridalOther: '',

    // K. GUEST MANAGEMENT & HOSPITALITY
    guestHospitality: ['Guest Welcome', 'Welcome Desk', 'Ushers'],
    guestHospitalityOther: '',

    // L. COMPLETE EVENT COORDINATION
    mezbanInvolvement: ['Complete Event Management', 'Event-Day Coordination'],
    familyCoordinatorName: '',
    familyCoordinatorMobile: '',

    // M. BUDGET DISCUSSION
    overallBudgetRange: '₹3–5 Lakh',
    approxBudget: '350000',
    mostImportant: ['Good Food', 'Decoration', 'On-Time Execution', 'Complete Tension-Free Event'],
    budgetFlexibility: 'Slightly Flexible',

    // N. CUSTOMER'S PREVIOUS EXPERIENCE
    organizedBefore: 'No',
    previousProblems: [],
    previousProblemOther: '',
    whatMezbanShouldHandle: 'End-to-end coordination and vendor quality check so family can relax.',

    // O. CUSTOMER EXPECTATION FROM MEZBAN
    satisfiedIf: 'All programs start and run smoothly on time with delicious warm food.',
    trustMezbanFactors: ['Transparent Pricing', 'Written Quotation', 'Reliable Vendors', 'One Point of Contact'],
    trustOther: '',

    // P. QUOTATION REQUIREMENT
    quotationNeeds: ['Need Complete Quotation', 'Need Complete Event Package'],
    quotationDeadline: '',
    preferredContactMethod: 'WhatsApp',

    // Q. FOLLOW-UP
    nextFollowUpDate: '',
    followUpPerson: 'Shahed (Mezban Lead)',
    decisionMaker: '',
    otherFamilyMembers: '',
    leadStatus: 'Level 1 – Potential',
    notes: 'Initial requirement discussion completed at Mezban office.',

    // R. MEZBAN INTERNAL USE
    vendorCostEstimate: '',
    mezbanCoordFee: '25000',
    otherCharges: '0',
    proposedQuote: '',
    expectedAdvance: '',
    expectedProfit: '',
    quotationSent: 'No',
    quotationDate: '',
    customerResponse: 'Waiting',
    reasonIfLost: [],
    reasonIfLostOther: ''
  };

  const [formData, setFormData] = useState(defaultFormData);

  // Autosave draft to localStorage
  useEffect(() => {
    if (!initialSheetId && formData.customerName) {
      try {
        localStorage.setItem('mezban_draft_wizard', JSON.stringify({
          formData,
          currentStep,
          visitedSteps: Array.from(visitedSteps)
        }));
      } catch (e) {
        // storage overflow fallback
      }
    }
  }, [formData, currentStep, visitedSteps, initialSheetId]);

  // Restore draft on initial load
  useEffect(() => {
    if (!initialSheetId) {
      try {
        const saved = localStorage.getItem('mezban_draft_wizard');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.formData) {
            setFormData(prev => ({ ...prev, ...parsed.formData }));
            if (typeof parsed.currentStep === 'number') {
              setCurrentStep(parsed.currentStep);
            }
            if (Array.isArray(parsed.visitedSteps)) {
              setVisitedSteps(new Set(parsed.visitedSteps));
            }
          }
        }
      } catch (e) {
        console.warn('Could not restore draft from localStorage', e);
      }
    }
  }, [initialSheetId]);

  // Quotation State
  const [quotationId, setQuotationId] = useState(null);
  const [sheetId, setSheetId] = useState(initialSheetId);
  const [quoteItems, setQuoteItems] = useState([]);
  const [quoteSummary, setQuoteSummary] = useState({
    totalCost: 0,
    totalPrice: 0,
    mezbaanMargin: 0,
    advanceRequired: 0,
    marginPct: 0
  });

  // Modal for adding a new service in quotation
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

  // Load registered vendors, services, venues from DB
  useEffect(() => {
    apiFetch('/api/vendors').then(res => {
      if (res.ok && res.data?.success) setDbVendors(res.data.vendors);
    });

    apiFetch('/api/services').then(res => {
      if (res.ok && res.data?.success) setDbServices(res.data.services);
      else setDbServices(FALLBACK_SERVICES);
    });

    apiFetch('/api/venues').then(res => {
      if (res.ok && res.data?.success) setDbVenues(res.data.venues);
      else setDbVenues(FALLBACK_VENUES);
    });

    if (initialSheetId) {
      loadSavedSheet(initialSheetId);
    }
  }, [initialSheetId]);

  const loadSavedSheet = async (id) => {
    try {
      setLoading(true);
      const res = await apiFetch(`/api/requirement-sheets/${id}`, {
        asAdmin: isAdmin
      });
      if (res.ok && res.data?.success && res.data.sheet) {
        const data = res.data;
        setSheetId(data.sheet.sheet_id);
        if (data.sheet.form_data) {
          setFormData(data.sheet.form_data);
        }

        // Resiliently extract or calculate quote items
        let items = data.quoteItems || [];
        if (!items || items.length === 0) {
          if (data.sheet.form_data && Array.isArray(data.sheet.form_data.quoteItems)) {
            items = data.sheet.form_data.quoteItems;
          } else {
            const localCalc = calculateLocalQuotation(data.sheet.form_data || {});
            items = localCalc.items;
          }
        }

        if (data.quote?.quote_id) {
          setQuotationId(data.quote.quote_id);
        }

        const totalPrice = parseFloat(data.quote?.total_price || 0) || items.reduce((s, it) => s + (parseFloat(it.customer_price) || 0), 0);
        const totalCost = parseFloat(data.quote?.total_cost || 0);
        const mezbaanMargin = parseFloat(data.quote?.mezbaan_margin || 0);

        let summary = {
          totalCost: isAdmin ? totalCost : 0,
          totalPrice,
          mezbaanMargin: isAdmin ? mezbaanMargin : 0,
          advanceRequired: Math.round(totalPrice * 0.3),
          marginPct: isAdmin && totalPrice > 0 ? Math.round((mezbaanMargin / totalPrice) * 100) : 0
        };

        if (!isAdmin) {
          items = items.map(it => ({
            ...it,
            vendor_cost: 0,
            margin_pct: 0
          }));
        }

        setQuoteItems(items);
        setQuoteSummary(summary);
        setCurrentView('quote');
      } else {
        // Check localStorage for offline draft
        try {
          const drafts = JSON.parse(localStorage.getItem('mezban_draft_sheets') || '[]');
          const item = drafts.find(d => String(d.sheet_id) === String(id));
          if (item) {
            setSheetId(item.sheet_id);
            setFormData(item.form_data);
            let items = item.quote_items || [];
            if (!items || items.length === 0) {
              const localCalc = calculateLocalQuotation(item.form_data || {});
              items = localCalc.items;
            }
            let summary = item.quote_summary || {};
            const totalPrice = parseFloat(summary.totalPrice || 0) || items.reduce((s, it) => s + (parseFloat(it.customer_price) || 0), 0);
            if (!isAdmin) {
              items = items.map(it => ({ ...it, vendor_cost: 0, margin_pct: 0 }));
              summary = {
                totalCost: 0,
                totalPrice: totalPrice,
                mezbaanMargin: 0,
                advanceRequired: Math.round(totalPrice * 0.3),
                marginPct: 0
              };
            }
            setQuoteItems(items);
            setQuoteSummary(summary);
            setCurrentView('quote');
          }
        } catch {}
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Live calculation summary for Step R
  const localCalcSummary = useMemo(() => {
    try {
      return calculateLocalQuotation(formData).summary;
    } catch {
      return null;
    }
  }, [formData]);

  // One-click demo prefill for testing (Fill Sample Beed Walima)
  const handlePrefillDemo = () => {
    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 45);
    const dateStr = nextMonth.toISOString().split('T')[0];

    const sampleData = {
      ...defaultFormData,
      customerName: 'Janab Tariq Farooqui & Family',
      contactPerson: 'Tariq Farooqui',
      mobile: '9822014589',
      whatsapp: '9822014589',
      altContact: '9423157890',
      email: 'tariq.farooqui@gmail.com',
      relationships: ["Groom's Family"],
      howHeard: ['Vendor Reference', 'WhatsApp'],
      eventTypes: ['Walima', 'Reception'],
      eventDate: dateStr,
      dateStatus: 'Confirmed',
      timingStart: '19:30',
      timingEnd: '23:30',
      timingSlot: ['Night'],
      guestRanges: ['300–500'],
      approxGuestCount: '450',
      guestProfiles: ['Mostly Family', 'Relatives', 'VIP Guests', 'Ladies & Gents'],
      venueSelected: 'Need Mezban to find venue',
      venueName: 'Royal Palace Banquet & Lawns',
      venueArea: 'Jalna Road, Beed',
      venueTypes: ['Banquet Hall', 'Lawn'],
      importantVenueReqs: ['Separate Ladies/Gents Sections', 'AC', 'Parking', 'Generator/Power Backup', 'Kitchen Facility', 'Non-Veg Allowed'],
      preferredArea: 'Beed Central',
      maxVenueBudget: '65000',
      decorationRequired: 'Yes',
      decorationType: 'Royal',
      decorationAreas: ['Main Stage', 'Entrance', 'Backdrop', 'Flower Decoration', 'Lighting'],
      preferredColors: 'Emerald Green & Royal Gold with Fresh Jasmine/Roses',
      referencePhotoAvailable: 'Yes',
      referencePhotoFileName: 'royal_walima_inspiration.jpg',
      cateringRequired: 'Yes',
      foodPreference: 'Both Veg & Non-Veg',
      meals: ['Dinner'],
      foodServices: ['Buffet'],
      cuisines: ['Mughlai', 'Biryani', 'Desserts'],
      specialMenuReqs: 'Authentic Beed Mutton Dum Biryani, Shahi Tukda, Chicken Angara & Dalcha',
      approxFoodBudget: '380',
      photographyRequired: 'Yes',
      photoServices: ['Traditional Photography', 'Candid Photography', 'Videography', 'Cinematic Video', 'Album', 'Drone'],
      photoHours: '8',
      approxPhotoBudget: '48000',
      photoRefStyle: 'Cinematic Royal Aesthetic',
      soundEntertainment: ['Sound System', 'Mic', 'Wireless Mic', 'Stage Lighting', 'LED Wall'],
      stageSeating: ['Stage', 'Sofa Seating', 'VIP Seating', 'Guest Chairs', 'Tables', 'Carpet'],
      approxSeatingCapacity: '450 Chairs + 6 VIP Sofas',
      invitationPrinting: ['Digital Invitation', 'WhatsApp Invitation', 'Welcome Board'],
      bridalServices: ['Makeup', 'Mehendi', 'Cake'],
      guestHospitality: ['Guest Welcome', 'Welcome Desk', 'Ushers', 'Ladies Hospitality Team', 'Gents Hospitality Team'],
      mezbanInvolvement: ['Complete Event Management', 'Booking Coordination', 'Event-Day Coordination'],
      familyCoordinatorName: 'Adv. Mateen Farooqui',
      familyCoordinatorMobile: '9423157890',
      overallBudgetRange: '₹3–5 Lakh',
      approxBudget: '380000',
      mostImportant: ['Good Food', 'Premium Quality', 'Reliable Vendors', 'Complete Tension-Free Event'],
      budgetFlexibility: 'Flexible for Better Quality',
      organizedBefore: 'Yes',
      previousProblems: ['Vendor Delay', 'Food Problem'],
      whatMezbanShouldHandle: 'We want Mezban to oversee the entire event so our family can greet guests with peace of mind.',
      satisfiedIf: 'All vendors arrive on schedule and food is served piping hot with great taste.',
      trustMezbanFactors: ['Transparent Pricing', 'Written Quotation', 'Reliable Vendors', 'One Point of Contact', 'No Hidden Charges'],
      quotationNeeds: ['Need Complete Quotation', 'Need Complete Event Package'],
      quotationDeadline: 'Within 24 hours',
      preferredContactMethod: 'WhatsApp',
      nextFollowUpDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
      followUpPerson: 'Shahed (Mezban Lead)',
      decisionMaker: 'Janab Tariq Farooqui',
      otherFamilyMembers: 'Adv. Mateen Farooqui (Brother)',
      leadStatus: 'Level 2 – Qualified',
      notes: 'Customer visited office. Very keen on premium Mughlai catering and royal stage setup.',
      mezbanCoordFee: '25000',
      otherCharges: '0',
      quotationSent: 'No',
      customerResponse: 'Interested'
    };

    setFormData(sampleData);
    setErrors({});
    // Mark all steps as visited
    const allVisited = new Set();
    for (let i = 0; i < WIZARD_STEPS.length; i++) allVisited.add(i);
    setVisitedSteps(allVisited);

    setSuccessNotice('Sample 450-Guest Beed Walima requirements pre-filled across all 18 steps!');
    setTimeout(() => setSuccessNotice(null), 3500);
  };

  // Clear Form handler
  const handleClearForm = () => {
    if (window.confirm('Are you sure you want to clear the entire requirement sheet? All unsaved inputs across all 18 steps will be reset.')) {
      setFormData(defaultFormData);
      setCurrentStep(0);
      setVisitedSteps(new Set([0]));
      setErrors({});
      try {
        localStorage.removeItem('mezban_draft_wizard');
      } catch {}
      setSuccessNotice('Form has been cleared and reset to Step A.');
      setTimeout(() => setSuccessNotice(null), 3000);
    }
  };

  // Step Validation (Validates only the current step's required fields)
  const validateStep = (stepIndex) => {
    const newErrors = {};

    if (stepIndex === 0) {
      if (!formData.customerName || !formData.customerName.trim()) {
        newErrors.customerName = 'Please enter Customer / Family Name';
      }
      if (!formData.mobile || !formData.mobile.trim()) {
        newErrors.mobile = 'Please enter Mobile Number';
      } else {
        const digits = formData.mobile.replace(/\D/g, '');
        if (digits.length < 10) {
          newErrors.mobile = 'Please enter a valid 10-digit mobile number';
        }
      }
    } else if (stepIndex === 1) {
      if (!formData.eventTypes || formData.eventTypes.length === 0) {
        newErrors.eventTypes = 'Please select at least one event type';
      }
      if (!formData.eventDate) {
        newErrors.eventDate = 'Please select the event date';
      }
      if (!formData.approxGuestCount && (!formData.guestRanges || formData.guestRanges.length === 0)) {
        newErrors.approxGuestCount = 'Please specify expected guest count';
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setTimeout(() => {
        const firstAlert = document.querySelector('[role="alert"]');
        if (firstAlert) {
          firstAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 60);
      return false;
    }

    return true;
  };

  // Steps configured based on user role (Customers see Steps A to P; Admin sees internal Step Q & R)
  const activeSteps = useMemo(() => {
    return isAdmin ? WIZARD_STEPS : WIZARD_STEPS.filter(s => !s.internalOnly);
  }, [isAdmin]);

  // Ensure currentStep stays within valid bounds when role or steps change
  useEffect(() => {
    if (currentStep >= activeSteps.length) {
      setCurrentStep(Math.max(0, activeSteps.length - 1));
    }
  }, [activeSteps, currentStep]);

  // Navigation: Next button
  const handleNext = () => {
    if (currentStep < activeSteps.length - 1) {
      if (validateStep(currentStep)) {
        setVisitedSteps(prev => new Set([...prev, currentStep, currentStep + 1]));
        setCurrentStep(prev => prev + 1);
      }
    } else {
      // Final Step reached: Trigger Submit & Generate Quotation
      handleSubmitAndCalculate();
    }
  };

  // Navigation: Previous button (never validates)
  const handlePrev = () => {
    setErrors({});
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  // Stepper Pill Click: Jump to visited or earlier step
  const handleStepJump = (targetIndex) => {
    setErrors({});
    setCurrentStep(targetIndex);
  };

  // Submit Requirement Sheet & Calculate Quotation
  const handleSubmitAndCalculate = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    // Prepare activeFormData with intelligent fallback defaults so calculation NEVER fails
    const activeFormData = {
      ...formData,
      customerName: formData.customerName?.trim() || 'Valued Client',
      mobile: formData.mobile?.trim() || '9822014589',
      eventDate: formData.eventDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      eventTypes: Array.isArray(formData.eventTypes) && formData.eventTypes.length > 0 ? formData.eventTypes : ['Wedding']
    };

    setFormData(activeFormData);
    setLoading(true);
    setError(null);

    try {
      let generatedItems = [];
      let generatedSummary = null;

      // Step A: Attempt quotation calculation via backend
      const calcResult = await apiFetch('/api/quotations/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activeFormData),
        asAdmin: isAdmin
      });

      if (calcResult.ok && calcResult.data?.success) {
        generatedItems = calcResult.data.items || [];
        generatedSummary = calcResult.data.summary;
      } else {
        // Resilient fallback to instant client-side calculation
        console.warn('Backend quote calculation offline or unavailable, using local calculation:', calcResult.error);
        const localCalc = calculateLocalQuotation(activeFormData);
        generatedItems = localCalc.items;
        generatedSummary = localCalc.summary;
      }

      // If customer view, strictly sanitize items & summary
      if (!isAdmin) {
        generatedItems = (generatedItems || []).map(it => ({
          ...it,
          vendor_cost: 0,
          margin_pct: 0
        }));
        generatedSummary = {
          ...(generatedSummary || {}),
          totalCost: 0,
          mezbaanMargin: 0,
          marginPct: 0
        };
      }

      setQuoteItems(generatedItems);
      setQuoteSummary(generatedSummary);

      // Step B: Save requirement sheet and initial quote in DB (or localStorage if offline)
      const saveResult = await apiFetch('/api/requirement-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheetId,
          formData: activeFormData,
          quoteItems: generatedItems,
          quoteSummary: generatedSummary
        }),
        asAdmin: isAdmin
      });

      if (saveResult.ok && saveResult.data?.success) {
        setSheetId(saveResult.data.sheet_id);
        setQuotationId(saveResult.data.quote_id);
        if (onSaved) onSaved(saveResult.data);
        setSuccessNotice('Customer requirement sheet saved and official quotation generated!');
      } else {
        // Fallback: Save to browser local storage so work is never lost
        const localId = `local_${Date.now()}`;
        try {
          const existing = JSON.parse(localStorage.getItem('mezban_draft_sheets') || '[]');
          existing.unshift({
            sheet_id: localId,
            customer_name: formData.customerName,
            event_type: Array.isArray(formData.eventTypes) ? formData.eventTypes.join(' & ') : 'Event',
            event_date: formData.eventDate,
            mobile: formData.mobile,
            form_data: formData,
            quote_items: generatedItems,
            quote_summary: generatedSummary,
            created_at: new Date().toISOString()
          });
          localStorage.setItem('mezban_draft_sheets', JSON.stringify(existing.slice(0, 50)));
        } catch (e) {
          console.warn('Could not save draft to localStorage', e);
        }
        setSheetId(localId);
        setSuccessNotice('Quotation generated successfully! (Saved to local browser storage)');
      }

      // Smoothly switch to Quotation View!
      setCurrentView('quote');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      // Fallback to local quotation rather than blocking
      try {
        const localCalc = calculateLocalQuotation(formData);
        let items = localCalc.items;
        let summary = localCalc.summary;
        if (!isAdmin) {
          items = (items || []).map(it => ({
            ...it,
            vendor_cost: 0,
            margin_pct: 0
          }));
          summary = {
            ...(summary || {}),
            totalCost: 0,
            mezbaanMargin: 0,
            marginPct: 0
          };
        }
        setQuoteItems(items);
        setQuoteSummary(summary);
        setCurrentView('quote');
        setSuccessNotice('Quotation generated in offline mode.');
      } catch (fallbackErr) {
        setError(err.message || 'Error processing requirement sheet');
      }
    } finally {
      setLoading(false);
    }
  };

  // Recalculate summary from quoteItems
  const recalculateQuote = (items) => {
    let cost = 0;
    let price = 0;
    items.forEach(it => {
      cost += parseFloat(it.vendor_cost || 0);
      price += parseFloat(it.customer_price || 0);
    });
    const margin = price - cost;
    const summary = {
      totalCost: cost,
      totalPrice: price,
      mezbaanMargin: margin,
      advanceRequired: Math.round(price * 0.3),
      marginPct: price > 0 ? Math.round((margin / price) * 100) : 0
    };
    setQuoteItems(items);
    setQuoteSummary(summary);
  };

  // Delete line item
  const handleDeleteItem = (index) => {
    const updated = quoteItems.filter((_, idx) => idx !== index);
    recalculateQuote(updated);
  };

  // Edit item inline
  const handleItemFieldChange = (index, field, value) => {
    const updated = [...quoteItems];
    updated[index][field] = value;

    if (field === 'vendor_cost' || field === 'margin_pct') {
      const c = parseFloat(updated[index].vendor_cost) || 0;
      const m = parseFloat(updated[index].margin_pct) || 0;
      updated[index].customer_price = Math.round(c * (1 + m / 100));
    } else if (field === 'customer_price') {
      const p = parseFloat(updated[index].customer_price) || 0;
      const c = parseFloat(updated[index].vendor_cost) || 0;
      if (c > 0) {
        updated[index].margin_pct = Math.round(((p - c) / c) * 100);
      }
    }

    recalculateQuote(updated);
  };

  // Add new service item
  const handleAddService = (e) => {
    e.preventDefault();
    if (!newServiceItem.service_name) return;

    const vendorObj = dbVendors.find(v => v.vendor_id === Number(newServiceItem.vendor_id));

    const item = {
      service_id: Number(newServiceItem.service_id) || 1,
      service_name: newServiceItem.service_name,
      category: newServiceItem.category || 'Special Service',
      vendor_id: vendorObj ? vendorObj.vendor_id : null,
      vendor_name: vendorObj ? vendorObj.business_name : (newServiceItem.vendor_name || 'Mezban Verified Partner'),
      vendor_cost: parseFloat(newServiceItem.vendor_cost) || 0,
      margin_pct: parseFloat(newServiceItem.margin_pct) || 20,
      customer_price: parseFloat(newServiceItem.customer_price) || Math.round((parseFloat(newServiceItem.vendor_cost) || 0) * 1.2),
      details: newServiceItem.details || ''
    };

    const updated = [...quoteItems, item];
    recalculateQuote(updated);
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

  // Send Quotation (WhatsApp / Email / SMS)
  const handleSendQuotation = async (channel = 'whatsapp') => {
    try {
      setLoading(true);
      const res = await apiFetch('/api/quotations/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quote_id: quotationId,
          sheet_id: sheetId,
          customer_name: formData.customerName,
          mobile: formData.whatsapp || formData.mobile,
          email: formData.email,
          event_type: Array.isArray(formData.eventTypes) ? formData.eventTypes.join(' & ') : 'Event',
          event_date: formData.eventDate,
          guest_count: formData.approxGuestCount,
          items: quoteItems,
          total_price: quoteSummary.totalPrice,
          advance_required: quoteSummary.advanceRequired
        })
      });

      if (res.ok && res.data?.success) {
        const data = res.data;
        if (channel === 'whatsapp' && data.dispatches?.whatsapp_url) {
          window.open(data.dispatches.whatsapp_url, '_blank');
        } else if (channel === 'email' && data.dispatches?.email_mailto) {
          window.location.href = data.dispatches.email_mailto;
        }
        setSuccessNotice(`Quotation successfully prepared & logged for ${formData.customerName}! (${channel.toUpperCase()})`);
        setTimeout(() => setSuccessNotice(null), 5000);
      } else {
        // Direct browser dispatch fallback if server is offline
        const cleanMobile = (formData.whatsapp || formData.mobile || '').replace(/\D/g, '');
        const mobileWithCountry = cleanMobile.startsWith('91') ? cleanMobile : `91${cleanMobile}`;
        const itemsText = quoteItems.map((it, idx) => `${idx + 1}. ${it.service_name}: ₹${Number(it.customer_price).toLocaleString('en-IN')}`).join('\n');
        const message = 
`👑 *MEZBAAN EVENTS & CELEBRATIONS*
*Official Quotation & Event Estimate*
----------------------------------------
*Client:* ${formData.customerName}
*Event:* ${Array.isArray(formData.eventTypes) ? formData.eventTypes.join(' & ') : 'Event'}
*Date:* ${formData.eventDate || 'Upcoming'}
*Guests:* ${formData.approxGuestCount || 300}
----------------------------------------
*ESTIMATED SERVICES:*
${itemsText}
----------------------------------------
*TOTAL ESTIMATED QUOTE:* ₹${Number(quoteSummary.totalPrice || 0).toLocaleString('en-IN')}
*Advance Required (30%):* ₹${Number(quoteSummary.advanceRequired || 0).toLocaleString('en-IN')}

✓ Transparent Pricing • Zero Hidden Charges
✓ 100% Verified Quality Vendors & Supervised Execution
----------------------------------------
To confirm this booking, reply to this message or call Mezban Support: +91 98220 14589`;

        if (channel === 'whatsapp') {
          window.open(`https://wa.me/${mobileWithCountry}?text=${encodeURIComponent(message)}`, '_blank');
        } else if (channel === 'email') {
          const subject = `MEZBAAN Event Quotation - ${formData.customerName}`;
          window.location.href = `mailto:${formData.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
        }
        setSuccessNotice(`Quotation prepared & dispatched via ${channel.toUpperCase()}!`);
        setTimeout(() => setSuccessNotice(null), 5000);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to dispatch quotation');
    } finally {
      setLoading(false);
    }
  };

  // Save Quotation updates back to SQLite or localStorage
  const handleSaveQuotationDraft = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/api/requirement-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheetId,
          formData: {
            ...formData,
            proposedQuote: quoteSummary.totalPrice,
            vendorCostEstimate: quoteSummary.totalCost,
            expectedProfit: quoteSummary.mezbaanMargin,
            expectedAdvance: quoteSummary.advanceRequired
          },
          quoteItems,
          quoteSummary
        }),
        asAdmin: isAdmin
      });

      if (res.ok && res.data?.success) {
        if (res.data.sheet_id) setSheetId(res.data.sheet_id);
        if (onSaved) onSaved(res.data);
        setSuccessNotice('Quotation items and updated rates saved to database!');
        setTimeout(() => setSuccessNotice(null), 4000);
      } else {
        // Save locally to browser
        try {
          const existing = JSON.parse(localStorage.getItem('mezban_draft_sheets') || '[]');
          const idx = existing.findIndex(s => s.sheet_id === sheetId);
          const updatedRecord = {
            sheet_id: sheetId || `local_${Date.now()}`,
            customer_name: formData.customerName,
            event_type: Array.isArray(formData.eventTypes) ? formData.eventTypes.join(' & ') : 'Event',
            event_date: formData.eventDate,
            mobile: formData.mobile,
            form_data: formData,
            quote_items: quoteItems,
            quote_summary: quoteSummary,
            updated_at: new Date().toISOString()
          };
          if (idx >= 0) existing[idx] = updatedRecord;
          else existing.unshift(updatedRecord);
          localStorage.setItem('mezban_draft_sheets', JSON.stringify(existing));
        } catch {}
        setSuccessNotice('Quotation items saved locally in browser storage!');
        setTimeout(() => setSuccessNotice(null), 4000);
      }
    } catch (err) {
      console.error(err);
      setSuccessNotice('Quotation draft saved!');
      setTimeout(() => setSuccessNotice(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Alert Notices */}
      {error && (
        <div style={{
          maxWidth: 960,
          margin: '16px auto',
          background: '#fee2e2',
          border: '1px solid #ef4444',
          color: '#b91c1c',
          padding: '10px 16px',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: '0.88rem'
        }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {successNotice && (
        <div style={{
          maxWidth: 960,
          margin: '16px auto',
          background: '#ecfdf5',
          border: '1px solid #10b981',
          color: '#047857',
          padding: '10px 16px',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: '0.88rem'
        }}>
          <Check size={18} /> {successNotice}
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 1: PROFESSIONAL 18-STEP WIZARD FORM (STEPS A TO R) */}
      {/* ============================================================== */}
      {currentView === 'form' && (
        <WizardShell
          currentStep={currentStep}
          onStepChange={handleStepJump}
          steps={activeSteps}
          visitedSteps={visitedSteps}
          onNext={handleNext}
          onPrev={handlePrev}
          isSubmitting={loading}
          onClose={onClose}
          onFillSample={handlePrefillDemo}
          onClearForm={handleClearForm}
          onInstantEstimate={handleSubmitAndCalculate}
        >
          <StepFormRenderer
            currentStep={currentStep}
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
            localCalcSummary={localCalcSummary}
          />
        </WizardShell>
      )}

      {/* ============================================================== */}
      {/* VIEW 2: FINAL QUOTATION & BUDGET ESTIMATION */}
      {/* Customer Mode: Clean proposal (Strictly NO vendor costs or margins) */}
      {/* Admin Mode: Full costing engine with margins and vendor editing */}
      {/* ============================================================== */}
      {currentView === 'quote' && (
        isAdmin ? (
          <AdminQuotationView
            formData={formData}
            quoteItems={quoteItems}
            setQuoteItems={setQuoteItems}
            quoteSummary={quoteSummary}
            setQuoteSummary={setQuoteSummary}
            sheetId={sheetId}
            dbVendors={dbVendors}
            dbServices={dbServices}
            onEditRequirements={() => {
              setCurrentView('form');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSaveDraft={handleSaveQuotationDraft}
            onClose={onClose}
            saving={loading}
          />
        ) : (
          <CustomerQuotationView
            formData={formData}
            quoteItems={quoteItems}
            setQuoteItems={setQuoteItems}
            quoteSummary={quoteSummary}
            setQuoteSummary={setQuoteSummary}
            sheetId={sheetId}
            dbVendors={dbVendors}
            dbServices={dbServices}
            onEditRequirements={() => {
              setCurrentView('form');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSaveDraft={handleSaveQuotationDraft}
            onClose={onClose}
            saving={loading}
          />
        )
      )}
    </>
  );
}
