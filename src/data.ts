import { Booking, Enquiry, CateringItem, VenueSpace, TeamMember, VenueSettings } from './types';

export const initialEnquiries: Enquiry[] = [
  {
    id: 'ENQ-2024-001',
    customerName: 'Sarah Miller',
    phone: '+1 (555) 012-3456',
    email: 'sarah.miller@weddingwire.com',
    source: 'WeddingWire',
    eventDate: '2024-10-24',
    pax: 150,
    budget: 12500,
    status: 'New',
    venuePref: 'Grand Ballroom',
    description: 'Looking for a premium wedding package with elegant table setups, customized multi-course catering, and premium audio-visual support.',
    notes: [
      { time: '2024-08-12 10:45 AM', text: 'Enquiry Received via WeddingWire' },
      { time: '2024-08-12 10:46 AM', text: 'Automated Brochure Sent to sarah.miller@weddingwire.com' }
    ],
    timeAgo: '2 min ago'
  },
  {
    id: 'ENQ-2024-002',
    customerName: 'James K. (TechCorp)',
    phone: '+1 (555) 234-5678',
    email: 'james.k@techcorp.com',
    source: 'Direct Website',
    eventDate: '2024-12-12',
    pax: 80,
    budget: 5200,
    status: 'Negotiating',
    venuePref: 'Executive Lounge',
    description: 'Quarterly general assembly seminar requiring custom catering, wireless microphones, high-definition projection, and quick high-speed internet.',
    notes: [
      { time: '2024-08-10 09:15 AM', text: 'Enquiry Received from online form' },
      { time: '2024-08-11 02:30 PM', text: 'Initial phone call complete - James requested custom AV quote' }
    ],
    timeAgo: '15 min ago'
  },
  {
    id: 'ENQ-2024-003',
    customerName: 'Anita Henderson',
    phone: '+1 (555) 987-6543',
    email: 'anita.h@gmail.com',
    source: 'Instagram Ad',
    eventDate: '2024-11-05',
    pax: 200,
    budget: 18900,
    status: 'Contacted',
    venuePref: 'Crystal Lounge',
    description: 'Luxury anniversary gala dinner with themed decor, elegant floral arrangements, custom cocktails, and dynamic live band setups.',
    notes: [
      { time: '2024-08-08 11:15 AM', text: 'Enquiry Received via Social Channels' },
      { time: '2024-08-09 10:00 AM', text: 'Brochure and price list shared via WhatsApp' }
    ],
    timeAgo: '1 hour ago'
  },
  {
    id: 'ENQ-2024-004',
    customerName: 'Robert White',
    phone: '+1 (555) 345-6789',
    email: 'r.white@gmail.com',
    source: 'Referral',
    eventDate: '2025-01-15',
    pax: 120,
    budget: 9000,
    status: 'New',
    venuePref: 'Garden Pavilion',
    description: 'Elegant retirement banquet. Requested outdoor cocktail reception space and an indoor fallback venue in case of unexpected rain.',
    notes: [
      { time: '2024-08-07 04:00 PM', text: 'Enquiry Received' }
    ],
    timeAgo: '4 hours ago'
  },
  {
    id: 'ENQ-2024-005',
    customerName: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'rahul.sharma@gmail.com',
    source: 'WhatsApp',
    eventDate: '2024-10-24',
    pax: 300,
    budget: 250000,
    status: 'New',
    venuePref: 'Grand Ballroom',
    description: 'Elegant reception with customized Indian and Continental catering menus, floral backdrops, and heavy stage lighting.',
    notes: [
      { time: '2024-08-05 10:00 AM', text: 'WhatsApp inquiry received' }
    ],
    timeAgo: '1 day ago'
  },
  {
    id: 'ENQ-2024-006',
    customerName: 'Vikram Khanna',
    phone: '+91 91234 56789',
    email: 'vikram.khanna@yahoo.co.in',
    source: 'Direct Website',
    eventDate: '2024-10-29',
    pax: 180,
    budget: 180000,
    status: 'New',
    venuePref: 'Crystal Lounge',
    description: 'Pre-wedding cocktail party with premium beverage selections, DJ booths, and customized snack counters.',
    notes: [
      { time: '2024-08-04 11:30 AM', text: 'Online application submitted' }
    ],
    timeAgo: '2 days ago'
  }
];

