// Configuration for Mezban Customer Requirement Sheet 18-step wizard form

export const WIZARD_STEPS = [
  { index: 0, letter: 'A', key: 'customer_info', title: 'A. Customer Information', shortTitle: 'Customer' },
  { index: 1, letter: 'B', key: 'event_info', title: 'B. Event Information', shortTitle: 'Event' },
  { index: 2, letter: 'C', key: 'venue_req', title: 'C. Venue Requirement', shortTitle: 'Venue' },
  { index: 3, letter: 'D', key: 'decor_req', title: 'D. Decoration Requirement', shortTitle: 'Decoration' },
  { index: 4, letter: 'E', key: 'catering_food', title: 'E. Catering & Food', shortTitle: 'Catering' },
  { index: 5, letter: 'F', key: 'photo_video', title: 'F. Photography & Videography', shortTitle: 'Photography' },
  { index: 6, letter: 'G', key: 'sound_light', title: 'G. Sound / DJ / Lighting / Entertainment', shortTitle: 'Sound & Lights' },
  { index: 7, letter: 'H', key: 'stage_seating', title: 'H. Stage / Tent / Seating', shortTitle: 'Stage & Tent' },
  { index: 8, letter: 'I', key: 'invitation_print', title: 'I. Invitation & Printing', shortTitle: 'Invitations' },
  { index: 9, letter: 'J', key: 'bridal_services', title: 'J. Bridal / Personal Services', shortTitle: 'Bridal' },
  { index: 10, letter: 'K', key: 'guest_mgmt', title: 'K. Guest Management & Hospitality', shortTitle: 'Hospitality' },
  { index: 11, letter: 'L', key: 'event_coord', title: 'L. Complete Event Coordination', shortTitle: 'Coordination' },
  { index: 12, letter: 'M', key: 'budget_disc', title: 'M. Budget Discussion', shortTitle: 'Budget' },
  { index: 13, letter: 'N', key: 'prev_exp', title: "N. Customer's Previous Experience", shortTitle: 'Experience' },
  { index: 14, letter: 'O', key: 'customer_exp', title: 'O. Customer Expectation From Mezban', shortTitle: 'Expectation' },
  { index: 15, letter: 'P', key: 'quote_req', title: 'P. Quotation Requirement', shortTitle: 'Quotation Req' },
  { index: 16, letter: 'Q', key: 'follow_up', title: 'Q. Follow-Up', shortTitle: 'Follow-Up', internalOnly: true },
  { index: 17, letter: 'R', key: 'internal_use', title: 'R. Mezban Internal Use', shortTitle: 'Internal Use', internalOnly: true }
];

export const RELATIONSHIP_OPTIONS = [
  "Bride's Family",
  "Groom's Family",
  "Parent",
  "Individual",
  "Business Owner",
  "School/Institute",
  "NGO/Community",
  "Other"
];

export const HOW_HEARD_OPTIONS = [
  "Friend/Relative",
  "WhatsApp",
  "Facebook/Instagram",
  "Visiting Card",
  "Catalogue",
  "Vendor Reference",
  "Venue Reference",
  "Direct Contact",
  "Previous Customer",
  "Other"
];

export const EVENT_TYPE_OPTIONS = [
  "Wedding",
  "Nikah",
  "Walima",
  "Reception",
  "Engagement",
  "Mehendi",
  "Family Celebration",
  "Anniversary",
  "Aqeeqah",
  "Iftar",
  "Religious Gathering",
  "Eid Event",
  "NGO/Community Event",
  "School Event",
  "Educational Event",
  "Seminar",
  "Workshop",
  "Corporate Event",
  "Business Event",
  "Product Launch",
  "Store/Shop Opening",
  "Award/Felicitation",
  "Meeting/Conference",
  "Other"
];

export const DATE_STATUS_OPTIONS = [
  "Confirmed",
  "Tentative",
  "Flexible"
];

export const TIME_OF_DAY_OPTIONS = [
  "Morning",
  "Afternoon",
  "Evening",
  "Night"
];

export const GUEST_RANGES = [
  "Below 50",
  "50–100",
  "100–150",
  "150–300",
  "300–500",
  "500–750",
  "750–1,000",
  "1,000–1,500",
  "1,500–2,000",
  "2000+"
];

