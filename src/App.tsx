import { useState, useEffect, useCallback } from 'react';
import { 
  initialEnquiries, initialBookings, initialCateringItems, 
  initialVenueSpaces, initialTeamMembers, initialVenueSettings 
} from './data';
import { Enquiry, Booking, CateringItem, VenueSpace, TeamMember, VenueSettings, ActiveTab, Tenant } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import EnquiriesView from './components/EnquiriesView';
import BookingsView from './components/BookingsView';
import CalendarView from './components/CalendarView';
import MenuView from './components/MenuView';
import SettingsView from './components/SettingsView';
import NewEnquiryModal from './components/NewEnquiryModal';
import NewBookingDrawer from './components/NewBookingDrawer';
import LoginScreen from './components/LoginScreen';
import AppAdminPortal from './components/AppAdminPortal';
import { LayoutDashboard, Inbox, CalendarCheck, Calendar as CalendarIcon, ChefHat, Settings } from 'lucide-react';
import { Language, translations } from './translations';

// API imports
import { getAuthToken } from './api/client';
import { logoutApi } from './api/auth';
import * as enquiriesApi from './api/enquiries';
import * as bookingsApi from './api/bookings';
import * as menuApi from './api/menu';
import * as venuesApi from './api/venues';
import * as settingsApi from './api/settings';

