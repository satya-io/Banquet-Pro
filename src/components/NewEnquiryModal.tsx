import React, { useState, useMemo } from 'react';
import { X, User, Phone, Mail, Calendar, Users, IndianRupee, MapPin, Sparkles, ChefHat, FileText, Copy, Check, ChevronDown, ChevronRight } from 'lucide-react';
import { Enquiry, CateringItem } from '../types';

interface NewEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEnquiry: (enquiry: Enquiry) => void;
  venueSpaces: string[];
  cateringItems: CateringItem[];
}

export default function NewEnquiryModal({
  isOpen,
  onClose,
  onAddEnquiry,
  venueSpaces,
  cateringItems
}: NewEnquiryModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [source, setSource] = useState('Direct Website');
  const [eventDate, setEventDate] = useState('');
  const [pax, setPax] = useState('');
  const [budget, setBudget] = useState('');
  const [venuePref, setVenuePref] = useState(venueSpaces[0] || 'Grand Ballroom');
  const [description, setDescription] = useState('');
  
  // New States
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingAmount, setBookingAmount] = useState('0');
  const [menuSelection, setMenuSelection] = useState<string[]>([]);
  const [copiedTerms, setCopiedTerms] = useState(false);
  const [termsAcknowledged, setTermsAcknowledged] = useState(false);
  const [collapsedCats, setCollapsedCats] = useState<Set<string>>(new Set());

  const handleCopyTerms = () => {
    const termsText = `BANQUET PRO - TERMS & CONDITIONS\n` +
      `1. TIMING FOR PROGRAMME:\n` +
      `   - Chat Stall & Fresh Fruit: 8:00 PM to 11:30 PM\n` +
      `   - Dinner: 9:00 PM to 12:30 AM\n` +
      `2. 50% ADVANCE PAYMENT: Required at the time of booking.\n` +
      `3. BALANCE PAYMENT: Will be charged at the end of the programme.\n` +
      `4. EXTRA GATHERING: No responsibility accepted for extra gatherings.\n` +
      `5. EXTRA PLATES: Extra plates must be paid by the host.\n` +
      `-------------------------------------------\n` +
      `नियम एवं शर्तें:\n` +
      `1. कार्यक्रम का समय:\n` +
      `   - चाट स्टॉल और ताजे फल: रात 8:00 बजे से 11:30 बजे तक\n` +
      `   - डिनर का समय: रात 9:00 बजे से 12:30 बजे तक\n` +
      `2. अग्रिम भुगतान: बुकिंग के समय 50% अग्रिम राशि अनिवार्य है।\n` +
      `3. शेष भुगतान: कार्यक्रम के अंत में लिया जाएगा।\n` +
      `4. अतिरिक्त भीड़/अतिथि: कोई जिम्मेदारी नहीं स्वीकार की जाएगी।\n` +
      `5. अतिरिक्त प्लेटें: मेजबान द्वारा भुगतान किया जाना होगा।`;

    navigator.clipboard.writeText(termsText).then(() => {
      setCopiedTerms(true);
      setTimeout(() => setCopiedTerms(false), 2000);
    });
  };

  if (!isOpen) return null;

  // Group catering items dynamically by category
  const categories: { [key: string]: CateringItem[] } = {};
  cateringItems.forEach(item => {
    if (item.isAvailable) {
      if (!categories[item.category]) {
        categories[item.category] = [];
      }
      categories[item.category].push(item);
    }
  });

  const sortedCategoryNames = Object.keys(categories).sort();

  const handleMenuToggle = (itemName: string) => {
    setMenuSelection(prev => 
      prev.includes(itemName) 
        ? prev.filter(c => c !== itemName) 
        : [...prev, itemName]
    );
  };

  const toggleCat = (cat: string) => {
    setCollapsedCats(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const selectAllInCategory = (catName: string) => {
    const items = categories[catName];
    const allSelected = items.every(item => menuSelection.includes(item.name));
    if (allSelected) {
      // Deselect all in this category
      setMenuSelection(prev => prev.filter(name => !items.some(i => i.name === name)));
    } else {
      // Select all in this category
      const newNames = items.map(i => i.name).filter(n => !menuSelection.includes(n));
      setMenuSelection(prev => [...prev, ...newNames]);
    }
  };

  // Category color palette
  const getCategoryColor = (index: number) => {
    const colors = [
      { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500', activeBg: 'bg-blue-100', activeBorder: 'border-blue-400' },
      { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500', activeBg: 'bg-emerald-100', activeBorder: 'border-emerald-400' },
      { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500', activeBg: 'bg-amber-100', activeBorder: 'border-amber-400' },
      { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500', activeBg: 'bg-purple-100', activeBorder: 'border-purple-400' },
      { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', badge: 'bg-rose-100 text-rose-700', dot: 'bg-rose-500', activeBg: 'bg-rose-100', activeBorder: 'border-rose-400' },
      { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', badge: 'bg-teal-100 text-teal-700', dot: 'bg-teal-500', activeBg: 'bg-teal-100', activeBorder: 'border-teal-400' },
      { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', badge: 'bg-indigo-100 text-indigo-700', dot: 'bg-indigo-500', activeBg: 'bg-indigo-100', activeBorder: 'border-indigo-400' },
      { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500', activeBg: 'bg-orange-100', activeBorder: 'border-orange-400' },
      { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', badge: 'bg-cyan-100 text-cyan-700', dot: 'bg-cyan-500', activeBg: 'bg-cyan-100', activeBorder: 'border-cyan-400' },
      { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700', badge: 'bg-pink-100 text-pink-700', dot: 'bg-pink-500', activeBg: 'bg-pink-100', activeBorder: 'border-pink-400' },
    ];
    return colors[index % colors.length];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !eventDate || !pax || !budget) {
      alert('Please fill out all required fields');
      return;
    }

    const priceVal = parseFloat(budget) || 0;
    const bookingVal = isConfirmed ? (parseFloat(bookingAmount) || 0) : 0;
    const balanceVal = Math.max(0, priceVal - bookingVal);

    const newEnq: Enquiry = {
      id: `ENQ-${Date.now().toString().slice(-4)}`,
      customerName: name,
      phone,
      email: email || '',
      source,
      eventDate,
      pax: parseInt(pax) || 100,
      budget: priceVal,
      status: isConfirmed ? 'Confirmed' : 'New',
      venuePref,
      description,
      bookingAmount: bookingVal,
      pendingBalance: balanceVal,
      menuSelection: menuSelection,
      notes: [
        {
          time: new Date().toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }),
          text: isConfirmed 
            ? `Enquiry registered directly as Confirmed event with ₹${bookingVal} booking deposit paid.`
            : `Enquiry Registered via ${source}`
        }
      ],
      timeAgo: 'Just now'
    };

    onAddEnquiry(newEnq);
    
    // reset
    setName('');
    phone && setPhone('');
    setEmail('');
    setSource('Direct Website');
    setEventDate('');
    setPax('');
    setBudget('');
    setDescription('');
    setIsConfirmed(false);
    setBookingAmount('0');
    setMenuSelection([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl p-4 sm:p-6 space-y-4 sm:space-y-6 shadow-2xl animate-scale-up max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#e3e1eb] pb-3 sm:pb-4 sticky top-0 bg-white z-10 -mx-4 sm:-mx-6 px-4 sm:px-6 pt-2">
          <div>
            <h3 className="font-sans font-bold text-lg sm:text-xl text-[#1a1b22] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#00288e]" />
              <span>Register New Enquiry Lead</span>
            </h3>
            <p className="text-xs text-[#444653] font-semibold mt-1 hidden sm:block">Nurture event inquiries with automated price catalogs and templates.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-[#f4f2fc] rounded-full text-[#444653] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          {/* Customer Main profile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1">
              <label className="text-[#444653] uppercase tracking-wider block text-[10px] sm:text-xs">Customer Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444653]/60" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g. Priya Sharma"
                  className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl pl-10 pr-3 py-2.5 sm:py-2 text-sm text-[#1a1b22] focus:outline-none focus:ring-2 focus:ring-[#00288e]/30"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[#444653] uppercase tracking-wider block text-[10px] sm:text-xs">WhatsApp / Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444653]/60" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="E.g. +91 98765 43210"
                  className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl pl-10 pr-3 py-2.5 sm:py-2 text-sm text-[#1a1b22] focus:outline-none focus:ring-2 focus:ring-[#00288e]/30"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1">
              <label className="text-[#444653] uppercase tracking-wider block text-[10px] sm:text-xs">Contact Email (Optional)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444653]/60" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E.g. priya@gmail.com"
                  className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl pl-10 pr-3 py-2.5 sm:py-2 text-sm text-[#1a1b22] focus:outline-none focus:ring-2 focus:ring-[#00288e]/30"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[#444653] uppercase tracking-wider block text-[10px] sm:text-xs">Acquisition Lead Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl px-3 py-2.5 sm:py-2 text-sm text-[#1a1b22] focus:outline-none focus:ring-2 focus:ring-[#00288e]/30"
              >
                <option value="Direct Website">Direct Website</option>
                <option value="WeddingWire">WeddingWire</option>
                <option value="Instagram Ad">Instagram Ad</option>
                <option value="Referral">Referral</option>
                <option value="WhatsApp">WhatsApp</option>
              </select>
            </div>
          </div>

          {/* Event details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="space-y-1">
              <label className="text-[#444653] uppercase tracking-wider block text-[10px] sm:text-xs">Event Date *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444653]/60" />
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl pl-10 pr-3 py-2.5 sm:py-2 text-sm text-[#1a1b22] focus:outline-none focus:ring-2 focus:ring-[#00288e]/30"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[#444653] uppercase tracking-wider block text-[10px] sm:text-xs">Expected Guests (Pax) *</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444653]/60" />
                <input
                  type="number"
                  required
                  value={pax}
                  onChange={(e) => setPax(e.target.value)}
                  placeholder="E.g. 150"
                  className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl pl-10 pr-3 py-2.5 sm:py-2 text-sm text-[#1a1b22] focus:outline-none focus:ring-2 focus:ring-[#00288e]/30"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[#444653] uppercase tracking-wider block text-[10px] sm:text-xs">Quote Price (₹) *</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444653]/60" />
                <input
                  type="number"
                  required
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="E.g. 15000"
                  className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl pl-10 pr-3 py-2.5 sm:py-2 text-sm text-[#1a1b22] focus:outline-none font-bold focus:ring-2 focus:ring-[#00288e]/30"
                />
              </div>
            </div>
          </div>

          {/* Venue preference selection */}
          <div className="space-y-1">
            <label className="text-[#444653] uppercase tracking-wider block text-[10px] sm:text-xs">Venue Space Preference</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444653]/60" />
              <select
                value={venuePref}
                onChange={(e) => setVenuePref(e.target.value)}
                className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl pl-10 pr-3 py-2.5 sm:py-2 text-sm text-[#1a1b22] focus:outline-none focus:ring-2 focus:ring-[#00288e]/30"
              >
                {venueSpaces.map(sp => (
                  <option key={sp} value={sp}>{sp}</option>
                ))}
              </select>
            </div>
          </div>

          {/* New Interactive: Finalized Booking Toggle */}
          <div className="bg-[#f4f2fc]/50 p-3 sm:p-4 rounded-2xl border border-[#dde1ff] space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-sm font-bold text-[#1a1b22] block">Is Booking Finalized & Confirmed?</span>
                <span className="text-xs text-[#444653] font-medium block hidden sm:block">If yes, you can record the initial deposit/booking amount.</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00288e]"></div>
              </label>
            </div>

            {isConfirmed && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2 border-t border-[#dde1ff] animate-fade-in">
                <div className="space-y-1">
                  <label className="text-[#444653] uppercase tracking-wider block font-semibold text-[10px]">Booking Amount Paid (Deposit)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444653]/60" />
                    <input
                      type="number"
                      value={bookingAmount}
                      onChange={(e) => setBookingAmount(e.target.value)}
                      placeholder="E.g. 5000"
                      className="w-full bg-white border border-[#c4c5d5] rounded-xl pl-10 pr-3 py-2.5 sm:py-2 text-sm text-[#1a1b22] focus:outline-none font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[#444653] uppercase tracking-wider block font-semibold text-[10px]">Outstanding Pending Balance</label>
                  <div className="bg-white border border-[#c4c5d5] rounded-xl px-3 py-2.5 sm:py-2 text-sm text-[#ba1a1a] font-extrabold flex items-center justify-between">
                    <span>Pending:</span>
                    <span>₹{Math.max(0, (parseFloat(budget) || 0) - (parseFloat(bookingAmount) || 0)).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ═══ Catering Menu Category Selection ═══ */}
          <div className="space-y-3 bg-[#f4f2fc]/40 p-3 sm:p-4 rounded-xl border border-[#eeedf7]">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <label className="text-[#444653] uppercase tracking-wider font-semibold text-xs flex items-center gap-1.5">
                <ChefHat className="w-4 h-4 text-[#00288e]" />
                <span>Catering Menu Selection</span>
              </label>
              <span className="text-xs bg-[#00288e] text-white px-3 py-1 rounded-full font-bold self-start sm:self-auto">
                {menuSelection.length} Items Selected
              </span>
            </div>

            {/* Category-wise scrollable selection */}
            <div className="max-h-[50vh] sm:max-h-[40vh] overflow-y-auto space-y-2 bg-white rounded-xl border border-[#e3e1eb] p-2 sm:p-3">
              {sortedCategoryNames.map((catName, catIndex) => {
                const items = categories[catName];
                const isCollapsed = collapsedCats.has(catName);
                const selectedInCat = items.filter(i => menuSelection.includes(i.name)).length;
                const allSelectedInCat = selectedInCat === items.length;
                const colors = getCategoryColor(catIndex);

                return (
                  <div key={catName} className={`rounded-lg border ${colors.border} overflow-hidden`}>
                    {/* Category Header */}
                    <div className={`flex items-center justify-between px-3 py-2.5 ${colors.bg} cursor-pointer`}>
                      <button
                        type="button"
                        onClick={() => toggleCat(catName)}
                        className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer"
                      >
                        {isCollapsed ? (
                          <ChevronRight className={`w-4 h-4 flex-shrink-0 ${colors.text}`} />
                        ) : (
                          <ChevronDown className={`w-4 h-4 flex-shrink-0 ${colors.text}`} />
                        )}
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${colors.dot}`}></div>
                        <h4 className={`text-xs sm:text-sm font-bold uppercase tracking-wide ${colors.text} truncate`}>
                          {catName}
                        </h4>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${colors.badge}`}>
                          {items.length}
                        </span>
                      </button>

                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        {selectedInCat > 0 && (
                          <span className="text-[10px] font-bold text-[#00288e] bg-[#dde1ff] px-1.5 py-0.5 rounded-full">
                            {selectedInCat} ✓
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => selectAllInCategory(catName)}
                          className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                            allSelectedInCat
                              ? 'bg-[#00288e] text-white border-[#00288e]'
                              : 'bg-white text-[#444653] border-[#c4c5d5] hover:border-[#00288e] hover:text-[#00288e]'
                          }`}
                        >
                          {allSelectedInCat ? 'Deselect All' : 'Select All'}
                        </button>
                      </div>
                    </div>

                    {/* Items Grid */}
                    {!isCollapsed && (
                      <div className="p-2 sm:p-2.5">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 sm:gap-2">
                          {items.map((item) => {
                            const isChecked = menuSelection.includes(item.name);
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => handleMenuToggle(item.name)}
                                className={`flex items-center gap-2 px-2.5 py-2 sm:py-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                                  isChecked 
                                    ? 'border-[#00288e] bg-[#eeedf7] text-[#1a1b22] shadow-sm' 
                                    : 'border-[#eeedf7] hover:bg-[#f8f8fc] text-[#444653] hover:border-[#c4c5d5]'
                                }`}
                              >
                                <span className={`w-4 h-4 border-2 rounded flex items-center justify-center shrink-0 text-[10px] ${
                                  isChecked ? 'bg-[#00288e] border-[#00288e] text-white' : 'border-gray-300'
                                }`}>
                                  {isChecked && '✓'}
                                </span>
                                <span className="text-xs font-semibold truncate leading-tight">{item.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Description requirements */}
          <div className="space-y-1">
            <label className="text-[#444653] uppercase tracking-wider block text-[10px] sm:text-xs font-semibold">Specific Client Requirements</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Multi-cuisine requirements, floral setups, AV requirements, live band requests..."
              className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl px-3 py-2.5 sm:py-2 text-sm text-[#1a1b22] focus:outline-none focus:ring-2 focus:ring-[#00288e]/30"
            ></textarea>
          </div>

          {/* Terms & Conditions Section */}
          <div className="bg-[#fcf8e3] border border-[#fbeed5] rounded-2xl p-3 sm:p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <span className="text-sm font-bold text-[#c09853] flex items-center gap-1.5 uppercase tracking-wide">
                <FileText className="w-4 h-4 text-[#c09853]" />
                <span>Terms & Conditions (नियम और शर्तें)</span>
              </span>
              <button
                type="button"
                onClick={handleCopyTerms}
                className="flex items-center gap-1.5 text-[10px] font-bold bg-white text-[#c09853] hover:bg-[#faf4d3] border border-[#fbeed5] rounded-xl px-2.5 py-1.5 cursor-pointer transition-all self-start sm:self-auto"
              >
                {copiedTerms ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy to WhatsApp</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-[10px] leading-relaxed text-[#8a6d3b] font-semibold">
              <div className="bg-white/80 p-2.5 sm:p-3 rounded-xl border border-[#fbeed5]/60 space-y-1">
                <p className="font-bold text-[#c09853] border-b border-[#fbeed5] pb-0.5 uppercase tracking-wider">⏱ Program Timings</p>
                <p>• <strong>Chat Stall & Fruits:</strong> 8:00 PM to 11:30 PM</p>
                <p>• <strong>Dinner Buffet:</strong> 9:00 PM to 12:30 AM</p>
                <p className="text-[9px] italic mt-1 text-[#c09853]">चाट स्टॉल (रात 8 से 11:30) | डिनर (रात 9 से 12:30)</p>
              </div>

              <div className="bg-white/80 p-2.5 sm:p-3 rounded-xl border border-[#fbeed5]/60 space-y-1">
                <p className="font-bold text-[#c09853] border-b border-[#fbeed5] pb-0.5 uppercase tracking-wider">💰 Payment Schedule</p>
                <p>• <strong>Advance:</strong> 50% required at booking time.</p>
                <p>• <strong>Balance:</strong> charged at end of programme.</p>
                <p className="text-[9px] italic mt-1 text-[#c09853]">50% बुकिंग के समय | शेष राशि कार्यक्रम के अंत में</p>
              </div>

              <div className="bg-white/80 p-2.5 sm:p-3 rounded-xl border border-[#fbeed5]/60 col-span-1 sm:col-span-2 space-y-1">
                <p className="font-bold text-[#c09853] border-b border-[#fbeed5] pb-0.5 uppercase tracking-wider">⚠️ Extra Gathering & Plates Policy</p>
                <p>• No responsibility for extra gathering beyond agreed pax.</p>
                <p>• All extra plates must be logged and paid by host.</p>
                <p className="text-[9px] italic mt-1 text-[#c09853]">अतिरिक्त भीड़ की जिम्मेदारी नहीं | एक्स्ट्रा प्लेट का भुगतान मेजबान को करना होगा</p>
              </div>
            </div>

            <label className="flex items-start sm:items-center gap-2 pt-2 border-t border-[#fbeed5] cursor-pointer">
              <input
                type="checkbox"
                checked={termsAcknowledged}
                onChange={(e) => setTermsAcknowledged(e.target.checked)}
                className="rounded text-[#00288e] focus:ring-[#00288e] cursor-pointer mt-0.5 sm:mt-0"
              />
              <span className="text-[11px] text-[#8a6d3b] font-bold">
                I have informed the customer about program timings, 50% advance, and extra plate rules.
              </span>
            </label>
          </div>

          {/* Action Row Buttons — sticky on mobile */}
          <div className="flex justify-end gap-3 pt-3 sm:pt-4 border-t border-[#e3e1eb] sticky bottom-0 bg-white pb-2 -mx-4 sm:-mx-6 px-4 sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 sm:px-5 py-2.5 bg-white text-[#444653] rounded-xl hover:bg-[#f4f2fc] border border-[#c4c5d5] cursor-pointer text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 sm:px-5 py-2.5 bg-[#00288e] text-white rounded-xl hover:bg-[#1e40af] cursor-pointer font-bold text-sm flex-1 sm:flex-none"
            >
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
