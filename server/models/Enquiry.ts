import mongoose, { Schema, Document } from 'mongoose';

export interface IEnquiryNote {
  time: string;
  text: string;
}

export interface IEnquiry extends Document {
  id: string;
  tenantId: string;
  customerName: string;
  phone: string;
  email: string;
  source: string;
  eventDate: string;
  pax: number;
  budget: number;
  status: 'New' | 'Contacted' | 'Negotiating' | 'Confirmed' | 'Lost';
  venuePref: string;
  description: string;
  notes: IEnquiryNote[];
  timeAgo: string;
  bookingAmount?: number;
  pendingBalance?: number;
  menuSelection?: string[];
  timeSlot?: 'Morning' | 'Evening';
  startTime?: string;
  referrerName?: string;
}

const EnquirySchema = new Schema<IEnquiry>({
  id: { type: String, required: true, index: true },
  tenantId: { type: String, required: true, index: true },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
  source: String,
  referrerName: String,
  eventDate: String,
  pax: Number,
  budget: Number,
  status: { type: String, enum: ['New', 'Contacted', 'Negotiating', 'Confirmed', 'Lost'], default: 'New' },
  venuePref: String,
  description: String,
  notes: [{ time: String, text: String }],
  timeAgo: String,
  bookingAmount: Number,
  pendingBalance: Number,
  menuSelection: [String],
  timeSlot: { type: String, enum: ['Morning', 'Evening'] },
  startTime: String,
}, { timestamps: true });

EnquirySchema.index({ tenantId: 1, id: 1 }, { unique: true });

export const Enquiry = mongoose.model<IEnquiry>('Enquiry', EnquirySchema);
