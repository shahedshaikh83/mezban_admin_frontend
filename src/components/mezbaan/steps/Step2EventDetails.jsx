import React from 'react';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';
import FormField from '../FormField';
import SelectField from '../SelectField';

export default function Step2EventDetails({ formData, onChange, errors = {} }) {
  const eventTypesList = [
    'Walima & Reception',
    'Nikah Ceremony',
    'Engagement / Sagai',
    'Haldi / Mehendi',
    'Birthday Celebration',
    'Corporate Banquet',
    'Anniversary',
    'Other'
  ];

  const handleEventTypeToggle = (type) => {
    const current = Array.isArray(formData.eventTypes) ? formData.eventTypes : [];
    if (current.includes(type)) {
      onChange('eventTypes', current.filter(t => t !== type));
    } else {
      onChange('eventTypes', [...current, type]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Event Types Pill Selection */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-gray-800 flex items-center gap-1">
          <span>Event Type(s)</span>
          <span className="text-[#EF4444] text-sm">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {eventTypesList.map((type) => {
            const isSelected = Array.isArray(formData.eventTypes) && formData.eventTypes.includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleEventTypeToggle(type)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 flex items-center gap-1.5 cursor-pointer
                  ${isSelected
                    ? 'bg-[#0B4D3A] text-white border-[#0B4D3A] shadow-xs'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'}
                `}
              >
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#F4C542]" />}
                <span>{type}</span>
              </button>
            );
          })}
        </div>
        {errors.eventTypes && (
          <p className="text-[11px] text-[#EF4444] font-medium">{errors.eventTypes}</p>
        )}
      </div>

      {/* 3-Column Grid for Dates & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FormField
          label="Event Date"
          name="eventDate"
          type="date"
          value={formData.eventDate}
          onChange={(e) => onChange('eventDate', e.target.value)}
          required
          icon={Calendar}
          error={errors.eventDate}
        />

        <SelectField
          label="Date Status"
          name="dateStatus"
          value={formData.dateStatus || 'Confirmed'}
          onChange={(e) => onChange('dateStatus', e.target.value)}
          options={[
            { value: 'Confirmed', label: 'Confirmed Date' },
            { value: 'Tentative', label: 'Tentative (May change by 1-2 days)' },
            { value: 'Flexible', label: 'Flexible / Checking Auspicious Dates' }
          ]}
          icon={Calendar}
        />

        <SelectField
          label="Time Slot"
          name="timeSlot"
          value={formData.timeSlot || 'Night (Dinner)'}
          onChange={(e) => onChange('timeSlot', e.target.value)}
          options={[
            { value: 'Night (Dinner)', label: 'Night (Dinner: 7:30 PM - 11:30 PM)' },
            { value: 'Evening', label: 'Evening (5:00 PM - 9:00 PM)' },
            { value: 'Afternoon (Lunch)', label: 'Afternoon (Lunch: 12:00 PM - 4:00 PM)' },
            { value: 'Morning', label: 'Morning (8:00 AM - 12:00 PM)' },
            { value: 'Full Day', label: 'Full Day Program' }
          ]}
          icon={Clock}
        />

        <FormField
          label="Start Time"
          name="timingStart"
          type="time"
          value={formData.timingStart}
          onChange={(e) => onChange('timingStart', e.target.value)}
          placeholder="19:30"
          icon={Clock}
        />

        <FormField
          label="End Time"
          name="timingEnd"
          type="time"
          value={formData.timingEnd}
          onChange={(e) => onChange('timingEnd', e.target.value)}
          placeholder="23:30"
          icon={Clock}
        />
      </div>
    </div>
  );
}
