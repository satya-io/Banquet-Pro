/**
 * Database Seed Script
 * Migrates hardcoded data from src/data.ts into Cosmos DB containers.
 * Run: npm run server:seed
 */
import dotenv from 'dotenv';
dotenv.config();

import { initializeCosmosDB, getContainer } from './config/cosmos.js';

// ─── Seed Data (matches src/data.ts) ───────────────────────────────────────────

const TENANT_ID = 'TENANT-DEFAULT';

const tenantDoc = {
  id: TENANT_ID,
  name: 'Grand Royal Banquet Hall',
  ownerUsername: 'admin',
  ownerPassword: 'admin123',
  staffUsername: 'sales',
  staffPassword: 'sales123',
  createdAt: new Date().toISOString(),
};

const enquiries = [
  { id: 'ENQ-2024-001', customerName: 'Sarah Miller', phone: '+1 (555) 012-3456', email: 'sarah.miller@weddingwire.com', source: 'WeddingWire', eventDate: '2024-10-24', pax: 150, budget: 12500, status: 'New', venuePref: 'Grand Ballroom', description: 'Looking for a premium wedding package with elegant table setups, customized multi-course catering, and premium audio-visual support.', notes: [{ time: '2024-08-12 10:45 AM', text: 'Enquiry Received via WeddingWire' }, { time: '2024-08-12 10:46 AM', text: 'Automated Brochure Sent to sarah.miller@weddingwire.com' }], timeAgo: '2 min ago' },
  { id: 'ENQ-2024-002', customerName: 'James K. (TechCorp)', phone: '+1 (555) 234-5678', email: 'james.k@techcorp.com', source: 'Direct Website', eventDate: '2024-12-12', pax: 80, budget: 5200, status: 'Negotiating', venuePref: 'Executive Lounge', description: 'Quarterly general assembly seminar requiring custom catering, wireless microphones, high-definition projection, and quick high-speed internet.', notes: [{ time: '2024-08-10 09:15 AM', text: 'Enquiry Received from online form' }, { time: '2024-08-11 02:30 PM', text: 'Initial phone call complete - James requested custom AV quote' }], timeAgo: '15 min ago' },
  { id: 'ENQ-2024-003', customerName: 'Anita Henderson', phone: '+1 (555) 987-6543', email: 'anita.h@gmail.com', source: 'Instagram Ad', eventDate: '2024-11-05', pax: 200, budget: 18900, status: 'Contacted', venuePref: 'Crystal Lounge', description: 'Luxury anniversary gala dinner with themed decor, elegant floral arrangements, custom cocktails, and dynamic live band setups.', notes: [{ time: '2024-08-08 11:15 AM', text: 'Enquiry Received via Social Channels' }, { time: '2024-08-09 10:00 AM', text: 'Brochure and price list shared via WhatsApp' }], timeAgo: '1 hour ago' },
  { id: 'ENQ-2024-004', customerName: 'Robert White', phone: '+1 (555) 345-6789', email: 'r.white@gmail.com', source: 'Referral', eventDate: '2025-01-15', pax: 120, budget: 9000, status: 'New', venuePref: 'Garden Pavilion', description: 'Elegant retirement banquet. Requested outdoor cocktail reception space and an indoor fallback venue in case of unexpected rain.', notes: [{ time: '2024-08-07 04:00 PM', text: 'Enquiry Received' }], timeAgo: '4 hours ago' },
  { id: 'ENQ-2024-005', customerName: 'Rahul Sharma', phone: '+91 98765 43210', email: 'rahul.sharma@gmail.com', source: 'WhatsApp', eventDate: '2024-10-24', pax: 300, budget: 250000, status: 'New', venuePref: 'Grand Ballroom', description: 'Elegant reception with customized Indian and Continental catering menus, floral backdrops, and heavy stage lighting.', notes: [{ time: '2024-08-05 10:00 AM', text: 'WhatsApp inquiry received' }], timeAgo: '1 day ago' },
  { id: 'ENQ-2024-006', customerName: 'Vikram Khanna', phone: '+91 91234 56789', email: 'vikram.khanna@yahoo.co.in', source: 'Direct Website', eventDate: '2024-10-29', pax: 180, budget: 180000, status: 'New', venuePref: 'Crystal Lounge', description: 'Pre-wedding cocktail party with premium beverage selections, DJ booths, and customized snack counters.', notes: [{ time: '2024-08-04 11:30 AM', text: 'Online application submitted' }], timeAgo: '2 days ago' },
];

