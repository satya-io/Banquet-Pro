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

    // 1. Seed tenant
    console.log('📦 Seeding tenant...');
    await Tenant.findOneAndUpdate(
      { tenantId: TENANT_ID },
      {
        tenantId: TENANT_ID,
        name: 'Grand Royal Banquet Hall',
        ownerUsername: 'admin',
        ownerPassword: 'admin123',
        staffUsername: 'sales',
        staffPassword: 'sales123',
      },
      { upsert: true, new: true }
    );
    console.log('   ✅ Tenant "Grand Royal Banquet Hall" ready');

    // 2. Seed enquiries
    console.log('📦 Seeding enquiries...');
    const enquiries = [
      { id: 'ENQ-2024-001', customerName: 'Sarah Miller', phone: '+1 (555) 012-3456', email: 'sarah.miller@weddingwire.com', source: 'WeddingWire', eventDate: '2024-10-24', pax: 150, budget: 12500, status: 'New', venuePref: 'Grand Ballroom', description: 'Looking for a premium wedding package.', notes: [{ time: '2024-08-12 10:45 AM', text: 'Enquiry Received via WeddingWire' }], timeAgo: '2 min ago' },
      { id: 'ENQ-2024-002', customerName: 'James K. (TechCorp)', phone: '+1 (555) 234-5678', email: 'james.k@techcorp.com', source: 'Direct Website', eventDate: '2024-12-12', pax: 80, budget: 5200, status: 'Negotiating', venuePref: 'Executive Lounge', description: 'Quarterly general assembly seminar.', notes: [{ time: '2024-08-10 09:15 AM', text: 'Enquiry Received from online form' }], timeAgo: '15 min ago' },
      { id: 'ENQ-2024-003', customerName: 'Anita Henderson', phone: '+1 (555) 987-6543', email: 'anita.h@gmail.com', source: 'Instagram Ad', eventDate: '2024-11-05', pax: 200, budget: 18900, status: 'Contacted', venuePref: 'Crystal Lounge', description: 'Luxury anniversary gala dinner.', notes: [{ time: '2024-08-08 11:15 AM', text: 'Enquiry Received via Social Channels' }], timeAgo: '1 hour ago' },
      { id: 'ENQ-2024-004', customerName: 'Robert White', phone: '+1 (555) 345-6789', email: 'r.white@gmail.com', source: 'Referral', eventDate: '2025-01-15', pax: 120, budget: 9000, status: 'New', venuePref: 'Garden Pavilion', description: 'Elegant retirement banquet.', notes: [{ time: '2024-08-07 04:00 PM', text: 'Enquiry Received' }], timeAgo: '4 hours ago' },
      { id: 'ENQ-2024-005', customerName: 'Rahul Sharma', phone: '+91 98765 43210', email: 'rahul.sharma@gmail.com', source: 'WhatsApp', eventDate: '2024-10-24', pax: 300, budget: 250000, status: 'New', venuePref: 'Grand Ballroom', description: 'Elegant reception with customized catering.', notes: [{ time: '2024-08-05 10:00 AM', text: 'WhatsApp inquiry received' }], timeAgo: '1 day ago' },
      { id: 'ENQ-2024-006', customerName: 'Vikram Khanna', phone: '+91 91234 56789', email: 'vikram.khanna@yahoo.co.in', source: 'Direct Website', eventDate: '2024-10-29', pax: 180, budget: 180000, status: 'New', venuePref: 'Crystal Lounge', description: 'Pre-wedding cocktail party.', notes: [{ time: '2024-08-04 11:30 AM', text: 'Online application submitted' }], timeAgo: '2 days ago' },
    ];
    for (const enq of enquiries) {
      await Enquiry.findOneAndUpdate({ id: enq.id, tenantId: TENANT_ID }, { ...enq, tenantId: TENANT_ID }, { upsert: true });
      console.log(`   ✅ ${enq.id} — ${enq.customerName}`);
    }

    // 3. Seed bookings
    console.log('📦 Seeding bookings...');
    const bookings = [
      { id: 'BP-88021', customerName: 'Jonathan Sterling', phone: '+1 (555) 880-2100', eventDate: '2024-10-24', venue: 'Grand Ballroom', totalAmount: 12450, discountPercent: 10, discountAmount: 1245, finalAmount: 11205, amountReceived: 11205, pendingBalance: 0, status: 'Booked', paymentStatus: 'Fully Paid', menuSelection: ['Truffle Mushroom Bruschetta', 'Herb-Crusted Rack of Lamb'], eventType: 'Wedding Reception', timeSlot: 'Morning', startTime: '10:00' },
      { id: 'BP-88025', customerName: 'MegaCorp Inc.', phone: '+1 (555) 880-2500', eventDate: '2024-11-12', venue: 'Grand Ballroom', totalAmount: 45000, discountPercent: 5, discountAmount: 2250, finalAmount: 42750, amountReceived: 25000, pendingBalance: 17750, status: 'Booked', paymentStatus: 'Partially Paid', menuSelection: ['Herb-Crusted Rack of Lamb', 'Artisan Coffee Service'], eventType: 'Annual Summit', timeSlot: 'Morning', startTime: '09:00' },
      { id: 'BP-88028', customerName: 'Alice Waters', phone: '+1 (555) 880-2800', eventDate: '2024-10-18', venue: 'Emerald Lawns', totalAmount: 8900, discountPercent: 0, discountAmount: 0, finalAmount: 8900, amountReceived: 3000, pendingBalance: 5900, status: 'Booked', paymentStatus: 'Overdue', menuSelection: ['Seared Atlantic Scallops', 'Dark Chocolate Fondant'], eventType: 'Charity Gala', timeSlot: 'Evening', startTime: '19:00' },
      { id: 'BP-88031', customerName: 'Sarah Lofton', phone: '+1 (555) 880-3100', eventDate: '2024-12-05', venue: 'Crystal Lounge', totalAmount: 5200, discountPercent: 0, discountAmount: 0, finalAmount: 5200, amountReceived: 5200, pendingBalance: 0, status: 'Booked', paymentStatus: 'Fully Paid', menuSelection: ['Truffle Mushroom Bruschetta', 'Butternut Squash Risotto'], eventType: 'Product Launch', timeSlot: 'Evening', startTime: '18:00' },
      { id: 'BP-88032', customerName: 'Ananya Iyer', phone: '+91 94432 10987', eventDate: '2024-11-05', venue: 'Crystal Lounge', totalAmount: 450000, discountPercent: 0, discountAmount: 0, finalAmount: 450000, amountReceived: 300000, pendingBalance: 150000, status: 'Booked', paymentStatus: 'Partially Paid', menuSelection: ['Truffle Mushroom Bruschetta', 'Herb-Crusted Rack of Lamb'], eventType: 'Confirmed Wedding Event', timeSlot: 'Morning', startTime: '11:00' },
      { id: 'BP-88033', customerName: 'Mehul Choksi', phone: '+91 98876 54321', eventDate: '2024-11-12', venue: 'Grand Ballroom', totalAmount: 720000, discountPercent: 0, discountAmount: 0, finalAmount: 720000, amountReceived: 720000, pendingBalance: 0, status: 'Completed', paymentStatus: 'Fully Paid', menuSelection: ['Seared Atlantic Scallops', 'Miso-Glazed Sea Bass'], eventType: 'Corporate Gala Banquet', timeSlot: 'Evening', startTime: '19:30' },
    ];
    for (const bk of bookings) {
      await Booking.findOneAndUpdate({ id: bk.id, tenantId: TENANT_ID }, { ...bk, tenantId: TENANT_ID }, { upsert: true });
      console.log(`   ✅ ${bk.id} — ${bk.customerName}`);
    }

    // 4. Seed venue spaces
    console.log('📦 Seeding venue spaces...');
    const venues = [
      { id: 'SPACE-001', name: 'Grand Ballroom', capacityMin: 800, capacityMax: 1200, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5lHMmom6K6Dr9RBdFDzjZCczdRUw-WZwgnIEWgagaHLHY6KOi_os5D1xubz80OzOE8XNitam6X3mq35glfZmRWYY7-QdKSrlCFgR3u0159eTBU2jFDyFkliXTibeqIFgbY7fgs4LvJIvbSYY6AKS1syBaZwIjlysOUy-e7Lium9VsqwBbHhPw39s5yR_VSb2XhH-2dzAJ_L5dWzkknnC3JOd9OCjcGqG587mP9KvAQ60JqVrV6r_ZKA', status: 'Active', features: ['High ceilings', 'Grand chandeliers', 'Advanced AV rigging', 'Premium Acoustics'] },
      { id: 'SPACE-002', name: 'Emerald Lawns', capacityMin: 500, capacityMax: 2000, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbfkiH9Ryonj1scyASDPawkEs8TLRdWMbrX7Jno2x4GBXEE-HCTqGtYdFjtFG4fAa-zLDZxZ00tyio9TzySK1rWkrlYbPlstGFZsdiuzse086CZBgcPwAurnj067W4NvVe-l2Hl8M_3yQLWyH5Vl6zd7FMkHeYSi23h_T0P8GJnfwFGjnj33ygj20wIUIbF5irPrIDksF-9hIw6ShQzCimHPSzO9FZL361F8l1g6mJZ_V1kF68Iq3WSQ', status: 'Active', features: ['Manicured lawns', 'Fairy light integration', 'Sunset views', 'Paved dancing decks'] },
      { id: 'SPACE-003', name: 'Crystal Lounge', capacityMin: 150, capacityMax: 350, image: '', status: 'Active', features: ['Plush seating', 'Stunning glass walls', 'Signature central bar'] },
    ];
    for (const v of venues) {
      await VenueSpace.findOneAndUpdate({ id: v.id, tenantId: TENANT_ID }, { ...v, tenantId: TENANT_ID }, { upsert: true });
      console.log(`   ✅ ${v.id} — ${v.name}`);
    }

    // 5. Seed team members
    console.log('📦 Seeding team members...');
    const team = [
      { id: 'TEAM-001', name: 'Alex Rivera', email: 'alex.rivera@banquetpro.com', role: 'Admin', status: 'Online', lastActive: 'Just now', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_z3jZfhBZzvyiTOCthdJZCXPUTwi0MXEuwe_qVQcw1g9PfEfzPv3fsXKKvMPJ5J4gYfq5eHQiPi4xAp1QQEacuLoibg9QdoBql0Wtv0HeJFmNJHlKrRbthP-vNZS3eKSncH6e0HiWnW6v3keIER-AAQygcSMyKDL4LCASdZWQVlCPzRTRstTTdTp2JUzCgiNWiV4DOh-eF4F1SHTx-rrRJ9XxSZ3fjB25-Ta4isBGbF2cPgJcMDJrhg' },
      { id: 'TEAM-002', name: 'Jordan Miller', email: 'jordan@grandroyal.com', role: 'Manager', status: 'Offline', lastActive: '2h ago', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZBAEbRTytGtp5st7h7aI-6VTJHQs20OoQ9pHGdn-8wpz-oGHYJdkAd8HIP5YiMIQYGndejiGfFYwUbAeoowO-G8k2fmVEt8FobpDkMzV3wQxTohX4mzRRPhlm0utmmC5wtc6xbNPw2b__5VBnc4k-gtcJIrZl9wb1QpFBf4QJWJxIcXMqApb4WD7KWK4FSk37GM_HSXVaDsIEgrn_q7BR1WOfm6fwO4lYZwKmkUvrekb3L3v9Gqz_rQ' },
      { id: 'TEAM-003', name: 'Sarah Tan', email: 'sarah@grandroyal.com', role: 'Staff', status: 'Online', lastActive: '14m ago', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCc3cVsnSt9zilkyUgSKtjmj5UK5uKIRf3ILPxGoLMa74A_ObsrepXR4pOZOm8Wa9O5nbT3ER_IP4-Un3WzC3l9TvkltO2cMSwTBdDUlZFhE0aOUgozmHpQ9lBx0VJAj6-dgAvdCgqVnNxmsTT7R6SRhklo25NNgofAzmVZVkOdmeHo9kNyA1buTl3stNhrKmo1H50fGVdH6HJKJblhnfLd-IABi_lw3Q9jVZhqpE0VATf6bHENDL89RQ' },
    ];
    for (const m of team) {
      await TeamMember.findOneAndUpdate({ id: m.id, tenantId: TENANT_ID }, { ...m, tenantId: TENANT_ID }, { upsert: true });
      console.log(`   ✅ ${m.id} — ${m.name} (${m.role})`);
    }

    // 6. Seed settings
    console.log('📦 Seeding venue settings...');
    await Settings.findOneAndUpdate(
      { tenantId: TENANT_ID },
      {
        tenantId: TENANT_ID,
        name: 'Grand Royal Banquet Hall',
        email: 'ops@grandroyal.com',
        address: '12th Luxury Boulevard, Midtown Business District, NY 10001',
        logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBt_ZWAhHqrdHopiVZF8NocAQn_Z9Y-9RTOhqfBlRrJfEYleFAfAGxiIhdC5Ve_pA7hmB-9DQ3SVcPr0VHhAuh0YmiZZxoAMPvhsx5G34kwdp2caZnRW8rY0PDIT2Wcdk7-BidmA1PweRRALUZvkWXR_ptshS-n2XQh05uvOlzxnWPz622JGisjEX-bN3uNUndZS9A8mYo3sFr12j8xMBLqF9kTzGe0vErnoBjkImtD0nr4iMjlEClA2g',
        weekendSurge: true,
        peakSeason: true,
        baseDeposit: 5000,
      },
      { upsert: true }
    );
    console.log('   ✅ Settings for "Grand Royal Banquet Hall" ready');

    // 7. Seed catering items (sample subset)
    console.log('📦 Seeding catering items...');
    const cateringItems = [
      { id: 'CAT-WD-01', name: 'Water Bottle 250ml', category: 'WELCOME DRINKS', description: 'Chilled packaged drinking water 250ml.', price: 0, isAvailable: true, image: '' },
      { id: 'CAT-WD-02', name: 'Pan Shake', category: 'WELCOME DRINKS', description: 'Creamy refreshing betel-flavored sweet shake.', price: 0, isAvailable: true, isBestseller: true, image: '' },
      { id: 'CAT-ST-01', name: 'Paneer Malai Tikka', category: 'STARTERS', description: 'Succulent tandoor-grilled cottage cheese cubes.', price: 0, isAvailable: true, isBestseller: true, image: '' },
      { id: 'CAT-ST-02', name: 'Spring Roll', category: 'STARTERS', description: 'Crunchy golden rolls packed with vegetables.', price: 0, isAvailable: true, image: '' },
      { id: 'CAT-CS-04', name: 'Golgappe', category: 'CHAT STALL', description: 'Puffed puris served with interactive flavored waters.', price: 0, isAvailable: true, isBestseller: true, image: '' },
      { id: 'CAT-VMF-01', name: 'Lahori Kadai Paneer', category: 'VEGETABLE MUGHLAI FOOD LIVE', description: 'Cottage cheese cooked in Lahori wok spices.', price: 0, isAvailable: true, isBestseller: true, image: '' },
      { id: 'CAT-DC-01', name: 'Dal Makhni', category: 'DAL COUNTER', description: 'Decadent buttery slow-cooked black lentils.', price: 0, isAvailable: true, isBestseller: true, image: '' },
      { id: 'CAT-DD-04', name: 'Jalebi Rabri', category: 'DELIGHTFUL DESSERT', description: 'Live hot crisp jalebi paired with cold condensed milk.', price: 0, isAvailable: true, isBestseller: true, image: '' },
      { id: 'CAT-RC-01', name: 'Navrattan Pulao', category: 'RICE COUNTER', description: 'Aromatic basmati rice cooked with vegetables and nuts.', price: 0, isAvailable: true, image: '' },
      { id: 'CAT-IB-01', name: 'Naan - Plain, Butter, Garlic', category: 'INDIAN BREADS', description: 'Leavened clay-oven baked bread selection.', price: 0, isAvailable: true, image: '' },
    ];
    for (const item of cateringItems) {
      await CateringItem.findOneAndUpdate({ id: item.id, tenantId: TENANT_ID }, { ...item, tenantId: TENANT_ID }, { upsert: true });
    }
    console.log(`   ✅ ${cateringItems.length} catering items seeded`);

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
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedDatabase();