export default function App() {
  // Auth state
  const [userRole, setUserRole] = useState<'admin' | 'sales_agent' | null>(() => {
    return (localStorage.getItem('userRole') as 'admin' | 'sales_agent') || null;
  });

  const [activeTenantId, setActiveTenantId] = useState<string>(() => {
    return localStorage.getItem('activeTenantId') || 'TENANT-DEFAULT';
  });

  const [tenantName, setTenantName] = useState<string>(() => {
    return localStorage.getItem('tenantName') || 'Luxury Banquet Workspace';
  });

  // UI state
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    return (localStorage.getItem('activeTab') as ActiveTab) || 'dashboard';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [newEnquiryOpen, setNewEnquiryOpen] = useState(false);
  const [newBookingOpen, setNewBookingOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prefillEnquiry, setPrefillEnquiry] = useState<Enquiry | null>(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Language State
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('language') as Language) || 'en';
  });

  // Data state — initialized from static data as fallback
  const [enquiries, setEnquiries] = useState<Enquiry[]>(initialEnquiries);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [cateringItems, setCateringItems] = useState<CateringItem[]>(initialCateringItems);
  const [venueSpaces, setVenueSpaces] = useState<VenueSpace[]>(initialVenueSpaces);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [venueSettings, setVenueSettings] = useState<VenueSettings>(initialVenueSettings);

  const [activeAdminId, setActiveAdminId] = useState(() => {
    return localStorage.getItem('activeAdminId') || 'TEAM-001';
  });

  // ─── Fetch All Data from API ─────────────────────────────────────────────────
  const fetchAllData = useCallback(async () => {
    if (!getAuthToken()) return;

    setIsLoading(true);
    try {
      const [enqData, bookData, menuData, venueData, settData, teamData] = await Promise.all([
        enquiriesApi.getEnquiries().catch(() => null),
        bookingsApi.getBookings().catch(() => null),
        menuApi.getMenuItems().catch(() => null),
        venuesApi.getVenueSpaces().catch(() => null),
        settingsApi.getSettings().catch(() => null),
        settingsApi.getTeamMembers().catch(() => null),
      ]);

      if (enqData) setEnquiries(enqData);
      if (bookData) setBookings(bookData);
      if (menuData) setCateringItems(menuData);
      if (venueData) setVenueSpaces(venueData);
      if (settData) setVenueSettings(settData);
      if (teamData) setTeamMembers(teamData);
    } catch (error) {
      console.error('Failed to fetch data from API:', error);
      // Graceful fallback — keep existing state (static data or last fetched)
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch data when user is authenticated
  useEffect(() => {
    if (userRole && getAuthToken()) {
      fetchAllData();
    }
  }, [userRole, fetchAllData]);

  // ─── Language ────────────────────────────────────────────────────────────────
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  // ─── Login / Logout ──────────────────────────────────────────────────────────
  const handleLogin = (tenantId: string, role: 'admin' | 'sales_agent', name?: string) => {
    setActiveTenantId(tenantId);
    setUserRole(role);
    if (name) setTenantName(name);
    localStorage.setItem('userRole', role);
    localStorage.setItem('activeTenantId', tenantId);
    if (name) localStorage.setItem('tenantName', name);

    setActiveTab('dashboard');
  };

  const handleLogout = async () => {
    await logoutApi();
    setUserRole(null);
    localStorage.removeItem('userRole');
    localStorage.removeItem('activeTenantId');
    localStorage.removeItem('tenantName');
    localStorage.removeItem('authToken');

    // Reset to defaults
    setEnquiries(initialEnquiries);
    setBookings(initialBookings);
    setCateringItems(initialCateringItems);
    setVenueSpaces(initialVenueSpaces);
    setTeamMembers(initialTeamMembers);
    setVenueSettings(initialVenueSettings);

    if (window.location.pathname === '/appadmin') {
      window.location.href = '/';
    }
  };


  // Active Admin Details Lookup
  const activeAdmin = teamMembers.find(m => m.id === activeAdminId) || teamMembers[0] || initialTeamMembers[0];

  // Save UI preferences to localStorage
  useEffect(() => { localStorage.setItem('activeTab', activeTab); }, [activeTab]);
  useEffect(() => { localStorage.setItem('activeAdminId', activeAdminId); }, [activeAdminId]);

  // ─── Data Handlers (with API sync) ──────────────────────────────────────────

  const handleAddEnquiry = async (enq: Enquiry) => {
    // Optimistic update
    setEnquiries(prev => [enq, ...prev]);
    setSelectedEnquiry(enq);
    setActiveTab('enquiries');
    // Sync to backend
    try {
      await enquiriesApi.createEnquiry(enq);
    } catch (error) {
      console.error('Failed to save enquiry to server:', error);
    }
  };

  const handleUpdateEnquiry = async (updated: Enquiry) => {
    setEnquiries(prev => prev.map(e => e.id === updated.id ? updated : e));
    try {
      await enquiriesApi.updateEnquiry(updated);
    } catch (error) {
      console.error('Failed to update enquiry on server:', error);
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    setEnquiries(prev => prev.filter(e => e.id !== id));
    try {
      await enquiriesApi.deleteEnquiry(id);
    } catch (error) {
      console.error('Failed to delete enquiry on server:', error);
    }
  };

  const handleAddBooking = async (book: Booking) => {
    setBookings(prev => [book, ...prev]);
    setActiveTab('bookings');

    // If converted from a prefilled lead, update the lead status
    if (prefillEnquiry) {
      const updatedLead: Enquiry = {
        ...prefillEnquiry,
        status: 'Negotiating',
        notes: [
          ...prefillEnquiry.notes,
          {
            time: new Date().toLocaleString('en-US', {
              month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
            }),
            text: `Converted to Active booking Contract ID: ${book.id}`
          }
        ]
      };
      handleUpdateEnquiry(updatedLead);
      setPrefillEnquiry(null);
    }

    try {
      await bookingsApi.createBooking(book);
    } catch (error) {
      console.error('Failed to save booking to server:', error);
    }
  };

  const handleUpdateBooking = async (updated: Booking) => {
    setBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
    try {
      await bookingsApi.updateBooking(updated);
    } catch (error) {
      console.error('Failed to update booking on server:', error);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
    try {
      await bookingsApi.deleteBooking(id);
    } catch (error) {
      console.error('Failed to delete booking on server:', error);
    }
  };

  const handleAddCateringItem = async (item: CateringItem) => {
    setCateringItems(prev => [item, ...prev]);
    try {
      await menuApi.createMenuItem(item);
    } catch (error) {
      console.error('Failed to save menu item to server:', error);
    }
  };

  const handleUpdateCateringItem = async (updated: CateringItem) => {
    setCateringItems(prev => prev.map(item => item.id === updated.id ? updated : item));
    try {
      await menuApi.updateMenuItem(updated);
    } catch (error) {
      console.error('Failed to update menu item on server:', error);
    }
  };

  const handleDeleteCateringItem = async (id: string) => {
    setCateringItems(prev => prev.filter(item => item.id !== id));
    try {
      await menuApi.deleteMenuItem(id);
    } catch (error) {
      console.error('Failed to delete menu item on server:', error);
    }
  };

  const handleAddVenueSpace = async (space: VenueSpace) => {
    setVenueSpaces(prev => [...prev, space]);
    try {
      await venuesApi.createVenueSpace(space);
    } catch (error) {
      console.error('Failed to save venue space to server:', error);
    }
  };

  const handleDeleteVenueSpace = async (id: string) => {
    setVenueSpaces(prev => prev.filter(s => s.id !== id));
    try {
      await venuesApi.deleteVenueSpace(id);
    } catch (error) {
      console.error('Failed to delete venue space on server:', error);
    }
  };

  const handleUpdateVenueSpace = async (updatedSpace: VenueSpace) => {
    setVenueSpaces(prev => prev.map(s => s.id === updatedSpace.id ? updatedSpace : s));
    try {
      await venuesApi.updateVenueSpace(updatedSpace.id, updatedSpace);
    } catch (error) {
      console.error('Failed to update venue space on server:', error);
    }
  };

  const handleUpdateSettings = async (newSettings: VenueSettings) => {
    setVenueSettings(newSettings);
    try {
      await settingsApi.updateSettings(newSettings);
    } catch (error) {
      console.error('Failed to update settings on server:', error);
    }
  };

  // Convert callback triggering Prefill
  const handleConvertToBooking = (enq: Enquiry) => {
    setPrefillEnquiry(enq);
    setNewBookingOpen(true);
  };

  // Switch Active identity operator
  const handleSelectActiveAdmin = (member: TeamMember) => {
    setActiveAdminId(member.id);
  };

  const handleAddTeamMember = async (member: TeamMember) => {
    setTeamMembers(prev => [...prev, member]);
    try {
      await settingsApi.addTeamMember(member);
    } catch (error) {
      console.error('Failed to add team member on server:', error);
    }
  };

  const handleUpdateTeamMember = async (id: string, updated: Partial<TeamMember>) => {
    setTeamMembers(prev => prev.map(m => m.id === id ? { ...m, ...updated } as TeamMember : m));
    try {
      await settingsApi.updateTeamMember(id, updated);
    } catch (error) {
      console.error('Failed to update team member on server:', error);
    }
  };

  const handleDeleteTeamMember = async (id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
    try {
      await settingsApi.deleteTeamMember(id);
    } catch (error) {
      console.error('Failed to delete team member on server:', error);
    }
  };

  const handleToggleProfile = () => {
    setActiveTab('settings');
  };

  const renderActiveScreen = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#00288e]/20 border-t-[#00288e] rounded-full animate-spin mx-auto"></div>
            <p className="text-[#444653] text-sm font-semibold">Loading data from server...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        if (userRole === 'sales_agent') {
          return (
            <CalendarView 
              searchQuery={searchQuery}
              bookings={bookings}
              enquiries={enquiries}
              onOpenNewBookingDrawer={() => {
                setPrefillEnquiry(null);
                setNewBookingOpen(true);
              }}
              role={userRole}
              language={language}
            />
          );
        }
        return (
          <DashboardView 
            searchQuery={searchQuery}
            enquiries={enquiries}
            bookings={bookings}
            onTabChange={setActiveTab}
            onOpenEnquiryDetails={(enq) => {
              setSelectedEnquiry(enq);
              setActiveTab('enquiries');
            }}
            onOpenNewBookingDrawer={() => {
              setPrefillEnquiry(null);
              setNewBookingOpen(true);
            }}
            onOpenNewEnquiryModal={() => setNewEnquiryOpen(true)}
          />
        );
      case 'enquiries':
        return (
          <EnquiriesView 
            searchQuery={searchQuery}
            enquiries={enquiries}
            onAddEnquiry={handleAddEnquiry}
            onUpdateEnquiry={handleUpdateEnquiry}
            onDeleteEnquiry={handleDeleteEnquiry}
            onConvertToBooking={handleConvertToBooking}
            selectedEnquiry={selectedEnquiry}
            onSelectEnquiry={setSelectedEnquiry}
            onOpenNewEnquiryModal={() => setNewEnquiryOpen(true)}
            cateringItems={cateringItems}
          />
        );
      case 'bookings':
        return (
          <BookingsView 
            searchQuery={searchQuery}
            bookings={bookings}
            onAddBooking={handleAddBooking}
            onUpdateBooking={handleUpdateBooking}
            onDeleteBooking={handleDeleteBooking}
            onOpenNewBookingDrawer={() => {
              setPrefillEnquiry(null);
              setNewBookingOpen(true);
            }}
            role={userRole || 'admin'}
            language={language}
            cateringItems={cateringItems}
          />
        );
      case 'calendar':
        return (
          <CalendarView 
            searchQuery={searchQuery}
            bookings={bookings}
            enquiries={enquiries}
            onOpenNewBookingDrawer={() => {
              setPrefillEnquiry(null);
              setNewBookingOpen(true);
            }}
            role={userRole || 'admin'}
            language={language}
          />
        );
      case 'menu':
        return (
          <MenuView 
            searchQuery={searchQuery}
            cateringItems={cateringItems}
            onAddCateringItem={handleAddCateringItem}
            onUpdateCateringItem={handleUpdateCateringItem}
            onDeleteCateringItem={handleDeleteCateringItem}
          />
        );
      case 'settings':
        return (
          <SettingsView 
            venueSettings={venueSettings}
            onUpdateSettings={handleUpdateSettings}
            teamMembers={teamMembers}
            onSelectActiveAdmin={handleSelectActiveAdmin}
            activeAdminId={activeAdminId}
            venueSpaces={venueSpaces}
            onAddVenueSpace={handleAddVenueSpace}
            onDeleteVenueSpace={handleDeleteVenueSpace}
            onUpdateVenueSpace={handleUpdateVenueSpace}
            onAddTeamMember={handleAddTeamMember}
            onUpdateTeamMember={handleUpdateTeamMember}
            onDeleteTeamMember={handleDeleteTeamMember}
            role={userRole || 'admin'}
            tenantId={activeTenantId || ''}
          />
        );
      default:
        return <div className="text-[#1a1b22] text-sm font-bold">Screen under active renovation.</div>;
    }
  };

  if (userRole === null) {
    return (
      <LoginScreen 
        onLogin={handleLogin} 
        language={language} 
        onLanguageChange={handleLanguageChange} 
      />
    );
  }

  if (activeTenantId === 'TENANT-DEFAULT') {
    return (
      <AppAdminPortal 
        onLogout={handleLogout}
        language={language}
        onLanguageChange={handleLanguageChange}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf8ff] flex text-[#1a1b22]">
      {/* 1. Desktop Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        adminName={activeAdmin.name}
        adminRole={activeAdmin.role}
        adminAvatar={activeAdmin.avatar}
        userRole={userRole}
        language={language}
        venueName={venueSettings.name}
      />

      {/* 2. Mobile Nav Backdrop / Drawer */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-all duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-64 h-full bg-white p-5 flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-[#e3e1eb] pb-3">
                <div className="w-8 h-8 rounded bg-[#00288e]/15 flex items-center justify-center text-[#00288e] font-extrabold text-xs">BP</div>
                <h2 className="font-bold text-base text-[#00288e]">Banquet Pro</h2>
              </div>
              <nav className="space-y-1">
                {(userRole === 'sales_agent'
                  ? [
                      { id: 'bookings' as ActiveTab, label: translations[language].bookings, icon: CalendarCheck },
                      { id: 'calendar' as ActiveTab, label: translations[language].calendar, icon: CalendarIcon }
                    ]
                  : [
                      { id: 'dashboard' as ActiveTab, label: translations[language].dashboard, icon: LayoutDashboard },
                      { id: 'enquiries' as ActiveTab, label: translations[language].enquiries, icon: Inbox },
                      { id: 'bookings' as ActiveTab, label: translations[language].bookings, icon: CalendarCheck },
                      { id: 'calendar' as ActiveTab, label: translations[language].calendar, icon: CalendarIcon },
                      { id: 'menu' as ActiveTab, label: translations[language].menu, icon: ChefHat },
                      { id: 'settings' as ActiveTab, label: translations[language].settings, icon: Settings }
                    ]
                ).map(m => {
                  const Icon = m.icon;
                  const active = activeTab === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        setActiveTab(m.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        active ? 'bg-[#dde1ff] text-[#00288e]' : 'text-[#444653]'
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
            <div className="text-[10px] text-[#444653] font-bold uppercase tracking-widest text-center py-2 bg-[#f4f2fc] rounded-lg">
              v1.0.0 Enterprise Suite
            </div>
          </div>
        </div>
      )}

      {/* 3. Main content frame - ADDED lg:pl-64 to prevent sidebar overlap */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Header 
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          activeTab={activeTab}
          onMobileMenuToggle={() => setMobileMenuOpen(prev => !prev)}
          adminName={userRole === 'sales_agent' ? (language === 'hi' ? 'सेल्स कंसलटेंट' : 'Sales Consultant') : activeAdmin.name}
          adminAvatar={userRole === 'sales_agent' ? '' : activeAdmin.avatar}
          onToggleProfile={handleToggleProfile}
          userRole={userRole}
          onLogout={handleLogout}
          language={language}
          onLanguageChange={handleLanguageChange}
          bookings={bookings}
          enquiries={enquiries}
        />

        {/* Core application body viewport */}
        <main className="flex-1 p-6 md:p-8 lg:pl-10 pb-24 lg:pb-10 overflow-y-auto max-w-7xl mx-auto w-full">
          {renderActiveScreen()}
        </main>
      </div>

      {/* 4. Mobile Bottom Quick Tabs Bar (Priceless usability) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#e3e1eb] p-3 flex justify-around items-center z-40 shadow-xl">
        {(userRole === 'sales_agent'
          ? [
              { id: 'dashboard' as ActiveTab, label: translations[language].dashboard, icon: LayoutDashboard },
              { id: 'enquiries' as ActiveTab, label: translations[language].enquiries, icon: Inbox },
              { id: 'bookings' as ActiveTab, label: translations[language].bookings, icon: CalendarCheck },
              { id: 'calendar' as ActiveTab, label: translations[language].calendar, icon: CalendarIcon }
            ]
          : [
              { id: 'dashboard' as ActiveTab, label: translations[language].dashboard, icon: LayoutDashboard },
              { id: 'enquiries' as ActiveTab, label: translations[language].enquiries, icon: Inbox },
              { id: 'bookings' as ActiveTab, label: translations[language].bookings, icon: CalendarCheck },
              { id: 'menu' as ActiveTab, label: translations[language].menu, icon: ChefHat }
            ]
        ).map(tb => {
          const Icon = tb.icon;
          const active = activeTab === tb.id;
          return (
            <button
              key={tb.id}
              onClick={() => setActiveTab(tb.id)}
              className={`flex flex-col items-center gap-1 cursor-pointer ${
                active ? 'text-[#00288e]' : 'text-[#444653]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-bold">{tb.label}</span>
            </button>
          );
        })}
      </div>

      {/* Global workflow builders */}
      <NewEnquiryModal 
        isOpen={newEnquiryOpen}
        onClose={() => setNewEnquiryOpen(false)}
        onAddEnquiry={handleAddEnquiry}
        venueSpaces={venueSpaces.map(s => s.name)}
        cateringItems={cateringItems}
        bookings={bookings}
      />

      <NewBookingDrawer 
        isOpen={newBookingOpen}
        onClose={() => {
          setNewBookingOpen(false);
          setPrefillEnquiry(null);
        }}
        onAddBooking={handleAddBooking}
        venueSpaces={venueSpaces.map(s => s.name)}
        prefillEnquiry={prefillEnquiry}
        role={userRole || 'admin'}
        bookings={bookings}
        cateringItems={cateringItems}
        language={language}
      />
    </div>
  );
}
