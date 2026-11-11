import React from 'react';
import { Utensils, IndianRupee, Sparkles } from 'lucide-react';
import FormField from '../FormField';

export default function Step5CateringReqs({ formData, onChange, errors = {} }) {
  const cuisineList = [
    'Authentic Beed Dum Biryani',
    'Mughlai Gosht & Korma',
    'Roomali Roti & Butter Naan',
    'Chicken Angara / Tikka',
    'Shahi Tukda & Firni',
    'Paneer Butter Masala (Veg Counter)',
    'Dal Makhani & Jeera Rice',
    'Live Mocktail & Welcome Drinks',
    'Kashmiri Chai / Irani Chai'
  ];

  const handleCuisineToggle = (c) => {
    const current = Array.isArray(formData.cuisines) ? formData.cuisines : [];
    if (current.includes(c)) {
      onChange('cuisines', current.filter(item => item !== c));
    } else {
      onChange('cuisines', [...current, c]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-gray-800">
          Highlight Menu Items & Cuisines
        </label>
        <div className="flex flex-wrap gap-2">
          {cuisineList.map((item) => {
            const isSelected = Array.isArray(formData.cuisines) && formData.cuisines.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => handleCuisineToggle(item)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-150 cursor-pointer
                  ${isSelected
                    ? 'bg-[#0B4D3A] text-[#F4C542] border-[#0B4D3A] shadow-xs'
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
          label="Approx. Food Budget Per Plate (₹)"
          name="approxFoodBudget"
          type="number"
          value={formData.approxFoodBudget}
          onChange={(e) => onChange('approxFoodBudget', e.target.value)}
          placeholder="420"
          icon={IndianRupee}
          helperText="Typical Beed rate: ₹300 (standard veg) to ₹550 (royal non-veg dum biryani)"
        />

        <FormField
          label="Special Menu & Service Notes"
          name="specialMenuNotes"
          value={formData.specialMenuNotes}
          onChange={(e) => onChange('specialMenuNotes', e.target.value)}
          placeholder="Separate sweet dish counter, mineral water stations, hot fresh naan counter."
          icon={Sparkles}
        />
      </div>
    </div>
  );
}
