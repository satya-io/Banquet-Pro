import React, { useState, useEffect } from 'react';
import { 
  Building, LogOut, Languages, Power, Edit2, Shield, Sparkles, 
  RefreshCw, Key, Lock, Phone, X, AlertTriangle, CheckCircle2 
} from 'lucide-react';
import { Language, translations } from '../translations';
import { getAdminTenantsApi, activateTenantApi, deactivateTenantApi, updateTenantOwnerApi } from '../api/tenants';

interface AppAdminPortalProps {
  onLogout: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function AppAdminPortal({ onLogout, language, onLanguageChange }: AppAdminPortalProps) {
  const [tenants, setTenants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Editing Owner credentials state
  const [editingTenant, setEditingTenant] = useState<any | null>(null);
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [isUpdatingCredentials, setIsUpdatingCredentials] = useState(false);

  // App Admin self credentials reset state
  const [selfResetModalOpen, setSelfResetModalOpen] = useState(false);
  const [selfUsername, setSelfUsername] = useState('');
  const [selfPassword, setSelfPassword] = useState('');
  const [isResettingSelf, setIsResettingSelf] = useState(false);

  const generateStrongSelfCredentials = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let generatedPass = '';
    for (let i = 0; i < 16; i++) {
      generatedPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const randNum = Math.floor(1000 + Math.random() * 9000);
    setSelfUsername(`sysadmin_${randNum}`);
    setSelfPassword(generatedPass);
  };

  const handleSaveSelfCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selfUsername.trim() || !selfPassword.trim()) {
      alert('Please fill out or generate all fields.');
      return;
    }
    setIsResettingSelf(true);
    setError('');
    setSuccessMessage('');
    try {
      await updateTenantOwnerApi('TENANT-DEFAULT', { phone: selfUsername.trim(), password: selfPassword.trim() });
      setSuccessMessage(language === 'hi' ? 'सिस्टम एडमिन क्रेडेंशियल्स सफलतापूर्वक अपडेट किए गए!' : 'System Admin credentials updated successfully! Please write them down.');
      setSelfResetModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update system admin credentials.');
    } finally {
      setIsResettingSelf(false);
    }
  };

  const t = translations[language];

  const fetchTenants = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getAdminTenantsApi();
      setTenants(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch banquet venues.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleToggleActive = async (tenantId: string, currentActive: boolean) => {
    setError('');
    setSuccessMessage('');
    try {
      if (currentActive) {
        await deactivateTenantApi(tenantId);
        showSuccess(language === 'en' ? 'Banquet workspace disabled successfully.' : 'बैंक्वेट वर्कस्पेस सफलतापूर्वक निष्क्रिय कर दिया गया।');
      } else {
        await activateTenantApi(tenantId);
        showSuccess(language === 'en' ? 'Banquet workspace activated successfully.' : 'बैंक्वेट वर्कस्पेस सफलतापूर्वक सक्रिय कर दिया गया।');
      }
      await fetchTenants();
    } catch (err: any) {
      setError(err.message || 'Failed to update banquet workspace status.');
    }
  };

  const handleOpenEditOwnerModal = (tenant: any) => {
    setEditingTenant(tenant);
    setOwnerPhone(tenant.ownerUsername || '');
    setOwnerPassword(tenant.ownerPassword || '');
  };

  const handleUpdateOwnerCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerPhone.trim() || !ownerPassword.trim()) {
      alert('Owner phone and password are required.');
      return;
    }

    setIsUpdatingCredentials(true);
    setError('');
    setSuccessMessage('');

