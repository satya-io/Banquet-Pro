import { useState, useEffect } from 'react';
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
import { LayoutDashboard, Inbox, CalendarCheck, Calendar as CalendarIcon, ChefHat, Settings } from 'lucide-react';
import { Language, translations } from './translations';

export default function App() {
  // 1. Tenants master state
  const [tenants, setTenants] = useState<Tenant[]>(() => {
    const saved = localStorage.getItem('tenants');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'TENANT-DEFAULT',
        name: 'Grand Royal Banquet Hall',
        ownerUsername: 'admin',
        ownerPassword: 'admin123',
        staffUsername: 'sales',
        staffPassword: 'sales123',
        enquiries: initialEnquiries,
        bookings: initialBookings,
        venueSpaces: initialVenueSpaces,
        cateringItems: initialCateringItems,
        settings: initialVenueSettings,
        teamMembers: initialTeamMembers
      }
    ];
  });

  const [activeTenantId, setActiveTenantId] = useState<string>(() => {
    return localStorage.getItem('activeTenantId') || 'TENANT-DEFAULT';
  });

  // Find the current active tenant
  const activeTenant = tenants.find(t => t.id === activeTenantId) || tenants[0];

  // Load and preserve state with robust localStorage Fallbacks
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    return (localStorage.getItem('activeTab') as ActiveTab) || 'dashboard';
  });

  const [searchQuery, setSearchQuery] = useState('');

  // 2. Active Tenant dynamic sub-states
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => activeTenant.enquiries);
  const [bookings, setBookings] = useState<Booking[]>(() => activeTenant.bookings);
  const [cateringItems, setCateringItems] = useState<CateringItem[]>(() => activeTenant.cateringItems);
  const [venueSpaces, setVenueSpaces] = useState<VenueSpace[]>(() => activeTenant.venueSpaces);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => activeTenant.teamMembers);
  const [venueSettings, setVenueSettings] = useState<VenueSettings>(() => activeTenant.settings);

  const [activeAdminId, setActiveAdminId] = useState(() => {
    return localStorage.getItem('activeAdminId') || 'TEAM-001';
  });

  // Dialog State controls
  const [newEnquiryOpen, setNewEnquiryOpen] = useState(false);
  const [newBookingOpen, setNewBookingOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Conversion prefill helper
  const [prefillEnquiry, setPrefillEnquiry] = useState<Enquiry | null>(null);

  // Active Enquiry selection in panel
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  // Language State
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('language') as Language) || 'en';
  });

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  // User Role State
  const [userRole, setUserRole] = useState<'admin' | 'sales_agent' | null>(() => {
    return (localStorage.getItem('userRole') as 'admin' | 'sales_agent') || null;
  });

  const handleLogin = (tenantId: string, role: 'admin' | 'sales_agent') => {
    setActiveTenantId(tenantId);
    setUserRole(role);
    localStorage.setItem('userRole', role);
    localStorage.setItem('activeTenantId', tenantId);

    // Sync sub-states instantly on login
    const targetTenant = tenants.find(t => t.id === tenantId);
    if (targetTenant) {
      setEnquiries(targetTenant.enquiries);
      setBookings(targetTenant.bookings);
      setCateringItems(targetTenant.cateringItems);
      setVenueSpaces(targetTenant.venueSpaces);
      setVenueSettings(targetTenant.settings);
      setTeamMembers(targetTenant.teamMembers);
    }

    if (role === 'sales_agent') {
      setActiveTab('bookings');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    localStorage.removeItem('userRole');
  };

  // Sync sub-states when the active tenant id changes
  useEffect(() => {
    const tenant = tenants.find(t => t.id === activeTenantId);
    if (tenant) {
      setEnquiries(tenant.enquiries);
      setBookings(tenant.bookings);
      setCateringItems(tenant.cateringItems);
      setVenueSpaces(tenant.venueSpaces);
      setVenueSettings(tenant.settings);
      setTeamMembers(tenant.teamMembers);
    }
  }, [activeTenantId]);

  // Synchronize changes to current active tenant list and serialize
  useEffect(() => {
    setTenants(prev => prev.map(t => {
      if (t.id === activeTenantId) {
        return {
          ...t,
          enquiries,
          bookings,
          venueSpaces,
          cateringItems,
          settings: venueSettings,
          teamMembers
        };
      }
      return t;
    }));
  }, [enquiries, bookings, venueSpaces, cateringItems, venueSettings, teamMembers, activeTenantId]);

  useEffect(() => {
    localStorage.setItem('tenants', JSON.stringify(tenants));
  }, [tenants]);

  useEffect(() => {
    localStorage.setItem('activeTenantId', activeTenantId);
  }, [activeTenantId]);

  // Active Admin Details Lookup
  const activeAdmin = teamMembers.find(m => m.id === activeAdminId) || teamMembers[0] || initialTeamMembers[0];

  // Save changes to local storage
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('activeAdminId', activeAdminId);
  }, [activeAdminId]);

  // Handlers
  const handleAddEnquiry = (enq: Enquiry) => {
    setEnquiries(prev => [enq, ...prev]);
    // Set selected for high visibility
    setSelectedEnquiry(enq);
    setActiveTab('enquiries');
  };

  const handleUpdateEnquiry = (updated: Enquiry) => {
    setEnquiries(prev => prev.map(e => e.id === updated.id ? updated : e));
  };

  const handleDeleteEnquiry = (id: string) => {
    setEnquiries(prev => prev.filter(e => e.id !== id));
  };

  const handleAddBooking = (book: Booking) => {
    setBookings(prev => [book, ...prev]);
    setActiveTab('bookings');

    // If converted from a prefilled lead, update the lead status to complete/negotiating
    if (prefillEnquiry) {
      const updatedLead: Enquiry = {
        ...prefillEnquiry,
        status: 'Negotiating',
        notes: [
          ...prefillEnquiry.notes,
          {
            time: new Date().toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            }),
            text: `Converted to Active booking Contract ID: ${book.id}`
          }
        ]
      };
      handleUpdateEnquiry(updatedLead);
      setPrefillEnquiry(null);
    }
  };

  const handleUpdateBooking = (updated: Booking) => {
    setBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
  };

  const handleDeleteBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  const handleAddCateringItem = (item: CateringItem) => {
    setCateringItems(prev => [item, ...prev]);
  };

  const handleUpdateCateringItem = (updated: CateringItem) => {
    setCateringItems(prev => prev.map(item => item.id === updated.id ? updated : item));
  };

  const handleDeleteCateringItem = (id: string) => {
    setCateringItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAddVenueSpace = (space: VenueSpace) => {
    setVenueSpaces(prev => [...prev, space]);
  };

  const handleDeleteVenueSpace = (id: string) => {
    setVenueSpaces(prev => prev.filter(s => s.id !== id));
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

  const handleToggleProfile = () => {
    setActiveTab('settings');
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'dashboard':
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
            onUpdateSettings={setVenueSettings}
            teamMembers={teamMembers}
            onSelectActiveAdmin={handleSelectActiveAdmin}
            activeAdminId={activeAdminId}
            venueSpaces={venueSpaces}
            onAddVenueSpace={handleAddVenueSpace}
            onDeleteVenueSpace={handleDeleteVenueSpace}
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
              v1.5 Enterprise Suite
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
