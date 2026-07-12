import React, { useState } from 'react';
import { X, User, Phone, Mail, Calendar, Users, DollarSign, MapPin, Sparkles, ChefHat, FileText, Copy, Check } from 'lucide-react';
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

  const handleMenuToggle = (itemName: string) => {
    setMenuSelection(prev => 
      prev.includes(itemName) 
        ? prev.filter(c => c !== itemName) 
        : [...prev, itemName]
    );
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#e3e1eb] pb-4">
          <div>
            <h3 className="font-sans font-bold text-xl text-[#1a1b22] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#00288e]" />
              <span>Register New Enquiry Lead</span>
            </h3>
            <p className="text-xs text-[#444653] font-semibold mt-1">Nurture event inquiries with automated price catalogs and templates.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-[#f4f2fc] rounded-full text-[#444653] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          {/* Customer Main profile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[#444653] uppercase tracking-wider block">Customer Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444653]/60" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g. Priya Sharma"
                  className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl pl-10 pr-3 py-2 text-sm text-[#1a1b22] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[#444653] uppercase tracking-wider block">WhatsApp / Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444653]/60" />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="E.g. +91 98765 43210"
                  className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl pl-10 pr-3 py-2 text-sm text-[#1a1b22] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[#444653] uppercase tracking-wider block font-semibold text-xs">Contact Email Address (Optional)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444653]/60" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E.g. priya@gmail.com"
                  className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl pl-10 pr-3 py-2 text-sm text-[#1a1b22] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[#444653] uppercase tracking-wider block font-semibold text-xs">Acquisition Lead Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl px-3 py-2 text-sm text-[#1a1b22] focus:outline-none"
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[#444653] uppercase tracking-wider block font-semibold text-xs">Event Target Date *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444653]/60" />
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl pl-10 pr-3 py-2 text-sm text-[#1a1b22] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[#444653] uppercase tracking-wider block font-semibold text-xs">Expected Guests (Pax) *</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444653]/60" />
                <input
                  type="number"
                  required
                  value={pax}
                  onChange={(e) => setPax(e.target.value)}
                  placeholder="E.g. 150"
                  className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl pl-10 pr-3 py-2 text-sm text-[#1a1b22] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[#444653] uppercase tracking-wider block font-semibold text-xs">Quote Price (USD/INR) *</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444653]/60" />
                <input
                  type="number"
                  required
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="E.g. 15000"
                  className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl pl-10 pr-3 py-2 text-sm text-[#1a1b22] focus:outline-none font-bold"
                />
              </div>
            </div>
          </div>

          {/* Venue preference selection */}
          <div className="space-y-1">
            <label className="text-[#444653] uppercase tracking-wider block font-semibold text-xs">Venue Space Preference</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444653]/60" />
              <select
                value={venuePref}
                onChange={(e) => setVenuePref(e.target.value)}
                className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl pl-10 pr-3 py-2 text-sm text-[#1a1b22] focus:outline-none"
              >
                {venueSpaces.map(sp => (
                  <option key={sp} value={sp}>{sp}</option>
                ))}
              </select>
            </div>
          </div>

          {/* New Interactive: Finalized Booking Toggle */}
          <div className="bg-[#f4f2fc]/50 p-4 rounded-2xl border border-[#dde1ff] space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-sm font-bold text-[#1a1b22] block">Is Booking Finalized & Confirmed?</span>
                <span className="text-xs text-[#444653] font-medium block">If yes, you can record the initial deposit/booking amount.</span>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#dde1ff] animate-fade-in">
                <div className="space-y-1">
                  <label className="text-[#444653] uppercase tracking-wider block font-semibold text-[10px]">Booking Amount Paid (Deposit)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444653]/60" />
                    <input
                      type="number"
                      value={bookingAmount}
                      onChange={(e) => setBookingAmount(e.target.value)}
                      placeholder="E.g. 5000"
                      className="w-full bg-white border border-[#c4c5d5] rounded-xl pl-10 pr-3 py-2 text-sm text-[#1a1b22] focus:outline-none font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[#444653] uppercase tracking-wider block font-semibold text-[10px]">Outstanding Pending Balance</label>
                  <div className="bg-white border border-[#c4c5d5] rounded-xl px-3 py-2 text-sm text-[#ba1a1a] font-extrabold flex items-center justify-between">
                    <span>Pending:</span>
                    <span>${Math.max(0, (parseFloat(budget) || 0) - (parseFloat(bookingAmount) || 0))}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Catering Menu Selection */}
          <div className="space-y-3 bg-[#f4f2fc]/40 p-4 rounded-xl border border-[#eeedf7]">
            <div className="flex justify-between items-center">
              <label className="text-[#444653] uppercase tracking-wider block font-semibold text-xs flex items-center gap-1">
                <ChefHat className="w-4 h-4 text-[#00288e]" />
                <span>Catering Menu Selection</span>
              </label>
              <span className="text-[10px] bg-[#dde1ff] text-[#00288e] px-2 py-0.5 rounded-full font-bold">
                {menuSelection.length} Selected
              </span>
            </div>

            <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1 bg-white p-3 rounded-xl border border-[#e3e1eb]">
              {Object.keys(categories).map((catName) => {
                const items = categories[catName];
                if (items.length === 0) return null;
                
                return (
                  <div key={catName} className="space-y-1.5">
                    <h4 className="text-[10px] text-[#444653] font-extrabold uppercase border-b pb-0.5 tracking-wider">
                      {catName}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {items.map((item) => {
                        const isChecked = menuSelection.includes(item.name);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleMenuToggle(item.name)}
                            className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${
                              isChecked 
                                ? 'border-[#00288e] bg-[#f4f2fc] text-[#1a1b22]' 
                                : 'border-[#eeedf7] hover:bg-[#fbf8ff] text-[#444653]'
                            }`}
                          >
                            <span className={`w-3.5 h-3.5 border rounded flex items-center justify-center shrink-0 ${
                              isChecked ? 'bg-[#00288e] border-[#00288e] text-white' : 'border-gray-300'
                            }`}>
                              {isChecked && '✓'}
                            </span>
                            <span className="text-xs font-bold truncate leading-tight">{item.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Description requirements */}
          <div className="space-y-1">
            <label className="text-[#444653] uppercase tracking-wider block font-semibold text-xs">Specific Client Requirements</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Multi-cuisine requirements, floral setups, AV requirements, live band requests..."
              className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl px-3 py-2 text-sm text-[#1a1b22] focus:outline-none"
            ></textarea>
          </div>

          {/* Terms & Conditions Section */}
          <div className="bg-[#fcf8e3] border border-[#fbeed5] rounded-2xl p-4 space-y-3.5">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-[#c09853] flex items-center gap-1.5 uppercase tracking-wide">
                <FileText className="w-4 h-4 text-[#c09853]" />
                <span>Terms & Conditions (नियम और शर्तें)</span>
              </span>
              <button
                type="button"
                onClick={handleCopyTerms}
                className="flex items-center gap-1.5 text-[10px] font-bold bg-white text-[#c09853] hover:bg-[#faf4d3] border border-[#fbeed5] rounded-xl px-2.5 py-1.5 cursor-pointer transition-all"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px] leading-relaxed text-[#8a6d3b] font-semibold">
              <div className="bg-white/80 p-3 rounded-xl border border-[#fbeed5]/60 space-y-1">
                <p className="font-bold text-[#c09853] border-b border-[#fbeed5] pb-0.5 uppercase tracking-wider">⏱ Program Timings</p>
                <p>• <strong>Chat Stall & Fruits:</strong> 8:00 PM to 11:30 PM</p>
                <p>• <strong>Dinner Buffet:</strong> 9:00 PM to 12:30 AM</p>
                <p className="text-[9px] italic mt-1 text-[#c09853]">चाट स्टॉल (रात 8 से 11:30) | डिनर (रात 9 से 12:30)</p>
              </div>

              <div className="bg-white/80 p-3 rounded-xl border border-[#fbeed5]/60 space-y-1">
                <p className="font-bold text-[#c09853] border-b border-[#fbeed5] pb-0.5 uppercase tracking-wider">💰 Payment Schedule</p>
                <p>• <strong>Advance:</strong> 50% required at booking time.</p>
                <p>• <strong>Balance:</strong> charged at end of programme.</p>
                <p className="text-[9px] italic mt-1 text-[#c09853]">50% बुकिंग के समय | शेष राशि कार्यक्रम के अंत में</p>
              </div>

              <div className="bg-white/80 p-3 rounded-xl border border-[#fbeed5]/60 col-span-1 sm:col-span-2 space-y-1">
                <p className="font-bold text-[#c09853] border-b border-[#fbeed5] pb-0.5 uppercase tracking-wider">⚠️ Extra Gathering & Plates Policy</p>
                <p>• No responsibility for extra gathering beyond agreed pax.</p>
                <p>• All extra plates must be logged and paid by host.</p>
                <p className="text-[9px] italic mt-1 text-[#c09853]">अतिरिक्त भीड़ की जिम्मेदारी नहीं | एक्स्ट्रा प्लेट का भुगतान मेजबान को करना होगा</p>
              </div>
            </div>

            <label className="flex items-center gap-2 pt-2 border-t border-[#fbeed5] cursor-pointer">
              <input
                type="checkbox"
                checked={termsAcknowledged}
                onChange={(e) => setTermsAcknowledged(e.target.checked)}
                className="rounded text-[#00288e] focus:ring-[#00288e] cursor-pointer"
              />
              <span className="text-[11px] text-[#8a6d3b] font-bold">
                I have informed the customer about program timings, 50% advance, and extra plate rules.
              </span>
            </label>
          </div>

          {/* Action Row Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#e3e1eb]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-white text-[#444653] rounded-xl hover:bg-[#f4f2fc] border border-[#c4c5d5] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#00288e] text-white rounded-xl hover:bg-[#1e40af] cursor-pointer font-bold"
            >
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
