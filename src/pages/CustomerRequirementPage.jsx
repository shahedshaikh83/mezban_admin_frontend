import React, { useState, useEffect } from 'react';
import { 
  ExternalLink, 
  Sparkles, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  Link as LinkIcon, 
  Menu,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

// Components
import AnnouncementBar from '../components/mezbaan/AnnouncementBar';
import Header from '../components/mezbaan/Header';
import FormSidebar from '../components/mezbaan/FormSidebar';
import StepHeader from '../components/mezbaan/StepHeader';
import Badge from '../components/mezbaan/Badge';
import Button from '../components/mezbaan/Button';

// Steps
import { MEZBAAN_12_STEPS } from '../components/mezbaan/stepsConfig';
import Step1CustomerInfo from '../components/mezbaan/steps/Step1CustomerInfo';
import Step2EventDetails from '../components/mezbaan/steps/Step2EventDetails';
import Step3VenueLocation from '../components/mezbaan/steps/Step3VenueLocation';
import Step4GuestsDining from '../components/mezbaan/steps/Step4GuestsDining';
import Step5CateringReqs from '../components/mezbaan/steps/Step5CateringReqs';
import Step6DecorTheme from '../components/mezbaan/steps/Step6DecorTheme';
import Step7MediaEntertainment from '../components/mezbaan/steps/Step7MediaEntertainment';
import Step8LogisticsInfrastructure from '../components/mezbaan/steps/Step8LogisticsInfrastructure';
import Step9AdditionalPreferences from '../components/mezbaan/steps/Step9AdditionalPreferences';
import Step10BudgetRange from '../components/mezbaan/steps/Step10BudgetRange';
import Step11NotesReferences from '../components/mezbaan/steps/Step11NotesReferences';
import Step12ReviewSubmit from '../components/mezbaan/steps/Step12ReviewSubmit';

// Storage & Data layer
import { 
  getRequirement, 
  saveRequirement, 
  generateQuotationFromRequirement,
  saveQuotation,
  clearAll,
  SAMPLE_REQUIREMENT,
  saveDraftSheet,
  updateDraftSheetId
} from '../lib/quotationStorage';

// API Sync helper
import { apiFetch } from '../utils/api';

const DEFAULT_FORM_DATA = {
  customerName: '',
  contactPerson: '',
  mobile: '',
  countryCode: '+91',
  whatsappNumber: '',
  sameAsMobile: false,
  altMobile: '',
  email: '',
  relationship: '',
  source: '',

  // Step 2
  eventTypes: ['Walima & Reception'],
  eventDate: '',
  dateStatus: 'Confirmed',
  timeSlot: 'Night (Dinner)',
  timingStart: '19:30',
  timingEnd: '23:30',

  // Step 3
  venueSelected: 'Yes',
  venueName: '',
  venueArea: 'Beed',
  venueType: 'Banquet Hall + Open Lawn',
  maxVenueBudget: '65000',

  // Step 4
  guestCount: 450,
  foodPreference: 'Both Veg & Non-Veg',
  meals: ['Dinner'],
  serviceStyle: 'Royal Buffet + Dastarkhwan VIP Area',

  // Step 5
  cuisines: ['Authentic Beed Dum Biryani', 'Mughlai Gosht & Korma', 'Roomali Roti & Butter Naan', 'Shahi Tukda & Firni'],
  approxFoodBudget: '420',
  specialMenuNotes: '',

  // Step 6
  decorationType: 'Royal Islamic & Modern Floral',
  preferredColors: 'Emerald Green, Royal Gold & Ivory White',
  decorationAreas: ['Main Stage', 'Grand Entrance Arch', 'VIP Dastarkhwan Area', 'Photo Booth / Selfie Point'],
  approxDecorBudget: '45000',

  // Step 7
  photoServices: ['Traditional Photography', 'Candid Photography', '4K Cinematic Video', 'Drone Coverage', 'Premium Album'],
  soundSpecialReqs: '',
  approxMediaBudget: '55000',

  // Step 8
  stageSeating: ['VIP Royal Sofas', 'Round Tables with Silk Cover', 'Cushioned Banquet Chairs', 'Red Carpet Pathway'],
  powerBackup: 'Full Generator Backup Required',
  approxLogisticsBudget: '25000',

  // Step 9
  hospitalityNeeds: ['Uniformed Welcome Ushers (Gents & Ladies)', 'Attar & Rose Water Welcome Desk'],
  invitationNeeds: ['Digital Video E-Invite', 'WhatsApp RSVP Broadcast'],
  specialRequests: '',

  // Step 10
  overallBudgetRange: '₹4 Lakh – ₹6 Lakh',
  approxBudget: '520000',
  budgetFlexibility: 'Slightly Flexible',
  mostImportant: ['Delicious Authentic Food', 'Grand Stage Décor', 'Smooth Timely Execution'],

  // Step 11
  notes: '',
  referenceLinks: '',
  whatMezbanShouldHandle: ''
};

export default function CustomerRequirementPage({
  onNavigatePortal,
  onOpenPlanModal,
  onOpenQuotationPage
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set([1]));
  const [formData, setFormData] = useState(() => {
    const saved = getRequirement();
    return saved ? { ...DEFAULT_FORM_DATA, ...saved } : DEFAULT_FORM_DATA;
  });
  const [errors, setErrors] = useState({});
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [statusNotice, setStatusNotice] = useState(null);

  // Auto-save draft on data changes
  useEffect(() => {
    if (formData.customerName || formData.mobile) {
      saveRequirement(formData);
    }
  }, [formData]);

  const handleFieldChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for field if fixed
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // Validate step requirements before continuing
  const validateStep = (stepNumber) => {
    const newErrors = {};

    if (stepNumber === 1) {
      if (!formData.customerName || !formData.customerName.trim()) {
        newErrors.customerName = 'Customer / Family Name is required';
      }
      if (!formData.mobile || !formData.mobile.trim()) {
        newErrors.mobile = 'Mobile Number is required';
      } else if (formData.mobile.replace(/\D/g, '').length < 10) {
        newErrors.mobile = 'Please enter a valid 10-digit mobile number';
      }
    }

    if (stepNumber === 2) {
      if (!formData.eventDate) {
        newErrors.eventDate = 'Please select the event date';
      }
    }

    if (stepNumber === 4) {
      if (!formData.guestCount || parseInt(formData.guestCount, 10) <= 0) {
        newErrors.guestCount = 'Please enter approximate guest count';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    // Mark current step as completed
    setCompletedSteps(prev => new Set([...prev, currentStep]));

    if (currentStep < 12) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else {
      // Step 12: Final Submit & Open Quotation
      handleSubmitAndOpenQuotation();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleStepJump = (stepNumber) => {
    setCurrentStep(stepNumber);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Fill Sample (Beed Walima)
  const handleFillSample = () => {
    setFormData(SAMPLE_REQUIREMENT);
    saveRequirement(SAMPLE_REQUIREMENT);
    setErrors({});
    setCompletedSteps(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]));
    setStatusNotice({ type: 'success', text: 'Sample data loaded for Beed Walima & Reception!' });
    setTimeout(() => setStatusNotice(null), 4000);
  };

  // Clear Form
  const handleClearForm = () => {
    if (window.confirm('Are you sure you want to clear the entire form? This will reset all fields.')) {
      setFormData(DEFAULT_FORM_DATA);
      clearAll();
      setCompletedSteps(new Set());
      setErrors({});
      setCurrentStep(1);
      setStatusNotice({ type: 'info', text: 'Form cleared and reset to fresh state.' });
      setTimeout(() => setStatusNotice(null), 3000);
    }
  };

  // Save & Open Estimated Budget (Works from anywhere in form)
  const handleSubmitAndOpenQuotation = async () => {
    // Basic validation
    if (!formData.customerName || !formData.customerName.trim()) {
      setCurrentStep(1);
      setErrors({ customerName: 'Please specify Customer / Family Name to generate quotation' });
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    // 1. Save local draft state
    saveRequirement(formData);

    // 2. Generate itemized quotation and store
    const quotation = generateQuotationFromRequirement(formData);
    saveQuotation(quotation);

    // 3. Immediately persist to Requirement Sheets list (Guaranteed offline & online persistence)
    const localSheetId = formData.sheetId || `local_${Date.now()}`;
    const sheetRecord = {
      sheet_id: localSheetId,
      customer_name: formData.customerName.trim(),
      contact_person: formData.contactPerson?.trim() || formData.customerName.trim(),
      mobile: formData.mobile || formData.whatsappNumber || '',
      whatsapp: formData.whatsappNumber || formData.mobile || '',
      email: formData.email || '',
      event_type: Array.isArray(formData.eventTypes) && formData.eventTypes.length > 0 
        ? formData.eventTypes.join(' & ') 
        : (formData.eventType || 'Wedding / Event'),
      event_date: formData.eventDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      guest_count: parseInt(formData.guestCount || formData.approxGuestCount || 300, 10),
      lead_status: formData.leadStatus || 'Level 1 – Potential',
      total_price: quotation.quoteSummary?.totalPrice || 0,
      form_data: formData,
      quote_items: quotation.quoteItems,
      quote_summary: quotation.quoteSummary,
      created_at: new Date().toISOString()
    };

    saveDraftSheet(sheetRecord);

    // 4. Background synchronization with SQLite server
    try {
      const res = await apiFetch('/api/requirement-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheetId: formData.sheetId,
          formData,
          quoteItems: quotation.quoteItems,
          quoteSummary: quotation.quoteSummary
        })
      });

      if (res.ok && res.data?.success && res.data.sheet_id) {
        updateDraftSheetId(localSheetId, res.data.sheet_id);
        setFormData(prev => ({ ...prev, sheetId: res.data.sheet_id }));
      }
    } catch (e) {
      console.warn('Backend sync deferred; offline localStorage updated.', e);
    }

    // 5. Navigate to Quotation View
    if (onOpenQuotationPage) {
      onOpenQuotationPage(quotation);
    } else {
      window.location.hash = '#/quotation';
    }
  };

  // Active step metadata
  const activeStepMeta = MEZBAAN_12_STEPS.find(s => s.number === currentStep) || MEZBAAN_12_STEPS[0];
  const StepIcon = activeStepMeta.icon;

  // Next Button Label per step
  const getNextLabel = () => {
    if (currentStep === 12) return 'Submit & Generate Quotation';
    const nextMeta = MEZBAAN_12_STEPS.find(s => s.number === currentStep + 1);
    return `Next: ${nextMeta ? nextMeta.title : 'Next Step'}`;
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-[#1F2937] font-['Inter',sans-serif] flex flex-col selection:bg-[#E6F2EC] selection:text-[#0B4D3A]">
      {/* 1. Top Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Global Header */}
      <Header
        activeTab="customer-requirement"
        onNavigate={onNavigatePortal}
        onOpenPlanModal={onOpenPlanModal}
      />

      {/* 3. Main Page Body Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Status Notice Toast */}
        {statusNotice && (
          <div className={`mb-6 p-3.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 shadow-sm transition-all animate-in fade-in
            ${statusNotice.type === 'success' 
              ? 'bg-[#E6F2EC] text-[#0B4D3A] border border-[#b8dfce]' 
              : 'bg-amber-50 text-amber-900 border border-amber-200'}
          `}>
            {statusNotice.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />}
            <span>{statusNotice.text}</span>
          </div>
        )}

        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <Badge variant="gold" className="mb-2">
              INTERNAL ADMIN INTAKE
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Customer Requirement Sheet
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
              Collect client details and event requirements to generate an estimated budget.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Open Estimated Budget Page */}
            <button
              type="button"
              onClick={handleSubmitAndOpenQuotation}
              className="inline-flex items-center gap-2 bg-[#0B4D3A] hover:bg-[#083b2c] text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-colors duration-150 cursor-pointer active:scale-95"
            >
              <ExternalLink className="w-4 h-4 text-emerald-300" />
              <span>Open Estimated Budget Page</span>
            </button>

            {/* Fill Sample (Beed Walima) */}
            <button
              type="button"
              onClick={handleFillSample}
              className="inline-flex items-center gap-2 bg-[#FFF8E1] hover:bg-[#fdedb4] text-[#78590d] border border-[#F4C542] font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-2xs transition-colors duration-150 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-[#F4C542]" />
              <span>Fill Sample (Beed Walima)</span>
            </button>

            {/* Clear Form */}
            <button
              type="button"
              onClick={handleClearForm}
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-semibold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl shadow-2xs transition-colors duration-150 cursor-pointer active:scale-95"
            >
              <Trash2 className="w-4 h-4 text-gray-500" />
              <span className="hidden sm:inline">Clear Form</span>
            </button>

            {/* Mobile Steps Trigger (< 1024px) */}
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 bg-white text-gray-800 border border-gray-300 font-semibold text-xs px-3.5 py-2.5 rounded-xl shadow-2xs"
            >
              <Menu className="w-4 h-4 text-gray-600" />
              <span>Steps ({currentStep}/12)</span>
            </button>
          </div>
        </div>

        {/* Two Columns: Collapsible Sidebar (Left) + Form Card (Right) */}
        <div className="flex items-start gap-6 relative">
          {/* 1. Left Collapsible Sidebar */}
          <FormSidebar
            steps={MEZBAAN_12_STEPS}
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={handleStepJump}
            onBackToPortal={() => onNavigatePortal ? onNavigatePortal('admin') : (window.location.hash = '#/admin/dashboard')}
            isMobileOpen={isMobileDrawerOpen}
            onCloseMobile={() => setIsMobileDrawerOpen(false)}
          />

          {/* 2. Right Form Card */}
          <main className="flex-1 min-w-0 bg-white rounded-2xl border border-gray-200/90 shadow-sm overflow-hidden flex flex-col">
            {/* Form Section Header Bar */}
            <div className="p-4 sm:p-6 pb-2 sm:pb-4">
              <StepHeader
                stepNumber={activeStepMeta.number}
                title={activeStepMeta.title}
                subtitle={activeStepMeta.sectionSubtitle}
                icon={StepIcon}
              />
            </div>

            {/* Step Content Body */}
            <div className="p-4 sm:p-6 pt-2 flex-1">
              {currentStep === 1 && (
                <Step1CustomerInfo
                  formData={formData}
                  onChange={handleFieldChange}
                  errors={errors}
                />
              )}

              {currentStep === 2 && (
                <Step2EventDetails
                  formData={formData}
                  onChange={handleFieldChange}
                  errors={errors}
                />
              )}

              {currentStep === 3 && (
                <Step3VenueLocation
                  formData={formData}
                  onChange={handleFieldChange}
                  errors={errors}
                />
              )}

              {currentStep === 4 && (
                <Step4GuestsDining
                  formData={formData}
                  onChange={handleFieldChange}
                  errors={errors}
                />
              )}

              {currentStep === 5 && (
                <Step5CateringReqs
                  formData={formData}
                  onChange={handleFieldChange}
                  errors={errors}
                />
              )}

              {currentStep === 6 && (
                <Step6DecorTheme
                  formData={formData}
                  onChange={handleFieldChange}
                  errors={errors}
                />
              )}

              {currentStep === 7 && (
                <Step7MediaEntertainment
                  formData={formData}
                  onChange={handleFieldChange}
                  errors={errors}
                />
              )}

              {currentStep === 8 && (
                <Step8LogisticsInfrastructure
                  formData={formData}
                  onChange={handleFieldChange}
                  errors={errors}
                />
              )}

              {currentStep === 9 && (
                <Step9AdditionalPreferences
                  formData={formData}
                  onChange={handleFieldChange}
                  errors={errors}
                />
              )}

              {currentStep === 10 && (
                <Step10BudgetRange
                  formData={formData}
                  onChange={handleFieldChange}
                  errors={errors}
                />
              )}

              {currentStep === 11 && (
                <Step11NotesReferences
                  formData={formData}
                  onChange={handleFieldChange}
                  errors={errors}
                />
              )}

              {currentStep === 12 && (
                <Step12ReviewSubmit
                  formData={formData}
                  onJumpToStep={handleStepJump}
                />
              )}
            </div>

            {/* Form Card Footer */}
            <div className="border-t border-gray-200/90 p-4 sm:p-6 bg-gray-50/50 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 mt-4">
              {/* Left: Back Button */}
              <div>
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-100 text-gray-700 font-semibold text-xs sm:text-sm rounded-xl border border-gray-300 shadow-2xs transition-colors duration-150 cursor-pointer active:scale-95"
                  >
                    <ArrowLeft className="w-4 h-4 text-gray-500" />
                    <span>Back</span>
                  </button>
                ) : <div />}
              </div>

              {/* Right: Save & Open Estimated Budget + Next */}
              <div className="flex flex-wrap items-center justify-end gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleSubmitAndOpenQuotation}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FFF8E1] hover:bg-[#fae8b1] text-[#78590d] border border-[#F4C542] font-semibold text-xs sm:text-sm rounded-xl shadow-2xs transition-all duration-150 cursor-pointer active:scale-95"
                >
                  <LinkIcon className="w-4 h-4 text-[#F4C542]" />
                  <span>Save & Open Estimated Budget</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0B4D3A] hover:bg-[#083b2c] text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm hover:shadow transition-all duration-150 cursor-pointer active:scale-95"
                >
                  <span>{getNextLabel()}</span>
                  <ArrowRight className="w-4 h-4 text-emerald-300" />
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
