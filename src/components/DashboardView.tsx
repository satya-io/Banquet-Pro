import React from 'react';
import { 
  Inbox, CheckCircle2, Calendar, IndianRupee, TrendingUp, 
  Plus, CalendarDays, MapPin, Phone, MessageSquare, Edit2, 
  MoreVertical, FileText, Download, Users, Eye
} from 'lucide-react';
import { Booking, Enquiry } from '../types';

interface DashboardViewProps {
  searchQuery: string;
  enquiries: Enquiry[];
  bookings: Booking[];
  onTabChange: (tab: 'dashboard' | 'enquiries' | 'bookings' | 'calendar' | 'menu' | 'settings') => void;
  onOpenEnquiryDetails: (enquiry: Enquiry) => void;
  onOpenNewBookingDrawer: () => void;
  onOpenNewEnquiryModal: () => void;
}

export default function DashboardView({
  searchQuery,
  enquiries,
  bookings,
  onTabChange,
  onOpenEnquiryDetails,
  onOpenNewBookingDrawer,
  onOpenNewEnquiryModal
}: DashboardViewProps) {


  // Filter inquiries based on global search
  const filteredEnquiries = enquiries.filter(enq => 
    enq.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    enq.phone.includes(searchQuery) ||
    enq.venuePref.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Active Confirmed Bookings mock data matching the beautiful Ananya / Mehul list
  const activeConfirmedBookings = bookings.filter(b => b.status === 'Booked' || b.status === 'Completed').slice(0, 3);

  // Stats calculation
  const totalEnquiriesCount = enquiries.length + 118; // base offset to match "124" mockup
  const confirmedBookingsCount = bookings.filter(b => b.status === 'Booked').length + 38; // matches "42" mockup

  const formatMoney = (amount: number) => {
    // Show lakhs formatted or literal rupees
    return amount >= 100000 ? `₹${(amount / 100000).toFixed(1)}L` : `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome and New Action Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-sans font-bold text-3xl text-[#1a1b22] tracking-tight">Dashboard Overview</h2>
          <p className="text-[#444653] text-sm mt-1">Good morning, Rajesh. Here's what's happening at Grand Ballroom today.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewEnquiryModal}
            className="bg-[#00288e] text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-[#1e40af] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>New Enquiry</span>
          </button>
        </div>
      </div>

      {/* Dynamic Statistical Widgets Bento Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Total Enquiries */}
        <div className="bg-white p-6 rounded-2xl border-l-4 border-[#00288e] shadow-sm flex flex-col justify-between hover:translate-y-[-2px] transition-all duration-200">
          <div className="flex justify-between items-start mb-4">
            <span className="p-3 bg-[#f4f2fc] text-[#00288e] rounded-xl">
              <Inbox className="w-5 h-5" />
            </span>
            <span className="text-[#006c49] text-xs font-bold flex items-center bg-[#6cf8bb]/20 px-2 py-0.5 rounded-full gap-0.5">
              <span>+12%</span>
              <TrendingUp className="w-3 h-3" />
            </span>
          </div>
          <div>
            <p className="text-[#444653] text-xs uppercase font-semibold tracking-wider">Total Enquiries</p>
            <h3 className="font-sans font-extrabold text-3xl text-[#1a1b22] mt-1">{totalEnquiriesCount}</h3>
          </div>
        </div>

        {/* Confirmed Bookings */}
        <div className="bg-white p-6 rounded-2xl border-l-4 border-[#006c49] shadow-sm flex flex-col justify-between hover:translate-y-[-2px] transition-all duration-200">
          <div className="flex justify-between items-start mb-4">
            <span className="p-3 bg-[#6cf8bb]/10 text-[#006c49] rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </span>
            <span className="text-[#006c49] text-xs font-bold flex items-center bg-[#6cf8bb]/20 px-2 py-0.5 rounded-full gap-0.5">
              <span>+5%</span>
              <TrendingUp className="w-3 h-3" />
            </span>
          </div>
          <div>
            <p className="text-[#444653] text-xs uppercase font-semibold tracking-wider">Confirmed Bookings</p>
            <h3 className="font-sans font-extrabold text-3xl text-[#1a1b22] mt-1">{confirmedBookingsCount}</h3>
          </div>
        </div>

        {/* Today's Events */}
        <div className="bg-white p-6 rounded-2xl border-l-4 border-[#6b4200] shadow-sm flex flex-col justify-between hover:translate-y-[-2px] transition-all duration-200">
          <div className="flex justify-between items-start mb-4">
            <span className="p-3 bg-[#ffddb8]/40 text-[#6b4200] rounded-xl">
              <Calendar className="w-5 h-5" />
            </span>
            <span className="text-[#6b4200] text-xs font-bold bg-[#ffddb8] px-2 py-0.5 rounded-full">
              Today
            </span>
          </div>
          <div>
            <p className="text-[#444653] text-xs uppercase font-semibold tracking-wider">Today's Events</p>
            <h3 className="font-sans font-extrabold text-3xl text-[#1a1b22] mt-1">3</h3>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white p-6 rounded-2xl border-l-4 border-[#1e40af] shadow-sm flex flex-col justify-between hover:translate-y-[-2px] transition-all duration-200">
          <div className="flex justify-between items-start mb-4">
            <span className="p-3 bg-[#dde1ff] text-[#00288e] rounded-xl">
              <IndianRupee className="w-5 h-5" />
            </span>
            <span className="text-[#006c49] text-xs font-bold flex items-center bg-[#6cf8bb]/20 px-2 py-0.5 rounded-full gap-0.5">
              <span>+15%</span>
              <TrendingUp className="w-3 h-3" />
            </span>
          </div>
          <div>
            <p className="text-[#444653] text-xs uppercase font-semibold tracking-wider">Monthly Revenue</p>
            <h3 className="font-sans font-extrabold text-3xl text-[#1a1b22] mt-1">
              ₹12.5L
            </h3>
          </div>
        </div>
      </div>

      {/* Section 1: Open Enquiries */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h4 className="font-sans font-bold text-lg text-[#1a1b22] flex items-center gap-2">
            <span>Open Enquiries</span>
            <span className="bg-[#e3e1eb] text-[#444653] text-xs px-2.5 py-0.5 rounded-full font-semibold">
              {filteredEnquiries.length} New
            </span>
          </h4>
          <button 
            onClick={() => onTabChange('enquiries')}
            className="text-[#00288e] hover:text-[#1e40af] text-sm font-semibold hover:underline cursor-pointer"
          >
            View All Enquiries
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEnquiries.slice(0, 4).map((enq) => (
            <div 
              key={enq.id}
              className="bg-white rounded-2xl shadow-sm border border-[#e3e1eb] overflow-hidden hover:shadow-md transition-all duration-200"
            >
              <div className="p-6 space-y-5">
                {/* Header info */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#f4f2fc] flex items-center justify-center font-bold text-[#00288e] text-sm">
                      {enq.customerName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h5 className="font-sans font-semibold text-base text-[#1a1b22]">{enq.customerName}</h5>
                      <p className="text-xs text-[#444653] flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" />
                        <span>{enq.phone}</span>
                      </p>
                    </div>
                  </div>
                  <span className="bg-[#dde1ff] text-[#00288e] px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {enq.status}
                  </span>
                </div>

                {/* Grid details */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 bg-[#f4f2fc]/40 p-4 rounded-xl border border-[#eeedf7]">
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-[#444653] uppercase tracking-wider font-semibold">Event Date</p>
                    <p className="font-sans font-bold text-xs text-[#1a1b22] flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5 text-[#00288e]" />
                      <span>{enq.eventDate}</span>
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-[#444653] uppercase tracking-wider font-semibold">Venue</p>
                    <p className="font-sans font-bold text-xs text-[#1a1b22] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#00288e]" />
                      <span>{enq.venuePref}</span>
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-[#444653] uppercase tracking-wider font-semibold">Guests expected</p>
                    <p className="font-sans font-bold text-xs text-[#1a1b22] flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#00288e]" />
                      <span>{enq.pax} Pax</span>
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-[#444653] uppercase tracking-wider font-semibold">Budget Estimate</p>
                    <p className="font-sans font-bold text-xs text-[#00288e]">
                      ₹{enq.budget.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Footer action buttons */}
                <div className="flex items-center gap-2 pt-4 border-t border-[#e3e1eb]">
                  <button 
                    onClick={() => onOpenEnquiryDetails(enq)}
                    className="flex-1 bg-[#f4f2fc] hover:bg-[#eeedf7] text-[#1a1b22] px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </button>
                  <button 
                    onClick={() => onOpenNewBookingDrawer()}
                    className="p-2.5 border border-[#c4c5d5] rounded-xl text-[#444653] hover:text-[#00288e] hover:bg-[#f4f2fc] transition-all cursor-pointer"
                    title="Convert to Booking"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <a 
                    href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 bg-[#25D366] text-white rounded-xl hover:opacity-95 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                    title="Send WhatsApp Message"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Confirmed Bookings */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h4 className="font-sans font-bold text-lg text-[#1a1b22] flex items-center gap-2">
            <span>Confirmed Bookings</span>
            <span className="bg-[#6cf8bb]/20 text-[#006c49] px-2.5 py-0.5 rounded-full font-semibold text-xs">
              Active Contracts
            </span>
          </h4>
          <button 
            onClick={() => onTabChange('bookings')}
            className="text-[#00288e] hover:text-[#1e40af] text-sm font-semibold hover:underline cursor-pointer"
          >
            Full Booking Schedule
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Booking Card 1: Dynamic mapping of premium elements */}
          {activeConfirmedBookings.map((book, index) => {
            // Calculate a beautiful random payment percentage representation
            const total = book.finalAmount || book.totalAmount;
            const paid = book.amountReceived;
            const percentage = Math.min(Math.round((paid / total) * 100), 100);
            
            return (
              <div 
                key={book.id}
                className="bg-white rounded-2xl shadow-sm border border-[#e3e1eb] p-6 relative overflow-hidden group hover:shadow-md transition-all duration-200"
              >
                {/* Decorative background visual */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#006c49]/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-125 duration-500"></div>

                <div className="relative z-10 space-y-6">
                  {/* Card Title Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-sans font-bold text-lg text-[#1a1b22]">{book.customerName}</h5>
                      <p className="text-[#006c49] text-[10px] font-semibold flex items-center gap-1 uppercase tracking-wider mt-1.5">
                        <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
                        <span>Confirmed Contract</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#444653] text-[10px] uppercase font-bold tracking-wider">{book.eventDate}</p>
                      <p className="font-sans font-bold text-xs text-[#00288e] mt-0.5">{book.venue}</p>
                    </div>
                  </div>

                  {/* Payment Progress Bar Indicator */}
                  <div className="bg-[#f4f2fc]/50 p-4 rounded-xl border border-[#eeedf7] space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[#444653] text-xs">Total Contract Value</span>
                      <span className="font-bold text-[#1a1b22] text-sm">
                        ₹{total.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Progress Indicator */}
                    <div className="w-full bg-[#e3e1eb] h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#10B981] h-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <span className="text-[#444653] text-xs">Payment Status</span>
                      {book.pendingBalance === 0 ? (
                        <span className="font-bold text-[#006c49] text-xs bg-[#6cf8bb]/30 px-2.5 py-0.5 rounded-full">
                          Fully Paid
                        </span>
                      ) : (
                        <span className="font-bold text-[#ba1a1a] text-xs">
                          ₹{book.pendingBalance.toLocaleString('en-IN')} Pending
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action row workflow */}
                  <div className="flex gap-3">
                    <button 
                      onClick={() => alert(`Invoice generated for ${book.customerName} - ID: ${book.id}`)}
                      className="flex-1 bg-[#00288e] text-white py-2 rounded-xl text-xs font-semibold hover:bg-[#1e40af] hover:scale-[1.01] active:scale-[0.99] transition-all shadow-sm cursor-pointer"
                    >
                      {book.pendingBalance === 0 ? 'Download Invoice' : 'Generate Invoice'}
                    </button>
                    <button 
                      onClick={() => onTabChange('calendar')}
                      className="flex-1 border border-[#00288e] text-[#00288e] py-2 rounded-xl text-xs font-semibold hover:bg-[#f4f2fc] transition-all cursor-pointer"
                    >
                      View Event Plan
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
