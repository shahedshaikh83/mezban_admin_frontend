import React from 'react';
import { Truck, Zap, IndianRupee } from 'lucide-react';
import FormField from '../FormField';
import SelectField from '../SelectField';

export default function Step8LogisticsInfrastructure({ formData, onChange, errors = {} }) {
  const logisticsOptions = [
    'VIP Royal Sofas',
    'Round Tables with Silk Cover',
    'Cushioned Banquet Chairs',
    'Red Carpet Pathway',
    'Privacy Shamiana Partition (Ladies/Gents)',
    'Cooling Mist Fans',
    'Stage Riser Setup'
  ];

  const handleToggle = (item) => {
    const current = Array.isArray(formData.stageSeating) ? formData.stageSeating : [];
    if (current.includes(item)) {
      onChange('stageSeating', current.filter(i => i !== item));
    } else {
      onChange('stageSeating', [...current, item]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-gray-800">
          Stage, Seating & Structure Infrastructure
        </label>
        <div className="flex flex-wrap gap-2">
          {logisticsOptions.map((opt) => {
            const isSelected = Array.isArray(formData.stageSeating) && formData.stageSeating.includes(opt);
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
        <SelectField
          label="Power Backup & Generator Support"
          name="powerBackup"
          value={formData.powerBackup || 'Full Generator Backup Required'}
          onChange={(e) => onChange('powerBackup', e.target.value)}
          options={[
            { value: 'Full Generator Backup Required', label: 'Full Generator Backup Required (Dedicated 65+ kVA Silent GenSet)' },
            { value: 'Provided by Venue', label: 'Venue In-House Generator is sufficient' },
            { value: 'Not Required', label: 'Not Required' }
          ]}
          icon={Zap}
        />

        <FormField
          label="Approx. Logistics & Seating Budget (₹)"
          name="approxLogisticsBudget"
          type="number"
          value={formData.approxLogisticsBudget}
          onChange={(e) => onChange('approxLogisticsBudget', e.target.value)}
          placeholder="25000"
          icon={IndianRupee}
        />
      </div>
    </div>
  );
}
