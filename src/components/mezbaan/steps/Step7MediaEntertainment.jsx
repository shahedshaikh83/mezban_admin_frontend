import React from 'react';
import { Camera, Music, IndianRupee } from 'lucide-react';
import FormField from '../FormField';

export default function Step7MediaEntertainment({ formData, onChange, errors = {} }) {
  const mediaOptions = [
    'Traditional Photography',
    'Candid Photography',
    '4K Cinematic Video',
    'Drone Coverage',
    'Premium Album',
    'Same-Day Teaser Reel',
    'LED Video Wall Backdrop',
    'Line Array Sound System',
    'Warm Focus Ambient Lights',
    'Wireless Handheld Mics'
  ];

  const handleToggle = (item) => {
    const current = Array.isArray(formData.photoServices) ? formData.photoServices : [];
    if (current.includes(item)) {
      onChange('photoServices', current.filter(i => i !== item));
    } else {
      onChange('photoServices', [...current, item]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-gray-800">
          Select Required Photo, Video & Sound Services
        </label>
        <div className="flex flex-wrap gap-2">
          {mediaOptions.map((opt) => {
            const isSelected = Array.isArray(formData.photoServices) && formData.photoServices.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => handleToggle(opt)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 cursor-pointer
                  ${isSelected
                    ? 'bg-[#0B4D3A] text-white border-[#0B4D3A] shadow-xs'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'}
                `}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Approx. Media & Sound Budget (₹)"
          name="approxMediaBudget"
          type="number"
          value={formData.approxMediaBudget}
          onChange={(e) => onChange('approxMediaBudget', e.target.value)}
          placeholder="55000"
          icon={IndianRupee}
          helperText="Standard Beed coverage: ₹30,000 – ₹70,000"
        />

        <FormField
          label="Sound / Entertainment Preferences"
          name="soundSpecialReqs"
          value={formData.soundSpecialReqs}
          onChange={(e) => onChange('soundSpecialReqs', e.target.value)}
          placeholder="High quality vocal mic for speeches, soft nasheed / instrumental background audio."
          icon={Music}
        />
      </div>
    </div>
  );
}