const bookings = [
  { id: 'BP-88021', customerName: 'Jonathan Sterling', phone: '+1 (555) 880-2100', eventDate: '2024-10-24', venue: 'Grand Ballroom', totalAmount: 12450, discountPercent: 10, discountAmount: 1245, finalAmount: 11205, amountReceived: 11205, pendingBalance: 0, status: 'Booked', paymentStatus: 'Fully Paid', menuSelection: ['Truffle Mushroom Bruschetta', 'Herb-Crusted Rack of Lamb', 'Dark Chocolate Fondant', 'Signature Welcome Cocktail'], eventType: 'Wedding Reception', timeSlot: 'Morning', startTime: '10:00' },
  { id: 'BP-88025', customerName: 'MegaCorp Inc.', phone: '+1 (555) 880-2500', eventDate: '2024-11-12', venue: 'Grand Ballroom', totalAmount: 45000, discountPercent: 5, discountAmount: 2250, finalAmount: 42750, amountReceived: 25000, pendingBalance: 17750, status: 'Booked', paymentStatus: 'Partially Paid', menuSelection: ['Herb-Crusted Rack of Lamb', 'Miso-Glazed Sea Bass', 'Artisan Coffee Service'], eventType: 'Annual Summit', timeSlot: 'Morning', startTime: '09:00' },
  { id: 'BP-88028', customerName: 'Alice Waters', phone: '+1 (555) 880-2800', eventDate: '2024-10-18', venue: 'Emerald Lawns', totalAmount: 8900, discountPercent: 0, discountAmount: 0, finalAmount: 8900, amountReceived: 3000, pendingBalance: 5900, status: 'Booked', paymentStatus: 'Overdue', menuSelection: ['Seared Atlantic Scallops', 'Dark Chocolate Fondant', 'Signature Welcome Cocktail'], eventType: 'Charity Gala', timeSlot: 'Evening', startTime: '19:00' },
  { id: 'BP-88031', customerName: 'Sarah Lofton', phone: '+1 (555) 880-3100', eventDate: '2024-12-05', venue: 'Crystal Lounge', totalAmount: 5200, discountPercent: 0, discountAmount: 0, finalAmount: 5200, amountReceived: 5200, pendingBalance: 0, status: 'Booked', paymentStatus: 'Fully Paid', menuSelection: ['Truffle Mushroom Bruschetta', 'Butternut Squash Risotto', 'Artisan Coffee Service'], eventType: 'Product Launch', timeSlot: 'Evening', startTime: '18:00' },
  { id: 'BP-88032', customerName: 'Ananya Iyer', phone: '+91 94432 10987', eventDate: '2024-11-05', venue: 'Crystal Lounge', totalAmount: 450000, discountPercent: 0, discountAmount: 0, finalAmount: 450000, amountReceived: 300000, pendingBalance: 150000, status: 'Booked', paymentStatus: 'Partially Paid', menuSelection: ['Truffle Mushroom Bruschetta', 'Herb-Crusted Rack of Lamb', 'Dark Chocolate Fondant', 'Signature Welcome Cocktail', 'Artisan Coffee Service'], eventType: 'Confirmed Wedding Event', timeSlot: 'Morning', startTime: '11:00' },
  { id: 'BP-88033', customerName: 'Mehul Choksi', phone: '+91 98876 54321', eventDate: '2024-11-12', venue: 'Grand Ballroom', totalAmount: 720000, discountPercent: 0, discountAmount: 0, finalAmount: 720000, amountReceived: 720000, pendingBalance: 0, status: 'Completed', paymentStatus: 'Fully Paid', menuSelection: ['Seared Atlantic Scallops', 'Miso-Glazed Sea Bass', 'Madagascar Vanilla Crème Brûlée', 'Signature Welcome Cocktail'], eventType: 'Corporate Gala Banquet', timeSlot: 'Evening', startTime: '19:30' },
  { id: 'BP-88034', customerName: 'Sarah Johnson', phone: '+1 (234) 567-8901', eventDate: '2023-10-24', venue: 'Grand Ballroom', totalAmount: 4500, discountPercent: 0, discountAmount: 0, finalAmount: 4500, amountReceived: 1500, pendingBalance: 3000, status: 'Booked', paymentStatus: 'Partially Paid', menuSelection: ['Truffle Mushroom Bruschetta', 'Butternut Squash Risotto', 'Dark Chocolate Fondant'], eventType: 'Private Birthday', timeSlot: 'Evening', startTime: '18:30' },
  { id: 'BP-88035', customerName: 'Michael Chen', phone: '+1 (987) 654-3210', eventDate: '2023-11-12', venue: 'Emerald Lawns', totalAmount: 2800, discountPercent: 0, discountAmount: 0, finalAmount: 2800, amountReceived: 2800, pendingBalance: 0, status: 'Open Enquiry', paymentStatus: 'Fully Paid', menuSelection: ['Truffle Mushroom Bruschetta', 'Signature Welcome Cocktail'], eventType: 'Outdoor Cocktail', timeSlot: 'Morning', startTime: '11:30' },
];

