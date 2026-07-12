import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  tenantId: string;
  name: string;
  email: string;
  address: string;
  logo: string;
  weekendSurge: boolean;
  peakSeason: boolean;
  baseDeposit: number;
}

const SettingsSchema = new Schema<ISettings>({
  tenantId: { type: String, required: true, unique: true, index: true },
  name: String,
  email: String,
  address: String,
  logo: String,
  weekendSurge: { type: Boolean, default: false },
  peakSeason: { type: Boolean, default: false },
  baseDeposit: { type: Number, default: 5000 },
}, { timestamps: true });

export const Settings = mongoose.model<ISettings>('Settings', SettingsSchema);
