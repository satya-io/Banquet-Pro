import mongoose, { Schema, Document } from 'mongoose';

export interface ITeamMember extends Document {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Staff';
  status: 'Online' | 'Offline';
  lastActive: string;
  avatar: string;
}

const TeamMemberSchema = new Schema<ITeamMember>({
  id: { type: String, required: true, index: true },
  tenantId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  email: String,
  role: { type: String, enum: ['Admin', 'Manager', 'Staff'], default: 'Staff' },
  status: { type: String, enum: ['Online', 'Offline'], default: 'Offline' },
  lastActive: String,
  avatar: String,
}, { timestamps: true });

TeamMemberSchema.index({ tenantId: 1, id: 1 }, { unique: true });

export const TeamMember = mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);
