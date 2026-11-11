import React from 'react';
import { Users, UtensilsCrossed, Utensils } from 'lucide-react';
import FormField from '../FormField';
import SelectField from '../SelectField';

export default function Step4GuestsDining({ formData, onChange, errors = {} }) {
  const mealOptions = ['Dinner', 'Lunch', 'High Tea / Snacks', 'Breakfast'];

  const handleMealToggle = (meal) => {
    const current = Array.isArray(formData.meals) ? formData.meals : [];
    if (current.includes(meal)) {
      onChange('meals', current.filter(m => m !== meal));
    } else {
      onChange('meals', [...current, meal]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FormField
          label="Approx. Guest Count"
          name="guestCount"
          type="number"
          value={formData.guestCount}
          onChange={(e) => onChange('guestCount', e.target.value)}
          placeholder="450"
          required
          icon={Users}
          error={errors.guestCount}
          helperText="Expected total guests attending"
        />

        <SelectField
          label="Food Preference"
          name="foodPreference"
          value={
            formData.foodPreference === 'Non-Veg Only'
              ? 'Non-Veg'
              : formData.foodPreference === 'Pure Veg'
                ? 'Veg'
                : (formData.foodPreference || 'Both Veg & Non-Veg')
          }
          onChange={(e) => onChange('foodPreference', e.target.value)}
          options={[
            { value: 'Veg', label: 'Veg' },
            { value: 'Non-Veg', label: 'Non-Veg' },
            { value: 'Both Veg & Non-Veg', label: 'Both Veg & Non-Veg' }
          ]}
          icon={UtensilsCrossed}
          required
        />

        <SelectField
          label="Dining Service Style"
          name="serviceStyle"
          value={formData.serviceStyle || 'Royal Buffet + Dastarkhwan VIP Area'}
          onChange={(e) => onChange('serviceStyle', e.target.value)}
          options={[
            { value: 'Royal Buffet + Dastarkhwan VIP Area', label: 'Royal Buffet + Dastarkhwan VIP Area' },
            { value: 'Complete Traditional Dastarkhwan', label: 'Complete Traditional Dastarkhwan' },
            { value: 'Standard Buffet Counter', label: 'Standard Buffet Counter' },
            { value: 'VIP Table Service', label: 'VIP Table Service' }
          ]}
          icon={Utensils}
        />
      </div>

      {/* Meals Selection */}
      <div className="flex flex-col gap-2 pt-2">
        <label className="text-xs font-semibold text-gray-800">
          Meal Occasions
        </label>
        <div className="flex flex-wrap gap-2.5">
          {mealOptions.map((meal) => {
            const isSelected = Array.isArray(formData.meals) && formData.meals.includes(meal);
            return (
              <button
                key={meal}
                type="button"
                onClick={() => handleMealToggle(meal)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 cursor-pointer
                  ${isSelected
                    ? 'bg-[#0B4D3A] text-white border-[#0B4D3A] shadow-xs'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'}
                `}
              >
                {meal}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
