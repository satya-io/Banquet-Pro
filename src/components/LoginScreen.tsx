import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, User, Lock, LogIn, UserCheck, HelpCircle, Languages, Building, PlusCircle, UserPlus } from 'lucide-react';
import { Language, translations } from '../translations';
import { Tenant } from '../types';
import { 
  initialEnquiries, initialBookings, initialCateringItems, 
  initialVenueSpaces, initialTeamMembers, initialVenueSettings 
} from '../data';
import { loginApi } from '../api/auth';

interface LoginScreenProps {
  onLogin: (tenantId: string, role: 'admin' | 'sales_agent', tenantName?: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function LoginScreen({ onLogin, language, onLanguageChange }: LoginScreenProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Tenants local load
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState('');
  
  // Login Form
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'sales_agent'>('admin');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Registration Form
  const [newVenueName, setNewVenueName] = useState('');
  const [newOwnerUser, setNewOwnerUser] = useState('');
  const [newOwnerPass, setNewOwnerPass] = useState('');
  const [newStaffUser, setNewStaffUser] = useState('sales');
  const [newStaffPass, setNewStaffPass] = useState('sales123');
  const [regSuccess, setRegSuccess] = useState('');

  const t = translations[language];

  // Load tenants on mount
  useEffect(() => {
    const saved = localStorage.getItem('tenants');
    if (saved) {
      const parsed = JSON.parse(saved);
      setTenants(parsed);
      if (parsed.length > 0) {
        setSelectedTenantId(parsed[0].id);
      }
    } else {
      // Bootstrap default
      const defaultTenants: Tenant[] = [
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
      localStorage.setItem('tenants', JSON.stringify(defaultTenants));
      setTenants(defaultTenants);
      setSelectedTenantId('TENANT-DEFAULT');
    }
  }, []);

  const handleRoleSelect = (role: 'admin' | 'sales_agent') => {
    setSelectedRole(role);
    const currTenant = tenants.find(t => t.id === selectedTenantId);
    if (currTenant) {
      if (role === 'admin') {
        setUsername(currTenant.ownerUsername);
        setPassword(currTenant.ownerPassword);
      } else {
        setUsername(currTenant.staffUsername);
        setPassword(currTenant.staffPassword);
      }
    }
    setError('');
  };

  // Sync login credentials when tenant choice changes
  useEffect(() => {
    const currTenant = tenants.find(t => t.id === selectedTenantId);
    if (currTenant) {
      if (selectedRole === 'admin') {
        setUsername(currTenant.ownerUsername);
        setPassword(currTenant.ownerPassword);
      } else {
        setUsername(currTenant.staffUsername);
        setPassword(currTenant.staffPassword);
      }
    }
  }, [selectedTenantId, selectedRole, tenants]);

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    try {
      // Try API-based login first
      const response = await loginApi(username, password, selectedTenantId || undefined);
      onLogin(response.tenantId, response.role, response.tenantName);
    } catch (apiError) {
      // Fallback to local credential check if API is unavailable
      const currTenant = tenants.find(t => t.id === selectedTenantId);
      if (!currTenant) {
        setError(language === 'en' 
          ? 'Please select a valid Banquet Venue' 
          : 'कृपया एक मान्य बैंक्वेट वेन्यू चुनें');
        setIsLoggingIn(false);
        return;
      }

      if (username === currTenant.ownerUsername && password === currTenant.ownerPassword) {
        onLogin(currTenant.id, 'admin', currTenant.name);
      } else if (username === currTenant.staffUsername && password === currTenant.staffPassword) {
        onLogin(currTenant.id, 'sales_agent', currTenant.name);
      } else {
        setError(language === 'en' 
          ? 'Invalid credentials for the selected Banquet Venue. Please check and try again.' 
          : 'चयनित बैंक्वेट वेन्यू के लिए गलत क्रेडेंशियल्स। कृपया जाँचें और पुनः प्रयास करें।'
        );
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegisterTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVenueName.trim() || !newOwnerUser.trim() || !newOwnerPass.trim() || !newStaffUser.trim() || !newStaffPass.trim()) {
      alert('Please fill out all fields for the new venue.');
      return;
    }

    // Check duplicate
    const isDuplicate = tenants.some(t => t.name.toLowerCase() === newVenueName.trim().toLowerCase());
    if (isDuplicate) {
      setError('A Banquet Venue with this name already exists.');
      return;
    }

    const newTenantId = `TENANT-${Date.now()}`;
    const newTenant: Tenant = {
      id: newTenantId,
      name: newVenueName.trim(),
      ownerUsername: newOwnerUser.trim(),
      ownerPassword: newOwnerPass.trim(),
      staffUsername: newStaffUser.trim(),
      staffPassword: newStaffPass.trim(),
      enquiries: initialEnquiries.map(eq => ({ ...eq, id: `ENQ-${Math.floor(Math.random() * 9000) + 1000}` })),
      bookings: initialBookings.map(bk => ({ ...bk, id: `BP-${Math.floor(Math.random() * 90000) + 10000}` })),
      venueSpaces: initialVenueSpaces,
      cateringItems: initialCateringItems,
      settings: {
        ...initialVenueSettings,
        name: newVenueName.trim(),
        email: `contact@${newVenueName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`
      },
      teamMembers: [
        {
          id: `TEAM-001`,
          name: `${newOwnerUser} (Owner)`,
          email: `${newOwnerUser}@banquetpro.com`,
          role: 'Admin',
          status: 'Online',
          lastActive: 'Just now',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_z3jZfhBZzvyiTOCthdJZCXPUTwi0MXEuwe_qVQcw1g9PfEfzPv3fsXKKvMPJ5J4gYfq5eHQiPi4xAp1QQEacuLoibg9QdoBql0Wtv0HeJFmNJHlKrRbthP-vNZS3eKSncH6e0HiWnW6v3keIER-AAQygcSMyKDL4LCASdZWQVlCPzRTRstTTdTp2JUzCgiNWiV4DOh-eF4F1SHTx-rrRJ9XxSZ3fjB25-Ta4isBGbF2cPgJcMDJrhg'
        },
        {
          id: `TEAM-002`,
          name: `${newStaffUser} (Sales)`,
          email: `${newStaffUser}@banquetpro.com`,
          role: 'Staff',
          status: 'Offline',
          lastActive: '1d ago',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCc3cVsnSt9zilkyUgSKtjmj5UK5uKIRf3ILPxGoLMa74A_ObsrepXR4pOZOm8Wa9O5nbT3ER_IP4-Un3WzC3l9TvkltO2cMSwTBdDUlZFhE0aOUgozmHpQ9lBx0VJAj6-dgAvdCgqVnNxmsTT7R6SRhklo25NNgofAzmVZVkOdmeHo9kNyA1buTl3stNhrKmo1H50fGVdH6HJKJblhnfLd-IABi_lw3Q9jVZhqpE0VATf6bHENDL89RQ'
        }
      ]
    };

    const updatedTenants = [...tenants, newTenant];
    localStorage.setItem('tenants', JSON.stringify(updatedTenants));
    setTenants(updatedTenants);
    setSelectedTenantId(newTenantId);
    
    // Clear registration fields
    setNewVenueName('');
    setNewOwnerUser('');
    setNewOwnerPass('');
    
    // Switch to login tab and autofill
    setActiveTab('login');
    setSelectedRole('admin');
    setUsername(newOwnerUser);
    setPassword(newOwnerPass);
    
    setRegSuccess(language === 'en' 
      ? `Successfully registered "${newTenant.name}"! Logging in...` 
      : `"${newTenant.name}" का पंजीकरण सफल! लॉगिन कर रहे हैं...`
    );
    
    setTimeout(() => {
      onLogin(newTenantId, 'admin', newTenant.name);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#fbf8ff] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#e3e1eb] overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[600px] animate-scale-up">
        
        {/* Left Visual Banner (Deep Brand Navy) */}
        <div className="md:col-span-5 bg-[#00288e] p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Abstract circles decoration */}
          <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-white/10 blur-xl"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-white/5 blur-2xl"></div>

          <div className="space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full backdrop-blur-md border border-white/20 text-xs font-bold text-[#6cf8bb]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>v2.0 Multi-Tenant Cloud</span>
            </div>
            
            <div className="flex items-center gap-2.5 mt-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                <span className="font-extrabold text-base tracking-wider text-white">BP</span>
              </div>
              <h1 className="font-display font-extrabold text-xl tracking-tight">{t.brandTitle}</h1>
            </div>
          </div>

          <div className="space-y-4 relative z-10 my-8">
            <h2 className="font-display font-bold text-2xl sm:text-3xl leading-tight">
              {t.brandSlogan}
            </h2>
            <p className="text-white/80 text-xs leading-relaxed font-medium">
              {t.brandDesc}
            </p>
          </div>

          <div className="border-t border-white/20 pt-6 text-[10px] text-white/60 font-semibold tracking-wider uppercase relative z-10">
            © 2026 {t.brandTitle} Multi-Tenant Suite
          </div>
        </div>

        {/* Right Form & Tenant Selector / Registration Section */}
        <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center space-y-5 relative">
          
          {/* Top Right Language Switcher */}
          <div className="absolute top-6 right-8 flex items-center gap-1.5 bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl px-3 py-1.5 shadow-xs">
            <Languages className="w-4 h-4 text-[#00288e]" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-transparent border-none text-xs font-bold text-[#1a1b22] focus:outline-none cursor-pointer"
            >
              <option value="en">🇬🇧 English</option>
              <option value="hi">🇮🇳 हिन्दी</option>
            </select>
          </div>

          <div className="pt-4">
            <h3 className="font-display font-extrabold text-2xl text-[#1a1b22] tracking-tight">
              {activeTab === 'login' ? t.loginTitle : (language === 'en' ? 'Register New Banquet Hall' : 'नया बैंक्वेट हॉल पंजीकृत करें')}
            </h3>
            <p className="text-xs text-[#444653] font-semibold mt-1">
              {activeTab === 'login' ? t.loginSubtitle : (language === 'en' ? 'Create a secure isolated cloud tenant for your venue' : 'अपने वेन्यू के लिए एक सुरक्षित क्लाउड टेनेंट बनाएं')}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-[#f4f2fc] p-1 rounded-xl border border-[#e3e1eb]">
            <button
              onClick={() => { setActiveTab('login'); setError(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'login' 
                  ? 'bg-[#00288e] text-white shadow-sm' 
                  : 'text-[#444653] hover:text-[#1a1b22]'
              }`}
            >
              {language === 'en' ? 'Log In to Venue' : 'वेन्यू में लॉगिन करें'}
            </button>
            <button
              onClick={() => { setActiveTab('register'); setError(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'register' 
                  ? 'bg-[#00288e] text-white shadow-sm' 
                  : 'text-[#444653] hover:text-[#1a1b22]'
              }`}
            >
              {language === 'en' ? 'Register New Banquet' : 'नया वेन्यू रजिस्टर करें'}
            </button>
          </div>

          {regSuccess && (
            <div className="bg-[#e8f5e9] text-[#2e7d32] p-3 rounded-xl border border-[#c8e6c9] text-xs font-bold">
              {regSuccess}
            </div>
          )}

          {error && (
            <div className="bg-[#ffdad6] text-[#ba1a1a] p-3 rounded-xl border border-[#ffdad6] text-xs font-bold">
              {error}
            </div>
          )}

          {activeTab === 'login' ? (
            <div className="space-y-4">
              {/* Tenant Selection Dropdown */}
              <div className="space-y-1">
                <label className="text-[#444653] block uppercase tracking-wider text-[10px] font-bold flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-[#00288e]" />
                  <span>{language === 'en' ? 'Select Banquet Venue' : 'बैंक्वेट वेन्यू का चयन करें'}</span>
                </label>
                <select
                  value={selectedTenantId}
                  onChange={(e) => setSelectedTenantId(e.target.value)}
                  className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl px-3 py-2.5 text-sm font-bold text-[#1a1b22] focus:outline-none focus:ring-2 focus:ring-[#00288e]"
                >
                  {tenants.map(ten => (
                    <option key={ten.id} value={ten.id}>🏛️ {ten.name}</option>
                  ))}
                </select>
              </div>

              {/* Role cards for chosen tenant */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleRoleSelect('admin')}
                  className={`p-3 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between h-24 cursor-pointer ${
                    selectedRole === 'admin'
                      ? 'border-[#00288e] bg-[#f4f2fc] ring-2 ring-[#00288e]/20'
                      : 'border-[#e3e1eb] bg-white hover:bg-[#fbf8ff]'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className={`p-1.5 rounded-lg ${selectedRole === 'admin' ? 'bg-[#00288e] text-white' : 'bg-[#f4f2fc] text-[#00288e]'}`}>
                      <Shield className="w-3.5 h-3.5" />
                    </div>
                    {selectedRole === 'admin' && <span className="w-2 h-2 rounded-full bg-[#00288e]"></span>}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1a1b22]">{t.adminRoleTitle}</p>
                    <p className="text-[9px] text-[#444653] font-semibold">{t.adminRoleSubtitle}</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelect('sales_agent')}
                  className={`p-3 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between h-24 cursor-pointer ${
                    selectedRole === 'sales_agent'
                      ? 'border-[#00288e] bg-[#f4f2fc] ring-2 ring-[#00288e]/20'
                      : 'border-[#e3e1eb] bg-white hover:bg-[#fbf8ff]'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className={`p-1.5 rounded-lg ${selectedRole === 'sales_agent' ? 'bg-[#00288e] text-white' : 'bg-[#f4f2fc] text-[#00288e]'}`}>
                      <UserCheck className="w-3.5 h-3.5" />
                    </div>
                    {selectedRole === 'sales_agent' && <span className="w-2 h-2 rounded-full bg-[#00288e]"></span>}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1a1b22]">{t.salesRoleTitle}</p>
                    <p className="text-[9px] text-[#444653] font-semibold">{t.salesRoleSubtitle}</p>
                  </div>
                </button>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmitLogin} className="space-y-3.5 text-xs font-semibold">
                <div className="space-y-1">
                  <label className="text-[#444653] block uppercase tracking-wider">{t.usernameLabel}</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444653]/60" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl pl-10 pr-3 py-2 text-sm text-[#1a1b22] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[#444653] block uppercase tracking-wider">{t.passwordLabel}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444653]/60" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl pl-10 pr-3 py-2 text-sm text-[#1a1b22] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#00288e] text-white text-sm font-bold rounded-xl hover:bg-[#1e40af] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer mt-4"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{t.signInButton}</span>
                </button>
              </form>

              {/* Demo Keys Info */}
              <div className="bg-[#f4f2fc]/50 p-3 rounded-xl border border-[#eeedf7] flex items-start gap-2 text-[10px] text-[#444653] leading-normal">
                <HelpCircle className="w-3.5 h-3.5 text-[#00288e] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#1a1b22]">{t.demoKeys} for selected venue:</span>
                  <br />
                  Owner: <code className="font-mono bg-white px-1 text-[#00288e] font-bold">{username}</code> | Password: <code className="font-mono bg-white px-1 text-[#00288e] font-bold">{password}</code>
                </div>
              </div>
            </div>
          ) : (
            /* Tenant Registration Form */
            <form onSubmit={handleRegisterTenant} className="space-y-3.5 text-xs font-semibold animate-fade-in">
              <div className="space-y-1">
                <label className="text-[#444653] block uppercase tracking-wider">
                  {language === 'en' ? 'Banquet / Venue Name *' : 'बैंक्वेट / वेन्यू का नाम *'}
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444653]/60" />
                  <input
                    type="text"
                    required
                    value={newVenueName}
                    onChange={(e) => setNewVenueName(e.target.value)}
                    placeholder="E.g. Vrindavan Gardens"
                    className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl pl-10 pr-3 py-2 text-sm text-[#1a1b22] focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-[#f4f2fc]/30 p-3 rounded-xl border border-[#eeedf7]">
                <div className="col-span-2 text-[10px] text-[#00288e] uppercase font-bold flex items-center gap-1">
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>1. Owner (Admin) Credentials</span>
                </div>
                <div className="space-y-1">
                  <label className="text-[#444653] block text-[10px] uppercase font-bold">Admin Username</label>
                  <input
                    type="text"
                    required
                    value={newOwnerUser}
                    onChange={(e) => setNewOwnerUser(e.target.value)}
                    placeholder="E.g. admin"
                    className="w-full bg-white border border-[#c4c5d5] rounded-lg px-2 py-1.5 text-xs text-[#1a1b22] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#444653] block text-[10px] uppercase font-bold">Admin Password</label>
                  <input
                    type="text"
                    required
                    value={newOwnerPass}
                    onChange={(e) => setNewOwnerPass(e.target.value)}
                    placeholder="E.g. admin123"
                    className="w-full bg-white border border-[#c4c5d5] rounded-lg px-2 py-1.5 text-xs text-[#1a1b22] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-[#f4f2fc]/30 p-3 rounded-xl border border-[#eeedf7]">
                <div className="col-span-2 text-[10px] text-[#006c49] uppercase font-bold flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>2. Staff (Sales Agent) Credentials</span>
                </div>
                <div className="space-y-1">
                  <label className="text-[#444653] block text-[10px] uppercase font-bold">Sales Username</label>
                  <input
                    type="text"
                    required
                    value={newStaffUser}
                    onChange={(e) => setNewStaffUser(e.target.value)}
                    className="w-full bg-white border border-[#c4c5d5] rounded-lg px-2 py-1.5 text-xs text-[#1a1b22] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#444653] block text-[10px] uppercase font-bold">Sales Password</label>
                  <input
                    type="text"
                    required
                    value={newStaffPass}
                    onChange={(e) => setNewStaffPass(e.target.value)}
                    className="w-full bg-white border border-[#c4c5d5] rounded-lg px-2 py-1.5 text-xs text-[#1a1b22] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#006c49] text-white text-sm font-bold rounded-xl hover:bg-[#005237] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer mt-4"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{language === 'en' ? 'Provision My Banquet Workspace' : 'मेरा बैंक्वेट वर्कस्पेस शुरू करें'}</span>
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