export const GUEST_PROFILE_OPTIONS = [
  "Mostly Family",
  "Friends",
  "Relatives",
  "Children",
  "Senior Citizens",
  "Ladies & Gents",
  "VIP Guests",
  "Business Guests",
  "Students",
  "Community Members",
  "Mixed"
];

export const VENUE_SELECTED_OPTIONS = [
  "Yes",
  "No",
  "Shortlisted",
  "Need Mezban to find venue"
];

export const VENUE_REQUIREMENT_OPTIONS = [
  "Marriage Hall",
  "Hotel",
  "Banquet Hall",
  "Community Hall",
  "Open Ground",
  "Lawn",
  "School/Institute",
  "Restaurant",
  "Masjid/Community Premises",
  "Farm/Outdoor Venue",
  "Other"
];

export const IMPORTANT_VENUE_REQ_OPTIONS = [
  "Separate Ladies/Gents Sections",
  "AC",
  "Non-AC acceptable",
  "Parking",
  "Generator/Power Backup",
  "Kitchen Facility",
  "Outside Caterer Allowed",
  "Own Catering Allowed",
  "Non-Veg Allowed",
  "Veg Catering",
  "Stage",
  "Tables & Chairs",
  "Sound System",
  "Decoration Allowed",
  "Late-Night Event Allowed",
  "Clean Washrooms",
  "Changing Room",
  "Bridal Room",
  "Guest Waiting Area",
  "Accessibility",
  "Other"
];

export const DECORATION_REQUIRED_OPTIONS = [
  "Yes",
  "No",
  "Not Decided"
];

export const DECORATION_TYPE_OPTIONS = [
  "Simple",
  "Basic",
  "Standard",
  "Premium",
  "Luxury",
  "Traditional",
  "Modern",
  "Islamic Theme",
  "Floral",
  "Royal",
  "Minimal",
  "Custom Theme"
];

export const DECORATION_AREA_OPTIONS = [
  "Main Stage",
  "Couple Stage",
  "Nikah Stage",
  "Walima Stage",
  "Entrance",
  "Welcome Gate",
  "Backdrop",
  "Table Decoration",
  "Dining Area",
  "Bride/Groom Seating",
  "Photo Booth",
  "Flower Decoration",
  "Ceiling Decoration",
  "Wall Decoration",
  "Lighting",
  "LED Screen",
  "Pathway",
  "Mehendi Stage",
  "Other"
];

export const CATERING_REQUIRED_OPTIONS = [
  "Yes",
  "No",
  "Venue Catering",
  "Outside Caterer",
  "Need Mezban to arrange"
];

export const FOOD_PREFERENCE_OPTIONS = [
  "Veg",
  "Non-Veg",
  "Both Veg & Non-Veg"
];

export const MEAL_OPTIONS = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snacks",
  "High Tea",
  "Iftar",
  "Refreshments",
  "Welcome Drinks"
];

export const FOOD_SERVICE_OPTIONS = [
  "Buffet",
  "Table Service",
  "Packed Food",
  "Live Counter",
  "Family Style"
];

export const CUISINE_OPTIONS = [
  "Indian",
  "Mughlai",
  "Hyderabadi",
  "Biryani",
  "North Indian",
  "South Indian",
  "Chinese",
  "Snacks/Chaat",
  "Desserts",
  "Custom Menu"
];

export const YES_NO_OPTIONS = [
  "Yes",
  "No"
];

export const PHOTO_SERVICE_OPTIONS = [
  "Traditional Photography",
  "Candid Photography",
  "Videography",
  "Cinematic Video",
  "Highlight Video",
  "Full Event Video",
  "Album",
  "Drone",
  "Pre-Wedding Shoot",
  "Couple Shoot",
  "Live Streaming"
];

export const SOUND_SERVICE_OPTIONS = [
  "Sound System",
  "DJ",
  "Mic",
  "Wireless Mic",
  "Speakers",
  "Stage Lighting",
  "Decorative Lighting",
  "LED Wall",
  "Projector",
  "Screen",
  "Live Music",
  "Qawwali",
  "Nasheed",
  "Anchor/Host",
  "Entertainment",
  "Children's Entertainment",
  "Other"
];

export const STAGE_SEATING_OPTIONS = [
  "Stage",
  "Sofa Seating",
  "Couple Chairs",
  "VIP Seating",
  "Guest Chairs",
  "Tables",
  "Dining Tables",
  "Tent",
  "Canopy",
  "Fans/Coolers",
  "Carpet",
  "Flooring",
  "Generator",
  "Electrical Setup",
  "Other"
];