const venueSpaces = [
  { id: 'SPACE-001', name: 'Grand Ballroom', capacityMin: 800, capacityMax: 1200, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5lHMmom6K6Dr9RBdFDzjZCczdRUw-WZwgnIEWgagaHLHY6KOi_os5D1xubz80OzOE8XNitam6X3mq35glfZmRWYY7-QdKSrlCFgR3u0159eTBU2jFDyFkliXTibeqIFgbY7fgs4LvJIvbSYY6AKS1syBaZwIjlysOUy-e7Lium9VsqwBbHhPw39s5yR_VSb2XhH-2dzAJ_L5dWzkknnC3JOd9OCjcGqG587mP9KvAQ60JqVrV6r_ZKA', status: 'Active', features: ['High ceilings', 'Grand chandeliers', 'Advanced AV rigging', 'Premium Acoustics'] },
  { id: 'SPACE-002', name: 'Emerald Lawns', capacityMin: 500, capacityMax: 2000, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbfkiH9Ryonj1scyASDPawkEs8TLRdWMbrX7Jno2x4GBXEE-HCTqGtYdFjtFG4fAa-zLDZxZ00tyio9TzySK1rWkrlYbPlstGFZsdiuzse086CZBgcPwAurnj067W4NvVe-l2Hl8M_3yQLWyH5Vl6zd7FMkHeYSi23h_T0P8GJnfwFGjnj33ygj20wIUIbF5irPrIDksF-9hIw6ShQzCimHPSzO9FZL361F8l1g6mJZ_V1kF68Iq3WSQ', status: 'Active', features: ['Manicured lawns', 'Fairy light integration', 'Sunset views', 'Paved dancing decks'] },
  { id: 'SPACE-003', name: 'Crystal Lounge', capacityMin: 150, capacityMax: 350, image: '', status: 'Active', features: ['Plush seating', 'Stunning glass walls', 'Signature central bar'] },
];

const teamMembers = [
  { id: 'TEAM-001', name: 'Alex Rivera', email: 'alex.rivera@banquetpro.com', role: 'Admin', status: 'Online', lastActive: 'Just now', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_z3jZfhBZzvyiTOCthdJZCXPUTwi0MXEuwe_qVQcw1g9PfEfzPv3fsXKKvMPJ5J4gYfq5eHQiPi4xAp1QQEacuLoibg9QdoBql0Wtv0HeJFmNJHlKrRbthP-vNZS3eKSncH6e0HiWnW6v3keIER-AAQygcSMyKDL4LCASdZWQVlCPzRTRstTTdTp2JUzCgiNWiV4DOh-eF4F1SHTx-rrRJ9XxSZ3fjB25-Ta4isBGbF2cPgJcMDJrhg' },
  { id: 'TEAM-002', name: 'Jordan Miller', email: 'jordan@grandroyal.com', role: 'Manager', status: 'Offline', lastActive: '2h ago', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZBAEbRTytGtp5st7h7aI-6VTJHQs20OoQ9pHGdn-8wpz-oGHYJdkAd8HIP5YiMIQYGndejiGfFYwUbAeoowO-G8k2fmVEt8FobpDkMzV3wQxTohX4mzRRPhlm0utmmC5wtc6xbNPw2b__5VBnc4k-gtcJIrZl9wb1QpFBf4QJWJxIcXMqApb4WD7KWK4FSk37GM_HSXVaDsIEgrn_q7BR1WOfm6fwO4lYZwKmkUvrekb3L3v9Gqz_rQ' },
  { id: 'TEAM-003', name: 'Sarah Tan', email: 'sarah@grandroyal.com', role: 'Staff', status: 'Online', lastActive: '14m ago', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCc3cVsnSt9zilkyUgSKtjmj5UK5uKIRf3ILPxGoLMa74A_ObsrepXR4pOZOm8Wa9O5nbT3ER_IP4-Un3WzC3l9TvkltO2cMSwTBdDUlZFhE0aOUgozmHpQ9lBx0VJAj6-dgAvdCgqVnNxmsTT7R6SRhklo25NNgofAzmVZVkOdmeHo9kNyA1buTl3stNhrKmo1H50fGVdH6HJKJblhnfLd-IABi_lw3Q9jVZhqpE0VATf6bHENDL89RQ' },
];

const settingsDoc = {
  id: `settings-${TENANT_ID}`,
  name: 'Grand Royal Banquet Hall',
  email: 'ops@grandroyal.com',
  address: '12th Luxury Boulevard, Midtown Business District, NY 10001',
  logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBt_ZWAhHqrdHopiVZF8NocAQn_Z9Y-9RTOhqfBlRrJfEYleFAfAGxiIhdC5Ve_pA7hmB-9DQ3SVcPr0VHhAuh0YmiZZxoAMPvhsx5G34kwdp2caZnRW8rY0PDIT2Wcdk7-BidmA1PweRRALUZvkWXR_ptshS-n2XQh05uvOlzxnWPz622JGisjEX-bN3uNUndZS9A8mYo3sFr12j8xMBLqF9kTzGe0vErnoBjkImtD0nr4iMjlEClA2g',
  weekendSurge: true,
  peakSeason: true,
  baseDeposit: 5000,
};

// ─── Seed Function ─────────────────────────────────────────────────────────────

async function seedDatabase() {
  console.log('');
  console.log('🌱 Banquet Pro Database Seeding');
  console.log('═══════════════════════════════════════');

  try {
    await initializeCosmosDB();
    console.log('');

    // 1. Seed tenant
    console.log('📦 Seeding tenant...');
    const tenantsContainer = getContainer('tenants');
    try {
      await tenantsContainer.items.create(tenantDoc);
      console.log(`   ✅ Tenant "${tenantDoc.name}" created`);
    } catch (e: any) {
      if (e.code === 409) {
        console.log(`   ⚠️  Tenant "${tenantDoc.name}" already exists, skipping`);
      } else throw e;
    }

    // 2. Seed enquiries
    console.log('📦 Seeding enquiries...');
    const enquiriesContainer = getContainer('enquiries');
    for (const enq of enquiries) {
      try {
        await enquiriesContainer.items.create({ ...enq, tenantId: TENANT_ID });
        console.log(`   ✅ ${enq.id} — ${enq.customerName}`);
      } catch (e: any) {
        if (e.code === 409) console.log(`   ⚠️  ${enq.id} already exists, skipping`);
        else throw e;
      }
    }

    // 3. Seed bookings
    console.log('📦 Seeding bookings...');
    const bookingsContainer = getContainer('bookings');
    for (const booking of bookings) {
      try {
        await bookingsContainer.items.create({ ...booking, tenantId: TENANT_ID });
        console.log(`   ✅ ${booking.id} — ${booking.customerName}`);
      } catch (e: any) {
        if (e.code === 409) console.log(`   ⚠️  ${booking.id} already exists, skipping`);
        else throw e;
      }
    }

    // 4. Seed venue spaces
    console.log('📦 Seeding venue spaces...');
    const venuesContainer = getContainer('venueSpaces');
    for (const space of venueSpaces) {
      try {
        await venuesContainer.items.create({ ...space, tenantId: TENANT_ID });
        console.log(`   ✅ ${space.id} — ${space.name}`);
      } catch (e: any) {
        if (e.code === 409) console.log(`   ⚠️  ${space.id} already exists, skipping`);
        else throw e;
      }
    }

    // 5. Seed team members
    console.log('📦 Seeding team members...');
    const teamContainer = getContainer('teamMembers');
    for (const member of teamMembers) {
      try {
        await teamContainer.items.create({ ...member, tenantId: TENANT_ID });
        console.log(`   ✅ ${member.id} — ${member.name} (${member.role})`);
      } catch (e: any) {
        if (e.code === 409) console.log(`   ⚠️  ${member.id} already exists, skipping`);
        else throw e;
      }
    }

    // 6. Seed settings
    console.log('📦 Seeding venue settings...');
    const settingsContainer = getContainer('settings');
    try {
      await settingsContainer.items.create({ ...settingsDoc, tenantId: TENANT_ID });
      console.log(`   ✅ Settings for "${settingsDoc.name}" created`);
    } catch (e: any) {
      if (e.code === 409) console.log(`   ⚠️  Settings already exist, skipping`);
      else throw e;
    }

    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('✅ Database seeding completed successfully!');
    console.log('');
    console.log('Demo login credentials:');
    console.log('  Admin  → username: admin  | password: admin123');
    console.log('  Sales  → username: sales  | password: sales123');
    console.log('');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
