import mongoose, { Schema, Document } from 'mongoose';

export interface ICateringItem extends Document {
  id: string;
  tenantId: string;
  name: string;
  category: string;
  description: string;
  price: number;
  isAvailable: boolean;
  image: string;
  isBestseller?: boolean;
}

const CateringItemSchema = new Schema<ICateringItem>({
  id: { type: String, required: true, index: true },
  tenantId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  category: String,
  description: String,
  price: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  image: String,
  isBestseller: Boolean,
}, { timestamps: true });

CateringItemSchema.index({ tenantId: 1, id: 1 }, { unique: true });

export const CateringItem = mongoose.model<ICateringItem>('CateringItem', CateringItemSchema);
