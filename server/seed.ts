/**
 * Database Seed Script — MongoDB
 * Migrates hardcoded data from src/data.ts into MongoDB collections.
 * Run: npm run server:seed
 */
import dotenv from 'dotenv';
dotenv.config();

import { connectDatabase } from './config/database.js';
import { Tenant } from './models/Tenant.js';
import { Enquiry } from './models/Enquiry.js';
import { Booking } from './models/Booking.js';
import { CateringItem } from './models/CateringItem.js';
import { VenueSpace } from './models/VenueSpace.js';
import { TeamMember } from './models/TeamMember.js';
import { Settings } from './models/Settings.js';
import mongoose from 'mongoose';

const TENANT_ID = 'TENANT-DEFAULT';

async function seedDatabase() {
  console.log('');
  console.log('🌱 Banquet Pro Database Seeding (MongoDB)');
  console.log('═══════════════════════════════════════');

  try {
    await connectDatabase();

    // 1. Seed tenant (System Admin)
    console.log('📦 Seeding System Administrator Tenant...');
    await Tenant.findOneAndUpdate(
      { tenantId: TENANT_ID },
      {
        tenantId: TENANT_ID,
        name: 'System Administrator Workspace',
        ownerUsername: 'admin',
        ownerPassword: 'admin123',
        staffUsername: '',
        staffPassword: '',
        active: true,
      },
      { upsert: true, new: true }
    );
    console.log('   ✅ Tenant "System Administrator Workspace" ready');

    // 2. Clear out any demo Grand Royal data under TENANT-DEFAULT
    console.log('🧹 Cleaning up "Grand Royal Banquet Hall" demo data under default tenant...');
    await Enquiry.deleteMany({ tenantId: TENANT_ID });
    await Booking.deleteMany({ tenantId: TENANT_ID });
    await VenueSpace.deleteMany({ tenantId: TENANT_ID });
    await TeamMember.deleteMany({ tenantId: TENANT_ID });
    await Settings.deleteMany({ tenantId: TENANT_ID });
    await CateringItem.deleteMany({ tenantId: TENANT_ID });
    console.log('   ✅ Default tenant space cleared of Grand Royal data');

    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('✅ Database seeding completed successfully!');
    console.log('');
    console.log('System Administrator Login:');
    console.log('  Portal  → /appadmin');
    console.log('  Admin   → username: admin  | password: admin123');
    console.log('');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedDatabase();
