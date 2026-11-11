import React from 'react';
import { Palette, IndianRupee, Sparkles } from 'lucide-react';
import FormField from '../FormField';
import SelectField from '../SelectField';

export default function Step6DecorTheme({ formData, onChange, errors = {} }) {
  const decorAreas = [
    'Main Stage',
    'Grand Entrance Arch',
    'VIP Dastarkhwan Area',
    'Photo Booth / Selfie Point',
    'Walkway Floral Pillars',
    'Bride & Groom Seating Arch',
    'Ceiling Draping & Fairy Lights'
  ];

  const handleAreaToggle = (area) => {
    const current = Array.isArray(formData.decorationAreas) ? formData.decorationAreas : [];
    if (current.includes(area)) {
      onChange('decorationAreas', current.filter(a => a !== area));
    } else {
      onChange('decorationAreas', [...current, area]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SelectField
          label="Décor Theme Style"
          name="decorationType"
          value={formData.decorationType || 'Royal Islamic & Modern Floral'}
          onChange={(e) => onChange('decorationType', e.target.value)}
          options={[
            { value: 'Royal Islamic & Modern Floral', label: 'Royal Islamic & Modern Floral' },
            { value: 'Grand Royal Palace Theme', label: 'Grand Royal Palace Theme' },
            { value: 'Elegant Pastel & Fresh Floral', label: 'Elegant Pastel & Fresh Floral' },
            { value: 'Traditional Golden Heritage', label: 'Traditional Golden Heritage' },
            { value: 'Minimalist Contemporary', label: 'Minimalist Contemporary' }
          ]}
          icon={Palette}
        />

        <FormField
          label="Preferred Color Palette"
          name="preferredColors"
          value={formData.preferredColors}
          onChange={(e) => onChange('preferredColors', e.target.value)}
          placeholder="Emerald Green, Royal Gold & Ivory White"
          icon={Sparkles}
        />

        <FormField
          label="Approx. Décor Budget (₹)"
          name="approxDecorBudget"
          type="number"
          value={formData.approxDecorBudget}
          onChange={(e) => onChange('approxDecorBudget', e.target.value)}
          placeholder="45000"
          icon={IndianRupee}
          helperText="Standard Beed stage & entry décor: ₹25,000 – ₹80,000"
        />
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <label className="text-xs font-semibold text-gray-800">
          Focus Decoration Zones
        </label>
        <div className="flex flex-wrap gap-2">
          {decorAreas.map((area) => {
            const isSelected = Array.isArray(formData.decorationAreas) && formData.decorationAreas.includes(area);
            return (
              <button
                key={area}
                type="button"
                onClick={() => handleAreaToggle(area)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 cursor-pointer
                  ${isSelected
                    ? 'bg-[#0B4D3A] text-white border-[#0B4D3A] shadow-xs'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'}
                `}
              >
                {area}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
