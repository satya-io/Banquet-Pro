import React, { useState } from 'react';
import { 
  Inbox, Search, Filter, Phone, Mail, Calendar, MapPin, 
  Users, IndianRupee, ArrowRight, MessageSquare, Plus, Trash2, 
  CheckCircle, PlusCircle, User, MessageCircle, AlertCircle, 
  MessageSquareCode, ChevronRight, X, Clock
} from 'lucide-react';
import { Enquiry, EnquiryNote, CateringItem } from '../types';

interface EnquiriesViewProps {
  searchQuery: string;
  enquiries: Enquiry[];
  onAddEnquiry: (enquiry: Enquiry) => void;
  onUpdateEnquiry: (enquiry: Enquiry) => void;
  onDeleteEnquiry: (id: string) => void;
  onConvertToBooking: (enquiry: Enquiry) => void;
  selectedEnquiry: Enquiry | null;
  onSelectEnquiry: (enquiry: Enquiry | null) => void;
  onOpenNewEnquiryModal: () => void;
  cateringItems: CateringItem[];
}

type FilterType = 'All' | 'New' | 'Contacted' | 'Negotiating' | 'Confirmed' | 'Lost';

export default function EnquiriesView({
  searchQuery,
  enquiries,
  onAddEnquiry,
  onUpdateEnquiry,
  onDeleteEnquiry,
  onConvertToBooking,
  selectedEnquiry,
  onSelectEnquiry,
  onOpenNewEnquiryModal,
  cateringItems
}: EnquiriesViewProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [newNoteText, setNewNoteText] = useState('');

  // Sidebar Financial & Menu edits
  const [editPrice, setEditPrice] = useState<string>('');
  const [editBookingAmount, setEditBookingAmount] = useState<string>('');
  const [editMenu, setEditMenu] = useState<string[]>([]);
  const [deleteConfirmEnquiry, setDeleteConfirmEnquiry] = useState<Enquiry | null>(null);

  React.useEffect(() => {
    if (selectedEnquiry) {
      setEditPrice(String(selectedEnquiry.budget || 0));
      setEditBookingAmount(String(selectedEnquiry.bookingAmount || 0));
      setEditMenu(selectedEnquiry.menuSelection || []);
    }
  }, [selectedEnquiry?.id]);

  const getWhatsAppMessageText = (enq: Enquiry) => {
    let msg = `*Dear ${enq.customerName},*\n\n`;
    msg += `Thank you for choosing *Grand Royal Banquet*! Here are the details of your event enquiry:\n\n`;
    msg += `📅 *Event Date:* ${enq.eventDate}\n`;
    msg += `📍 *Venue Space:* ${enq.venuePref}\n`;
    msg += `👥 *Expected Guests:* ${enq.pax} Pax\n`;
    msg += `💰 *Quoted Budget:* ₹${enq.budget.toLocaleString('en-IN')}\n`;
    
    if (enq.timeSlot) {
      msg += `⏰ *Slot:* ${enq.timeSlot === 'Morning' ? 'Day Slot (10 AM - 4 PM)' : 'Night Slot (7 PM - 1 AM)'}\n`;
    }
    if (enq.startTime) {
      msg += `⏰ *Start Time:* ${enq.startTime}\n`;
    }

    if (enq.menuSelection && enq.menuSelection.length > 0) {
      msg += `\n*Selected Catering Inclusions:*\n`;
      enq.menuSelection.forEach(item => {
        msg += `✓ ${item}\n`;
      });
    }

    msg += `\nWe look forward to hosting a memorable celebration for you! Please review these specifications. If everything looks good, we can proceed to finalize your booking.\n\n`;
    msg += `Warm regards,\n*Grand Royal Banquet Team*`;

    return encodeURIComponent(msg);
  };

  const handleSaveSidebarEdits = () => {
    if (!selectedEnquiry) return;
    const p = parseFloat(editPrice) || 0;
    const b = parseFloat(editBookingAmount) || 0;
    const bal = Math.max(0, p - b);
    
    // Auto status to Confirmed if bookingAmount was added and is larger than 0, 
    // but preserve Lost if status is Lost
    let finalStatus = selectedEnquiry.status;
    if (b > 0 && selectedEnquiry.status !== 'Lost') {
      finalStatus = 'Confirmed';
    }

    const updated: Enquiry = {
      ...selectedEnquiry,
      status: finalStatus,
      budget: p,
      bookingAmount: b,
      pendingBalance: bal,
      menuSelection: editMenu
    };
    onUpdateEnquiry(updated);
    onSelectEnquiry(updated);
    alert('Event details updated successfully!');
  };

  // Handle filtering
  const filteredEnquiries = enquiries.filter(enq => {
    // Search query matches
    const matchesSearch = 
      enq.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enq.phone.includes(searchQuery) ||
      enq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enq.venuePref.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    // Tab filter matches
    if (activeFilter === 'All') return true;
    return enq.status === activeFilter;
  });

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !selectedEnquiry) return;

    const timestamp = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const updatedNotes: EnquiryNote[] = [
      ...selectedEnquiry.notes,
      { time: timestamp, text: newNoteText.trim() }
    ];

    const updatedEnquiry: Enquiry = {
      ...selectedEnquiry,
      notes: updatedNotes
    };

    onUpdateEnquiry(updatedEnquiry);
    onSelectEnquiry(updatedEnquiry); // Update active panel state
    setNewNoteText('');
  };

  const handleStatusChange = (status: 'New' | 'Contacted' | 'Negotiating' | 'Confirmed' | 'Lost') => {
    if (!selectedEnquiry) return;

    const updatedEnquiry: Enquiry = {
      ...selectedEnquiry,
      status
    };

    onUpdateEnquiry(updatedEnquiry);
    onSelectEnquiry(updatedEnquiry);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans font-bold text-3xl text-[#1a1b22] tracking-tight">Enquiries</h2>
          <p className="text-[#444653] text-sm mt-1">Manage and nurture potential event bookings and sales leads.</p>
        </div>
        <button
          onClick={onOpenNewEnquiryModal}
          className="bg-[#00288e] text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-[#1e40af] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>New Enquiry</span>
        </button>
      </div>

      {/* Tabs Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e3e1eb] pb-1">
        <div className="flex gap-2">
          {(['All', 'New', 'Contacted', 'Negotiating', 'Confirmed', 'Lost'] as FilterType[]).map((filter) => {
            const count = filter === 'All' 
              ? enquiries.length 
              : enquiries.filter(e => e.status === filter).length;
            
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 text-sm font-semibold relative transition-all cursor-pointer ${
                  activeFilter === filter
                    ? 'text-[#00288e] border-b-2 border-[#00288e]'
                    : 'text-[#444653] hover:text-[#1a1b22]'
                }`}
              >
                <span>{filter}</span>
                <span className="ml-1.5 text-xs bg-[#eeedf7] text-[#444653] px-2 py-0.5 rounded-full font-medium">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Table list (left) & Detail Panel (right) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Enquiries Table/List Column */}
        <div className={`bg-white rounded-2xl shadow-sm border border-[#e3e1eb] overflow-hidden xl:col-span-2 ${selectedEnquiry ? 'xl:col-span-2' : 'xl:col-span-3'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f4f2fc] text-[#1a1b22] font-sans font-bold text-xs uppercase tracking-wider border-b border-[#e3e1eb]">
                  <th className="px-6 py-4">Client / Source</th>
                  <th className="px-6 py-4">Date & Guest Size</th>
                  <th className="px-6 py-4 text-right">Est. Budget</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e1eb]">
                {filteredEnquiries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-[#444653]">
                      <Inbox className="w-10 h-10 mx-auto text-[#444653]/40 mb-3" />
                      <p className="font-bold">No enquiries found</p>
                      <p className="text-xs text-[#444653]/70 mt-1">Try adjusting your filters or search term</p>
                    </td>
                  </tr>
                ) : (
                  filteredEnquiries.map((enq) => {
                    const isSelected = selectedEnquiry?.id === enq.id;
                    return (
                      <tr 
                        key={enq.id}
                        className={`hover:bg-[#f4f2fc]/30 transition-colors cursor-pointer ${
                          isSelected ? 'bg-[#f4f2fc]/60' : ''
                        }`}
                        onClick={() => onSelectEnquiry(enq)}
                      >
                        {/* Client & Referral Source */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#dde1ff] text-[#00288e] flex items-center justify-center font-bold text-xs">
                              {enq.customerName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-sans font-bold text-sm text-[#1a1b22]">{enq.customerName}</p>
                              <span className="inline-block text-[10px] bg-[#eeedf7] text-[#444653] font-semibold px-2 py-0.5 rounded-full mt-1">
                                {enq.source}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Date & Guests */}
                        <td className="px-6 py-4">
                          <p className="font-sans text-xs font-semibold text-[#1a1b22]">{enq.eventDate}</p>
                          <p className="text-[10px] text-[#444653] font-semibold mt-0.5">{enq.pax} Guests ({enq.venuePref})</p>
                        </td>

                        {/* Budget */}
                        <td className="px-6 py-4 text-right">
                          <div>
                            <p className="font-sans text-xs font-bold text-[#00288e]">
                              ₹{enq.budget.toLocaleString('en-IN')}
                            </p>
                          </div>
                          {enq.bookingAmount !== undefined && enq.bookingAmount > 0 && (
                            <div className="mt-1 pt-1 border-t border-[#eeedf7] text-[10px] text-[#444653]">
                              <p>Paid: ₹{enq.bookingAmount?.toLocaleString('en-IN')}</p>
                              <p className="font-bold text-[#ba1a1a]">Bal: ₹{enq.pendingBalance?.toLocaleString('en-IN')}</p>
                            </div>
                          )}
                        </td>

                        {/* Status Badge */}
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              enq.status === 'New' 
                                ? 'bg-[#dde1ff] text-[#00288e]' 
                                : enq.status === 'Contacted'
                                ? 'bg-[#ffddb8] text-[#6b4200]'
                                : enq.status === 'Negotiating'
                                ? 'bg-amber-100 text-amber-800'
                                : enq.status === 'Confirmed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {enq.status}
                            </span>

                            {/* Overdue and Complete conditions */}
                            {enq.status === 'Confirmed' && (
                              <div className="pt-0.5">
                                {enq.pendingBalance === 0 ? (
                                  <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-green-600 text-white">
                                    Fully Paid
                                  </span>
                                ) : (() => {
                                  const todayStr = new Date().toISOString().split('T')[0];
                                  const isOverdue = enq.eventDate < todayStr;
                                  return isOverdue ? (
                                    <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-red-600 text-white animate-pulse">
                                      Overdue
                                    </span>
                                  ) : (
                                    <span className="inline-block px-2 py-0.5 rounded text-[9px] font-semibold uppercase bg-amber-100 text-amber-800">
                                      Pending Bal
                                    </span>
                                  );
                                })()}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Fast Workflows */}
                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end gap-1.5">
                            <button 
                              onClick={() => onSelectEnquiry(enq)}
                              className="p-1.5 hover:bg-[#dde1ff] text-[#00288e] rounded-lg transition-colors cursor-pointer"
                              title="View Details"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            <a 
                              href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=${getWhatsAppMessageText(enq)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 hover:bg-[#6cf8bb]/30 text-[#00714d] rounded-lg transition-colors cursor-pointer"
                              title="Chat on WhatsApp"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </a>
                            <button 
                              onClick={() => {
                                setDeleteConfirmEnquiry(enq);
                              }}
                              className="p-1.5 hover:bg-[#ffdad6] text-[#ba1a1a] rounded-lg transition-colors cursor-pointer"
                              title="Delete Enquiry"
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
        </div>

        {/* Dynamic Client Detail Sidebar Panel (Priceless UX) */}
        {selectedEnquiry && (
          <div className="bg-white rounded-2xl shadow-lg border border-[#e3e1eb] p-6 space-y-6 lg:sticky lg:top-24 animate-slide-in-right">
            {/* Panel Title */}
            <div className="flex justify-between items-center border-b border-[#e3e1eb] pb-4">
              <div>
                <h3 className="font-sans font-bold text-lg text-[#1a1b22]">Client Details</h3>
                <p className="text-xs text-[#444653] font-semibold mt-1">Lead ID: {selectedEnquiry.id}</p>
              </div>
              <button 
                onClick={() => onSelectEnquiry(null)}
                className="p-1.5 hover:bg-[#f4f2fc] text-[#444653] rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Client Card Profile Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3.5 bg-[#f4f2fc]/50 p-4 rounded-xl border border-[#eeedf7]">
                <div className="w-12 h-12 rounded-xl bg-[#00288e]/10 text-[#00288e] flex items-center justify-center font-bold text-sm">
                  {selectedEnquiry.customerName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-sans font-bold text-sm text-[#1a1b22]">{selectedEnquiry.customerName}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-[#006c49] font-bold mt-1">
                    <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                    <span>WhatsApp Verified</span>
                  </div>
                </div>
              </div>

              {/* Status workflow dropdown controller */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-[#444653] uppercase tracking-wider font-bold">Sales Lead Stage</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['New', 'Contacted', 'Negotiating', 'Confirmed', 'Lost'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(st)}
                      className={`py-1 rounded-lg text-[10px] font-bold transition-all border cursor-pointer ${
                        selectedEnquiry.status === st
                          ? 'bg-[#dde1ff] text-[#00288e] border-[#00288e]'
                          : 'bg-white text-[#444653] border-[#c4c5d5] hover:bg-[#f4f2fc]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Financial and Catering Inline Editor */}
              <div className="space-y-3 bg-[#f4f2fc]/60 p-3.5 rounded-xl border border-[#eeedf7]">
                <p className="text-[10px] uppercase font-extrabold tracking-wider text-[#00288e] flex justify-between items-center">
                  <span>Finance & Menu details</span>
                  <span className="text-[9px] font-normal text-[#444653]">Instant Save</span>
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-[#444653] font-bold block">Quoted Price (₹)</label>
                    <input
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-full bg-white border border-[#c4c5d5] rounded-lg px-2 py-1 text-xs text-[#1a1b22] focus:outline-none"
                    />
                  </div>

                  {selectedEnquiry.status === 'Confirmed' ? (
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#444653] font-bold block">Deposit Paid (₹)</label>
                      <input
                        type="number"
                        value={editBookingAmount}
                        onChange={(e) => setEditBookingAmount(e.target.value)}
                        className="w-full bg-white border border-[#c4c5d5] rounded-lg px-2 py-1 text-xs text-[#1a1b22] focus:outline-none"
                      />
                    </div>
                  ) : (
                    <div className="space-y-1 opacity-60">
                      <label className="text-[10px] text-[#444653] font-bold block">Deposit Paid (₹)</label>
                      <div className="bg-gray-100 border border-gray-200 rounded-lg px-2 py-1 text-xs text-[#444653] select-none">
                        Unconfirmed
                      </div>
                    </div>
                  )}
                </div>

                {selectedEnquiry.status === 'Confirmed' && (
                  <div className="text-[10px] font-bold flex justify-between text-[#ba1a1a] pt-1 border-t border-dashed border-[#c4c5d5]">
                    <span>Outstanding Balance:</span>
                    <span>₹{Math.max(0, (parseFloat(editPrice) || 0) - (parseFloat(editBookingAmount) || 0)).toLocaleString('en-IN')}</span>
                  </div>
                )}

                {/* Catering Checklist */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] text-[#444653] font-bold block">Catering Inclusions</label>
                    <span className="text-[9px] bg-[#dde1ff] text-[#00288e] px-1.5 py-0.5 rounded-full font-bold">
                      {editMenu.length} Selected
                    </span>
                  </div>
                  
                  <div className="space-y-2.5 max-h-[140px] overflow-y-auto pr-1 bg-white p-2 rounded-lg border border-[#e3e1eb]">
                    {Array.from(new Set(cateringItems.map(item => item.category))).map((catName) => {
                      const items = cateringItems.filter(item => item.category === catName && item.isAvailable);
                      if (items.length === 0) return null;
                      
                      return (
                        <div key={catName} className="space-y-1">
                          <h5 className="text-[9px] text-[#444653] font-black uppercase border-b pb-0.5 tracking-wider">
                            {catName}
                          </h5>
                          <div className="grid grid-cols-1 gap-1">
                            {items.map((item) => {
                              const isChecked = editMenu.includes(item.name);
                              return (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => {
                                    setEditMenu(prev => 
                                      prev.includes(item.name) 
                                        ? prev.filter(c => c !== item.name) 
                                        : [...prev, item.name]
                                    );
                                  }}
                                  className={`flex items-center gap-1.5 p-1.5 rounded border text-left text-[10px] font-bold transition-all ${
                                    isChecked 
                                      ? 'border-[#00288e] bg-[#f4f2fc] text-[#1a1b22]' 
                                      : 'border-[#eeedf7] hover:bg-[#fbf8ff] text-[#444653]'
                                  }`}
                                >
                                  <span className={`w-3 h-3 border rounded flex items-center justify-center shrink-0 ${
                                    isChecked ? 'bg-[#00288e] border-[#00288e] text-white text-[8px]' : 'border-gray-300'
                                  }`}>
                                    {isChecked && '✓'}
                                  </span>
                                  <span className="truncate">{item.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveSidebarEdits}
                  className="w-full py-1.5 bg-[#00288e] text-white rounded-lg text-xs font-bold hover:bg-[#1e40af] transition-all cursor-pointer"
                >
                  Save Financials & Catering
                </button>
              </div>

              {/* Contact Metadata */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2.5 text-xs text-[#444653]">
                  <Phone className="w-4 h-4 text-[#00288e] shrink-0" />
                  <span className="font-semibold text-[#1a1b22]">{selectedEnquiry.phone}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#444653]">
                  <Mail className="w-4 h-4 text-[#00288e] shrink-0" />
                  <span className="font-semibold text-[#1a1b22] break-all">{selectedEnquiry.email || 'No email registered'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#444653]">
                  <Calendar className="w-4 h-4 text-[#00288e] shrink-0" />
                  <span className="font-semibold text-[#1a1b22]">Target Date: {selectedEnquiry.eventDate}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#444653]">
                  <MapPin className="w-4 h-4 text-[#00288e] shrink-0" />
                  <span className="font-semibold text-[#1a1b22]">Pref: {selectedEnquiry.venuePref}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#444653]">
                  <Users className="w-4 h-4 text-[#00288e] shrink-0" />
                  <span className="font-semibold text-[#1a1b22]">Guests: {selectedEnquiry.pax} Pax</span>
                </div>
              </div>

              {/* Enquiry Description Body */}
              <div className="bg-[#f4f2fc]/30 p-3.5 rounded-xl border border-[#eeedf7] space-y-1.5">
                <p className="text-[10px] text-[#444653] uppercase font-bold tracking-wider">Client Requirement</p>
                <p className="text-xs text-[#1a1b22] leading-relaxed font-medium">
                  {selectedEnquiry.description || 'No additional specifications provided.'}
                </p>
              </div>
            </div>

            {/* Note logs */}
            <div className="space-y-3 pt-4 border-t border-[#e3e1eb]">
              <h5 className="font-sans font-bold text-xs text-[#1a1b22] uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#00288e]" />
                <span>Sales Activity & Notes ({selectedEnquiry.notes.length})</span>
              </h5>

              <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
                {selectedEnquiry.notes.map((note, index) => (
                  <div key={index} className="text-xs bg-[#f4f2fc]/50 p-2.5 rounded-lg border border-[#eeedf7]">
                    <p className="text-[9px] text-[#444653] font-bold">{note.time}</p>
                    <p className="text-xs text-[#1a1b22] font-semibold mt-1">{note.text}</p>
                  </div>
                ))}
              </div>

              {/* Add Custom Note inline form */}
              <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Add status note..."
                  className="flex-1 text-xs bg-white border border-[#c4c5d5] rounded-xl px-3 py-2 text-[#1a1b22] focus:outline-none focus:ring-1 focus:ring-[#00288e]"
                />
                <button
                  type="submit"
                  className="bg-[#00288e] text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-[#1e40af] transition-all cursor-pointer"
                >
                  Post
                </button>
              </form>
            </div>

            {/* Final Convert to Booking Button */}
            <div className="pt-4 border-t border-[#e3e1eb]">
              <button
                onClick={() => {
                  onConvertToBooking(selectedEnquiry);
                  onSelectEnquiry(null);
                }}
                className="w-full bg-[#006c49] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#005237] transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Convert to Active Booking</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmEnquiry && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl animate-scale-up text-center">
            <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            
            <div className="space-y-1.5">
              <h3 className="font-sans font-extrabold text-base text-[#1a1b22]">Delete Enquiry?</h3>
              <p className="text-xs text-[#444653] leading-relaxed">
                Are you sure you want to delete the enquiry for <span className="font-bold text-[#1a1b22]">{deleteConfirmEnquiry.customerName}</span>? This record will be permanently deleted.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmEnquiry(null)}
                className="flex-1 py-2 bg-white text-[#444653] font-semibold text-xs rounded-xl hover:bg-[#f4f2fc] border border-[#c4c5d5] cursor-pointer transition-colors"
              >
                No, Keep it
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteEnquiry(deleteConfirmEnquiry.id);
                  if (selectedEnquiry?.id === deleteConfirmEnquiry.id) onSelectEnquiry(null);
                  setDeleteConfirmEnquiry(null);
                }}
                className="flex-1 py-2 bg-red-600 text-white font-semibold text-xs rounded-xl hover:bg-red-700 cursor-pointer transition-colors shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
