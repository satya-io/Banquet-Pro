/**
 * Menu Seed Script — Comprehensive Catering Menu
 * Run: npx tsx server/seed-menu.ts
 */
import dotenv from 'dotenv';
dotenv.config();

import { connectDatabase } from './config/database.js';
import { CateringItem } from './models/CateringItem.js';
import mongoose from 'mongoose';

const TENANT_ID = 'TENANT-DEFAULT';

const menuData: Array<{ category: string; items: string[] }> = [
  {
    category: 'WELCOME DRINKS',
    items: [
      'Water Bottle 250ml',
      'Pan Shake',
      'Mango Shake',
      'Butter Scotch Shake',
      'Strawberry Shake',
      'Coconut Water',
      'Fruit Cocktail',
      'Jaljeera',
      'Pineapple Shake',
    ],
  },
  {
    category: 'LIVE MOCTAILS',
    items: [
      'Blue Lagoon',
      'Thai Mojito',
      'Lemon Soda',
    ],
  },
  {
    category: 'JUICES',
    items: [
      'Fresh Juice',
      'Water Melon Juice',
      'Grapes Juice',
      'Guava Juice',
    ],
  },
  {
    category: 'LIVE COFFEE EXPRESSO',
    items: [
      'Live Coffee Expresso',
    ],
  },
  {
    category: 'COLDDRINK / WATER BTLS 200ML',
    items: [
      'Coca Cola',
      'Limca',
      'Fanta',
    ],
  },
  {
    category: 'STARTERS',
    items: [
      'Paneer Malai Tikka',
      'Spring Roll',
      'Manchurian Dry',
      'Soya Achari Tikka',
      'Hara Bhara Kabab',
      'Honey Chilly Gobi',
      'Stuffed Tandoori Mushroom',
      'Cutlet',
      'Mushroom Tikka',
      'French Fry',
      'Dhai Kabab',
      'Mushroom Chilly',
    ],
  },
  {
    category: 'FRESH FRUIT',
    items: [
      'Sharda',
      'Kiwi (Imported)',
      'Australian Apple (Imported)',
      'Australian Grapes (Imported)',
      'Pineapple',
      'Papaya',
      'Water Melon',
      'Guava',
      'Dragon Fruit',
    ],
  },
  {
    category: 'CHAT STALL',
    items: [
      'Bhalla Papri',
      'Folding Chiila',
      'Boondi Chat',
      'Golgappe',
      'Rajbhog',
      'Aloo Tikki',
      'Moonglete',
      'Pav Bhaji',
      'Panpatta Chaat',
      'Mutter Kulcha',
      'Masala Dosa (Idli + Vada)',
    ],
  },
  {
    category: 'CHILDREN SPECIAL',
    items: [
      'Popcorn',
      'Sugar Candy',
      'Sweet Corn',
    ],
  },
  {
    category: 'SALAD-E-BAHAR',
    items: [
      'Garden Green Salad',
      'Cheese & Tomato Salad',
      'Kachumber Salad',
      'Channa Chat',
      'Beans Sprouted Salad',
      'Cheese Salad',
      'Sirka Onion (Mini Piece)',
      'Pasta Salad',
      'Assorted Achar & Papad',
    ],
  },
  {
    category: 'CURD BAR',
    items: [
      'Mix Veg Raita',
      'Pineapple Raita',
      'Boondi Raita',
    ],
  },
  {
    category: 'RICE COUNTER',
    items: [
      'Navrattan Pulao',
      'Corn Rice',
      'Jeera Rice',
    ],
  },
  {
    category: 'VEGETABLE MUGHLAI FOOD LIVE',
    items: [
      'Lahori Kadai Paneer',
      'Kashmiri Dum Aloo',
      'Palak Corn',
      'Cheese Butter Masala',
      'Mix Veg',
      'Matter Methi Malai',
      'Malai Kofta',
      'Mushroom Do Pyaza',
    ],
  },
  {
    category: 'PANJABI DESI RASOI',
    items: [
      'Kadhi Pakora with Rice',
      'Saag with Makki Roti',
      'Karele Masala',
      'Aloo Gobhi',
      'Aloo Methi',
      'Gajar Matar',
      'Rajma Raseela',
      'Bhindi Masala',
      'Baingan Bartha',
    ],
  },
  {
    category: 'AMRITSARI SPECIAL',
    items: [
      'Amritsari Chana',
      'Amritsari Kulcha',
      'Amritsari Dal',
      'Amritsari Chatni',
    ],
  },
  {
    category: 'DAL COUNTER',
    items: [
      'Dal Makhni',
      'Yellow Dal Tadka',
      'Tawa Chapatti',
    ],
  },
  {
    category: 'ORIENTAL CUISINE',
    items: [
      'Cheese Chilly',
      'Veg Manchurian',
      'Veg Hakka Noodles',
      'Fried Rice',
    ],
  },
  {
    category: 'INDIAN BREADS',
    items: [
      'Naan - Plain, Butter, Garlic',
      'Roti - Plain, Missi, Makki',
      'Parantha - Lacha, Pudina',
      'Methi Parantha',
      'Mirchi Parantha',
    ],
  },
  {
    category: 'DELIGHTFUL DESSERT',
    items: [
      'Hot Gulab Jamun',
      'Rasmalai',
      'Moong Kheer',
      'Jalebi Rabri',
      'Shahi Tukda',
      'Tila Kulfi',
      'Hot Kesar Milk',
    ],
  },
  {
    category: 'HALWA COUNTER',
    items: [
      'Moong Dal Halwa',
      'Lauki Halwa',
      'Gajar Ka Halwa',
    ],
  },
  {
    category: 'ICE CREAM COUNTER',
    items: [
      'Ice Cream Counter (Assorted)',
    ],
  },
  {
    category: 'DURING PHEREE',
    items: [
      'Coffee / Tea',
      'Water Bottles',
      'Kaju Katli',
      'Dry Fruit',
    ],
  },
  {
    category: 'WHISKEY SPECIAL',
    items: [
      'Water Bottles 1 Ltr',
      'Soda',
      'Ice Cubes',
      'Peanut Masala',
      'Chakana',
      'Dry Papad',
      'Masala Papad',
      'Corn Chaat',
      'Channa Chaat',
      'Live Snacks',
    ],
  },
];

