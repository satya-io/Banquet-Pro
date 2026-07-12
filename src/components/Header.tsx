import { Search, Bell, Menu, User, LogOut, Languages } from 'lucide-react';
import { ActiveTab } from '../types';
import { Language, translations } from '../translations';

interface HeaderProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  activeTab: ActiveTab;
  onMobileMenuToggle: () => void;
  adminName: string;
  adminAvatar: string;
  onToggleProfile: () => void;
  userRole: 'admin' | 'sales_agent';
  onLogout: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function Header({
  searchQuery,
  onSearchQueryChange,
  activeTab,
  onMobileMenuToggle,
  adminName,
  adminAvatar,
  onToggleProfile,
  userRole,
  onLogout,
  language,
  onLanguageChange
}: HeaderProps) {
  const t = translations[language];

  // Get dynamic placeholder based on current tab
  const getSearchPlaceholder = () => {
    switch (activeTab) {
      case 'enquiries':
        return language === 'en' ? 'Search enquiries, dates, or clients...' : 'पूछताछ, तिथियां या ग्राहक खोजें...';
      case 'bookings':
        return language === 'en' ? 'Search bookings, IDs, or clients...' : 'बुकिंग, आईडी या ग्राहक खोजें...';
      case 'menu':
        return language === 'en' ? 'Search menu items...' : 'मेनू आइटम खोजें...';
      case 'settings':
        return language === 'en' ? 'Search settings...' : 'सेटिंग्स खोजें...';
      default:
        return t.searchPlaceholder;
    }
  };

  return (
    <header className="flex justify-between items-center w-full px-3 sm:px-6 py-4 bg-white border-b border-[#e3e1eb] sticky top-0 z-30 shadow-sm">
      {/* Search Input on Desktop */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1">
        {/* Mobile menu button */}
        <button 
          onClick={onMobileMenuToggle}
          className="lg:hidden p-1.5 sm:p-2 hover:bg-[#f4f2fc] rounded-xl transition-all text-[#1a1b22]"
          aria-label="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full max-w-sm hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444653]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder={getSearchPlaceholder()}
            className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-full pl-11 pr-4 py-2 text-xs text-[#1a1b22] placeholder-[#444653]/60 focus:outline-none focus:ring-2 focus:ring-[#00288e] focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Right side user / notifications actions */}
      <div className="flex items-center gap-2 sm:gap-4 ml-2 sm:ml-4 shrink-0">
        
        {/* Language Switcher */}
        <div className="flex items-center gap-1 bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl px-2.5 py-1.5 shadow-sm">
          <Languages className="w-3.5 h-3.5 text-[#00288e]" />
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as Language)}
            className="bg-transparent border-none text-[10.5px] font-bold text-[#1a1b22] focus:outline-none cursor-pointer"
          >
            <option value="en">🇬🇧 EN</option>
            <option value="hi">🇮🇳 HI</option>
          </select>
        </div>

        <div className="h-6 w-px bg-[#e3e1eb]"></div>

        {/* User Role Badge */}
        <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
          userRole === 'admin' 
            ? 'bg-[#00288e]/10 text-[#00288e]' 
            : 'bg-[#6b4200]/15 text-[#6b4200]'
        }`}>
          {userRole === 'admin' ? t.admin : t.sales}
        </span>

        <button className="relative p-1.5 sm:p-2 text-[#444653] hover:bg-[#f4f2fc] rounded-full transition-all cursor-pointer">
          <Bell className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ba1a1a] rounded-full border-2 border-white"></span>
        </button>
        <div className="h-6 w-px bg-[#e3e1eb] hidden sm:block"></div>

        {/* User Profile / Identity Button */}
        <button
          onClick={onToggleProfile}
          className="flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-3 py-1 sm:py-1.5 hover:bg-[#f4f2fc] rounded-xl transition-all cursor-pointer group"
        >
          <span className="text-xs font-semibold text-[#1a1b22] hidden sm:block group-hover:text-[#00288e] max-w-[80px] truncate">
            {userRole === 'admin' ? t.admin : t.sales}
          </span>
          {adminAvatar ? (
            <img 
              src={adminAvatar} 
              alt={adminName} 
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-[#c4c5d5]" 
            />
          ) : (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#6cf8bb] text-[#00714d] flex items-center justify-center font-bold text-[10px] sm:text-xs">
              {adminName.split(' ').map(n => n[0]).join('')}
            </div>
          )}
        </button>

        <div className="h-6 w-px bg-[#e3e1eb]"></div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="p-1.5 sm:p-2 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-xl transition-all cursor-pointer flex items-center gap-1"
          title={t.logout}
        >
          <LogOut className="w-4.5 h-4.5" />
          <span className="text-[11px] font-bold hidden sm:inline">{t.logout}</span>
        </button>
      </div>
    </header>
  );
}
