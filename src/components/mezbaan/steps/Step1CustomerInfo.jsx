import React from 'react';
import { 
  FileText, 
  User, 
  Phone, 
  Mail, 
  Users, 
  Megaphone,
  MessageSquare
} from 'lucide-react';
import FormField from '../FormField';
import SelectField from '../SelectField';
import PhoneField from '../PhoneField';

export default function Step1CustomerInfo({ formData, onChange, errors = {} }) {
  const handleSameAsMobileToggle = (e) => {
    const checked = e.target.checked;
    onChange('sameAsMobile', checked);
    if (checked) {
      onChange('whatsappNumber', formData.mobile || '');
    }
  };

  const handleMobileChange = (e) => {
    const val = e.target.value;
    onChange('mobile', val);
    if (formData.sameAsMobile) {
      onChange('whatsappNumber', val);
    }
  };

  const relationshipOptions = [
    { value: "Bride's Family", label: "Bride's Family" },
    { value: "Groom's Family", label: "Groom's Family" },
    { value: "Self", label: "Self (Host)" },
    { value: "Corporate", label: "Corporate / Organization" },
    { value: "Other", label: "Other" }
  ];

  const sourceOptions = [
    { value: "Vendor Reference", label: "Vendor Reference" },
    { value: "Instagram", label: "Instagram" },
    { value: "Facebook", label: "Facebook" },
    { value: "WhatsApp", label: "WhatsApp" },
    { value: "Friend/Family", label: "Friend / Family Recommendation" },
    { value: "Walk-in", label: "Walk-in (Office Visit)" },
    { value: "Google", label: "Google Search" },
    { value: "Other", label: "Other" }
  ];

  return (
    <div className="space-y-6">
      {/* 3-Column Grid on Desktop, 1-Column on Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Customer / Family Name * */}
        <FormField
          label="Customer / Family Name"
          name="customerName"
          value={formData.customerName}
          onChange={(e) => onChange('customerName', e.target.value)}
          placeholder="Janab Tariq Farooqui & Family"
          required
          icon={FileText}
          error={errors.customerName}
        />

        {/* 2. Contact Person */}
        <FormField
          label="Contact Person"
          name="contactPerson"
          value={formData.contactPerson}
          onChange={(e) => onChange('contactPerson', e.target.value)}
          placeholder="Tariq Farooqui"
          icon={User}
          error={errors.contactPerson}
        />

        {/* 3. Mobile Number * */}
        <PhoneField
          label="Mobile Number"
          name="mobile"
          value={formData.mobile}
          onChange={handleMobileChange}
          placeholder="9822014589"
          required
          icon={Phone}
          error={errors.mobile}
        />

        {/* 4. WhatsApp Number with Same as Mobile Checkbox */}
        <PhoneField
          label="WhatsApp Number"
          name="whatsappNumber"
          value={formData.whatsappNumber}
          onChange={(e) => onChange('whatsappNumber', e.target.value)}
          placeholder="9822014589"
          disabled={Boolean(formData.sameAsMobile)}
          icon={MessageSquare}
          error={errors.whatsappNumber}
          labelRight={
            <label className="flex items-center gap-1.5 cursor-pointer text-xs text-gray-600 font-medium select-none hover:text-gray-900">
              <input
                type="checkbox"
                checked={Boolean(formData.sameAsMobile)}
                onChange={handleSameAsMobileToggle}
                className="w-4 h-4 rounded text-[#0B4D3A] focus:ring-[#0B4D3A] cursor-pointer"
              />
              <span>Same as mobile</span>
            </label>
          }
        />

        {/* 5. Alternative Contact */}
        <PhoneField
          label="Alternative Contact"
          name="altMobile"
          value={formData.altMobile}
          onChange={(e) => onChange('altMobile', e.target.value)}
          placeholder="9423157890"
          icon={Phone}
          error={errors.altMobile}
        />

        {/* 6. Email Address (Optional) */}
        <FormField
          label="Email Address (Optional)"
          name="email"
          type="email"
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="tariq.farooqui@gmail.com"
          icon={Mail}
          error={errors.email}
        />

        {/* 7. Relationship to Event */}
        <SelectField
          label="Relationship to Event"
          name="relationship"
          value={formData.relationship}
          onChange={(e) => onChange('relationship', e.target.value)}
          options={relationshipOptions}
          icon={Users}
          placeholder="Select Relationship"
          error={errors.relationship}
        />

        {/* 8. How did you hear about Mezban? */}
        <SelectField
          label="How did you hear about Mezban?"
          name="source"
          value={formData.source}
          onChange={(e) => onChange('source', e.target.value)}
          options={sourceOptions}
          icon={Megaphone}
          placeholder="Select Source"
          error={errors.source}
        />
      </div>
    </div>
  );
}
