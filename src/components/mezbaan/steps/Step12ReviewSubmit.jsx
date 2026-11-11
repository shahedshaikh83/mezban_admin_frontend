import React from 'react';
import { 
  User, 
  Calendar, 
  MapPin, 
  Users, 
  Utensils, 
  Palette, 
  Camera, 
  Truck, 
  ClipboardCheck, 
  Wallet, 
  BookOpen, 
  Edit3,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { generateQuotationFromRequirement } from '../../../lib/quotationStorage';

export default function Step12ReviewSubmit({ formData, onJumpToStep }) {
  const quotePreview = generateQuotationFromRequirement(formData);
  const totalPrice = quotePreview.quoteSummary?.totalPrice || 0;
  const advanceRequired = quotePreview.quoteSummary?.advanceRequired || 0;

  const sections = [
    {
      step: 1,
      title: 'Customer Information',
      icon: User,
      details: [
        { label: 'Name', value: formData.customerName || '—' },
        { label: 'Contact Person', value: formData.contactPerson || '—' },
        { label: 'Mobile', value: formData.mobile || '—' },
        { label: 'WhatsApp', value: formData.whatsappNumber || '—' },
        { label: 'Relationship', value: formData.relationship || '—' },
        { label: 'Source', value: formData.source || '—' }
      ]
    },
    {
      step: 2,
      title: 'Event Details',
      icon: Calendar,
      details: [
        { label: 'Event Type', value: Array.isArray(formData.eventTypes) ? formData.eventTypes.join(', ') : '—' },
        { label: 'Event Date', value: formData.eventDate || '—' },
        { label: 'Date Status', value: formData.dateStatus || '—' },
        { label: 'Time Slot', value: formData.timeSlot || '—' },
        { label: 'Timings', value: formData.timingStart ? `${formData.timingStart} to ${formData.timingEnd || 'End'}` : '—' }
      ]
    },
    {
      step: 3,
      title: 'Venue & Location',
      icon: MapPin,
      details: [
        { label: 'Venue Name', value: formData.venueName || '—' },
        { label: 'Area / City', value: formData.venueArea || '—' },
        { label: 'Venue Type', value: formData.venueType || '—' },
        { label: 'Max Venue Budget', value: formData.maxVenueBudget ? `₹${Number(formData.maxVenueBudget).toLocaleString('en-IN')}` : '—' }
      ]
    },
    {
      step: 4,
      title: 'Guests & Dining',
      icon: Users,
      details: [
        { label: 'Guest Count', value: formData.guestCount ? `${formData.guestCount} Guests` : '—' },
        { label: 'Food Preference', value: formData.foodPreference || '—' },
        { label: 'Meals', value: Array.isArray(formData.meals) ? formData.meals.join(', ') : '—' },
        { label: 'Service Style', value: formData.serviceStyle || '—' }
      ]
    },
    {
      step: 5,
      title: 'Catering Requirements',
      icon: Utensils,
      details: [
        { label: 'Cuisines', value: Array.isArray(formData.cuisines) ? formData.cuisines.join(', ') : '—' },
        { label: 'Food Budget/Plate', value: formData.approxFoodBudget ? `₹${formData.approxFoodBudget}` : '—' },
        { label: 'Special Notes', value: formData.specialMenuNotes || '—' }
      ]
    },
    {
      step: 6,
      title: 'Décor & Theme',
      icon: Palette,
      details: [
        { label: 'Theme Style', value: formData.decorationType || '—' },
        { label: 'Color Palette', value: formData.preferredColors || '—' },
        { label: 'Decor Areas', value: Array.isArray(formData.decorationAreas) ? formData.decorationAreas.join(', ') : '—' },
        { label: 'Approx. Decor Budget', value: formData.approxDecorBudget ? `₹${Number(formData.approxDecorBudget).toLocaleString('en-IN')}` : '—' }
      ]
    },
    {
      step: 7,
      title: 'Media & Entertainment',
      icon: Camera,
      details: [
        { label: 'Selected Media', value: Array.isArray(formData.photoServices) ? formData.photoServices.join(', ') : '—' },
        { label: 'Approx. Media Budget', value: formData.approxMediaBudget ? `₹${Number(formData.approxMediaBudget).toLocaleString('en-IN')}` : '—' },
        { label: 'Sound Details', value: formData.soundSpecialReqs || '—' }
      ]
    },
    {
      step: 8,
      title: 'Logistics & Infrastructure',
      icon: Truck,
      details: [
        { label: 'Stage & Seating', value: Array.isArray(formData.stageSeating) ? formData.stageSeating.join(', ') : '—' },
        { label: 'Power Backup', value: formData.powerBackup || '—' },
        { label: 'Logistics Budget', value: formData.approxLogisticsBudget ? `₹${Number(formData.approxLogisticsBudget).toLocaleString('en-IN')}` : '—' }
      ]
    },
    {
      step: 9,
      title: 'Additional Preferences',
      icon: ClipboardCheck,
      details: [
        { label: 'Hospitality Team', value: Array.isArray(formData.hospitalityNeeds) ? formData.hospitalityNeeds.join(', ') : '—' },
        { label: 'Special Requests', value: formData.specialRequests || '—' }
      ]
    },
    {
      step: 10,
      title: 'Budget Range & Priority',
      icon: Wallet,
      details: [
        { label: 'Budget Range', value: formData.overallBudgetRange || '—' },
        { label: 'Target Budget', value: formData.approxBudget ? `₹${Number(formData.approxBudget).toLocaleString('en-IN')}` : '—' },
        { label: 'Flexibility', value: formData.budgetFlexibility || '—' },
        { label: 'Priorities', value: Array.isArray(formData.mostImportant) ? formData.mostImportant.join(', ') : '—' }
      ]
    },
    {
      step: 11,
      title: 'Notes & References',
      icon: BookOpen,
      details: [
        { label: 'Instructions', value: formData.notes || '—' },
        { label: 'References', value: formData.referenceLinks || '—' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quotation Preview Highlight Box */}
      <div className="bg-[#FFF8E1] border border-[#F3DFA2] rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#0B4D3A] text-[#F4C542] flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <span>Estimated Package Budget Overview</span>
              <span className="text-[11px] font-bold bg-[#0B4D3A] text-white px-2 py-0.5 rounded-full">
                {quotePreview.quoteItems.length} Services Calculated
              </span>
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              Based on {formData.guestCount || 450} guests attending in {formData.venueArea || 'Beed'}.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-[#F3DFA2] pt-3 md:pt-0 md:pl-6 w-full md:w-auto justify-between md:justify-end">
          <div className="text-left md:text-right">
            <span className="text-xs text-gray-500 font-semibold block">Estimated Total Cost</span>
            <span className="text-2xl font-extrabold text-[#0B4D3A]">
              ₹{totalPrice.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500 font-semibold block">Suggested Advance (30%)</span>
            <span className="text-lg font-bold text-amber-900">
              ₹{advanceRequired.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Review Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((sec) => {
          const SecIcon = sec.icon;
          return (
            <div
              key={sec.step}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors shadow-2xs"
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
                  <div className="w-6 h-6 rounded-md bg-[#E6F2EC] text-[#0B4D3A] flex items-center justify-center shrink-0">
                    <SecIcon className="w-3.5 h-3.5" />
                  </div>
                  <span>{sec.step}. {sec.title}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onJumpToStep(sec.step)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#0B4D3A] hover:text-[#083b2c] hover:underline cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="space-y-1.5 text-xs">
                {sec.details.map((d, i) => (
                  <div key={i} className="flex items-start justify-between gap-2">
                    <span className="text-gray-500 shrink-0 font-medium">{d.label}:</span>
                    <span className="text-gray-900 text-right font-semibold truncate max-w-[65%]">
                      {d.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Note */}
      <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600 flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
        <span>
          Clicking <strong>"Submit & Generate Quotation"</strong> will register this customer intake sheet, compute exact market rates, and open the complete estimated quotation and cost breakdown.
        </span>
      </div>
    </div>
  );
}