export const initialBookings: Booking[] = [
  {
    id: 'BP-88021',
    customerName: 'Jonathan Sterling',
    phone: '+1 (555) 880-2100',
    eventDate: '2024-10-24',
    venue: 'Grand Ballroom',
    totalAmount: 12450.00,
    discountPercent: 10,
    discountAmount: 1245.00,
    finalAmount: 11205.00,
    amountReceived: 11205.00,
    pendingBalance: 0.00,
    status: 'Booked',
    paymentStatus: 'Fully Paid',
    menuSelection: ['Truffle Mushroom Bruschetta', 'Herb-Crusted Rack of Lamb', 'Dark Chocolate Fondant', 'Signature Welcome Cocktail'],
    eventType: 'Wedding Reception',
    timeSlot: 'Morning',
    startTime: '10:00'
  },
  {
    id: 'BP-88025',
    customerName: 'MegaCorp Inc.',
    phone: '+1 (555) 880-2500',
    eventDate: '2024-11-12',
    venue: 'Grand Ballroom',
    totalAmount: 45000.00,
    discountPercent: 5,
    discountAmount: 2250.00,
    finalAmount: 42750.00,
    amountReceived: 25000.00,
    pendingBalance: 17750.00,
    status: 'Booked',
    paymentStatus: 'Partially Paid',
    menuSelection: ['Herb-Crusted Rack of Lamb', 'Miso-Glazed Sea Bass', 'Artisan Coffee Service'],
    eventType: 'Annual Summit',
    timeSlot: 'Morning',
    startTime: '09:00'
  },
  {
    id: 'BP-88028',
    customerName: 'Alice Waters',
    phone: '+1 (555) 880-2800',
    eventDate: '2024-10-18',
    venue: 'Emerald Lawns',
    totalAmount: 8900.00,
    discountPercent: 0,
    discountAmount: 0.00,
    finalAmount: 8900.00,
    amountReceived: 3000.00,
    pendingBalance: 5900.00,
    status: 'Booked',
    paymentStatus: 'Overdue',
    menuSelection: ['Seared Atlantic Scallops', 'Dark Chocolate Fondant', 'Signature Welcome Cocktail'],
    eventType: 'Charity Gala',
    timeSlot: 'Evening',
    startTime: '19:00'
  },
  {
    id: 'BP-88031',
    customerName: 'Sarah Lofton',
    phone: '+1 (555) 880-3100',
    eventDate: '2024-12-05',
    venue: 'Crystal Lounge',
    totalAmount: 5200.00,
    discountPercent: 0,
    discountAmount: 0.00,
    finalAmount: 5200.00,
    amountReceived: 5200.00,
    pendingBalance: 0.00,
    status: 'Booked',
    paymentStatus: 'Fully Paid',
    menuSelection: ['Truffle Mushroom Bruschetta', 'Butternut Squash Risotto', 'Artisan Coffee Service'],
    eventType: 'Product Launch',
    timeSlot: 'Evening',
    startTime: '18:00'
  },
  {
    id: 'BP-88032',
    customerName: 'Ananya Iyer',
    phone: '+91 94432 10987',
    eventDate: '2024-11-05',
    venue: 'Crystal Lounge',
    totalAmount: 450000,
    discountPercent: 0,
    discountAmount: 0,
    finalAmount: 450000,
    amountReceived: 300000,
    pendingBalance: 150000,
    status: 'Booked',
    paymentStatus: 'Partially Paid',
    menuSelection: ['Truffle Mushroom Bruschetta', 'Herb-Crusted Rack of Lamb', 'Dark Chocolate Fondant', 'Signature Welcome Cocktail', 'Artisan Coffee Service'],
    eventType: 'Confirmed Wedding Event',
    timeSlot: 'Morning',
    startTime: '11:00'
  },
  {
    id: 'BP-88033',
    customerName: 'Mehul Choksi',
    phone: '+91 98876 54321',
    eventDate: '2024-11-12',
    venue: 'Grand Ballroom',
    totalAmount: 720000,
    discountPercent: 0,
    discountAmount: 0,
    finalAmount: 720000,
    amountReceived: 720000,
    pendingBalance: 0,
    status: 'Completed',
    paymentStatus: 'Fully Paid',
    menuSelection: ['Seared Atlantic Scallops', 'Miso-Glazed Sea Bass', 'Madagascar Vanilla Crème Brûlée', 'Signature Welcome Cocktail'],
    eventType: 'Corporate Gala Banquet',
    timeSlot: 'Evening',
    startTime: '19:30'
  },
  {
    id: 'BP-88034',
    customerName: 'Sarah Johnson',
    phone: '+1 (234) 567-8901',
    eventDate: '2023-10-24',
    venue: 'Grand Ballroom',
    totalAmount: 4500.00,
    discountPercent: 0,
    discountAmount: 0.00,
    finalAmount: 4500.00,
    amountReceived: 1500.00,
    pendingBalance: 3000.00,
    status: 'Booked',
    paymentStatus: 'Partially Paid',
    menuSelection: ['Truffle Mushroom Bruschetta', 'Butternut Squash Risotto', 'Dark Chocolate Fondant'],
    eventType: 'Private Birthday',
    timeSlot: 'Evening',
    startTime: '18:30'
  },
  {
    id: 'BP-88035',
    customerName: 'Michael Chen',
    phone: '+1 (987) 654-3210',
    eventDate: '2023-11-12',
    venue: 'Emerald Lawns',
    totalAmount: 2800.00,
    discountPercent: 0,
    discountAmount: 0.00,
    finalAmount: 2800.00,
    amountReceived: 2800.00,
    pendingBalance: 0.00,
    status: 'Open Enquiry',
    paymentStatus: 'Fully Paid',
    menuSelection: ['Truffle Mushroom Bruschetta', 'Signature Welcome Cocktail'],
    eventType: 'Outdoor Cocktail',
    timeSlot: 'Morning',
    startTime: '11:30'
  }
];

