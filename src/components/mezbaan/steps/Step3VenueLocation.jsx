import React, { useState, useEffect } from 'react';
import { MapPin, Building, IndianRupee, Compass } from 'lucide-react';
import FormField from '../FormField';
import SelectField from '../SelectField';
import { FALLBACK_VENUES } from '../../../data/mockData';

export default function Step3VenueLocation({ formData, onChange, errors = {} }) {
  const [venuesList, setVenuesList] = useState(FALLBACK_VENUES);
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    fetch('/api/venues')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.venues) && data.venues.length > 0) {
          setVenuesList(data.venues);
        }
      })
      .catch(() => {});
  }, []);

  // Format a venue object into value string
  const formatVenueValue = (v) => `${v.name}, ${v.address ? v.address + ', ' : ''}${v.city}`;

  // Find if current formData.venueName matches one of the known venues
  const matchedVenue = venuesList.find((v) => {
    if (!formData.venueName) return false;
    const full = formatVenueValue(v);
    const raw = String(formData.venueName).trim().toLowerCase();
    return (
      raw === full.toLowerCase() ||
      raw === `${v.name}, ${v.city}`.toLowerCase() ||
      raw === v.name.toLowerCase() ||
      raw.startsWith(v.name.toLowerCase())
    );
  });

  // Determine current dropdown value
  let selectedDropdownValue = '';
  if (isCustom) {
    selectedDropdownValue = 'custom';
  } else if (matchedVenue) {
    selectedDropdownValue = formatVenueValue(matchedVenue);
  } else if (
    formData.venueName === 'Need Mezban to suggest venue' ||
    formData.venueName === 'Need Mezban to suggest & book venue' ||
    (typeof formData.venueName === 'string' && formData.venueName.toLowerCase().includes('suggest'))
  ) {
    selectedDropdownValue = 'suggest';
  } else if (formData.venueName) {
    selectedDropdownValue = 'custom';
  }

  const handleVenueChange = (e) => {
    const val = e.target.value;
    if (val === 'custom') {
      setIsCustom(true);
      if (matchedVenue) {
        onChange('venueName', '');
      }
    } else if (val === 'suggest') {
      setIsCustom(false);
      onChange('venueName', 'Need Mezban to suggest & book venue');
    } else {
      setIsCustom(false);
      onChange('venueName', val);
      // Auto-sync venueArea (city) if available
      const found = venuesList.find((v) => formatVenueValue(v) === val || v.name === val);
      if (found && found.city) {
        onChange('venueArea', found.city);
      }
    }
  };

  const venueOptions = [
    ...venuesList.map((v) => ({
      value: formatVenueValue(v),
      label: `${v.name} (${v.city} • Cap: ${v.capacity || 500}+ guests)`
    })),
    { value: 'suggest', label: '✨ Let Mezban Suggest / Recommend Suitable Venue' },
    { value: 'custom', label: '📍 Other / Custom Venue (Type Name & Address)' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SelectField
          label="Venue Status"
          name="venueSelected"
          value={formData.venueSelected || 'Yes'}
          onChange={(e) => onChange('venueSelected', e.target.value)}
          options={[
            { value: 'Yes', label: 'Venue Already Booked / Finalized' },
            { value: 'Shortlisted', label: 'Shortlisted (Need Mezban negotiation)' },
            { value: 'Need Mezban to find venue', label: 'Need Mezban to suggest & book venue' },
            { value: 'No', label: 'Not Decided Yet' }
          ]}
          icon={Building}
        />

        <SelectField
          label="Venue Name & Address"
          name="venueName"
          value={selectedDropdownValue}
          onChange={handleVenueChange}
          placeholder="-- Select Venue (Beed, Kaij, Ambajogai, Gevrai) --"
          options={venueOptions}
          icon={MapPin}
          error={errors.venueName}
          helperText="Choose from verified halls & lawns or select custom"
        />

        <FormField
          label="Venue Area / City"
          name="venueArea"
          value={formData.venueArea}
          onChange={(e) => onChange('venueArea', e.target.value)}
          placeholder="Jalna Road, Beed"
          icon={Compass}
        />

        <SelectField
          label="Venue Type"
          name="venueType"
          value={formData.venueType || 'Banquet Hall + Open Lawn'}
          onChange={(e) => onChange('venueType', e.target.value)}
          options={[
            { value: 'Banquet Hall + Open Lawn', label: 'Banquet Hall + Open Lawn' },
            { value: 'AC Banquet Hall', label: 'AC Banquet Hall' },
            { value: 'Open Lawn & Garden', label: 'Open Lawn & Garden' },
            { value: 'Hotel Ballroom', label: 'Hotel Ballroom' },
            { value: 'Farmhouse / Resort', label: 'Farmhouse / Private Resort' },
            { value: 'Community Hall / Shadi Mahal', label: 'Community Hall / Shadi Mahal' }
          ]}
          icon={Building}
        />

        <FormField
          label="Approx. Venue Budget (₹)"
          name="maxVenueBudget"
          type="number"
          value={formData.maxVenueBudget}
          onChange={(e) => onChange('maxVenueBudget', e.target.value)}
          placeholder="75000"
          icon={IndianRupee}
          helperText="Standard banquet rates in Beed: ₹40,000 – ₹1,20,000"
        />

        {/* Custom Venue Name & Address Input (Shown when 'Other / Custom Venue' is selected) */}
        {(isCustom || selectedDropdownValue === 'custom') && (
          <div className="col-span-full animate-in fade-in duration-200">
            <FormField
              label="Custom Venue Name & Full Address"
              name="customVenueAddress"
              value={formData.venueName === 'custom' ? '' : formData.venueName}
              onChange={(e) => onChange('venueName', e.target.value)}
              placeholder="e.g. Al-Madina Banquet Hall, Old City, Beed"
              icon={MapPin}
              error={errors.venueName}
              helperText="Enter the full name and address of your chosen function hall or lawn"
            />
          </div>
        )}
      </div>
    </div>
  );
}
