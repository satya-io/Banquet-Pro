import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, MapPin, Users, 
  IndianRupee, CheckCircle2, Clock, Plus, Info, X, Filter, Sparkles
} from 'lucide-react';
import { Booking, Enquiry } from '../types';
import { Language, translations } from '../translations';

interface CalendarViewProps {
  searchQuery: string;
  bookings: Booking[];
  enquiries: Enquiry[];
  onOpenNewBookingDrawer: () => void;
  role?: 'admin' | 'sales_agent';
  language: Language;
}

interface CalendarEvent {
  id: string;
  title: string;
  customerName: string;
  date: string;
  venue: string;
  type: 'Booking' | 'Enquiry';
  status: string;
  paymentStatus?: string;
  pax?: number;
  amount?: number;
  timeSlot?: 'Morning' | 'Evening';
  startTime?: string;
}

export default function CalendarView({
  searchQuery,
  bookings,
  enquiries,
  onOpenNewBookingDrawer,
  role = 'admin',
  language
}: CalendarViewProps) {
  // We can default the calendar date to October 2024
  const [currentYear, setCurrentYear] = useState(2024);
  const [currentMonth, setCurrentMonth] = useState(9); // 0-indexed, so 9 is October
  const [selectedDayEvents, setSelectedDayEvents] = useState<CalendarEvent[]>([]);
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  const t = translations[language];

  // Month names list
  const monthNames = t.months;

  // Map enquiries and bookings to a unified CalendarEvent model
  const allEvents: CalendarEvent[] = [
    ...bookings.map(b => ({
      id: b.id,
      title: b.eventType,
      customerName: b.customerName,
      date: b.eventDate,
      venue: b.venue,
      type: 'Booking' as const,
      status: b.status,
      paymentStatus: b.paymentStatus,
      pax: 150, // default or custom
      amount: b.finalAmount,
      timeSlot: b.timeSlot,
      startTime: b.startTime
    })),
    ...(role !== 'sales_agent' ? enquiries.map(e => ({
      id: e.id,
      title: `${e.venuePref} Lead`,
      customerName: e.customerName,
      date: e.eventDate,
      venue: e.venuePref,
      type: 'Enquiry' as const,
      status: e.status,
      pax: e.pax,
      amount: e.budget
    })) : [])
  ];

  // Helper to change months
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  // Calendar math logic
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);

  // Formats date numbers as string matching 'YYYY-MM-DD'
  const formatDateString = (day: number) => {
    const mm = String(currentMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${currentYear}-${mm}-${dd}`;
  };

  // Grid list construction
  const calendarCells = [];
  // Blank days before the 1st
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(null);
  }
  // Days of the month
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(d);
  }

  // Handle clicking on a calendar day
  const handleDayClick = (dayNum: number | null) => {
    if (!dayNum) return;
    const dateStr = formatDateString(dayNum);
    const dayEvents = allEvents.filter(ev => ev.date === dateStr);
    setSelectedDayEvents(dayEvents);
    setSelectedDateStr(dateStr);
  };

  // Match event styles
  const getEventBadgeClass = (event: CalendarEvent) => {
    if (event.type === 'Enquiry') {
      return 'bg-[#dde1ff] text-[#00288e] border-[#00288e]/30';
    }
    if (event.paymentStatus === 'Fully Paid') {
      return 'bg-[#6cf8bb]/30 text-[#00714d] border-[#6cf8bb]';
    }
    if (event.paymentStatus === 'Overdue') {
      return 'bg-[#ffdad6] text-[#ba1a1a] border-[#ffdad6]';
    }
    return 'bg-[#ffddb8] text-[#6b4200] border-[#ffddb8]';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans font-bold text-3xl text-[#1a1b22] tracking-tight">{t.calendarTitle}</h2>
          <p className="text-[#444653] text-sm mt-1">{t.calendarSubtitle}</p>
        </div>
        <button
          onClick={onOpenNewBookingDrawer}
          className="bg-[#00288e] text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-[#1e40af] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>{t.addCustomEvent}</span>
        </button>
      </div>

      {/* Main Grid: Calendar matrix left, Event details right */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Calendar Grid card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e3e1eb] p-6 xl:col-span-2">
          {/* Calendar Month Navigation Control Header */}
          <div className="flex justify-between items-center mb-6 border-b border-[#e3e1eb] pb-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#00288e]" />
              <h3 className="font-sans font-bold text-lg text-[#1a1b22]">
                {monthNames[currentMonth]} {currentYear}
              </h3>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={handlePrevMonth}
                className="p-2 hover:bg-[#f4f2fc] rounded-lg border border-[#c4c5d5] text-[#1a1b22] cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={handleNextMonth}
                className="p-2 hover:bg-[#f4f2fc] rounded-lg border border-[#c4c5d5] text-[#1a1b22] cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Week Days Name Row */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-[#444653] uppercase tracking-wider">
            {t.days.map((dName) => (
              <div key={dName}>{dName}</div>
            ))}
          </div>

          {/* Calendar Cells Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarCells.map((day, index) => {
              const dateStr = day ? formatDateString(day) : '';
              const dayEvents = day ? allEvents.filter(ev => ev.date === dateStr) : [];
              const isSelected = selectedDateStr === dateStr;

              return (
                <div
                  key={index}
                  onClick={() => handleDayClick(day)}
                  className={`min-h-[90px] border rounded-xl p-2 flex flex-col justify-between transition-all cursor-pointer relative ${
                    !day 
                      ? 'bg-[#f4f2fc]/10 border-transparent cursor-default pointer-events-none' 
                      : isSelected
                      ? 'bg-[#f4f2fc] border-[#00288e] ring-1 ring-[#00288e]'
                      : 'bg-white border-[#e3e1eb] hover:bg-[#f4f2fc]/20'
                  }`}
                >
                  {/* Day Number */}
                  <span className={`text-xs font-bold ${
                    isSelected ? 'text-[#00288e]' : 'text-[#1a1b22]'
                  }`}>
                    {day}
                  </span>

                  {/* Day Events Indicator dots & list previews */}
                  <div className="space-y-1 mt-1.5 overflow-hidden">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div 
                        key={ev.id}
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded truncate border ${
                          ev.type === 'Booking' 
                            ? 'bg-[#6cf8bb]/20 text-[#00714d] border-[#10B981]/20' 
                            : 'bg-[#dde1ff]/40 text-[#00288e] border-[#00288e]/20'
                        }`}
                        title={`${ev.customerName} - ${ev.title}`}
                      >
                        {ev.customerName.split(' ')[0]}: {ev.venue.split(' ')[0]}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[8px] font-bold text-[#444653] text-center">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Activity Sidebar Panel */}
        <div className="space-y-6">
          {/* Panel Info Box */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#e3e1eb] p-6 space-y-4">
            <h4 className="font-sans font-bold text-base text-[#1a1b22] flex items-center gap-1.5">
              <Info className="w-4 h-4 text-[#00288e]" />
              <span>Agenda for Selected Slot</span>
            </h4>

            {selectedDateStr ? (
              <div className="space-y-4">
                <p className="text-xs text-[#00288e] font-bold uppercase tracking-wider bg-[#f4f2fc] px-3 py-1.5 rounded-lg border border-[#eeedf7]">
                  {selectedDateStr}
                </p>

                {selectedDayEvents.length === 0 ? (
                  <div className="text-center py-8 text-[#444653]/60 space-y-1">
                    <CheckCircle2 className="w-8 h-8 text-[#006c49] mx-auto opacity-70" />
                    <p className="font-bold text-xs">Hall Available</p>
                    <p className="text-[10px]">No bookings or active enquiries scheduled on this day.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedDayEvents.map((ev) => (
                      <div 
                        key={ev.id} 
                        className={`p-4 rounded-xl border space-y-3 shadow-sm ${
                          ev.type === 'Booking' ? 'bg-[#6cf8bb]/10 border-[#10B981]' : 'bg-[#dde1ff]/10 border-[#00288e]'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white border">
                              {ev.type}
                            </span>
                            <h5 className="font-sans font-bold text-sm text-[#1a1b22] mt-1.5">{ev.customerName}</h5>
                          </div>
                          <span className="font-mono text-[10px] text-[#444653]">{ev.id}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] text-[#444653] font-semibold">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#00288e]" />
                            <span>{ev.venue}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-[#00288e]" />
                            <span>{ev.pax} Pax</span>
                          </div>
                        </div>

                        {ev.type === 'Booking' && (
                          <div className="flex items-center gap-1.5 bg-white/60 p-2 rounded-lg border text-[10px] text-[#1a1b22] font-bold">
                            <Clock className="w-3.5 h-3.5 text-[#00288e]" />
                            <span>Slot: {ev.timeSlot || 'Morning'} ({ev.startTime || '10:00'})</span>
                          </div>
                        )}

                        {ev.type === 'Booking' && (
                          <div className="flex justify-between items-center bg-white p-2 rounded-lg border text-xs">
                            <span className="text-[#444653] font-semibold">Payment Status</span>
                            <span className={`font-bold uppercase text-[9px] px-2 py-0.5 rounded ${
                              ev.paymentStatus === 'Fully Paid' ? 'bg-[#10B981]/20 text-[#00714d]' : 'bg-[#ffddb8] text-[#6b4200]'
                            }`}>
                              {ev.paymentStatus}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-[#444653]/60">
                <CalendarIcon className="w-8 h-8 text-[#00288e] mx-auto opacity-70 mb-2" />
                <p className="font-bold text-xs">Select any calendar cell</p>
                <p className="text-[10px]">Click on a date to see its agenda timeline, manage bookings or verify slots.</p>
              </div>
            )}
          </div>

          {/* Quick Schedule Overview Info Block */}
          <div className="bg-[#dde1ff] text-[#001453] p-5 rounded-2xl border border-[#c4c5d5]/30">
            <h5 className="font-sans font-bold text-sm mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#173bab]" />
              <span>Catering & Hall Conflict Guard</span>
            </h5>
            <p className="text-xs leading-relaxed opacity-90">
              Banquet Pro automatically screens double-bookings. When registering a contract, any overlapping hours in the same venue will prompt verification steps.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
