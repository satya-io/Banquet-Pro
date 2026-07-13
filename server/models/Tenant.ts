import mongoose, { Schema, Document } from 'mongoose';

export interface ITenant extends Document {
  tenantId: string;
  name: string;
  ownerUsername: string;
  ownerPassword: string;
  staffUsername: string;
  staffPassword: string;
  active: boolean;
  createdAt: Date;
}

const TenantSchema = new Schema<ITenant>({
  tenantId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  ownerUsername: { type: String, required: true },
  ownerPassword: { type: String, required: true },
  staffUsername: { type: String, default: '' },
  staffPassword: { type: String, default: '' },
  active: { type: Boolean, default: false },
}, { timestamps: true });

export const Tenant = mongoose.model<ITenant>('Tenant', TenantSchema);