const categoryPrefixMap: Record<string, string> = {
  'WELCOME DRINKS': 'WD',
  'LIVE MOCTAILS': 'LM',
  'JUICES': 'JU',
  'LIVE COFFEE EXPRESSO': 'LCE',
  'COLDDRINK / WATER BTLS 200ML': 'CD',
  'STARTERS': 'ST',
  'FRESH FRUIT': 'FF',
  'CHAT STALL': 'CS',
  'CHILDREN SPECIAL': 'CH',
  'SALAD-E-BAHAR': 'SB',
  'CURD BAR': 'CB',
  'RICE COUNTER': 'RC',
  'VEGETABLE MUGHLAI FOOD LIVE': 'VMF',
  'PANJABI DESI RASOI': 'PDR',
  'AMRITSARI SPECIAL': 'AM',
  'DAL COUNTER': 'DC',
  'ORIENTAL CUISINE': 'OC',
  'INDIAN BREADS': 'IB',
  'DELIGHTFUL DESSERT': 'DD',
  'HALWA COUNTER': 'HC',
  'ICE CREAM COUNTER': 'IC',
  'DURING PHEREE': 'DP',
  'WHISKEY SPECIAL': 'WS',
};

function generateId(category: string, index: number): string {
  const prefix = categoryPrefixMap[category] || 'XX';
  return `CAT-${prefix}-${String(index + 1).padStart(2, '0')}`;
}

async function seedMenu() {
  console.log('');
  console.log('🍽️  Banquet Pro — Full Catering Menu Seed');
  console.log('═══════════════════════════════════════════');

  try {
    await connectDatabase();

    // Clear existing menu items for this tenant
    const deleted = await CateringItem.deleteMany({ tenantId: TENANT_ID });
    console.log(`🗑️  Cleared ${deleted.deletedCount} existing menu items`);
    console.log('');

    let totalItems = 0;

    for (const { category, items } of menuData) {
      console.log(`📦 ${category} (${items.length} items)`);

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const id = generateId(category, i);

        await CateringItem.create({
          id,
          tenantId: TENANT_ID,
          name: item,
          category,
          description: item,
          price: 0,
          isAvailable: true,
          isBestseller: false,
          image: '',
        });

        console.log(`   ✅ ${id} — ${item}`);
        totalItems++;
      }
      console.log('');
    }

    console.log('═══════════════════════════════════════════');
    console.log(`✅ Total ${totalItems} items across ${menuData.length} categories seeded!`);
    console.log('');
  } catch (error) {
    console.error('❌ Menu seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedMenu();
