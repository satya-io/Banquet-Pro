import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  id: string;
  tenantId: string;
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
}

const BookingSchema = new Schema<IBooking>({
  id: { type: String, required: true, index: true },
  tenantId: { type: String, required: true, index: true },
  customerName: { type: String, required: true },
  phone: String,
  eventDate: String,
  venue: String,
  totalAmount: { type: Number, default: 0 },
  discountPercent: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  finalAmount: { type: Number, default: 0 },
  amountReceived: { type: Number, default: 0 },
  pendingBalance: { type: Number, default: 0 },
  status: { type: String, enum: ['Booked', 'Completed', 'Cancelled', 'Open Enquiry'], default: 'Booked' },
  paymentStatus: { type: String, enum: ['Fully Paid', 'Partially Paid', 'Overdue'], default: 'Partially Paid' },
  menuSelection: [String],
  eventType: String,
  timeSlot: { type: String, enum: ['Morning', 'Evening'] },
  startTime: String,
}, { timestamps: true });

BookingSchema.index({ tenantId: 1, id: 1 }, { unique: true });

export const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
