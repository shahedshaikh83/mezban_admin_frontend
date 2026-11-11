import React from 'react';
import { BookOpen, Link2, Heart } from 'lucide-react';
import FormField from '../FormField';

export default function Step11NotesReferences({ formData, onChange, errors = {} }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Important Notes & Instructions"
          name="notes"
          value={formData.notes}
          onChange={(e) => onChange('notes', e.target.value)}
          placeholder="High-profile family gathering. Event must be managed end-to-end with zero delays."
          icon={BookOpen}
        />

        <FormField
          label="Reference Links (Instagram / Pinterest / Google Drive)"
          name="referenceLinks"
          value={formData.referenceLinks}
          onChange={(e) => onChange('referenceLinks', e.target.value)}
          placeholder="https://instagram.com/mezbaan_events_beed"
          icon={Link2}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <FormField
          label="What would make this event 100% successful for you?"
          name="whatMezbanShouldHandle"
          value={formData.whatMezbanShouldHandle}
          onChange={(e) => onChange('whatMezbanShouldHandle', e.target.value)}
          placeholder="End-to-end coordination, punctual program schedule, and hot delicious food served with royal hospitality."
          icon={Heart}
        />
      </div>
    </div>
  );
}
