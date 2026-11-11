import React, { useState, useEffect } from 'react';
import { Lock, Sparkles, Upload } from 'lucide-react';
import FormSection from './FormSection';
import TextField from './TextField';
import SelectField from './SelectField';
import MultiSelectDropdown from './MultiSelectDropdown';
import RadioGroup from './RadioGroup';
import MoneyField from './MoneyField';
import DateField from './DateField';
import TimeField from './TimeField';
import {
  WIZARD_STEPS,
  RELATIONSHIP_OPTIONS,
  HOW_HEARD_OPTIONS,
  EVENT_TYPE_OPTIONS,
  DATE_STATUS_OPTIONS,
  TIME_OF_DAY_OPTIONS,
  GUEST_RANGES,
  GUEST_PROFILE_OPTIONS,
  VENUE_SELECTED_OPTIONS,
  VENUE_REQUIREMENT_OPTIONS,
  IMPORTANT_VENUE_REQ_OPTIONS,
  DECORATION_REQUIRED_OPTIONS,
  DECORATION_TYPE_OPTIONS,
  DECORATION_AREA_OPTIONS,
  CATERING_REQUIRED_OPTIONS,
  FOOD_PREFERENCE_OPTIONS,
  MEAL_OPTIONS,
  FOOD_SERVICE_OPTIONS,
  CUISINE_OPTIONS,
  PHOTO_SERVICE_OPTIONS,
  SOUND_SERVICE_OPTIONS,
  STAGE_SEATING_OPTIONS,
  INVITATION_OPTIONS,
  BRIDAL_OPTIONS,
  HOSPITALITY_OPTIONS,
  INVOLVEMENT_OPTIONS,
  BUDGET_RANGE_OPTIONS,
  MOST_IMPORTANT_OPTIONS,
  BUDGET_FLEXIBILITY_OPTIONS,
  PREVIOUS_PROBLEMS_OPTIONS,
  TRUST_FACTORS_OPTIONS,
  QUOTATION_NEEDS_OPTIONS,
  PREFERRED_CONTACT_OPTIONS,
  LEAD_STATUS_OPTIONS,
  CUSTOMER_RESPONSE_OPTIONS,
  REASON_LOST_OPTIONS,
  YES_NO_OPTIONS
} from './wizardConfig';