export const initialCateringItems: CateringItem[] = [
  // --- WELCOME DRINKS ---
  { id: 'CAT-WD-01', name: 'Water Bottle 250ml', category: 'WELCOME DRINKS', description: 'Chilled packaged drinking water 250ml.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-WD-02', name: 'Pan Shake', category: 'WELCOME DRINKS', description: 'Creamy refreshing betel-flavored sweet shake.', price: 0, isAvailable: true, isBestseller: true, image: '' },
  { id: 'CAT-WD-03', name: 'Mango Shake', category: 'WELCOME DRINKS', description: 'Thick rich shake prepared with premium mangoes.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-WD-04', name: 'Butter Scotch Shake', category: 'WELCOME DRINKS', description: 'Sweet buttery caramel-infused milkshake.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-WD-05', name: 'Strawberry Shake', category: 'WELCOME DRINKS', description: 'Fruity strawberry milkshake.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-WD-06', name: 'Coconut Water', category: 'WELCOME DRINKS', description: 'Freshly opened natural coconut water.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-WD-07', name: 'Fruit Cocktail', category: 'WELCOME DRINKS', description: 'Chilled mixed fresh fruits juice beverage.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-WD-08', name: 'Jaljeera', category: 'WELCOME DRINKS', description: 'Spicy, tangy herbal cooling drink.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-WD-09', name: 'Pineapple Shake', category: 'WELCOME DRINKS', description: 'Creamy shake with sweet pineapple bits.', price: 0, isAvailable: true, image: '' },

  // --- LIVE MOCTAILS ---
  { id: 'CAT-LM-01', name: 'Blue Lagoon', category: 'LIVE MOCTAILS', description: 'Vibrant blue citrus mocktail with carbonated twist.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-LM-02', name: 'Thai Mojito', category: 'LIVE MOCTAILS', description: 'Zesty lime and mint mocktail with dynamic Thai herbs.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-LM-03', name: 'Lemon Soda', category: 'LIVE MOCTAILS', description: 'Chilled bubbly soda with lime and rock salt.', price: 0, isAvailable: true, image: '' },

  // --- JUICES ---
  { id: 'CAT-JC-01', name: 'Fresh Juice', category: 'JUICES', description: 'Seasonal fresh fruit juice selection.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-JC-02', name: 'Water Melon Juice', category: 'JUICES', description: 'Sweet and light chilled watermelon extract.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-JC-03', name: 'Grapes Juice', category: 'JUICES', description: 'Tangy and sweet fresh grape juice.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-JC-04', name: 'Guava Juice', category: 'JUICES', description: 'Rich guava nectar spiced with pinch of salt.', price: 0, isAvailable: true, image: '' },

  // --- LIVE COFFEE EXPRESSO ---
  { id: 'CAT-LCE-01', name: 'Live Coffee Espresso', category: 'LIVE COFFEE EXPRESSO', description: 'Premium freshly brewed espresso, cappuccino and lattes.', price: 0, isAvailable: true, isBestseller: true, image: '' },

  // --- COLDDRINK/WATER BTLS 200ml ---
  { id: 'CAT-CD-01', name: 'Coca Cola', category: 'COLDDRINK/WATER BTLS 200ml', description: 'Carbonated cola soft drink.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-CD-02', name: 'Limca', category: 'COLDDRINK/WATER BTLS 200ml', description: 'Chilled tangy lemon soda soft drink.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-CD-03', name: 'Fanta', category: 'COLDDRINK/WATER BTLS 200ml', description: 'Sweet carbonated orange soft drink.', price: 0, isAvailable: true, image: '' },

  // --- STARTERS ---
  { id: 'CAT-ST-01', name: 'Paneer Malai Tikka', category: 'STARTERS', description: 'Succulent tandoor-grilled cottage cheese cubes.', price: 0, isAvailable: true, isBestseller: true, image: '' },
  { id: 'CAT-ST-02', name: 'Spring Roll', category: 'STARTERS', description: 'Crunchy golden rolls packed with vegetables.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-ST-03', name: 'Manchurian Dry', category: 'STARTERS', description: 'Indo-Chinese style dry seasoned vegetable balls.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-ST-04', name: 'Soya Achari Tikka', category: 'STARTERS', description: 'Soya chunks marinated in pickling spices and tandoor baked.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-ST-05', name: 'Hara Bhara Kabab', category: 'STARTERS', description: 'Delicate patties of spinach, peas and potatoes.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-ST-06', name: 'Honey Chilly Gobi', category: 'STARTERS', description: 'Crispy cauliflower tossed in sweet chili sauce.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-ST-07', name: 'Stuffed Tandoori Mushroom', category: 'STARTERS', description: 'Clay-oven baked mushrooms with cheese filling.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-ST-08', name: 'Cutlet', category: 'STARTERS', description: 'Crispy pan-fried vegetable patties.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-ST-09', name: 'Mushroom Tikka', category: 'STARTERS', description: 'Marinated button mushrooms roasted in clay oven.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-ST-10', name: 'French Fries', category: 'STARTERS', description: 'Golden salted French potato fries.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-ST-11', name: 'Dahi Kabab', category: 'STARTERS', description: 'Creamy hung yogurt patties fried to perfection.', price: 0, isAvailable: true, isBestseller: true, image: '' },
  { id: 'CAT-ST-12', name: 'Mushroom Chilly', category: 'STARTERS', description: 'Spicy chili-tossed wok mushrooms.', price: 0, isAvailable: true, image: '' },

  // --- FRESH FRUIT ---
  { id: 'CAT-FF-01', name: 'Sharda', category: 'FRESH FRUIT', description: 'Slices of sweet local sharda melon.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-FF-02', name: 'Kiwi (imp)', category: 'FRESH FRUIT', description: 'Sweet exotic imported green kiwi.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-FF-03', name: 'Australian Apple (imp)', category: 'FRESH FRUIT', description: 'Imported crispy sweet red apples.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-FF-04', name: 'Australian Grapes (imp)', category: 'FRESH FRUIT', description: 'Seedless crisp red/green imported grapes.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-FF-05', name: 'Pineapple', category: 'FRESH FRUIT', description: 'Sweet and tangy fresh pineapple slices.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-FF-06', name: 'Kiwi', category: 'FRESH FRUIT', description: 'Fresh sliced tangy kiwi.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-FF-07', name: 'Papaya', category: 'FRESH FRUIT', description: 'Sweet ripe golden papaya cubes.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-FF-08', name: 'Watermelon', category: 'FRESH FRUIT', description: 'Refreshing juicy sweet watermelon cubes.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-FF-09', name: 'Guava', category: 'FRESH FRUIT', description: 'Fresh guava sprinkled with light chat masala.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-FF-10', name: 'Dragon Fruit', category: 'FRESH FRUIT', description: 'Exotic sliced dragon fruit.', price: 0, isAvailable: true, image: '' },

  // --- CHAT STALL ---
  { id: 'CAT-CS-01', name: 'Bhalla Papri', category: 'CHAT STALL', description: 'Soft lentil dumplings and crispy papri with yogurt & chutneys.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-CS-02', name: 'Folding Chilla', category: 'CHAT STALL', description: 'Live soft moong dal crepes with paneer stuffing.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-CS-03', name: 'Boondi Chat', category: 'CHAT STALL', description: 'Light seasoned chickpea flour boondi chaat.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-CS-04', name: 'Golgappe', category: 'CHAT STALL', description: 'Puffed puris served with interactive flavored waters.', price: 0, isAvailable: true, isBestseller: true, image: '' },
  { id: 'CAT-CS-05', name: 'Rajbhog', category: 'CHAT STALL', description: 'Traditional premium sweet kachori style chaat.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-CS-06', name: 'Aloo Tikki', category: 'CHAT STALL', description: 'Golden crisp pan-fried potato patties served live.', price: 0, isAvailable: true, isBestseller: true, image: '' },
  { id: 'CAT-CS-07', name: 'Moonglete', category: 'CHAT STALL', description: 'Fluffy butter-cooked vegetarian yellow lentil omelette.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-CS-08', name: 'Pav Bhaji', category: 'CHAT STALL', description: 'Spiced vegetable mash served hot with buttered buns.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-CS-09', name: 'Panpatta Chaat', category: 'CHAT STALL', description: 'Crispy batter-fried spinach leaves with rich yogurt.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-CS-10', name: 'Mutter Kulcha', category: 'CHAT STALL', description: 'Seasoned yellow peas served with yeast-leavened bread.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-CS-11', name: 'Masala Dosa (idli+vada)', category: 'CHAT STALL', description: 'Live south Indian counter serving crispy dosa, idlis & vadas.', price: 0, isAvailable: true, image: '' },

  // --- CHILDREN SPL ---
  { id: 'CAT-CHD-01', name: 'Popcorn', category: 'CHILDREN SPL', description: 'Butter salted freshly popped corn.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-CHD-02', name: 'Sugar Candy', category: 'CHILDREN SPL', description: 'Sweet colorful cotton candy cloud.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-CHD-03', name: 'Sweet Corn', category: 'CHILDREN SPL', description: 'Warm buttered sweet corn kernels with chat masala.', price: 0, isAvailable: true, image: '' },

  // --- SALAD-E-BAHAR ---
  { id: 'CAT-SB-01', name: 'GARDEN GREEN SALAD', category: 'SALAD-E-BAHAR', description: 'Crisp assorted fresh seasonal vegetables.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-SB-02', name: 'CHEESE & TOMATO SALAD', category: 'SALAD-E-BAHAR', description: 'Fresh tomatoes paired with premium cubes of paneer.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-SB-03', name: 'KACHUMBER SALAD', category: 'SALAD-E-BAHAR', description: 'Finely chopped onion, tomato and cucumber tossed with lemon.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-SB-04', name: 'CHANNA CHAT', category: 'SALAD-E-BAHAR', description: 'Spiced boiled chickpea salad with coriander and lime.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-SB-05', name: 'BEANS SPROUTED SALAD', category: 'SALAD-E-BAHAR', description: 'High protein fresh sprouted beans tossed with herbs.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-SB-06', name: 'CHEESE SALAD', category: 'SALAD-E-BAHAR', description: 'Assorted salad tossed with rich cheese dressings.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-SB-07', name: 'SIRKA ONION (MINI PEACE)', category: 'SALAD-E-BAHAR', description: 'Tangy red baby vinegar onions.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-SB-08', name: 'PASTA SALAD', category: 'SALAD-E-BAHAR', description: 'Chilled herb pasta tossed with garden vegetables.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-SB-09', name: 'DIFFERENT TYPES OF ASSORTED ACHAR & PAPAD', category: 'SALAD-E-BAHAR', description: 'Traditional pickles, roasted & fried papads.', price: 0, isAvailable: true, image: '' },

  // --- CURD BAR ---
  { id: 'CAT-CB-01', name: 'Mix Veg Raita', category: 'CURD BAR', description: 'Churned yogurt with finely chopped cucumber, onion and tomato.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-CB-02', name: 'Pineapple Raita', category: 'CURD BAR', description: 'Sweet and creamy yogurt with pineapple cubes.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-CB-03', name: 'Boondi Raita', category: 'CURD BAR', description: 'Classic spiced yogurt with crispy chickpea flour drops.', price: 0, isAvailable: true, image: '' },

  // --- RICE COUNTER ---
  { id: 'CAT-RC-01', name: 'Navrattan Pulao', category: 'RICE COUNTER', description: 'Aromatic basmati rice cooked with vegetables and nuts.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-RC-02', name: 'Corn Rice', category: 'RICE COUNTER', description: 'Basmati rice cooked with sweet corn kernels.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-RC-03', name: 'Jeera Rice', category: 'RICE COUNTER', description: 'Perfectly cooked basmati rice with tempered cumin seeds.', price: 0, isAvailable: true, image: '' },

  // --- VEGETABLE MUGHLAI FOOD LIVE ---
  { id: 'CAT-VMF-01', name: 'Lahori Kadai Paneer', category: 'VEGETABLE MUGHLAI FOOD LIVE', description: 'Cottage cheese cooked in Lahori wok spices.', price: 0, isAvailable: true, isBestseller: true, image: '' },
  { id: 'CAT-VMF-02', name: 'Kashmiri Dum Aloo', category: 'VEGETABLE MUGHLAI FOOD LIVE', description: 'Slow-cooked spiced baby potatoes.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-VMF-03', name: 'Palak Corn', category: 'VEGETABLE MUGHLAI FOOD LIVE', description: 'Creamy spinach puree cooked with sweet corn.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-VMF-04', name: 'Cheese Butter Masala', category: 'VEGETABLE MUGHLAI FOOD LIVE', description: 'Paneer cubes in rich sweet buttery tomato gravy.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-VMF-05', name: 'Mix Veg', category: 'VEGETABLE MUGHLAI FOOD LIVE', description: 'Seasonal mixed vegetables in North Indian spices.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-VMF-06', name: 'Methi Malai Mutter', category: 'VEGETABLE MUGHLAI FOOD LIVE', description: 'Sweet peas in fresh cream and fenugreek leaves gravy.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-VMF-07', name: 'Malai Kofta', category: 'VEGETABLE MUGHLAI FOOD LIVE', description: 'Melt-in-mouth vegetable paneer dumplings in white gravy.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-VMF-08', name: 'Mushroom Do Pyaza', category: 'VEGETABLE MUGHLAI FOOD LIVE', description: 'Button mushrooms cooked with caramelized onion cubes.', price: 0, isAvailable: true, image: '' },

  // --- PANJABI DESI RASOI ---
  { id: 'CAT-PDR-01', name: 'Kadhi Pakora with Rice', category: 'PANJABI DESI RASOI', description: 'Spiced tangy yogurt gram-flour curry with fried fritters.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-PDR-02', name: 'Saag with Makki Roti', category: 'PANJABI DESI RASOI', description: 'Winter special mustard leaves greens with yellow corn bread.', price: 0, isAvailable: true, isBestseller: true, image: '' },
  { id: 'CAT-PDR-03', name: 'Karele Masala', category: 'PANJABI DESI RASOI', description: 'Pan-fried bitter gourd with heavy spiced onions.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-PDR-04', name: 'Aloo Gobhi', category: 'PANJABI DESI RASOI', description: 'Dry cauliflower and potato preparation.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-PDR-05', name: 'Aloo Methi', category: 'PANJABI DESI RASOI', description: 'Dry potatoes tossed with fresh bitter fenugreek leaves.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-PDR-06', name: 'Gajjar Mater', category: 'PANJABI DESI RASOI', description: 'Fresh carrots and sweet peas sautéed together.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-PDR-07', name: 'Rajma Raseela', category: 'PANJABI DESI RASOI', description: 'Red kidney beans slow cooked in rich tomato gravy.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-PDR-08', name: 'Bhindi Masala', category: 'PANJABI DESI RASOI', description: 'Crisp fried ladies finger cooked in onions.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-PDR-09', name: 'Baingan Bhartha', category: 'PANJABI DESI RASOI', description: 'Roasted eggplant mashed and cooked with garlic, onions and tomatoes.', price: 0, isAvailable: true, image: '' },

  // --- AMRITSARI SPL.. ---
  { id: 'CAT-AS-01', name: 'Amritsari Chana', category: 'AMRITSARI SPL..', description: 'Rich dark spicy chickpeas.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-AS-02', name: 'Amritsari Kulcha', category: 'AMRITSARI SPL..', description: 'Butter-crusted potato-stuffed flatbread cooked in tandoor.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-AS-03', name: 'Amritsari Dal', category: 'AMRITSARI SPL..', description: 'Specially tempered yellow/black lentils.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-AS-04', name: 'Amritsari Chatni', category: 'AMRITSARI SPL..', description: 'Tangy tamarind and onion chutney.', price: 0, isAvailable: true, image: '' },

  // --- DAL COUNTER ---
  { id: 'CAT-DC-01', name: 'Dal Makhni', category: 'DAL COUNTER', description: 'Decadent buttery slow-cooked black lentils.', price: 0, isAvailable: true, isBestseller: true, image: '' },
  { id: 'CAT-DC-02', name: 'Yellow Dal Tadka', category: 'DAL COUNTER', description: 'Lentils tempered with cumin, garlic and dry red chilies.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-DC-03', name: 'Tawa Chapatti', category: 'DAL COUNTER', description: 'Hot flatbread cooked on iron griddle.', price: 0, isAvailable: true, image: '' },

  // --- ORIENTAL CUISINE ---
  { id: 'CAT-OC-01', name: 'Cheese Chilly', category: 'ORIENTAL CUISINE', description: 'Wok tossed paneer with bell peppers and onion in spicy soy sauce.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-OC-02', name: 'Veg Manchurian', category: 'ORIENTAL CUISINE', description: 'Deep fried vegetable balls in hot tangy soy garlic sauce.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-OC-03', name: 'Veg Hakka Noodles', category: 'ORIENTAL CUISINE', description: 'Indo-Chinese stir-fried vegetable noodles.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-OC-04', name: 'Fried Rice', category: 'ORIENTAL CUISINE', description: 'Classic stir-fried vegetable rice.', price: 0, isAvailable: true, image: '' },

  // --- INDIAN BREADS ---
  { id: 'CAT-IB-01', name: 'Naan - Plain, Butter, Garlic', category: 'INDIAN BREADS', description: 'Leavened clay-oven baked bread selection.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-IB-02', name: 'Roti - Plain, Missi, Makki', category: 'INDIAN BREADS', description: 'Whole-wheat, gram-flour and corn flatbreads.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-IB-03', name: 'Prantha - Lacha, Pudina, Methi, Mirchi', category: 'INDIAN BREADS', description: 'Layered flaky spiced and mint-topped breads.', price: 0, isAvailable: true, image: '' },

  // --- DELIGHTFUL DESSERT ---
  { id: 'CAT-DD-01', name: 'Hot Gulab Jamun', category: 'DELIGHTFUL DESSERT', description: 'Soft warm syrup-soaked milk balls.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-DD-02', name: 'Rasmalai', category: 'DELIGHTFUL DESSERT', description: 'Chilled flattened sweet chenna discs in sweet saffron milk.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-DD-03', name: 'Moon Kheer', category: 'DELIGHTFUL DESSERT', description: 'Slow cooked sweet milk-rice dessert.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-DD-04', name: 'Jalebi Rabri', category: 'DELIGHTFUL DESSERT', description: 'Live hot crisp jalebi paired with cold condensed milk.', price: 0, isAvailable: true, isBestseller: true, image: '' },
  { id: 'CAT-DD-05', name: 'Shahi Tukda', category: 'DELIGHTFUL DESSERT', description: 'Royal ghee fried bread soaked in milk syrup.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-DD-06', name: 'Tila Kulfi', category: 'DELIGHTFUL DESSERT', description: 'Creamy stick kulfi.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-DD-07', name: 'Hot Kaser Milk', category: 'DELIGHTFUL DESSERT', description: 'Boiled saffron, pistachio milk reduced live.', price: 0, isAvailable: true, image: '' },

  // --- HALWA COUNTER ---
  { id: 'CAT-HC-01', name: 'Moong Dal Halwa', category: 'HALWA COUNTER', description: 'Desi ghee split-green-gram sweet pudding.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-HC-02', name: 'Lokhi Halwa', category: 'HALWA COUNTER', description: 'Sweet bottle gourd halwa.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-HC-03', name: 'Gajar Ka Halwa', category: 'HALWA COUNTER', description: 'Red winter carrots slow reduced with ghee and khoya.', price: 0, isAvailable: true, image: '' },

  // --- ICE CREAM COUNTER ---
  { id: 'CAT-IC-01', name: 'Assorted Ice Cream', category: 'ICE CREAM COUNTER', description: 'Premium selection of ice creams in dynamic flavors.', price: 0, isAvailable: true, image: '' },

  // --- DURING PHEREE ---
  { id: 'CAT-DP-01', name: 'Coffee / Tea', category: 'DURING PHEREE', description: 'Hot live beverage service.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-DP-02', name: 'Water Bottles', category: 'DURING PHEREE', description: 'Chilled packaged mineral water bottles.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-DP-03', name: 'Kaju Katli', category: 'DURING PHEREE', description: 'Premium cashew nut fudge sweets.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-DP-04', name: 'Dry Fruit', category: 'DURING PHEREE', description: 'Assorted roasted almonds, cashew nuts and pistachios.', price: 0, isAvailable: true, image: '' },

  // --- WHISKEY SPL. ---
  { id: 'CAT-WS-01', name: 'Water Bottles 1L', category: 'WHISKEY SPL.', description: 'Premium 1 Litre drinking water bottles.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-WS-02', name: 'Soda', category: 'WHISKEY SPL.', description: 'Chilled sparkling soda cans/bottles.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-WS-03', name: 'Ice Cube', category: 'WHISKEY SPL.', description: 'Fresh, hygiene ice supply.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-WS-04', name: 'Peanut Masala', category: 'WHISKEY SPL.', description: 'Roasted spicy peanut mix.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-WS-05', name: 'Chakana', category: 'WHISKEY SPL.', description: 'Mixed dynamic Indian cocktail snacks.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-WS-06', name: 'Dry Papad', category: 'WHISKEY SPL.', description: 'Crisp roasted thin papadums.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-WS-07', name: 'Masala Papad', category: 'WHISKEY SPL.', description: 'Crisp papad topped with spicy salad mix.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-WS-08', name: 'Corn Chaat', category: 'WHISKEY SPL.', description: 'Steamed spicy butter corn chaat.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-WS-09', name: 'Channa Chaat', category: 'WHISKEY SPL.', description: 'Spicy black or white gram salad.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-WS-10', name: 'Peanut Masala (Spicy)', category: 'WHISKEY SPL.', description: 'Extremely spicy tossed red onion peanut snack.', price: 0, isAvailable: true, image: '' },
  { id: 'CAT-WS-11', name: 'Live Snacks', category: 'WHISKEY SPL.', description: 'Assorted live cocktail hot appetizers.', price: 0, isAvailable: true, image: '' }
];