    try {
      await updateTenantOwnerApi(editingTenant.tenantId, {
        phone: ownerPhone.trim(),
        password: ownerPassword.trim()
      });
      showSuccess(language === 'en' ? 'Owner credentials updated successfully.' : 'मालिक के क्रेडेंशियल सफलतापूर्वक अपडेट किए गए।');
      setEditingTenant(null);
      await fetchTenants();
    } catch (err: any) {
      setError(err.message || 'Failed to update owner credentials.');
    } finally {
      setIsUpdatingCredentials(false);
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage('');
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#fbf8ff] flex text-[#1a1b22] font-sans w-full">
      
      {/* 1. Simplified Admin Sidebar */}
      <aside className="hidden lg:flex flex-col h-screen w-64 fixed left-0 top-0 bg-white border-r border-[#e3e1eb] z-40 py-6">
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00288e]/10 flex items-center justify-center text-[#00288e]">
            <Shield className="w-5.5 h-5.5" />
          </div>
          <div>
            <h1 className="font-sans font-bold text-sm text-[#00288e] tracking-tight leading-tight">
              App Admin Portal
            </h1>
            <p className="text-[10px] font-sans font-semibold uppercase tracking-widest text-red-600 mt-0.5">
              System Root
            </p>
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          <div className="w-full flex flex-col gap-1.5">
            <div className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-[#00288e] font-bold border-r-4 border-[#00288e] bg-[#f4f2fc]">
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-[#00288e]" />
                <span>{language === 'en' ? 'Banquet Venues' : 'बैंक्वेट वेन्यू सूची'}</span>
              </div>
            </div>
            
            <button
              onClick={() => {
                setSelfUsername('');
                setSelfPassword('');
                setSelfResetModalOpen(true);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#444653] hover:bg-[#f4f2fc] hover:text-[#1a1b22] font-semibold text-sm transition-all cursor-pointer text-left"
            >
              <Key className="w-5 h-5" />
              <span>{language === 'en' ? 'Reset Admin Pass' : 'एडमिन पासवर्ड रीसेट'}</span>
            </button>
          </div>
        </nav>

        <div className="px-4 pt-4 border-t border-[#e3e1eb]">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-sans text-sm font-semibold transition-all cursor-pointer text-left"
          >
            <LogOut className="w-5 h-5 text-red-600" />
            <span>{language === 'en' ? 'Log Out' : 'लॉग आउट'}</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Portal Frame */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        
        {/* Header */}
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-[#e3e1eb] z-30 h-16 flex items-center justify-between px-6 sm:px-8">
          <div className="flex items-center gap-4">
            <span className="lg:hidden w-8 h-8 rounded bg-[#00288e]/15 flex items-center justify-center text-[#00288e] font-extrabold text-xs">AP</span>
            <h2 className="font-sans font-bold text-base text-[#1a1b22] tracking-tight">
              {language === 'en' ? 'Banquet Workspaces Manager' : 'बैंक्वेट वर्कस्पेस प्रबंधक'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl px-2.5 py-1.5">
              <Languages className="w-3.5 h-3.5 text-[#00288e]" />
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                className="bg-transparent border-none text-[11px] font-bold text-[#1a1b22] focus:outline-none cursor-pointer"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
              </select>
            </div>

            {/* Logout Mobile */}
            <button 
              onClick={onLogout}
              className="lg:hidden p-2 hover:bg-red-50 text-red-600 rounded-xl cursor-pointer"
              title="Log Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 md:p-8 pb-24 lg:pb-10 overflow-y-auto max-w-7xl mx-auto w-full space-y-6">
          
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-sans font-bold text-2xl text-[#1a1b22] tracking-tight">
                {language === 'en' ? 'Platform Venue Registrations' : 'प्लेटफ़ॉर्म वेन्यू पंजीकरण'}
              </h2>
              <p className="text-[#444653] text-xs mt-1">
                {language === 'en' 
                  ? 'Inspect, activate, deactivate banquet workspaces, and reset owner credential parameters.' 
                  : 'बैंक्वेट वर्कस्पेस का निरीक्षण, सक्रिय, निष्क्रिय करें और वेन्यू मालिक के पासवर्ड रीसेट करें।'}
              </p>
            </div>
            <button
              onClick={fetchTenants}
              disabled={isLoading}
              className="p-2.5 bg-white text-[#00288e] rounded-xl hover:bg-[#f4f2fc] disabled:opacity-50 cursor-pointer flex items-center gap-1.5 text-xs font-bold transition-all border border-[#c4c5d5]/30 shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{language === 'en' ? 'Refresh' : 'रिफ्रेश'}</span>
            </button>
          </div>

          {error && (
            <div className="bg-[#ffdad6] text-[#ba1a1a] text-xs p-3.5 rounded-xl border border-[#ffdad6] font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-[#e8f5e9] text-[#2e7d32] text-xs p-3.5 rounded-xl border border-[#c8e6c9] font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {isLoading && tenants.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-[#00288e]/20 border-t-[#00288e] rounded-full animate-spin mx-auto"></div>
              <p className="text-[#444653] text-xs font-semibold">Loading platform registrations...</p>
            </div>
          ) : tenants.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-[#e3e1eb] p-8">
              <Building className="w-12 h-12 text-[#dde1ff] mx-auto mb-3" />
              <h3 className="font-sans font-bold text-sm text-[#1a1b22]">No Registered Venues</h3>
              <p className="text-[#444653] text-xs mt-1">There are no venues registered on this instance yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {tenants.map((tenant) => {
                const isDefault = tenant.tenantId === 'TENANT-DEFAULT';
                return (
                  <div 
                    key={tenant.tenantId} 
                    className={`bg-white rounded-2xl border p-5 transition-all relative ${
                      tenant.active 
                        ? 'border-[#e3e1eb] hover:shadow-md' 
                        : 'border-red-200 bg-red-50/10'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-1">
                        <h3 className="font-sans font-bold text-base text-[#1a1b22] flex items-center gap-2">
                          🏛️ {tenant.name}
                        </h3>
                        <p className="text-[10px] font-mono text-[#8e90a6] uppercase tracking-wider">{tenant.tenantId}</p>
                      </div>

                      {/* Status Badge */}
                      <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        tenant.active 
                          ? 'bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9]' 
                          : 'bg-[#ffdad6] text-[#ba1a1a] border border-[#ffdad6]'
                      }`}>
                        {tenant.active ? (language === 'en' ? 'Active' : 'सक्रिय') : (language === 'en' ? 'Disabled' : 'निष्क्रिय')}
                      </span>
                    </div>

                    <div className="bg-[#f8f6fc] rounded-xl p-3 border border-[#eeedf7] space-y-2 mb-4">
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5 text-[#444653]">
                          <Phone className="w-3.5 h-3.5 text-[#00288e]" />
                          <span className="font-semibold">Owner Phone:</span>
                        </div>
                        <span className="font-mono font-bold text-[#1a1b22]">{tenant.ownerUsername || 'N/A'}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5 text-[#444653]">
                          <Lock className="w-3.5 h-3.5 text-[#00288e]" />
                          <span className="font-semibold">Owner Password:</span>
                        </div>
                        <span className="font-mono font-bold text-[#00288e] bg-white px-1.5 py-0.5 rounded border border-[#eeedf7]">{tenant.ownerPassword || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end border-t border-[#e3e1eb]/60 pt-4">
                      {/* Manage credentials */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditOwnerModal(tenant)}
                        className="px-3 py-1.5 bg-[#f4f2fc] text-[#00288e] hover:bg-[#dde1ff] rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-[#dde1ff]"
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>{language === 'en' ? 'Reset Password' : 'पासवर्ड रीसेट'}</span>
                      </button>

                      {/* Enable/Disable Toggle */}
                      {!isDefault && (
                        <button
                          type="button"
                          onClick={() => handleToggleActive(tenant.tenantId, tenant.active)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                            tenant.active
                              ? 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200'
                              : 'bg-green-50 hover:bg-green-100 text-green-600 border-green-200'
                          }`}
                        >
                          <Power className="w-3.5 h-3.5" />
                          <span>{tenant.active ? (language === 'en' ? 'Disable' : 'निष्क्रिय करें') : (language === 'en' ? 'Enable' : 'सक्रिय करें')}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </main>
      </div>

      {/* 3. Owner Credentials Editing Popup Modal */}
      {editingTenant && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center border-b border-[#e3e1eb] pb-3">
              <div className="flex items-center gap-2 text-[#00288e]">
                <Key className="w-5 h-5" />
                <h3 className="font-sans font-bold text-base text-[#1a1b22]">Reset Owner Credentials</h3>
              </div>
              <button 
                onClick={() => setEditingTenant(null)}
                className="p-1 hover:bg-[#f4f2fc] rounded-full text-[#444653] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#f4f2fc]/60 p-3.5 rounded-xl border border-[#eeedf7] space-y-1">
              <span className="text-[10px] text-[#8e90a6] uppercase tracking-wider font-bold">Banquet Hall</span>
              <p className="font-sans font-bold text-sm text-[#1a1b22]">{editingTenant.name}</p>
            </div>

            <form onSubmit={handleUpdateOwnerCredentials} className="space-y-4 text-xs font-semibold">
              
              {/* Owner Phone number input */}
              <div className="space-y-1">
                <label className="text-[#444653] uppercase tracking-wider block">Owner Phone Number (Login identifier) *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444653]/60" />
                  <input
                    type="tel"
                    required
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl pl-10 pr-3 py-2.5 text-sm text-[#1a1b22] focus:outline-none font-bold"
                  />
                </div>
              </div>

              {/* Owner password reset input */}
              <div className="space-y-1">
                <label className="text-[#444653] uppercase tracking-wider block">New Security Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444653]/60" />
                  <input
                    type="text"
                    required
                    value={ownerPassword}
                    onChange={(e) => setOwnerPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl pl-10 pr-3 py-2.5 text-sm text-[#1a1b22] focus:outline-none"
                  />
                </div>
              </div>

              {/* Save & Cancel buttons */}
              <div className="flex gap-3 justify-end pt-3 border-t border-[#e3e1eb]">
                <button
                  type="button"
                  onClick={() => setEditingTenant(null)}
                  className="px-4 py-2 bg-white text-[#444653] border border-[#c4c5d5] rounded-xl hover:bg-[#f4f2fc] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingCredentials}
                  className="px-4 py-2 bg-[#00288e] text-white rounded-xl hover:bg-[#1e40af] disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  {isUpdatingCredentials ? 'Saving...' : 'Save Credentials'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 4. App Admin Self Reset Modal */}
      {selfResetModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e3e1eb] animate-scale-up space-y-4">
            <div className="flex justify-between items-center border-b border-[#e3e1eb] pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-600 animate-pulse" />
                <h3 className="font-sans font-bold text-base text-[#1a1b22]">
                  {language === 'en' ? 'Reset System Admin Credentials' : 'सिस्टम एडमिन क्रेडेंशियल रीसेट'}
                </h3>
              </div>
              <button 
                onClick={() => setSelfResetModalOpen(false)}
                className="text-[#444653] hover:bg-[#f4f2fc] p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#ffdad6] text-[#ba1a1a] p-3.5 rounded-xl border border-[#ffdad6] flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 shrink-0 text-[#ba1a1a] mt-0.5" />
              <div>
                <p className="font-bold text-xs">{language === 'en' ? 'CRITICAL WARNING!' : 'क्रिटिकल चेतावनी!'}</p>
                <p className="text-[10px] font-semibold mt-0.5 leading-relaxed">
                  {language === 'en' 
                    ? 'Changing these credentials alters the primary login for /appadmin. Be sure to copy and save them securely!' 
                    : 'इन क्रेडेंशियल्स को बदलने से /appadmin का मुख्य लॉगिन बदल जाएगा। इन्हें सुरक्षित रूप से कॉपी और सहेजें!'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveSelfCredentials} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-[#444653] uppercase tracking-wider block">
                  {language === 'en' ? 'New System Username *' : 'नया सिस्टम यूजरनेम *'}
                </label>
                <input
                  type="text"
                  required
                  value={selfUsername}
                  onChange={(e) => setSelfUsername(e.target.value)}
                  placeholder="Enter unique username"
                  className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl px-3 py-2.5 text-sm text-[#1a1b22] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#444653] uppercase tracking-wider block">
                  {language === 'en' ? 'New Secure Password *' : 'नया सुरक्षित पासवर्ड *'}
                </label>
                <input
                  type="text"
                  required
                  value={selfPassword}
                  onChange={(e) => setSelfPassword(e.target.value)}
                  placeholder="Enter secure password"
                  className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl px-3 py-2.5 text-sm text-[#1a1b22] focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={generateStrongSelfCredentials}
                  className="flex-1 py-2 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-xl font-bold flex items-center justify-center gap-1 cursor-pointer transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>{language === 'en' ? 'Generate Strong Credentials' : 'सुरक्षित क्रेडेंशियल जनरेट करें'}</span>
                </button>
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-[#e3e1eb]">
                <button
                  type="button"
                  onClick={() => setSelfResetModalOpen(false)}
                  className="px-4 py-2 bg-white text-[#444653] border border-[#c4c5d5] rounded-xl hover:bg-[#f4f2fc] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResettingSelf}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl disabled:opacity-50 cursor-pointer"
                >
                  {isResettingSelf ? 'Saving...' : 'Apply New Credentials'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
