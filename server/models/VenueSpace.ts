import mongoose, { Schema, Document } from 'mongoose';

export interface IVenueSpace extends Document {
  id: string;
  tenantId: string;
  name: string;
  capacityMin: number;
  capacityMax: number;
  image: string;
  status: 'Active' | 'Maintenance';
  features: string[];
}

const VenueSpaceSchema = new Schema<IVenueSpace>({
  id: { type: String, required: true, index: true },
  tenantId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  capacityMin: Number,
  capacityMax: Number,
  image: String,
  status: { type: String, enum: ['Active', 'Maintenance'], default: 'Active' },
  features: [String],
}, { timestamps: true });

VenueSpaceSchema.index({ tenantId: 1, id: 1 }, { unique: true });

export const VenueSpace = mongoose.model<IVenueSpace>('VenueSpace', VenueSpaceSchema);