export const initialVenueSpaces: VenueSpace[] = [
  {
    id: 'SPACE-001',
    name: 'Grand Ballroom',
    capacityMin: 800,
    capacityMax: 1200,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5lHMmom6K6Dr9RBdFDzjZCczdRUw-WZwgnIEWgagaHLHY6KOi_os5D1xubz80OzOE8XNitam6X3mq35glfZmRWYY7-QdKSrlCFgR3u0159eTBU2jFDyFkliXTibeqIFgbY7fgs4LvJIvbSYY6AKS1syBaZwIjlysOUy-e7Lium9VsqwBbHhPw39s5yR_VSb2XhH-2dzAJ_L5dWzkknnC3JOd9OCjcGqG587mP9KvAQ60JqVrV6r_ZKA',
    status: 'Active',
    features: ['High ceilings', 'Grand chandeliers', 'Advanced AV rigging', 'Premium Acoustics']
  },
  {
    id: 'SPACE-002',
    name: 'Emerald Lawns',
    capacityMin: 500,
    capacityMax: 2000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbfkiH9Ryonj1scyASDPawkEs8TLRdWMbrX7Jno2x4GBXEE-HCTqGtYdFjtFG4fAa-zLDZxZ00tyio9TzySK1rWkrlYbPlstGFZsdiuzse086CZBgcPwAurnj067W4NvVe-l2Hl8M_3yQLWyH5Vl6zd7FMkHeYSi23h_T0P8GJnfwFGjnj33ygj20wIUIbF5irPrIDksF-9hIw6ShQzCimHPSzO9FZL361F8l1g6mJZ_V1kF68Iq3WSQ',
    status: 'Active',
    features: ['Manicured lawns', 'Fairy light integration', 'Sunset views', 'Paved dancing decks']
  },
  {
    id: 'SPACE-003',
    name: 'Crystal Lounge',
    capacityMin: 150,
    capacityMax: 350,
    image: '',
    status: 'Active',
    features: ['Plush seating', 'Stunning glass walls', 'Signature central bar']
  }
];

