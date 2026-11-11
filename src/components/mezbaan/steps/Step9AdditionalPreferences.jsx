import React from 'react';
import { ClipboardCheck, Sparkles, HeartHandshake } from 'lucide-react';
import FormField from '../FormField';

export default function Step9AdditionalPreferences({ formData, onChange, errors = {} }) {
  const hospitalityList = [
    'Uniformed Welcome Ushers (Gents & Ladies)',
    'Attar & Rose Water Welcome Desk',
    'VIP Escort & Front Row Seating Support',
    'Separate Ladies Dining & Prayer Space Coordinator',
    'Valet Parking Assistance'
  ];

  const handleHospitalityToggle = (item) => {
    const current = Array.isArray(formData.hospitalityNeeds) ? formData.hospitalityNeeds : [];
    if (current.includes(item)) {
      onChange('hospitalityNeeds', current.filter(i => i !== item));
    } else {
      onChange('hospitalityNeeds', [...current, item]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-gray-800">
          Mezban Hospitality & Guest Care Services
        </label>
        <div className="flex flex-wrap gap-2">
          {hospitalityList.map((item) => {
            const isSelected = Array.isArray(formData.hospitalityNeeds) && formData.hospitalityNeeds.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => handleHospitalityToggle(item)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 cursor-pointer
                  ${isSelected
                    ? 'bg-[#0B4D3A] text-white border-[#0B4D3A] shadow-xs'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'}
                `}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Special Requests / Family Customs"
          name="specialRequests"
          value={formData.specialRequests}
          onChange={(e) => onChange('specialRequests', e.target.value)}
          placeholder="Elderly guest seating assistance near stage, separate prayer area arrangements."
          icon={HeartHandshake}
        />

        <FormField
          label="Invitation & Digital Media Needs"
          name="invitationNeeds"
          value={Array.isArray(formData.invitationNeeds) ? formData.invitationNeeds.join(', ') : formData.invitationNeeds}
          onChange={(e) => onChange('invitationNeeds', e.target.value)}
          placeholder="Digital Video E-Invite, WhatsApp RSVP Broadcast"
          icon={Sparkles}
        />
      </div>
    </div>
  );
}
