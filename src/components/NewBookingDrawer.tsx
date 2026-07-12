import React, { useState, useEffect } from 'react';
import { 
  X, User, Phone, Calendar, MapPin, IndianRupee, Receipt, Sparkles, 
  Clock, Utensils, CheckCircle2, AlertTriangle, Info, CheckSquare, Square,
  FileText, Copy, Check
} from 'lucide-react';
import { Booking, Enquiry, CateringItem } from '../types';
import { Language } from '../translations';

interface NewBookingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBooking: (booking: Booking) => void;
  venueSpaces: string[];
  bookings: Booking[];
  cateringItems: CateringItem[];
  prefillEnquiry?: Enquiry | null;
  role?: 'admin' | 'sales_agent';
  language: Language;
}

export default function NewBookingDrawer({
  isOpen,
  onClose,
  onAddBooking,
  venueSpaces,
  bookings,
  cateringItems,
  prefillEnquiry,
  role = 'admin',
  language
}: NewBookingDrawerProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [venue, setVenue] = useState(venueSpaces[0] || 'Grand Ballroom');
  const [eventType, setEventType] = useState('Wedding Reception');
  
  // Time Slot & Start Time
  const [timeSlot, setTimeSlot] = useState<'Morning' | 'Evening'>('Morning');
  const [startTime, setStartTime] = useState('10:00');

  // Catering Items selection state
  const [selectedCateringItems, setSelectedCateringItems] = useState<string[]>([]);

  // Financial inputs
  const [totalAmount, setTotalAmount] = useState('');
  const [discountPercent, setDiscountPercent] = useState('0');
  const [amountReceived, setAmountReceived] = useState('0');

  // Conflict state
  const [conflictError, setConflictError] = useState('');

  // Terms & Conditions state
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

  // Auto-sync start time when slot changes
  useEffect(() => {
    if (timeSlot === 'Morning') {
      setStartTime('10:00');
    } else {
      setStartTime('18:00');
    }
  }, [timeSlot]);

  // Check for conflicts in real time as values change
  useEffect(() => {
    if (!eventDate || !venue || !timeSlot) {
      setConflictError('');
      return;
    }

    const hasConflict = bookings.some(b => 
      b.status !== 'Cancelled' && 
      b.eventDate === eventDate && 
      b.venue === venue && 
      b.timeSlot === timeSlot
    );

    if (hasConflict) {
      if (language === 'hi') {
        setConflictError(
          `बुकिंग टकराव: ${venue} पहले से ही ${eventDate} को ${timeSlot === 'Morning' ? 'सुबह' : 'शाम'} के स्लॉट में बुक है।`
        );
      } else {
        setConflictError(
          `Booking Conflict: "${venue}" is already booked for the ${timeSlot} slot on ${eventDate}.`
        );
      }
    } else {
      setConflictError('');
    }
  }, [eventDate, venue, timeSlot, bookings, language]);

  // Prefill hook
  useEffect(() => {
    if (isOpen) {
      if (prefillEnquiry) {
        setName(prefillEnquiry.customerName);
        setPhone(prefillEnquiry.phone);
        setEventDate(prefillEnquiry.eventDate);
        setVenue(prefillEnquiry.venuePref || venueSpaces[0]);
        setTotalAmount(String(prefillEnquiry.budget));
        setDiscountPercent('0');
        setAmountReceived('0');
        if (prefillEnquiry.menuSelection && prefillEnquiry.menuSelection.length > 0) {
          setSelectedCateringItems(prefillEnquiry.menuSelection);
        } else {
          // Default select some bestsellers
          const bestsellers = cateringItems.filter(item => item.isBestseller).map(item => item.name);
          setSelectedCateringItems(bestsellers.length > 0 ? bestsellers : cateringItems.slice(0, 4).map(item => item.name));
        }
      } else {
        setName('');
        setPhone('');
        // Default to a date or empty
        setEventDate('');
        setVenue(venueSpaces[0] || 'Grand Ballroom');
        setTotalAmount('');
        setDiscountPercent('0');
        setAmountReceived('0');
        // Default select first few catering items
        setSelectedCateringItems(cateringItems.slice(0, 4).map(item => item.name));
      }
    }
  }, [isOpen, prefillEnquiry, venueSpaces, cateringItems]);

  // Calculated values state
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [pendingBalance, setPendingBalance] = useState(0);

  // Recalculate billing values in real time on change
  useEffect(() => {
    const total = parseFloat(totalAmount) || 0;
    const discPct = parseFloat(discountPercent) || 0;
    const received = parseFloat(amountReceived) || 0;

    const discAmt = parseFloat(((total * discPct) / 100).toFixed(2));
    const finalAmt = parseFloat((total - discAmt).toFixed(2));
    const balance = parseFloat((finalAmt - received).toFixed(2));

    setDiscountAmount(discAmt);
    setFinalAmount(finalAmt);
    setPendingBalance(balance >= 0 ? balance : 0);
  }, [totalAmount, discountPercent, amountReceived]);

  if (!isOpen) return null;

  const handleToggleCateringItem = (itemName: string) => {
    setSelectedCateringItems(prev => 
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isSales = role === 'sales_agent';
    
    if (!name.trim() || !phone.trim() || !eventDate || (!isSales && !totalAmount)) {
      alert(language === 'hi' ? 'कृपया सभी आवश्यक फ़ील्ड भरें' : 'Please fill out all required fields');
      return;
    }

    if (conflictError) {
      alert(language === 'hi' ? 'बुकिंग टकराव: कृपया कोई अन्य तारीख, वेन्यू या समय स्लॉट चुनें।' : 'Booking Conflict: Please resolve the scheduling conflict before booking.');
      return;
    }

    const total = isSales ? 0 : parseFloat(totalAmount) || 0;
    const received = isSales ? 0 : parseFloat(amountReceived) || 0;
    const discPct = isSales ? 0 : parseFloat(discountPercent) || 0;
    const discAmt = isSales ? 0 : discountAmount;
    const finalAmt = isSales ? 0 : finalAmount;
    const balance = isSales ? 0 : pendingBalance;

    const newBooking: Booking = {
      id: `BP-${Math.floor(10000 + Math.random() * 90000)}`,
      customerName: name,
      phone,
      eventDate,
      venue,
      totalAmount: total,
      discountPercent: discPct,
      discountAmount: discAmt,
      finalAmount: finalAmt,
      amountReceived: received,
      pendingBalance: balance,
      status: 'Booked',
      paymentStatus: isSales ? 'Fully Paid' : (balance === 0 ? 'Fully Paid' : received > 0 ? 'Partially Paid' : 'Overdue'),
      menuSelection: selectedCateringItems.length > 0 ? selectedCateringItems : ['Standard Setup Menu'],
      eventType,
      timeSlot,
      startTime
    };

    onAddBooking(newBooking);

    // Reset fields
    setName('');
    phone && setPhone('');
    setEventDate('');
    setTotalAmount('');
    setDiscountPercent('0');
    setAmountReceived('0');
    setSelectedCateringItems([]);
    onClose();
  };

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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-end z-50 p-0">
      {/* Sliding Panel */}
      <div className="bg-white w-full max-w-xl h-full p-6 space-y-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-in-right">
        <div>
          {/* Header */}
          <div className="flex justify-between items-center border-b border-[#e3e1eb] pb-4 mb-6">
            <div>
              <h3 className="font-sans font-bold text-xl text-[#1a1b22] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#00288e]" />
                <span>{role === 'sales_agent' ? (language === 'hi' ? 'बुकिंग अनुरोध जमा करें' : 'Submit Booking Request') : (language === 'hi' ? 'नया बुकिंग अनुबंध जारी करें' : 'Issue Booking Contract')}</span>
              </h3>
              <p className="text-xs text-[#444653] font-semibold mt-1">
                {role === 'sales_agent' 
                  ? (language === 'hi' ? 'एक नया वेन्यू बुकिंग अनुरोध दर्ज करें।' : 'Register a new booking reservation space under tentative status.')
                  : (language === 'hi' ? 'नियम तय करें और प्रारंभिक चालान रसीदें जेनरेट करें।' : 'Generate dynamic agreement terms and initial invoice receipts.')
                }
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-[#f4f2fc] rounded-full text-[#444653] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form fields */}
          <form id="new_booking_form" onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
            
            {/* Real-time Conflict Alert Box */}
            {conflictError && (
              <div className="bg-[#ffdad6] text-[#ba1a1a] p-3.5 rounded-xl border border-[#ffdad6] flex items-start gap-2.5 animate-pulse">
                <AlertTriangle className="w-5 h-5 shrink-0 text-[#ba1a1a] mt-0.5" />
                <div>
                  <p className="font-bold text-xs">{language === 'hi' ? 'शेड्यूलिंग संघर्ष!' : 'Scheduling Conflict!'}</p>
                  <p className="text-[10px] font-semibold mt-0.5 leading-relaxed">{conflictError}</p>
                </div>
              </div>
            )}

            {/* Customer Section */}
            <div className="space-y-3 bg-[#f4f2fc]/40 p-4 rounded-xl border border-[#eeedf7]">
              <p className="text-[10px] uppercase font-bold tracking-wider text-[#00288e]">
                {language === 'hi' ? 'ग्राहक प्रोफ़ाइल' : 'Client Profile'}
              </p>
              
              <div className="space-y-1">
                <label className="text-[#444653] block">{language === 'hi' ? 'ग्राहक का पूरा नाम *' : 'Client Full Name *'}</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444653]/60" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g. Priya Sharma"
                    className="w-full bg-white border border-[#c4c5d5] rounded-xl pl-10 pr-3 py-2 text-sm text-[#1a1b22] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#444653] block">{language === 'hi' ? 'व्हाट्सएप / फोन नंबर *' : 'WhatsApp / Phone Number *'}</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444653]/60" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="E.g. +91 98765 43210"
                    className="w-full bg-white border border-[#c4c5d5] rounded-xl pl-10 pr-3 py-2 text-sm text-[#1a1b22] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Event Specification Section */}
            <div className="space-y-3 bg-[#f4f2fc]/40 p-4 rounded-xl border border-[#eeedf7]">
              <p className="text-[10px] uppercase font-bold tracking-wider text-[#00288e]">
                {language === 'hi' ? 'इवेंट विवरण' : 'Event Details'}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#444653] block">{language === 'hi' ? 'इवेंट की तारीख *' : 'Event Target Date *'}</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444653]/60" />
                    <input
                      type="date"
                      required
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full bg-white border border-[#c4c5d5] rounded-xl pl-10 pr-3 py-2 text-sm text-[#1a1b22] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[#444653] block">{language === 'hi' ? 'वेन्यू स्पेस आवंटन' : 'Venue Allocation Space'}</label>
                  <select
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full bg-white border border-[#c4c5d5] rounded-xl px-2.5 py-2.5 text-sm text-[#1a1b22] focus:outline-none"
                  >
                    {venueSpaces.map(sp => (
                      <option key={sp} value={sp}>{sp}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Time Slot & Specific Start Time Picker */}
              <div className="grid grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-[#eeedf7]">
                <div className="space-y-1">
                  <label className="text-[#444653] block flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#00288e]" />
                    <span>{language === 'hi' ? 'समय स्लॉट' : 'Time Slot'}</span>
                  </label>
                  <div className="flex bg-[#f4f2fc] p-1 rounded-xl border border-[#e3e1eb] w-full">
                    <button
                      type="button"
                      onClick={() => setTimeSlot('Morning')}
                      className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                        timeSlot === 'Morning' 
                          ? 'bg-[#00288e] text-white shadow-sm' 
                          : 'text-[#444653] hover:text-[#1a1b22]'
                      }`}
                    >
                      {language === 'hi' ? 'सुबह (Morning)' : 'Morning'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTimeSlot('Evening')}
                      className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                        timeSlot === 'Evening' 
                          ? 'bg-[#00288e] text-white shadow-sm' 
                          : 'text-[#444653] hover:text-[#1a1b22]'
                      }`}
                    >
                      {language === 'hi' ? 'शाम (Evening)' : 'Evening'}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[#444653] block">{language === 'hi' ? 'इवेंट शुरू होने का समय *' : 'Event Start Time *'}</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-white border border-[#c4c5d5] rounded-xl px-2.5 py-2 text-sm text-[#1a1b22] focus:outline-none"
                  />
                  <span className="text-[9px] text-[#444653]/80 italic font-semibold">
                    {timeSlot === 'Morning' 
                      ? (language === 'hi' ? 'सुबह के कार्यक्रम आम तौर पर सुबह 10 बजे से' : 'Morning events usually start at 10:00 AM')
                      : (language === 'hi' ? 'शाम के कार्यक्रम आम तौर पर शाम 6 बजे से' : 'Evening events usually start at 6:00 PM')
                    }
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#444653] block">{language === 'hi' ? 'इवेंट थीम / प्रकार' : 'Event Theme Style'}</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full bg-white border border-[#c4c5d5] rounded-xl px-2.5 py-2 text-sm text-[#1a1b22] focus:outline-none"
                >
                  <option value="Wedding Reception">Wedding Reception</option>
                  <option value="Anniversary Gala">Anniversary Gala</option>
                  <option value="Product Launch">Product Launch</option>
                  <option value="Corporate Seminar">Corporate Seminar</option>
                  <option value="Birthday Celebration">Birthday Celebration</option>
                </select>
              </div>
            </div>

            {/* Catering Menu Items Selection (Requested Change!) */}
            <div className="space-y-3 bg-[#f4f2fc]/40 p-4 rounded-xl border border-[#eeedf7]">
              <div className="flex justify-between items-center">
                <p className="text-[10px] uppercase font-bold tracking-wider text-[#00288e] flex items-center gap-1">
                  <Utensils className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'केटरिंग डिश का चयन' : 'Catering Dish Selection'}</span>
                </p>
                <span className="text-[10px] bg-[#dde1ff] text-[#00288e] px-2 py-0.5 rounded-full font-bold">
                  {selectedCateringItems.length} {language === 'hi' ? 'चुने हुए' : 'Selected'}
                </span>
              </div>

              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 bg-white p-3 rounded-xl border border-[#e3e1eb]">
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
                          const isChecked = selectedCateringItems.includes(item.name);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleToggleCateringItem(item.name)}
                              className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${
                                isChecked 
                                  ? 'border-[#00288e] bg-[#f4f2fc] text-[#1a1b22]' 
                                  : 'border-[#eeedf7] hover:bg-[#fbf8ff] text-[#444653]'
                              }`}
                            >
                              {isChecked ? (
                                <CheckSquare className="w-4 h-4 text-[#00288e] shrink-0" />
                              ) : (
                                <Square className="w-4 h-4 text-gray-300 shrink-0" />
                              )}
                              <div className="min-w-0">
                                <p className="text-xs font-bold truncate leading-tight">{item.name}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Financial Invoice Setup */}
            {role !== 'sales_agent' && (
              <div className="space-y-3 bg-[#f4f2fc]/40 p-4 rounded-xl border border-[#eeedf7]">
                <p className="text-[10px] uppercase font-bold tracking-wider text-[#00288e]">Financial Invoice Ledger</p>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[#444653] block">Base Quote (INR) *</label>
                    <input
                      type="number"
                      required
                      value={totalAmount}
                      onChange={(e) => setTotalAmount(e.target.value)}
                      placeholder="E.g. 15000"
                      className="w-full bg-white border border-[#c4c5d5] rounded-xl px-2 py-1.5 text-sm text-[#1a1b22] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#444653] block">Discount (%)</label>
                    <input
                      type="number"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(e.target.value)}
                      placeholder="E.g. 10"
                      className="w-full bg-white border border-[#c4c5d5] rounded-xl px-2 py-1.5 text-sm text-[#1a1b22] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#444653] block">Deposit Recd (INR)</label>
                    <input
                      type="number"
                      value={amountReceived}
                      onChange={(e) => setAmountReceived(e.target.value)}
                      placeholder="E.g. 5000"
                      className="w-full bg-white border border-[#c4c5d5] rounded-xl px-2 py-1.5 text-sm text-[#1a1b22] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Dynamic Ledger Summary Calculations */}
                <div className="mt-3 bg-white p-3 rounded-lg border border-[#eeedf7] space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-[#444653]">
                    <span>Applied Discount:</span>
                    <span>₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-[#1a1b22]">
                    <span>Final Contract Price:</span>
                    <span>₹{finalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xs font-extrabold text-[#ba1a1a] pt-1 border-t border-[#eeedf7]">
                    <span>Outstanding Balance Due:</span>
                    <span>₹{pendingBalance.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Terms & Conditions Section */}
            <div className="mt-4 bg-[#fcf8e3] border border-[#fbeed5] rounded-2xl p-4 space-y-3.5">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-[#c09853] flex items-center gap-1.5 uppercase tracking-wide">
                  <FileText className="w-4 h-4 text-[#c09853]" />
                  <span>{language === 'hi' ? 'नियम और शर्तें (Terms & Conditions)' : 'Terms & Conditions'}</span>
                </span>
                <button
                  type="button"
                  onClick={handleCopyTerms}
                  className="flex items-center gap-1.5 text-[10px] font-bold bg-white text-[#c09853] hover:bg-[#faf4d3] border border-[#fbeed5] rounded-xl px-2.5 py-1.5 cursor-pointer transition-all"
                >
                  {copiedTerms ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-green-600">{language === 'hi' ? 'कॉपी हो गया!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'व्हाट्सएप के लिए कॉपी करें' : 'Copy to WhatsApp'}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px] leading-relaxed text-[#8a6d3b] font-semibold">
                <div className="bg-white/80 p-3 rounded-xl border border-[#fbeed5]/60 space-y-1">
                  <p className="font-bold text-[#c09853] border-b border-[#fbeed5] pb-0.5 uppercase tracking-wider">⏱ {language === 'hi' ? 'कार्यक्रम का समय' : 'Program Timings'}</p>
                  <p>• <strong>{language === 'hi' ? 'चाट स्टॉल और फ्रूट:' : 'Chat Stall & Fruits:'}</strong> 8:00 PM to 11:30 PM</p>
                  <p>• <strong>{language === 'hi' ? 'डिनर बुफे:' : 'Dinner Buffet:'}</strong> 9:00 PM to 12:30 AM</p>
                  <p className="text-[9px] italic mt-1 text-[#c09853]">चाट स्टॉल (रात 8 से 11:30) | डिनर (रात 9 से 12:30)</p>
                </div>

                <div className="bg-white/80 p-3 rounded-xl border border-[#fbeed5]/60 space-y-1">
                  <p className="font-bold text-[#c09853] border-b border-[#fbeed5] pb-0.5 uppercase tracking-wider">💰 {language === 'hi' ? 'भुगतान का नियम' : 'Payment Schedule'}</p>
                  <p>• <strong>{language === 'hi' ? 'अग्रिम (Advance):' : 'Advance:'}</strong> 50% required at booking time.</p>
                  <p>• <strong>{language === 'hi' ? 'शेष (Balance):' : 'Balance:'}</strong> charged at end of programme.</p>
                  <p className="text-[9px] italic mt-1 text-[#c09853]">50% बुकिंग के समय | शेष राशि कार्यक्रम के अंत में</p>
                </div>

                <div className="bg-white/80 p-3 rounded-xl border border-[#fbeed5]/60 col-span-1 sm:col-span-2 space-y-1">
                  <p className="font-bold text-[#c09853] border-b border-[#fbeed5] pb-0.5 uppercase tracking-wider">⚠️ {language === 'hi' ? 'अतिरिक्त अतिथि और प्लेट नियम' : 'Extra Gathering & Plates Policy'}</p>
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
                  {language === 'hi' 
                    ? 'मैंने ग्राहक को कार्यक्रम के समय, 50% अग्रिम भुगतान और अतिरिक्त प्लेट के नियमों के बारे में सूचित कर दिया है।' 
                    : 'I have informed the customer about program timings, 50% advance, and extra plate rules.'
                  }
                </span>
              </label>
            </div>
          </form>
        </div>

        {/* Buttons Row */}
        <div className="flex gap-3 pt-4 border-t border-[#e3e1eb] mt-6 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-white text-[#444653] rounded-xl hover:bg-[#f4f2fc] border border-[#c4c5d5] font-bold cursor-pointer"
          >
            {language === 'hi' ? 'रद्द करें' : 'Cancel'}
          </button>
          <button
            type="submit"
            form="new_booking_form"
            disabled={!!conflictError}
            className={`flex-1 py-3 text-white rounded-xl font-bold shadow-md cursor-pointer transition-all ${
              conflictError 
                ? 'bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed opacity-50' 
                : 'bg-[#00288e] hover:bg-[#1e40af]'
            }`}
          >
            {role === 'sales_agent' 
              ? (language === 'hi' ? 'अनुरोध भेजें' : 'Submit Request') 
              : (language === 'hi' ? 'अनुबंध बनाएं' : 'Create Contract')
            }
          </button>
        </div>
      </div>
    </div>
  );
}
