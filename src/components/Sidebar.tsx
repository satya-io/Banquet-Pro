import { LayoutDashboard, Inbox, CalendarCheck, Calendar, ChefHat, Settings, Sparkles } from 'lucide-react';
import { ActiveTab } from '../types';
import { Language, translations } from '../translations';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  adminName: string;
  adminRole: string;
  adminAvatar: string;
  userRole?: 'admin' | 'sales_agent';
  language: Language;
  venueName?: string;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  adminName,
  adminRole,
  adminAvatar,
  userRole = 'admin',
  language,
  venueName
}: SidebarProps) {
  const t = translations[language];

  const allMenuItems = [
    { id: 'dashboard' as ActiveTab, label: t.dashboard, icon: LayoutDashboard },
    { id: 'enquiries' as ActiveTab, label: t.enquiries, icon: Inbox, badge: language === 'en' ? '8 New' : '8 नया' },
    { id: 'bookings' as ActiveTab, label: t.bookings, icon: CalendarCheck },
    { id: 'calendar' as ActiveTab, label: t.calendar, icon: Calendar },
    { id: 'menu' as ActiveTab, label: t.menu, icon: ChefHat },
    { id: 'settings' as ActiveTab, label: t.settings, icon: Settings }
  ];

  // Filter based on role
  const menuItems = userRole === 'sales_agent'
    ? allMenuItems.filter(item => item.id === 'bookings' || item.id === 'calendar')
    : allMenuItems;

  return (
    <aside className="hidden lg:flex flex-col h-screen w-64 fixed left-0 top-0 bg-white border-r border-[#e3e1eb] z-40 py-6">
      {/* Brand Header */}
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#00288e]/10 flex items-center justify-center text-[#00288e]">
          <svg className="w-6 h-6" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2C10.0589 2 2 10.0589 2 20C2 29.9411 10.0589 38 20 38C29.9411 38 38 29.9411 38 20C38 10.0589 29.9411 2 20 2ZM20 34C12.268 34 6 27.732 6 20C6 12.268 12.268 6 20 6C27.732 6 34 12.268 34 20C34 27.732 27.732 34 20 34Z" fill="currentColor"/>
            <path d="M26.2929 15.2929L19 22.5858L15.7071 19.2929C15.3166 18.9024 14.6834 18.9024 14.2929 19.2929C13.9024 19.6834 13.9024 20.3166 14.2929 20.7071L18.2929 24.7071C18.6834 25.0976 19.3166 25.0976 19.7071 24.7071L27.7071 16.7071C28.0976 16.3166 28.0976 15.6834 27.7071 15.2929C27.3166 14.9024 26.6834 14.9024 26.2929 15.2929ZM20 34C12.268 34 6 27.732 6 20C6 12.268 12.268 6 20 6C27.732 6 34 12.268 34 20C34 27.732 27.732 34 20 34Z" fill="currentColor" opacity="0.3"/>
          </svg>
        </div>
        <div>
          <h1 className="font-sans font-bold text-sm text-[#00288e] tracking-tight leading-tight truncate max-w-[150px]" title={venueName || t.brandTitle}>
            {venueName || t.brandTitle}
          </h1>
          <p className="text-[10px] font-sans font-semibold uppercase tracking-widest text-[#444653]/70 mt-0.5">
            {language === 'en' ? 'Premium Venue' : 'प्रीमियम वेन्यू'}
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-150 group font-sans text-sm ${
                isActive
                  ? 'text-[#00288e] font-bold border-r-4 border-[#00288e] bg-[#f4f2fc]'
                  : 'text-[#444653] hover:text-[#1a1b22] hover:bg-[#eeedf7]'
              }`}
            >
              <div className="flex items-center gap-3">
                <IconComponent className={`w-5 h-5 ${isActive ? 'text-[#00288e]' : 'text-[#444653] group-hover:text-[#1a1b22]'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#e3e1eb] text-[#1a1b22]">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Trial / Promo Card */}
      <div className="px-4 mb-4">
        <div className="p-4 bg-[#dde1ff] text-[#001453] rounded-2xl flex flex-col gap-3 border border-[#c4c5d5]/30">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#173bab]" />
            <p className="text-xs font-semibold font-sans">
              {language === 'en' ? 'Trial ends in 12 days' : 'ट्रायल 12 दिनों में समाप्त होगा'}
            </p>
          </div>
          <button className="w-full bg-[#00288e] text-white py-2 rounded-xl text-xs font-semibold hover:bg-[#1e40af] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm">
            {language === 'en' ? 'Upgrade Plan' : 'प्लान अपग्रेड करें'}
          </button>
        </div>
      </div>

      {/* User Profile Section at Bottom */}
      <div className="px-4 pt-4 border-t border-[#e3e1eb]">
        <div className="flex items-center gap-3 p-2 bg-[#f4f2fc] rounded-2xl border border-[#eeedf7]/60">
          <div className="w-10 h-10 rounded-full bg-[#dde1ff] flex items-center justify-center text-[#00288e] overflow-hidden border border-[#c4c5d5]/40">
            {adminAvatar ? (
              <img src={adminAvatar} alt={adminName} className="w-full h-full object-cover" />
            ) : (
              <span className="font-bold text-sm">
                {userRole === 'sales_agent' ? 'SC' : (adminName.split(' ').map(n => n[0]).join(''))}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-sans font-bold text-sm text-[#1a1b22] truncate">
              {userRole === 'sales_agent' ? t.sales : adminName}
            </p>
            <p className="text-[10px] text-[#444653] uppercase font-semibold tracking-wider truncate">
              {userRole === 'sales_agent' ? t.salesRoleTitle : adminRole}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