export const initialTeamMembers: TeamMember[] = [
  {
    id: 'TEAM-001',
    name: 'Alex Rivera',
    email: 'alex.rivera@banquetpro.com',
    role: 'Admin',
    status: 'Online',
    lastActive: 'Just now',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_z3jZfhBZzvyiTOCthdJZCXPUTwi0MXEuwe_qVQcw1g9PfEfzPv3fsXKKvMPJ5J4gYfq5eHQiPi4xAp1QQEacuLoibg9QdoBql0Wtv0HeJFmNJHlKrRbthP-vNZS3eKSncH6e0HiWnW6v3keIER-AAQygcSMyKDL4LCASdZWQVlCPzRTRstTTdTp2JUzCgiNWiV4DOh-eF4F1SHTx-rrRJ9XxSZ3fjB25-Ta4isBGbF2cPgJcMDJrhg'
  },
  {
    id: 'TEAM-002',
    name: 'Jordan Miller',
    email: 'jordan@grandroyal.com',
    role: 'Manager',
    status: 'Offline',
    lastActive: '2h ago',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZBAEbRTytGtp5st7h7aI-6VTJHQs20OoQ9pHGdn-8wpz-oGHYJdkAd8HIP5YiMIQYGndejiGfFYwUbAeoowO-G8k2fmVEt8FobpDkMzV3wQxTohX4mzRRPhlm0utmmC5wtc6xbNPw2b__5VBnc4k-gtcJIrZl9wb1QpFBf4QJWJxIcXMqApb4WD7KWK4FSk37GM_HSXVaDsIEgrn_q7BR1WOfm6fwO4lYZwKmkUvrekb3L3v9Gqz_rQ'
  },
  {
    id: 'TEAM-003',
    name: 'Sarah Tan',
    email: 'sarah@grandroyal.com',
    role: 'Staff',
    status: 'Online',
    lastActive: '14m ago',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCc3cVsnSt9zilkyUgSKtjmj5UK5uKIRf3ILPxGoLMa74A_ObsrepXR4pOZOm8Wa9O5nbT3ER_IP4-Un3WzC3l9TvkltO2cMSwTBdDUlZFhE0aOUgozmHpQ9lBx0VJAj6-dgAvdCgqVnNxmsTT7R6SRhklo25NNgofAzmVZVkOdmeHo9kNyA1buTl3stNhrKmo1H50fGVdH6HJKJblhnfLd-IABi_lw3Q9jVZhqpE0VATf6bHENDL89RQ'
  }
];

export const initialVenueSettings: VenueSettings = {
  name: 'Luxury Banquet Workspace',
  email: 'ops@luxurybanquet.com',
  address: '12th Luxury Boulevard, Midtown Business District, NY 10001',
  logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBt_ZWAhHqrdHopiVZF8NocAQn_Z9Y-9RTOhqfBlRrJfEYleFAfAGxiIhdC5Ve_pA7hmB-9DQ3SVcPr0VHhAuh0YmiZZxoAMPvhsx5G34kwdp2caZnRW8rY0PDIT2Wcdk7-BidmA1PweRRALUZvkWXR_ptshS-n2XQh05uvOlzxnWPz622JGisjEX-bN3uNUndZS9A8mYo3sFr12j8xMBLqF9kTzGe0vErnoBjkImtD0nr4iMjlEClA2g',
  weekendSurge: true,
  peakSeason: true,
  baseDeposit: 5000
};
