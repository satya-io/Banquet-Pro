export interface EnquiryNote {
  time: string;
  text: string;
}

export interface BookingAllocation {
  venue: string;
  eventDate: string;
  timeSlot: 'Morning' | 'Evening';
  startTime?: string;
}

export interface Enquiry {
  id: string;
  customerName: string;
  phone: string;
  email: string; // optional
  source: string;
  eventDate: string;
  pax: number;
  budget: number; // Quote Price
  status: 'New' | 'Contacted' | 'Negotiating' | 'Confirmed' | 'Lost';
  venuePref: string;
  description: string;
  notes: EnquiryNote[];
  timeAgo: string;
  bookingAmount?: number;
  pendingBalance?: number;
  menuSelection?: string[];
  timeSlot?: 'Morning' | 'Evening';
  startTime?: string;
  referrerName?: string;
}

export interface Booking {
  id: string;
  customerName: string;
  phone: string;
  eventDate: string;
  venue: string;
  totalAmount: number;
  discountPercent: number;
  discountAmount: number;
  finalAmount: number;
  amountReceived: number;
  pendingBalance: number;
  status: 'Booked' | 'Completed' | 'Cancelled' | 'Open Enquiry';
  paymentStatus: 'Fully Paid' | 'Partially Paid' | 'Overdue';
  menuSelection: string[];
  eventType: string;
  timeSlot?: 'Morning' | 'Evening';
  startTime?: string;
  pax?: number;
  email?: string;
  referrerName?: string;
  allocations?: BookingAllocation[];
}

export interface CateringItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  isAvailable: boolean;
  image: string;
  isBestseller?: boolean;
}

export interface VenueSpace {
  id: string;
  name: string;
  capacityMin: number;
  capacityMax: number;
  image: string;
  status: 'Active' | 'Maintenance';
  features: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Staff';
  status: 'Online' | 'Offline';
  lastActive: string;
  avatar: string;
  phone?: string;
  password?: string;
  active?: boolean;
}

export interface VenueSettings {
  name: string;
  email: string;
  address: string;
  logo: string;
  weekendSurge: boolean;
  peakSeason: boolean;
  baseDeposit: number;
}

export type ActiveTab = 'dashboard' | 'enquiries' | 'bookings' | 'calendar' | 'menu' | 'settings';

export interface Tenant {
  id: string;
  name: string;
  ownerUsername: string;
  ownerPassword: string;
  staffUsername: string;
  staffPassword: string;
  enquiries: Enquiry[];
  bookings: Booking[];
  venueSpaces: VenueSpace[];
  cateringItems: CateringItem[];
  settings: VenueSettings;
  teamMembers: TeamMember[];
}
