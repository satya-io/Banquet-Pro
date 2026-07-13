import React, { useState } from 'react';
import { 
  CalendarCheck, Plus, Search, Filter, Phone, Calendar, 
  MapPin, CheckCircle2, AlertTriangle, HelpCircle, X, ChevronRight, 
  Receipt, Trash2, Edit2, Sparkles, Coins, IndianRupee, Download, ArrowRight, MessageSquare
} from 'lucide-react';
import { Booking, CateringItem } from '../types';
import { Language, translations } from '../translations';
import { printInvoice, printAgreement } from '../utils/print';

interface BookingsViewProps {
  searchQuery: string;
  bookings: Booking[];
  onAddBooking: (booking: Booking) => void;
  onUpdateBooking: (booking: Booking) => void;
  onDeleteBooking: (id: string) => void;
  onOpenNewBookingDrawer: () => void;
  role?: 'admin' | 'sales_agent';
  language: Language;
  cateringItems: CateringItem[];
}

type PaymentFilterType = 'All' | 'Fully Paid' | 'Partially Paid' | 'Overdue';

export default function BookingsView({
  searchQuery,
  bookings,
  onAddBooking,
  onUpdateBooking,
  onDeleteBooking,
  onOpenNewBookingDrawer,
  role = 'admin',
  language,
  cateringItems
}: BookingsViewProps) {
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilterType>('All');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [paymentAmountInput, setPaymentAmountInput] = useState('');
  const [showWhatsAppAssistant, setShowWhatsAppAssistant] = useState<{ booking: Booking; type: 'Invoice' | 'Contract' } | null>(null);

  const t = translations[language];

  const filterLabels: Record<PaymentFilterType, string> = {
    'All': t.allPayments,
    'Fully Paid': t.fullyPaid,
    'Partially Paid': t.partiallyPaid,
    'Overdue': t.overdue
  };

  // Handle searches & filters
  const filteredBookings = bookings.filter(book => {
    const matchesSearch = 
      book.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.eventType.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (paymentFilter === 'All') return true;
    return book.paymentStatus === paymentFilter;
  });

  // Record a payment dynamically
  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking || !paymentAmountInput) return;

    const paymentVal = parseFloat(paymentAmountInput);
    if (isNaN(paymentVal) || paymentVal <= 0) {
      alert(language === 'en' ? 'Please enter a valid positive payment amount' : 'कृपया एक मान्य सकारात्मक भुगतान राशि दर्ज करें');
      return;
    }

    const updatedAmountReceived = selectedBooking.amountReceived + paymentVal;
    const finalAmount = selectedBooking.finalAmount;
    const updatedPendingBalance = Math.max(0, finalAmount - updatedAmountReceived);
    
    let updatedPaymentStatus: Booking['paymentStatus'] = 'Partially Paid';
    if (updatedPendingBalance === 0) {
      updatedPaymentStatus = 'Fully Paid';
    } else if (updatedPendingBalance > 0 && selectedBooking.paymentStatus === 'Overdue') {
      // Remain overdue or partially paid based on logic
      updatedPaymentStatus = 'Partially Paid';
    }

    const updatedBooking: Booking = {
      ...selectedBooking,
      amountReceived: parseFloat(updatedAmountReceived.toFixed(2)),
      pendingBalance: parseFloat(updatedPendingBalance.toFixed(2)),
      paymentStatus: updatedPaymentStatus
    };

    onUpdateBooking(updatedBooking);
    setSelectedBooking(updatedBooking);
    setPaymentAmountInput('');
  };

  const handleDownloadInvoice = (book: Booking) => {
    setShowWhatsAppAssistant({ booking: book, type: 'Invoice' });
  };

  const getWhatsAppBookingText = (book: Booking, type: 'Invoice' | 'Contract') => {
    let msg = `*Dear ${book.customerName},*\n\n`;
    msg += `We are pleased to share your Event *${type === 'Invoice' ? 'Invoice' : 'Agreement Contract'}* details for *Grand Royal Banquet*:\n\n`;
    msg += `📑 *Booking ID:* ${book.id}\n`;
    msg += `📅 *Event Date:* ${book.eventDate}\n`;
    msg += `📍 *Allocated Venue:* ${book.venue}\n`;
    msg += `🎈 *Event Type:* ${book.eventType}\n`;
    msg += `👥 *Capacity:* ${book.pax} Pax\n`;
    
    if (book.timeSlot) {
      msg += `⏰ *Slot:* ${book.timeSlot === 'Morning' ? 'Day Slot (10 AM - 4 PM)' : 'Night Slot (7 PM - 1 AM)'}\n`;
    }
    if (book.startTime) {
      msg += `⏰ *Start Time:* ${book.startTime}\n`;
    }

    msg += `\n*Financial Schedule:*\n`;
    msg += `- Total Amount: ₹${book.totalAmount.toLocaleString('en-IN')}\n`;
    if (book.discountPercent > 0) {
      msg += `- Discount (${book.discountPercent}%): -₹${book.discountAmount.toLocaleString('en-IN')}\n`;
    }
    msg += `- Final Contract Price: ₹${book.finalAmount.toLocaleString('en-IN')}\n`;
    msg += `- Amount Deposited: ₹${book.amountReceived.toLocaleString('en-IN')}\n`;
    msg += `- Outstanding Balance: ₹${book.pendingBalance.toLocaleString('en-IN')}\n`;

    if (book.menuSelection && book.menuSelection.length > 0) {
      msg += `\n*Catering Inclusions Selected:*\n`;
      book.menuSelection.forEach(item => {
        msg += `✓ ${item}\n`;
      });
    }

    msg += `\nWe have generated the PDF copy of your ${type === 'Invoice' ? 'invoice' : 'contract agreement'}. We are opening the chat to send this to you.\n\n`;
    msg += `Warm regards,\n*Grand Royal Banquet Team*`;

    return encodeURIComponent(msg);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans font-bold text-3xl text-[#1a1b22] tracking-tight">{t.bookingsTitle}</h2>
          <p className="text-[#444653] text-sm mt-1">{t.bookingsSubtitle}</p>
        </div>
        <button
          onClick={onOpenNewBookingDrawer}
          className="bg-[#00288e] text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-[#1e40af] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>{t.addBookingBtn}</span>
        </button>
      </div>

      {/* Stats Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e3e1eb] pb-1">
        <div className="flex gap-2">
          {(['All', 'Fully Paid', 'Partially Paid', 'Overdue'] as PaymentFilterType[]).map((filter) => {
            const count = filter === 'All' 
              ? bookings.length 
              : bookings.filter(b => b.paymentStatus === filter).length;
            
            return (
              <button
                key={filter}
                onClick={() => setPaymentFilter(filter)}
                className={`px-4 py-2 text-sm font-semibold relative transition-all cursor-pointer ${
                  paymentFilter === filter
                    ? 'text-[#00288e] border-b-2 border-[#00288e]'
                    : 'text-[#444653] hover:text-[#1a1b22]'
                }`}
              >
                <span>{filterLabels[filter]}</span>
                <span className="ml-1.5 text-xs bg-[#eeedf7] text-[#444653] px-2 py-0.5 rounded-full font-medium">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Data table vs detail billing panel */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Bookings List Table */}
        <div className={`bg-white rounded-2xl shadow-sm border border-[#e3e1eb] overflow-hidden ${selectedBooking ? 'xl:col-span-2' : 'xl:col-span-3'}`}>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f4f2fc] text-[#1a1b22] font-sans font-bold text-xs uppercase tracking-wider border-b border-[#e3e1eb]">
                  <th className="px-6 py-4">{t.contractClient}</th>
                  <th className="px-6 py-4">{t.venueEventType}</th>
                  <th className="px-6 py-4">{t.targetDate}</th>
                  {role !== 'sales_agent' && <th className="px-6 py-4 text-right">{t.balanceDueHeader}</th>}
                  <th className="px-6 py-4">{t.paymentStatus}</th>
                  <th className="px-6 py-4 text-right">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e1eb]">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={role === 'sales_agent' ? 5 : 6} className="text-center py-12 text-[#444653]">
                      <CalendarCheck className="w-10 h-10 mx-auto text-[#444653]/40 mb-3" />
                      <p className="font-bold">{t.noBookingsFound}</p>
                      <p className="text-xs text-[#444653]/70 mt-1">{t.noBookingsSub}</p>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((book) => {
                    const isSelected = selectedBooking?.id === book.id;
                    const finalVal = book.finalAmount || book.totalAmount;
                    return (
                      <tr
                        key={book.id}
                        onClick={() => setSelectedBooking(book)}
                        className={`hover:bg-[#f4f2fc]/30 transition-all cursor-pointer ${
                          isSelected ? 'bg-[#f4f2fc]/60' : ''
                        }`}
                      >
                        {/* ID & Client */}
                        <td className="px-6 py-4">
                          <p className="font-mono text-xs font-bold text-[#00288e]">{book.id}</p>
                          <p className="font-sans font-bold text-sm text-[#1a1b22] mt-0.5">{book.customerName}</p>
                        </td>

                        {/* Venue & Event Type */}
                        <td className="px-6 py-4">
                          <p className="font-sans text-xs font-semibold text-[#1a1b22]">{book.venue}</p>
                          <p className="text-[10px] text-[#444653] font-semibold mt-0.5">{book.eventType}</p>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4">
                          <p className="font-sans text-xs font-semibold text-[#1a1b22]">{book.eventDate}</p>
                        </td>

                        {/* Balance Due */}
                        {role !== 'sales_agent' && (
                          <td className="px-6 py-4 text-right">
                            <p className="font-sans text-xs font-bold text-[#ba1a1a]">
                              ₹{book.pendingBalance.toLocaleString('en-IN')}
                            </p>
                            <p className="text-[10px] text-[#444653] font-semibold mt-0.5">
                              of ₹{(finalVal).toLocaleString('en-IN')} Total
                            </p>
                          </td>
                        )}

                        {/* Payment Status Indicator */}
                        <td className="px-6 py-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            book.paymentStatus === 'Fully Paid'
                              ? 'bg-[#6cf8bb]/30 text-[#00714d]'
                              : book.paymentStatus === 'Partially Paid'
                              ? 'bg-[#ffddb8] text-[#6b4200]'
                              : 'bg-[#ffdad6] text-[#ba1a1a]'
                          }`}>
                            {book.paymentStatus}
                          </span>
                        </td>

                        {/* Fast Actions */}
                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedBooking(book)}
                              className="p-1.5 hover:bg-[#dde1ff] text-[#00288e] rounded-lg transition-colors cursor-pointer"
                              title="Show Billing Hub"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            {role !== 'sales_agent' && (
                              <button
                                onClick={() => handleDownloadInvoice(book)}
                                className="p-1.5 hover:bg-[#dde1ff] text-[#00288e] rounded-lg transition-colors cursor-pointer"
                                title="Download Invoice"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => {
                                if (confirm(`Delete contract ${book.id} for ${book.customerName}?`)) {
                                  onDeleteBooking(book.id);
                                  if (selectedBooking?.id === book.id) setSelectedBooking(null);
                                }
                              }}
                              className="p-1.5 hover:bg-[#ffdad6] text-[#ba1a1a] rounded-lg transition-colors cursor-pointer"
                              title="Delete Booking"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="block md:hidden divide-y divide-[#e3e1eb]">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12 text-[#444653]">
                <CalendarCheck className="w-10 h-10 mx-auto text-[#444653]/40 mb-3" />
                <p className="font-bold">{t.noBookingsFound}</p>
                <p className="text-xs text-[#444653]/70 mt-1">{t.noBookingsSub}</p>
              </div>
            ) : (
              filteredBookings.map((book) => {
                const isSelected = selectedBooking?.id === book.id;
                const finalVal = book.finalAmount || book.totalAmount;
                return (
                  <div 
                    key={book.id}
                    onClick={() => setSelectedBooking(book)}
                    className={`p-4 space-y-3 cursor-pointer hover:bg-[#f4f2fc]/30 transition-all duration-150 ${isSelected ? 'bg-[#f4f2fc]/60 border-l-4 border-[#00288e]' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono text-xs font-bold text-[#00288e]">{book.id}</span>
                        <p className="font-bold text-sm text-[#1a1b22] mt-0.5">{book.customerName}</p>
                      </div>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        book.paymentStatus === 'Fully Paid'
                          ? 'bg-[#6cf8bb]/30 text-[#00714d]'
                          : book.paymentStatus === 'Partially Paid'
                          ? 'bg-[#ffddb8] text-[#6b4200]'
                          : 'bg-[#ffdad6] text-[#ba1a1a]'
                      }`}>
                        {book.paymentStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-[#f4f2fc]/30 p-2.5 rounded-lg border border-[#eeedf7]">
                      <div>
                        <span className="text-[10px] text-[#444653] uppercase font-semibold block">Venue & Type</span>
                        <span className="font-bold text-[#1a1b22]">{book.venue} ({book.eventType})</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#444653] uppercase font-semibold block">Event Date</span>
                        <span className="font-bold text-[#1a1b22]">{book.eventDate}</span>
                      </div>
                      {role !== 'sales_agent' && (
                        <div className="col-span-2">
                          <span className="text-[10px] text-[#444653] uppercase font-semibold block">Balance Due</span>
                          <span className="font-bold text-[#ba1a1a]">₹{book.pendingBalance.toLocaleString('en-IN')} <span className="text-[#444653] font-normal text-[10px]">of ₹{finalVal.toLocaleString('en-IN')}</span></span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-[#e3e1eb]/60" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => setSelectedBooking(book)}
                        className="bg-[#f4f2fc] text-[#00288e] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span>Billing Hub</span>
                      </button>
                      {role !== 'sales_agent' && (
                        <button 
                          onClick={() => handleDownloadInvoice(book)}
                          className="p-2 bg-[#f4f2fc] text-[#00288e] rounded-lg hover:bg-[#eeedf7] transition-all flex items-center justify-center cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button 
                        onClick={() => {
                          if (confirm(`Delete contract ${book.id} for ${book.customerName}?`)) {
                            onDeleteBooking(book.id);
                            if (selectedBooking?.id === book.id) setSelectedBooking(null);
                          }
                        }}
                        className="p-2 bg-[#ffdad6] text-[#ba1a1a] rounded-lg transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Dynamic Itemized Invoice Drawer & Billing Hub */}
        {selectedBooking && (
          <div className="bg-white rounded-2xl shadow-lg border border-[#e3e1eb] p-6 space-y-6 lg:sticky lg:top-24 animate-slide-in-right">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-[#e3e1eb] pb-4">
              <div>
                <h3 className="font-sans font-bold text-lg text-[#1a1b22]">Billing & Invoice Hub</h3>
                <p className="text-xs text-[#444653] font-semibold mt-1">Contract: {selectedBooking.id}</p>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 hover:bg-[#f4f2fc] text-[#444653] rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Details Card */}
            <div className="space-y-4">
              <div className="bg-[#f4f2fc]/50 p-4 rounded-xl border border-[#eeedf7] space-y-1 relative">
                <p className="text-[10px] text-[#444653] uppercase font-bold tracking-wider">Customer Name</p>
                <h4 className="font-sans font-extrabold text-[#1a1b22] text-sm">{selectedBooking.customerName}</h4>
                <div className="flex justify-between items-center mt-1.5">
                  <p className="text-xs text-[#444653] flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#00288e]" />
                    <span>{selectedBooking.phone}</span>
                  </p>
                  {selectedBooking.referrerName && (
                    <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md font-bold">
                      Referred by: {selectedBooking.referrerName}
                    </span>
                  )}
                </div>
              </div>

              {/* Event details */}
              {selectedBooking.allocations && selectedBooking.allocations.length > 0 ? (
                <div className="space-y-2 bg-[#f4f2fc]/20 p-3.5 rounded-xl border border-[#eeedf7]">
                  <span className="text-[10px] text-[#444653] uppercase font-bold tracking-wider block">Allocated Events & Venues</span>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {selectedBooking.allocations.map((alloc, idx) => (
                      <div key={idx} className="bg-white p-2 rounded-lg border border-[#eeedf7] flex justify-between items-center text-xs font-bold">
                        <div>
                          <span className="text-[#00288e]">{alloc.venue}</span>
                          <span className="text-[#444653]/60 text-[10px] ml-1">({alloc.timeSlot})</span>
                        </div>
                        <div className="text-[#1a1b22] text-[10px]">
                          {alloc.eventDate} @ {alloc.startTime || '10:00'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 text-xs bg-[#f4f2fc]/20 p-3.5 rounded-xl border border-[#eeedf7]">
                  <div>
                    <span className="text-[#444653] font-semibold block">Event Type</span>
                    <span className="font-bold text-[#1a1b22]">{selectedBooking.eventType}</span>
                  </div>
                  <div>
                    <span className="text-[#444653] font-semibold block">Venue Space</span>
                    <span className="font-bold text-[#1a1b22]">{selectedBooking.venue}</span>
                  </div>
                  <div>
                    <span className="text-[#444653] font-semibold block">Event Date</span>
                    <span className="font-bold text-[#1a1b22]">{selectedBooking.eventDate}</span>
                  </div>
                  <div>
                    <span className="text-[#444653] font-semibold block">Slot & Start Time</span>
                    <span className="font-bold text-[#1a1b22]">
                      {selectedBooking.timeSlot || 'Morning'} ({selectedBooking.startTime || '10:00'})
                    </span>
                  </div>
                </div>
              )}

              {/* Catering Menu Items selection */}
              <div className="space-y-1.5 bg-[#f4f2fc]/30 p-3.5 rounded-xl border border-[#eeedf7]">
                <span className="text-[10px] text-[#444653] uppercase font-bold tracking-wider block">Selected Catering Menu</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedBooking.menuSelection && selectedBooking.menuSelection.length > 0 ? (
                    selectedBooking.menuSelection.map((item, idx) => (
                      <span key={idx} className="bg-white text-[#00288e] border border-[#dde1ff] px-2 py-0.5 rounded-md text-[10px] font-bold">
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-[#444653] italic text-[11px]">No items selected</span>
                  )}
                </div>
              </div>

              {/* Dynamic Ledger Breakdown */}
              {role !== 'sales_agent' && (
                <div className="space-y-2 pt-2">
                  <h5 className="font-sans font-bold text-xs text-[#1a1b22] uppercase tracking-wider flex items-center gap-1.5">
                    <Receipt className="w-4 h-4 text-[#00288e]" />
                    <span>Itemized Balance Ledger</span>
                  </h5>

                  <div className="space-y-2.5 text-xs bg-[#f4f2fc]/40 p-4 rounded-xl border border-[#eeedf7]">
                    <div className="flex justify-between text-[#444653]">
                      <span>Standard Venue & Catering Subtotal</span>
                      <span className="font-semibold text-[#1a1b22]">
                        ₹{selectedBooking.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {selectedBooking.discountPercent > 0 && (
                      <div className="flex justify-between text-[#006c49]">
                        <span>Applied Discount ({selectedBooking.discountPercent}%)</span>
                        <span>-₹{selectedBooking.discountAmount.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="h-px bg-[#e3e1eb] my-1"></div>

                    <div className="flex justify-between text-sm font-bold text-[#1a1b22]">
                      <span>Contract Grand Total</span>
                      <span className="text-[#00288e]">
                        ₹{((selectedBooking.finalAmount || selectedBooking.totalAmount)).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex justify-between text-[#006c49]">
                      <span>Amount Received</span>
                      <span>₹{selectedBooking.amountReceived.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between font-bold text-[#ba1a1a]">
                      <span>Remaining Balance Due</span>
                      <span>₹{selectedBooking.pendingBalance.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Record Dynamic Payment Form */}
              {role !== 'sales_agent' && selectedBooking.pendingBalance > 0 && (
                <form onSubmit={handleRecordPayment} className="space-y-2 bg-[#ffddb8]/20 p-4 rounded-xl border border-[#ffddb8] pt-3.5">
                  <p className="text-[10px] text-[#6b4200] uppercase font-bold tracking-wider flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5" />
                    <span>Record Partial Payment (INR)</span>
                  </p>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#444653] font-bold">₹</span>
                      <input
                        type="number"
                        value={paymentAmountInput}
                        onChange={(e) => setPaymentAmountInput(e.target.value)}
                        placeholder={`Up to ${selectedBooking.pendingBalance.toFixed(0)}`}
                        className="w-full bg-white border border-[#c4c5d5] rounded-xl pl-6 pr-2 py-1.5 text-xs text-[#1a1b22] font-semibold focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-[#00288e] text-white text-xs font-semibold px-4 py-1.5 rounded-xl hover:bg-[#1e40af] transition-all cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                </form>
              )}

              {/* Complete Payment Success Notice */}
              {role !== 'sales_agent' && selectedBooking.pendingBalance === 0 && (
                <div className="bg-[#6cf8bb]/20 p-4 rounded-xl border border-[#6cf8bb] flex items-center gap-2.5 text-[#00714d] text-xs">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-[#10B981]" />
                  <span className="font-bold">This contract is fully paid. No active balance pending.</span>
                </div>
              )}
            </div>

            {/* Quick Actions at bottom */}
            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-[#e3e1eb]">
              {role !== 'sales_agent' ? (
                <>
                  <button
                    onClick={() => handleDownloadInvoice(selectedBooking)}
                    className="bg-[#f4f2fc] hover:bg-[#eeedf7] text-[#1a1b22] py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Invoice PDF</span>
                  </button>
                  <button
                    onClick={() => setShowWhatsAppAssistant({ booking: selectedBooking, type: 'Contract' })}
                    className="bg-[#00288e] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#1e40af] transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Legal Contract</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => alert(`Reservation details for ${selectedBooking.customerName} verified successfully.`)}
                  className="col-span-2 bg-[#00288e] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#1e40af] transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Verify Reservation details</span>
                </button>
              )}
            </div>
          </div>
        )}

      {/* WhatsApp Delivery Assistant Modal */}
      {showWhatsAppAssistant && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center pb-2 border-b border-[#eeedf7]">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#25D366]/10 rounded-xl text-[#25D366]">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="font-sans font-extrabold text-base text-[#1a1b22]">WhatsApp Delivery Assistant</h3>
              </div>
              <button 
                onClick={() => setShowWhatsAppAssistant(null)}
                className="p-1.5 hover:bg-[#f4f2fc] text-[#444653] rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-[#444653] leading-relaxed">
                We are generating the <strong>${showWhatsAppAssistant.type} PDF</strong> for <strong>${showWhatsAppAssistant.booking.customerName}</strong>. 
              </p>
              
              <div className="bg-[#f4f2fc]/60 p-3 rounded-2xl border border-[#dde1ff] space-y-2 text-[11px] text-[#444653]">
                <p className="font-bold text-[#00288e] uppercase tracking-wider text-[9px]">How to share via WhatsApp:</p>
                <ol className="list-decimal pl-4 space-y-1.5 font-medium">
                  <li>Click <strong>"Generate PDF & Open Chat"</strong> below.</li>
                  <li>The print screen will load automatically. Click <strong>"Save as PDF"</strong> to save the document.</li>
                  <li>A new tab will open with the client's pre-filled chat details.</li>
                  <li>Simply attach or drag-and-drop the saved PDF file into the WhatsApp chat.</li>
                </ol>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowWhatsAppAssistant(null)}
                className="flex-1 py-2.5 bg-white text-[#444653] font-semibold text-xs rounded-xl hover:bg-[#f4f2fc] border border-[#c4c5d5] cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const book = showWhatsAppAssistant.booking;
                  const type = showWhatsAppAssistant.type;
                  
                  // 1. Generate print
                  if (type === 'Invoice') {
                    printInvoice(book, cateringItems);
                  } else {
                    printAgreement(book, cateringItems);
                  }
                  
                  // 2. Open WhatsApp link with prefilled specifications
                  const text = getWhatsAppBookingText(book, type);
                  const phone = book.phone.replace(/[^0-9]/g, '');
                  window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
                  
                  // 3. Clear modal
                  setShowWhatsAppAssistant(null);
                }}
                className="flex-1 py-2.5 bg-[#00288e] text-white font-semibold text-xs rounded-xl hover:bg-[#1e40af] cursor-pointer transition-colors shadow-sm"
              >
                Generate & Open Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
  );
}