export const INVITATION_OPTIONS = [
  "Wedding Cards",
  "Nikah Cards",
  "Walima Cards",
  "Digital Invitation",
  "WhatsApp Invitation",
  "Welcome Board",
  "Direction Board",
  "Menu Cards",
  "Table Numbers",
  "Name Tags",
  "Banners",
  "Certificates",
  "Other"
];

export const BRIDAL_OPTIONS = [
  "Makeup",
  "Hairstyling",
  "Mehendi",
  "Groom Styling",
  "Bridal Dress Coordination",
  "Cake",
  "Bouquet",
  "Gifts/Return Gifts",
  "Other"
];

export const HOSPITALITY_OPTIONS = [
  "Guest Welcome",
  "Welcome Desk",
  "Ushers",
  "Ladies Hospitality Team",
  "Gents Hospitality Team",
  "VIP Management",
  "Seating Assistance",
  "Parking Assistance",
  "Transportation",
  "Elderly Guest Assistance",
  "Children Assistance",
  "Guest Accommodation",
  "Other"
];

export const INVOLVEMENT_OPTIONS = [
  "Only Vendor Suggestions",
  "Vendor Search & Options",
  "Vendor Price Comparison",
  "Vendor Negotiation",
  "Booking Coordination",
  "Selected Vendor Coordination",
  "Complete Pre-Event Coordination",
  "Event-Day Coordination",
  "Complete Event Management"
];

export const BUDGET_RANGE_OPTIONS = [
  "Below ₹50,000",
  "₹50,000–₹1 Lakh",
  "₹1–3 Lakh",
  "₹3–5 Lakh",
  "₹5–10 Lakh",
  "₹10 Lakh+",
  "Prefer not to disclose",
  "Not decided"
];

export const MOST_IMPORTANT_OPTIONS = [
  "Lowest Price",
  "Good Quality",
  "Premium Quality",
  "Reliable Vendors",
  "Good Food",
  "Decoration",
  "Photography",
  "On-Time Execution",
  "Guest Comfort",
  "Family Enjoyment",
  "One Point of Contact",
  "Complete Tension-Free Event"
];

export const BUDGET_FLEXIBILITY_OPTIONS = [
  "Strict Budget",
  "Slightly Flexible",
  "Flexible for Better Quality",
  "Not Decided"
];

export const PREVIOUS_PROBLEMS_OPTIONS = [
  "Vendor Delay",
  "Vendor Didn't Arrive",
  "Price Increased",
  "Poor Quality",
  "Food Problem",
  "Decoration Problem",
  "Photography Problem",
  "Sound Problem",
  "Venue Problem",
  "Payment Issue",
  "Family Had to Manage Everything",
  "Guest Management Problem",
  "Last-Minute Problem",
  "No Major Problem",
  "Other"
];

export const TRUST_FACTORS_OPTIONS = [
  "Transparent Pricing",
  "Written Quotation",
  "Reliable Vendors",
  "Previous Event Photos",
  "Customer Reviews",
  "Vendor Options",
  "Clear Payment Terms",
  "One Point of Contact",
  "No Hidden Charges",
  "Event-Day Coordinator",
  "Other"
];

export const QUOTATION_NEEDS_OPTIONS = [
  "Need Complete Quotation",
  "Need Vendor Options First",
  "Need Venue Options First",
  "Need Decoration Options",
  "Need Catering Options",
  "Need Photography Options",
  "Need Complete Event Package",
  "Just Exploring for Now"
];

export const PREFERRED_CONTACT_OPTIONS = [
  "WhatsApp",
  "Phone Call",
  "Meeting"
];

export const LEAD_STATUS_OPTIONS = [
  "Level 0 – General Enquiry Lead",
  "Level 1 – Potential",
  "Level 2 – Qualified",
  "Level 3 – Quotation Required",
  "Level 4 – Paid Event Lead"
];

export const CUSTOMER_RESPONSE_OPTIONS = [
  "Interested",
  "Negotiating",
  "Waiting",
  "Rejected",
  "Confirmed"
];

export const REASON_LOST_OPTIONS = [
  "Price",
  "Date",
  "Vendor",
  "Venue",
  "Family Decision",
  "Not Interested",
  "Other"
];
