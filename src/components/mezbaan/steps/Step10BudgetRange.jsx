import React from 'react';
import { Wallet, IndianRupee, SlidersHorizontal, CheckCircle2 } from 'lucide-react';
import FormField from '../FormField';
import SelectField from '../SelectField';

export default function Step10BudgetRange({ formData, onChange, errors = {} }) {
  const priorities = [
    'Delicious Authentic Food',
    'Grand Stage Décor',
    'Smooth Timely Execution',
    'High-End Photography & Video',
    'Complete Tension-Free Event for Family'
  ];

  const handlePriorityToggle = (p) => {
    const current = Array.isArray(formData.mostImportant) ? formData.mostImportant : [];
    if (current.includes(p)) {
      onChange('mostImportant', current.filter(item => item !== p));
    } else {
      onChange('mostImportant', [...current, p]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SelectField
          label="Overall Event Budget Range"
          name="overallBudgetRange"
          value={formData.overallBudgetRange || '₹4 Lakh – ₹6 Lakh'}
          onChange={(e) => onChange('overallBudgetRange', e.target.value)}
          options={[
            { value: '₹2 Lakh – ₹4 Lakh', label: '₹2 Lakh – ₹4 Lakh (Essential Quality)' },
            { value: '₹4 Lakh – ₹6 Lakh', label: '₹4 Lakh – ₹6 Lakh (Royal Standard)' },
            { value: '₹6 Lakh – ₹10 Lakh', label: '₹6 Lakh – ₹10 Lakh (Luxury Wedding)' },
            { value: '₹10 Lakh – ₹15 Lakh', label: '₹10 Lakh – ₹15 Lakh (Grand Palace Elite)' },
            { value: 'Above ₹15 Lakh', label: 'Above ₹15 Lakh (Ultra Bespoke)' }
          ]}
          icon={Wallet}
        />

        <FormField
          label="Approx. Target Budget (₹)"
          name="approxBudget"
          type="number"
          value={formData.approxBudget}
          onChange={(e) => onChange('approxBudget', e.target.value)}
          placeholder="520000"
          icon={IndianRupee}
        />

        <SelectField
          label="Budget Flexibility"
          name="budgetFlexibility"
          value={formData.budgetFlexibility || 'Slightly Flexible'}
          onChange={(e) => onChange('budgetFlexibility', e.target.value)}
          options={[
            { value: 'Strict', label: 'Strict (Must stay within budget)' },
            { value: 'Slightly Flexible', label: 'Slightly Flexible (Can adjust for top quality)' },
            { value: 'Flexible', label: 'Flexible (Quality and aesthetics are priority)' }
          ]}
          icon={SlidersHorizontal}
        />
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <label className="text-xs font-semibold text-gray-800">
          What are the Most Critical Priorities for this Event?
        </label>
        <div className="flex flex-wrap gap-2">
          {priorities.map((item) => {
            const isSelected = Array.isArray(formData.mostImportant) && formData.mostImportant.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => handlePriorityToggle(item)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 flex items-center gap-1.5 cursor-pointer
                  ${isSelected
                    ? 'bg-[#0B4D3A] text-white border-[#0B4D3A] shadow-xs'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'}
                `}
              >
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#F4C542]" />}
                <span>{item}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