export default function StepFormRenderer({
  currentStep,
  formData,
  setFormData,
  errors = {},
  setErrors,
  localCalcSummary = null
}) {
  const [sameAsMobile, setSameAsMobile] = useState(false);

  // Sync WhatsApp when "Same as Mobile" is checked
  useEffect(() => {
    if (sameAsMobile && formData.mobile) {
      setFormData(prev => ({ ...prev, whatsapp: prev.mobile }));
    }
  }, [sameAsMobile, formData.mobile, setFormData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // --------------------------------------------------------------------------
  // STEP A: Customer Information
  // --------------------------------------------------------------------------
  if (currentStep === 0) {
    const selectedRel = Array.isArray(formData.relationships) 
      ? (formData.relationships[0] || '') 
      : (formData.relationships || '');
    const selectedHeard = Array.isArray(formData.howHeard)
      ? (formData.howHeard[0] || '')
      : (formData.howHeard || '');

    return (
      <FormSection
        title="A. Customer Information"
        subtitle="Basic contact coordinates and relationship to the upcoming event."
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '14px 20px' }}>
          <TextField
            id="field-customer-name"
            label="Customer / Family Name"
            required
            value={formData.customerName}
            onChange={v => handleInputChange('customerName', v)}
            placeholder="e.g. Farooqui Family / Janab Tariq Farooqui"
            error={errors.customerName}
          />

          <TextField
            label="Contact Person"
            value={formData.contactPerson}
            onChange={v => handleInputChange('contactPerson', v)}
            placeholder="Primary coordinator full name"
          />

          <TextField
            id="field-mobile"
            label="Mobile Number"
            required
            type="tel"
            isPhone
            value={formData.mobile}
            onChange={v => handleInputChange('mobile', v)}
            placeholder="10-digit mobile"
            error={errors.mobile}
          />

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151' }}>
                WhatsApp Number
              </label>
              <label style={{ fontSize: '0.78rem', color: '#0f3d2e', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={sameAsMobile}
                  onChange={e => {
                    const checked = e.target.checked;
                    setSameAsMobile(checked);
                    if (checked && formData.mobile) {
                      handleInputChange('whatsapp', formData.mobile);
                    }
                  }}
                  style={{ accentColor: '#0f3d2e', cursor: 'pointer' }}
                />
                Same as mobile
              </label>
            </div>
            <TextField
              type="tel"
              isPhone
              value={formData.whatsapp}
              onChange={v => {
                setSameAsMobile(false);
                handleInputChange('whatsapp', v);
              }}
              placeholder="10-digit WhatsApp"
            />
          </div>

          <TextField
            label="Alternative Contact"
            type="tel"
            isPhone
            value={formData.altContact}
            onChange={v => handleInputChange('altContact', v)}
            placeholder="Family member phone"
          />

          <TextField
            label="Email Address (Optional)"
            type="email"
            value={formData.email}
            onChange={v => handleInputChange('email', v)}
            placeholder="client@gmail.com"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '14px 20px', marginTop: 10 }}>
          <SelectField
            label="Relationship to Event"
            options={RELATIONSHIP_OPTIONS}
            value={selectedRel}
            onChange={val => {
              setFormData(prev => ({
                ...prev,
                relationships: [val],
                relationshipOther: val === 'Other' ? prev.relationshipOther : ''
              }));
            }}
            placeholder="-- Choose relationship --"
            otherValue={formData.relationshipOther}
            onOtherChange={v => handleInputChange('relationshipOther', v)}
          />

          <SelectField
            label="How did you hear about Mezban?"
            options={HOW_HEARD_OPTIONS}
            value={selectedHeard}
            onChange={val => {
              setFormData(prev => ({
                ...prev,
                howHeard: [val],
                howHeardOther: val === 'Other' ? prev.howHeardOther : ''
              }));
            }}
            placeholder="-- Choose referral source --"
            otherValue={formData.howHeardOther}
            onOtherChange={v => handleInputChange('howHeardOther', v)}
          />
        </div>
      </FormSection>
    );
  }

  // --------------------------------------------------------------------------
  // STEP B: Event Information
  // --------------------------------------------------------------------------
  if (currentStep === 1) {
    const rawDateStatus = (formData.dateStatus || '').replace('Date ', '');
    const selectedGuestRange = Array.isArray(formData.guestRanges)
      ? (formData.guestRanges[0] || '')
      : (formData.guestRanges || '');

    return (
      <FormSection
        title="B. Event Information"
        subtitle="Specify what kind of event is planned, expected date, timing, and audience size."
      >
        <MultiSelectDropdown
          id="field-event-types"
          label="Type of Event"
          required
          options={EVENT_TYPE_OPTIONS}
          selectedValues={formData.eventTypes}
          onChange={val => handleInputChange('eventTypes', val)}
          placeholder="Select one or more event types..."
          otherValue={formData.eventTypeOther}
          onOtherChange={v => handleInputChange('eventTypeOther', v)}
          error={errors.eventTypes}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '14px 20px' }}>
          <div>
            <DateField
              id="field-event-date"
              label="Event Date"
              required
              value={formData.eventDate}
              onChange={v => handleInputChange('eventDate', v)}
              error={errors.eventDate}
            />
            <RadioGroup
              label="Date Status"
              options={DATE_STATUS_OPTIONS}
              value={rawDateStatus}
              onChange={v => handleInputChange('dateStatus', v)}
            />
          </div>

          <DateField
            label="Alternative Date (Optional)"
            value={formData.altDate}
            onChange={v => handleInputChange('altDate', v)}
            helperText="Backup date if prime venue is unavailable"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '14px 20px', marginTop: 10 }}>
          <TimeField
            label="Start Time"
            value={formData.timingStart}
            onChange={v => handleInputChange('timingStart', v)}
          />
          <TimeField
            label="End Time"
            value={formData.timingEnd}
            onChange={v => handleInputChange('timingEnd', v)}
          />
          <MultiSelectDropdown
            label="Time of Day"
            options={TIME_OF_DAY_OPTIONS}
            selectedValues={formData.timingSlot}
            onChange={v => handleInputChange('timingSlot', v)}
            placeholder="Select timing slot"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '14px 20px', marginTop: 10 }}>
          <SelectField
            label="Expected Guests (Range)"
            options={GUEST_RANGES}
            value={selectedGuestRange}
            onChange={val => handleInputChange('guestRanges', [val])}
            placeholder="Select approximate range"
          />

          <TextField
            id="field-approx-guests"
            label="Approximate Final Number"
            required
            type="number"
            min="1"
            value={formData.approxGuestCount}
            onChange={v => handleInputChange('approxGuestCount', v)}
            placeholder="e.g. 450"
            helperText="Will be used for per-plate catering math"
            error={errors.approxGuestCount}
          />
        </div>

        <div style={{ marginTop: 10 }}>
          <MultiSelectDropdown
            label="Guest Profile"
            options={GUEST_PROFILE_OPTIONS}
            selectedValues={formData.guestProfiles}
            onChange={v => handleInputChange('guestProfiles', v)}
            placeholder="Select audience profiles..."
          />
        </div>
      </FormSection>
    );
  }

  // --------------------------------------------------------------------------
  // STEP C: Venue Requirement
  // --------------------------------------------------------------------------
  if (currentStep === 2) {
    const isVenueSelectedOrShortlisted = 
      formData.venueSelected === 'Yes' || formData.venueSelected === 'Shortlisted';

    return (
      <FormSection
        title="C. Venue Requirement"
        subtitle="Venue search, selection status, capacity, and essential amenities."
      >
        <RadioGroup
          label="Has the venue already been selected?"
          options={VENUE_SELECTED_OPTIONS}
          value={formData.venueSelected}
          onChange={v => handleInputChange('venueSelected', v)}
        />

        {isVenueSelectedOrShortlisted && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '14px 20px' }}>
            <TextField
              label="Venue Name"
              value={formData.venueName}
              onChange={v => handleInputChange('venueName', v)}
              placeholder="e.g. Royal Palace Banquet & Lawns"
            />
            <TextField
              label="Area / City"
              value={formData.venueArea}
              onChange={v => handleInputChange('venueArea', v)}
              placeholder="e.g. Jalna Road, Beed"
            />
          </div>
        )}

        <MultiSelectDropdown
          label="Venue Requirement"
          options={VENUE_REQUIREMENT_OPTIONS}
          selectedValues={formData.venueTypes}
          onChange={v => handleInputChange('venueTypes', v)}
          placeholder="Select preferred venue types..."
          otherValue={formData.venueTypeOther}
          onOtherChange={v => handleInputChange('venueTypeOther', v)}
        />

        <MultiSelectDropdown
          label="Important Venue Requirements"
          options={IMPORTANT_VENUE_REQ_OPTIONS}
          selectedValues={formData.importantVenueReqs}
          onChange={v => handleInputChange('importantVenueReqs', v)}
          placeholder="Select amenities & restrictions..."
          otherValue={formData.importantVenueOther}
          onOtherChange={v => handleInputChange('importantVenueOther', v)}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '14px 20px', marginTop: 10 }}>
          <TextField
            label="Preferred Area / Locality"
            value={formData.preferredArea}
            onChange={v => handleInputChange('preferredArea', v)}
            placeholder="e.g. Near Stadium, Jalna Road"
          />

          <MoneyField
            label="Maximum Venue Budget"
            value={formData.maxVenueBudget}
            onChange={v => handleInputChange('maxVenueBudget', v)}
            placeholder="60000"
          />
        </div>
      </FormSection>
    );
  }

  // --------------------------------------------------------------------------
  // STEP D: Decoration Requirement
  // --------------------------------------------------------------------------
  if (currentStep === 3) {
    const isDecorYes = formData.decorationRequired === 'Yes';

    return (
      <FormSection
        title="D. Decoration Requirement"
        subtitle="Theme style, stage setup, color palettes, and floral arrangements."
      >
        <RadioGroup
          label="Decoration Required?"
          options={DECORATION_REQUIRED_OPTIONS}
          value={formData.decorationRequired}
          onChange={v => handleInputChange('decorationRequired', v)}
        />

        {isDecorYes ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '14px 20px' }}>
              <SelectField
                label="Decoration Style / Type"
                options={DECORATION_TYPE_OPTIONS}
                value={formData.decorationType}
                onChange={v => handleInputChange('decorationType', v)}
                placeholder="-- Select decoration style --"
              />

              <TextField
                label="Preferred Colors"
                value={formData.preferredColors}
                onChange={v => handleInputChange('preferredColors', v)}
                placeholder="e.g. Emerald Green & Royal Gold with Fresh Jasmine"
              />
            </div>

            <MultiSelectDropdown
              label="Decoration Areas"
              options={DECORATION_AREA_OPTIONS}
              selectedValues={formData.decorationAreas}
              onChange={v => handleInputChange('decorationAreas', v)}
              placeholder="Select areas to decorate..."
              otherValue={formData.decorationAreaOther}
              onOtherChange={v => handleInputChange('decorationAreaOther', v)}
            />

            <div style={{ marginTop: 10 }}>
              <RadioGroup
                label="Reference Photo Available?"
                options={YES_NO_OPTIONS}
                value={formData.referencePhotoAvailable}
                onChange={v => handleInputChange('referencePhotoAvailable', v)}
              />

              {formData.referencePhotoAvailable === 'Yes' && (
                <div style={{
                  padding: '14px',
                  background: '#fcfaf6',
                  border: '1.5px dashed #dcd3c4',
                  borderRadius: 6,
                  marginTop: 8
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.86rem', color: '#0f3d2e', fontWeight: 600, cursor: 'pointer' }}>
                    <Upload size={18} /> Upload Reference Image / Moodboard (Optional)
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={e => {
                        if (e.target.files && e.target.files[0]) {
                          handleInputChange('referencePhotoFileName', e.target.files[0].name);
                        }
                      }}
                    />
                  </label>
                  {formData.referencePhotoFileName && (
                    <span style={{ display: 'block', fontSize: '0.8rem', color: '#047857', marginTop: 4 }}>
                      ✓ Attached: {formData.referencePhotoFileName}
                    </span>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{ padding: '16px', background: '#f9fafb', borderRadius: 6, color: '#6b7280', fontSize: '0.88rem', fontStyle: 'italic' }}>
            Decoration is marked as {formData.decorationRequired || 'not required'}. You can advance to the next step.
          </div>
        )}
      </FormSection>
    );
  }

  // --------------------------------------------------------------------------
  // STEP E: Catering & Food
  // --------------------------------------------------------------------------
  if (currentStep === 4) {
    const isCateringNeeded = formData.cateringRequired !== 'No';

    return (
      <FormSection
        title="E. Catering & Food"
        subtitle="Dastarkhwan preferences, cuisine choices, service format, and per-plate budget."
      >
        <RadioGroup
          label="Catering Required?"
          options={CATERING_REQUIRED_OPTIONS}
          value={formData.cateringRequired}
          onChange={v => handleInputChange('cateringRequired', v)}
        />

        {isCateringNeeded ? (
          <>
            <RadioGroup
              label="Food Preference"
              options={FOOD_PREFERENCE_OPTIONS}
              value={formData.foodPreference}
              onChange={v => handleInputChange('foodPreference', v)}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '14px 20px' }}>
              <MultiSelectDropdown
                label="Meal Slots"
                options={MEAL_OPTIONS}
                selectedValues={formData.meals}
                onChange={v => handleInputChange('meals', v)}
                placeholder="Select meal slots..."
              />

              <MultiSelectDropdown
                label="Food Service Style"
                options={FOOD_SERVICE_OPTIONS}
                selectedValues={formData.foodServices}
                onChange={v => handleInputChange('foodServices', v)}
                placeholder="Select service formats..."
              />
            </div>

            <MultiSelectDropdown
              label="Cuisine / Menu Preferences"
              options={CUISINE_OPTIONS}
              selectedValues={formData.cuisines}
              onChange={v => handleInputChange('cuisines', v)}
              placeholder="Select preferred cuisines..."
            />

            <TextField
              label="Special Menu Requirements"
              multiline
              rows={2}
              value={formData.specialMenuReqs}
              onChange={v => handleInputChange('specialMenuReqs', v)}
              placeholder="e.g. Authentic Beed Mutton Dum Biryani, Shahi Tukda, Chicken Angara, Dalcha..."
            />

            <div style={{ maxWidth: 300 }}>
              <MoneyField
                label="Approx. Food Budget Per Person"
                value={formData.approxFoodBudget}
                onChange={v => handleInputChange('approxFoodBudget', v)}
                placeholder="380"
                suffix="/ person"
              />
            </div>
          </>
        ) : (
          <div style={{ padding: '16px', background: '#f9fafb', borderRadius: 6, color: '#6b7280', fontSize: '0.88rem', fontStyle: 'italic' }}>
            Catering is marked as not required. Mezban will exclude catering from the proposal.
          </div>
        )}
      </FormSection>
    );
  }

  // --------------------------------------------------------------------------
  // STEP F: Photography & Videography
  // --------------------------------------------------------------------------
  if (currentStep === 5) {
    const isPhotoYes = (formData.photographyRequired || 'Yes') !== 'No';

    return (
      <FormSection
        title="F. Photography & Videography"
        subtitle="Candid moments, drone shoots, 4K film coverage, and designer albums."
      >
        <RadioGroup
          label="Photography Required?"
          options={YES_NO_OPTIONS}
          value={formData.photographyRequired || 'Yes'}
          onChange={v => handleInputChange('photographyRequired', v)}
        />

        {isPhotoYes ? (
          <>
            <MultiSelectDropdown
              label="Media Services"
              options={PHOTO_SERVICE_OPTIONS}
              selectedValues={formData.photoServices}
              onChange={v => handleInputChange('photoServices', v)}
              placeholder="Select media packages..."
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '14px 20px' }}>
              <TextField
                label="Expected Coverage Hours"
                type="number"
                min="1"
                value={formData.photoHours}
                onChange={v => handleInputChange('photoHours', v)}
                placeholder="e.g. 8"
                suffix="hours"
              />

              <MoneyField
                label="Approx. Photo/Video Budget"
                value={formData.approxPhotoBudget}
                onChange={v => handleInputChange('approxPhotoBudget', v)}
                placeholder="45000"
              />

              <TextField
                label="Reference Visual Style"
                value={formData.photoRefStyle}
                onChange={v => handleInputChange('photoRefStyle', v)}
                placeholder="e.g. Royal Cinematic Aesthetic"
              />
            </div>
          </>
        ) : (
          <div style={{ padding: '16px', background: '#f9fafb', borderRadius: 6, color: '#6b7280', fontSize: '0.88rem', fontStyle: 'italic' }}>
            Photography & Videography marked as not required.
          </div>
        )}
      </FormSection>
    );
  }

  // --------------------------------------------------------------------------
  // STEP G: Sound / DJ / Lighting / Entertainment
  // --------------------------------------------------------------------------
  if (currentStep === 6) {
    return (
      <FormSection
        title="G. Sound / DJ / Lighting / Entertainment"
        subtitle="Stage lighting, line array sound, wireless microphones, LED walls, and hosts."
      >
        <MultiSelectDropdown
          label="Sound, Lights & Entertainment Services"
          options={SOUND_SERVICE_OPTIONS}
          selectedValues={formData.soundEntertainment}
          onChange={v => handleInputChange('soundEntertainment', v)}
          placeholder="Select audiovisual equipment and acts..."
          otherValue={formData.soundOther}
          onOtherChange={v => handleInputChange('soundOther', v)}
        />

        <TextField
          label="Special Sound / Program Instructions"
          multiline
          rows={3}
          value={formData.soundSpecialReqs}
          onChange={v => handleInputChange('soundSpecialReqs', v)}
          placeholder="e.g. Dual mic for speeches, soft background nasheed playback during dinner..."
        />
      </FormSection>
    );
  }

  // --------------------------------------------------------------------------
  // STEP H: Stage / Tent / Seating
  // --------------------------------------------------------------------------
  if (currentStep === 7) {
    return (
      <FormSection
        title="H. Stage / Tent / Seating"
        subtitle="VIP sofas, guest banquet chairs, shamiana partitions, cooling fans, and carpeting."
      >
        <MultiSelectDropdown
          label="Stage, Tent & Seating Items"
          options={STAGE_SEATING_OPTIONS}
          selectedValues={formData.stageSeating}
          onChange={v => handleInputChange('stageSeating', v)}
          placeholder="Select seating and shamiana requirements..."
          otherValue={formData.stageOther}
          onOtherChange={v => handleInputChange('stageOther', v)}
        />

        <TextField
          label="Approximate Seating Capacity"
          value={formData.approxSeatingCapacity}
          onChange={v => handleInputChange('approxSeatingCapacity', v)}
          placeholder="e.g. 350 Chairs + 4 VIP Sofas"
        />
      </FormSection>
    );
  }

  // --------------------------------------------------------------------------
  // STEP I: Invitation & Printing
  // --------------------------------------------------------------------------
  if (currentStep === 8) {
    return (
      <FormSection
        title="I. Invitation & Printing"
        subtitle="Physical card printing, digital WhatsApp e-invites, welcome banners, and easel boards."
      >
        <MultiSelectDropdown
          label="Invitation & Media Items"
          options={INVITATION_OPTIONS}
          selectedValues={formData.invitationPrinting}
          onChange={v => handleInputChange('invitationPrinting', v)}
          placeholder="Select invitation & signage needs..."
          otherValue={formData.invitationOther}
          onOtherChange={v => handleInputChange('invitationOther', v)}
        />
      </FormSection>
    );
  }

  // --------------------------------------------------------------------------
  // STEP J: Bridal / Personal Services
  // --------------------------------------------------------------------------
  if (currentStep === 9) {
    return (
      <FormSection
        title="J. Bridal / Personal Services"
        subtitle="Bridal HD makeover, mehendi artistry, groom styling, bespoke cakes, and gifts."
      >
        <MultiSelectDropdown
          label="Bridal & Personal Styling Services"
          options={BRIDAL_OPTIONS}
          selectedValues={formData.bridalServices}
          onChange={v => handleInputChange('bridalServices', v)}
          placeholder="Select styling and bespoke services..."
          otherValue={formData.bridalOther}
          onOtherChange={v => handleInputChange('bridalOther', v)}
        />
      </FormSection>
    );
  }

  // --------------------------------------------------------------------------
  // STEP K: Guest Management & Hospitality
  // --------------------------------------------------------------------------
  if (currentStep === 10) {
    return (
      <FormSection
        title="K. Guest Management & Hospitality"
        subtitle="Front welcome desk, trained ladies & gents ushers, VIP hospitality, and parking guides."
      >
        <MultiSelectDropdown
          label="Guest Hospitality Services"
          options={HOSPITALITY_OPTIONS}
          selectedValues={formData.guestHospitality}
          onChange={v => handleInputChange('guestHospitality', v)}
          placeholder="Select hospitality requirements..."
          otherValue={formData.guestHospitalityOther}
          onOtherChange={v => handleInputChange('guestHospitalityOther', v)}
        />
      </FormSection>
    );
  }

  // --------------------------------------------------------------------------
  // STEP L: Complete Event Coordination
  // --------------------------------------------------------------------------
  if (currentStep === 11) {
    return (
      <FormSection
        title="L. Complete Event Coordination"
        subtitle="Desired involvement from Mezban team and family point of contact."
      >
        <MultiSelectDropdown
          label="Level of Involvement Wanted from Mezban"
          options={INVOLVEMENT_OPTIONS}
          selectedValues={formData.mezbanInvolvement}
          onChange={v => handleInputChange('mezbanInvolvement', v)}
          placeholder="Select coordination levels..."
        />

        <div style={{
          background: '#fcfaf6',
          border: '1px solid #ebdcc5',
          borderRadius: 6,
          padding: '16px',
          marginTop: 14
        }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f3d2e', display: 'block', marginBottom: 10 }}>
            Family-Side Primary Coordinator:
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '14px 20px' }}>
            <TextField
              label="Coordinator Name"
              value={formData.familyCoordinatorName}
              onChange={v => handleInputChange('familyCoordinatorName', v)}
              placeholder="e.g. Adv. Mateen Farooqui"
            />
            <TextField
              label="Coordinator Mobile"
              type="tel"
              isPhone
              value={formData.familyCoordinatorMobile}
              onChange={v => handleInputChange('familyCoordinatorMobile', v)}
              placeholder="10-digit mobile"
            />
          </div>
        </div>
      </FormSection>
    );
  }

  // --------------------------------------------------------------------------
  // STEP M: Budget Discussion
  // --------------------------------------------------------------------------
  if (currentStep === 12) {
    return (
      <FormSection
        title="M. Budget Discussion"
        subtitle="Overall event financial target, flexibility parameters, and top priorities."
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '14px 20px' }}>
          <SelectField
            label="Approximate Overall Event Budget Range"
            options={BUDGET_RANGE_OPTIONS}
            value={formData.overallBudgetRange}
            onChange={v => handleInputChange('overallBudgetRange', v)}
            placeholder="-- Select budget bracket --"
          />

          <MoneyField
            label="Approximate Specific Budget Target"
            value={formData.approxBudget}
            onChange={v => handleInputChange('approxBudget', v)}
            placeholder="350000"
          />
        </div>

        <MultiSelectDropdown
          label="What is MOST important to you?"
          options={MOST_IMPORTANT_OPTIONS}
          selectedValues={formData.mostImportant}
          onChange={v => handleInputChange('mostImportant', v)}
          placeholder="Select core priorities..."
        />

        <RadioGroup
          label="Budget Flexibility"
          options={BUDGET_FLEXIBILITY_OPTIONS}
          value={formData.budgetFlexibility}
          onChange={v => handleInputChange('budgetFlexibility', v)}
        />
      </FormSection>
    );
  }

  // --------------------------------------------------------------------------
  // STEP N: Customer's Previous Experience
  // --------------------------------------------------------------------------
  if (currentStep === 13) {
    const organizedYes = formData.organizedBefore === 'Yes';

    return (
      <FormSection
        title="N. Customer's Previous Experience"
        subtitle="Past event hiccups and pain points the customer wants Mezban to safeguard against."
      >
        <RadioGroup
          label="Have you organized a similar event before?"
          options={YES_NO_OPTIONS}
          value={formData.organizedBefore}
          onChange={v => handleInputChange('organizedBefore', v)}
        />

        {organizedYes && (
          <MultiSelectDropdown
            label="Problems Faced Previously"
            options={PREVIOUS_PROBLEMS_OPTIONS}
            selectedValues={formData.previousProblems}
            onChange={v => handleInputChange('previousProblems', v)}
            placeholder="Select issues faced earlier..."
            otherValue={formData.previousProblemOther}
            onOtherChange={v => handleInputChange('previousProblemOther', v)}
          />
        )}

        <TextField
          label="What specific responsibilities would you like Mezban to handle?"
          multiline
          rows={3}
          value={formData.whatMezbanShouldHandle}
          onChange={v => handleInputChange('whatMezbanShouldHandle', v)}
          placeholder="e.g. End-to-end coordination and vendor quality check so family can relax and greet guests."
        />
      </FormSection>
    );
  }

  // --------------------------------------------------------------------------
  // STEP O: Customer Expectation From Mezban
  // --------------------------------------------------------------------------
  if (currentStep === 14) {
    return (
      <FormSection
        title="O. Customer Expectation From Mezban"
        subtitle="Definition of success and critical trust factors for the host family."
      >
        <TextField
          label='Complete the sentence: "We would be satisfied with Mezban if…"'
          multiline
          rows={3}
          value={formData.satisfiedIf}
          onChange={v => handleInputChange('satisfiedIf', v)}
          placeholder="e.g. All programs start and run smoothly on time with delicious warm food and zero panic."
        />

        <MultiSelectDropdown
          label="What would make you trust Mezban?"
          options={TRUST_FACTORS_OPTIONS}
          selectedValues={formData.trustMezbanFactors}
          onChange={v => handleInputChange('trustMezbanFactors', v)}
          placeholder="Select key trust factors..."
          otherValue={formData.trustOther}
          onOtherChange={v => handleInputChange('trustOther', v)}
        />
      </FormSection>
    );
  }

  // --------------------------------------------------------------------------
  // STEP P: Quotation Requirement
  // --------------------------------------------------------------------------
  if (currentStep === 15) {
    return (
      <FormSection
        title="P. Quotation Requirement"
        subtitle="Quotation scope, urgency, and preferred communication channel."
      >
        <MultiSelectDropdown
          label="Quotation Scope Needed"
          options={QUOTATION_NEEDS_OPTIONS}
          selectedValues={formData.quotationNeeds}
          onChange={v => handleInputChange('quotationNeeds', v)}
          placeholder="Select quotation deliverables..."
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '14px 20px', marginTop: 10 }}>
          <TextField
            label="Quotation Deadline"
            value={formData.quotationDeadline}
            onChange={v => handleInputChange('quotationDeadline', v)}
            placeholder="e.g. Within 24 hours / Tomorrow Evening"
          />

          <RadioGroup
            label="Preferred Contact Channel"
            options={PREFERRED_CONTACT_OPTIONS}
            value={formData.preferredContactMethod}
            onChange={v => handleInputChange('preferredContactMethod', v)}
          />
        </div>
      </FormSection>
    );
  }

  // --------------------------------------------------------------------------
  // STEP Q: Follow-Up
  // --------------------------------------------------------------------------
  if (currentStep === 16) {
    return (
      <FormSection
        title="Q. Follow-Up"
        subtitle="Internal follow-up schedule, decision makers, and lead qualification status."
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '14px 20px' }}>
          <DateField
            label="Next Follow-Up Date"
            value={formData.nextFollowUpDate}
            onChange={v => handleInputChange('nextFollowUpDate', v)}
          />

          <TextField
            label="Follow-Up Person (Mezban)"
            value={formData.followUpPerson}
            onChange={v => handleInputChange('followUpPerson', v)}
            placeholder="Mezban lead coordinator"
          />

          <TextField
            label="Customer Decision Maker"
            value={formData.decisionMaker}
            onChange={v => handleInputChange('decisionMaker', v)}
            placeholder="e.g. Groom's Father"
          />

          <TextField
            label="Other Family Member Involved"
            value={formData.otherFamilyMembers}
            onChange={v => handleInputChange('otherFamilyMembers', v)}
            placeholder="e.g. Elder Brother / Uncle"
          />
        </div>

        <SelectField
          label="Lead Qualification Status"
          options={LEAD_STATUS_OPTIONS}
          value={formData.leadStatus}
          onChange={v => handleInputChange('leadStatus', v)}
          placeholder="-- Select lead status --"
        />

        <TextField
          label="Notes & Meeting Discussion Record"
          multiline
          rows={3}
          value={formData.notes}
          onChange={v => handleInputChange('notes', v)}
          placeholder="Summary of key discussion points, tone of customer, special instructions..."
        />
      </FormSection>
    );
  }

  // --------------------------------------------------------------------------
  // STEP R: Mezban Internal Use (Final Step)
  // --------------------------------------------------------------------------
  if (currentStep === 17) {
    const isRejected = formData.customerResponse === 'Rejected';
    const computedVendorCost = localCalcSummary?.totalCost || 0;
    const computedCustomerQuote = localCalcSummary?.totalPrice || 0;

    return (
      <FormSection
        title="R. Mezban Internal Use"
        subtitle="Proprietary costing calculations, coordination margins, and pipeline conversion tracking."
        internalOnly
      >
        {/* Live Calculation KPI Banner */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
          gap: 12,
          background: '#fcfaf6',
          border: '1.5px solid #d4af37',
          borderRadius: 8,
          padding: '16px',
          marginBottom: 20
        }}>
          <div>
            <span style={{ fontSize: '0.74rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700 }}>
              Live Vendor Cost Engine
            </span>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1f2937', marginTop: 2 }}>
              ₹{Number(computedVendorCost).toLocaleString('en-IN')}
            </div>
            <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>Disbursable to vendors</span>
          </div>

          <div>
            <span style={{ fontSize: '0.74rem', color: '#047857', textTransform: 'uppercase', fontWeight: 700 }}>
              Projected Gross Margin
            </span>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#065f46', marginTop: 2 }}>
              ₹{Number(localCalcSummary?.mezbaanMargin || 0).toLocaleString('en-IN')}
            </div>
            <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>
              {localCalcSummary?.marginPct || 0}% Mezban margin
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.74rem', color: '#92400e', textTransform: 'uppercase', fontWeight: 700 }}>
              Live Proposal Estimate
            </span>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f3d2e', marginTop: 2 }}>
              ₹{Number(computedCustomerQuote).toLocaleString('en-IN')}
            </div>
            <span style={{ fontSize: '0.72rem', color: '#0f3d2e' }}>All-inclusive proposal</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '14px 20px' }}>
          <MoneyField
            label="Vendor Cost Estimate"
            value={formData.vendorCostEstimate || computedVendorCost}
            onChange={v => handleInputChange('vendorCostEstimate', v)}
            helperText="Auto-calculated from selected items"
            readOnly
          />

          <MoneyField
            label="Mezban Coordination Fee"
            value={formData.mezbanCoordFee || '25000'}
            onChange={v => handleInputChange('mezbanCoordFee', v)}
            placeholder="25000"
          />

          <MoneyField
            label="Other Charges"
            value={formData.otherCharges || '0'}
            onChange={v => handleInputChange('otherCharges', v)}
            placeholder="0"
          />

          <MoneyField
            label="Proposed Customer Quote"
            value={formData.proposedQuote || computedCustomerQuote}
            onChange={v => handleInputChange('proposedQuote', v)}
            helperText="Auto-calculated; finalized on submission"
            readOnly
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '14px 20px', marginTop: 14 }}>
          <RadioGroup
            label="Quotation Sent?"
            options={YES_NO_OPTIONS}
            value={formData.quotationSent}
            onChange={v => handleInputChange('quotationSent', v)}
          />

          <DateField
            label="Quotation Sent Date"
            value={formData.quotationDate}
            onChange={v => handleInputChange('quotationDate', v)}
          />

          <RadioGroup
            label="Customer Response"
            options={CUSTOMER_RESPONSE_OPTIONS}
            value={formData.customerResponse}
            onChange={v => handleInputChange('customerResponse', v)}
          />
        </div>

        {isRejected && (
          <div style={{ marginTop: 12 }}>
            <MultiSelectDropdown
              label="Reason Lost"
              options={REASON_LOST_OPTIONS}
              selectedValues={Array.isArray(formData.reasonIfLost) ? formData.reasonIfLost : (formData.reasonIfLost ? [formData.reasonIfLost] : [])}
              onChange={v => handleInputChange('reasonIfLost', v)}
              placeholder="Select reason lead was lost..."
              otherValue={formData.reasonIfLostOther}
              onOtherChange={v => handleInputChange('reasonIfLostOther', v)}
            />
          </div>
        )}
      </FormSection>
    );
  }

  return null;
}
