import { 
  User, 
  Calendar, 
  MapPin, 
  Users, 
  Utensils, 
  Palette, 
  Image as ImageIcon, 
  Truck, 
  ClipboardCheck, 
  Wallet, 
  BookOpen, 
  Eye 
} from 'lucide-react';

export const MEZBAAN_12_STEPS = [
  {
    id: 'customer-info',
    number: 1,
    title: 'Customer Information',
    subtitle: 'Basic details and contact info',
    sectionSubtitle: 'Basic contact coordinates and relationship to the upcoming event.',
    icon: User
  },
  {
    id: 'event-details',
    number: 2,
    title: 'Event Details',
    subtitle: 'Type, date and time',
    sectionSubtitle: 'Occasion types, program dates, and event timing slots.',
    icon: Calendar
  },
  {
    id: 'venue-location',
    number: 3,
    title: 'Venue & Location',
    subtitle: 'Event venue address',
    sectionSubtitle: 'Banquet hall or lawn address and venue booking status.',
    icon: MapPin
  },
  {
    id: 'guests-dining',
    number: 4,
    title: 'Guests & Dining',
    subtitle: 'Guest count and food preference',
    sectionSubtitle: 'Expected guest attendance, vegetarian/non-vegetarian preferences, and service style.',
    icon: Users
  },
  {
    id: 'catering-reqs',
    number: 5,
    title: 'Menu Selection',
    subtitle: 'Menu and catering details',
    sectionSubtitle: 'Authentic Beed Mughlai & Dum Biryani menu selections and plate budgeting.',
    icon: Utensils
  },
  {
    id: 'decor-theme',
    number: 6,
    title: 'Décor & Theme',
    subtitle: 'Theme and decoration style',
    sectionSubtitle: 'Stage design, color palettes, entrance arches, and floral aesthetics.',
    icon: Palette
  },
  {
    id: 'media-entertainment',
    number: 7,
    title: 'Media & Entertainment',
    subtitle: 'Photography, DJ, etc.',
    sectionSubtitle: '4K cinematic videography, drone coverage, pro sound, and ambient lighting.',
    icon: ImageIcon
  },
  {
    id: 'logistics-infra',
    number: 8,
    title: 'Logistics & Infrastructure',
    subtitle: 'Setup and additional needs',
    sectionSubtitle: 'VIP royal sofa seating, round tables, shamiana partitions, and power generators.',
    icon: Truck
  },
  {
    id: 'additional-prefs',
    number: 9,
    title: 'Additional Preferences',
    subtitle: 'Special requests',
    sectionSubtitle: 'Welcome ushers, rose water & attar reception, and family custom requirements.',
    icon: ClipboardCheck
  },
  {
    id: 'budget-range',
    number: 10,
    title: 'Budget Range',
    subtitle: 'Expected budget',
    sectionSubtitle: 'Client expected budget window and event priorities.',
    icon: Wallet
  },
  {
    id: 'notes-references',
    number: 11,
    title: 'Notes & References',
    subtitle: 'Any extra information',
    sectionSubtitle: 'Special coordination instructions, previous event pain points, and design reference links.',
    icon: BookOpen
  },
  {
    id: 'review-submit',
    number: 12,
    title: 'Review & Submit',
    subtitle: 'Confirm and submit form',
    sectionSubtitle: 'Review all gathered customer requirements and generate formal estimate quotation.',
    icon: Eye
  }
];
