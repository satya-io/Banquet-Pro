import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, User, Lock, LogIn, UserCheck, HelpCircle, Languages, Building, PlusCircle, UserPlus, Phone } from 'lucide-react';
import { Language, translations } from '../translations';
import { loginApi, loginAppAdminApi, registerTenantApi } from '../api/auth';

interface LoginScreenProps {
  onLogin: (tenantId: string, role: 'admin' | 'sales_agent', tenantName?: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function LoginScreen({ onLogin, language, onLanguageChange }: LoginScreenProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // App Admin detection
  const isAppAdmin = window.location.pathname === '/appadmin';

  // Standard Login fields
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // App Admin fields
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Form handling state
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Registration Form
  const [newVenueName, setNewVenueName] = useState('');
  const [newOwnerPhone, setNewOwnerPhone] = useState('');
  const [newOwnerPass, setNewOwnerPass] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffPass, setNewStaffPass] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  const t = translations[language];

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    try {
      if (isAppAdmin) {
        const response = await loginAppAdminApi(adminUsername, adminPassword);
        onLogin(response.tenantId, response.role, response.tenantName);
      } else {
        const response = await loginApi(phone, password);
        onLogin(response.tenantId, response.role, response.tenantName);
      }
    } catch (apiError: any) {
      setError(apiError.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegisterTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVenueName.trim() || !newOwnerPhone.trim() || !newOwnerPass.trim()) {
      alert('Please fill out all fields for the new venue.');
      return;
    }

    try {
      setError('');
      setRegSuccess('');

      await registerTenantApi({
        name: newVenueName.trim(),
        phone: newOwnerPhone.trim(),
        password: newOwnerPass.trim(),
      });

      const registeredName = newVenueName.trim();

      // Clear registration fields
      setNewVenueName('');
      setNewOwnerPhone('');
      setNewOwnerPass('');
      setNewStaffPhone('');
      setNewStaffPass('');

      // Show success activation instruction banner
      setRegSuccess(language === 'en'
        ? `Successfully registered "${registeredName}"! Your workspace is pending activation by the system administrator.`
        : `"${registeredName}" का पंजीकरण सफल! आपका वर्कस्पेस सिस्टम एडमिनिस्ट्रेटर द्वारा सक्रिय होने की प्रतीक्षा में है।`
      );

      // Switch to login tab
      setActiveTab('login');
    } catch (apiError: any) {
      setError(apiError.message || 'Failed to register banquet venue.');
    }
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
              <span>v2.0 Phone Auth Cloud</span>
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
            © 2026 {t.brandTitle} Phone Auth Suite
          </div>
        </div>

        {/* Right Form & Section */}
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
              {isAppAdmin 
                ? (language === 'en' ? 'System Administrator Portal' : 'सिस्टम एडमिनिस्ट्रेटर पोर्टल')
                : (activeTab === 'login' ? (language === 'en' ? 'Sign In to Banquet Pro' : 'बैंक्वेट प्रो में साइन इन करें') : (language === 'en' ? 'Register New Banquet' : 'नया बैंक्वेट रजिस्टर करें'))}
            </h3>
            <p className="text-xs text-[#444653] font-semibold mt-1">
              {isAppAdmin
                ? (language === 'en' ? 'Authenticate with root system privileges' : 'रूट सिस्टम विशेषाधिकारों के साथ प्रमाणित करें')
                : (activeTab === 'login' ? (language === 'en' ? 'Enter phone number and password assigned to your workspace' : 'अपने वर्कस्पेस को असाइन किया गया फोन नंबर और पासवर्ड डालें') : (language === 'en' ? 'Register a new workspace for your venue' : 'अपने वेन्यू के लिए एक नया वर्कस्पेस पंजीकृत करें'))}
            </p>
          </div>

          {/* Tab Switcher - only show if NOT app admin */}
          {!isAppAdmin && (
            <div className="flex bg-[#f4f2fc] p-1 rounded-xl border border-[#e3e1eb]">
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setError(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'login' 
                    ? 'bg-[#00288e] text-white shadow-sm' 
                    : 'text-[#444653] hover:text-[#1a1b22]'
                }`}
              >
                {language === 'en' ? 'Log In' : 'लॉग इन करें'}
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('register'); setError(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'register' 
                    ? 'bg-[#00288e] text-white shadow-sm' 
                    : 'text-[#444653] hover:text-[#1a1b22]'
                }`}
              >
                {language === 'en' ? 'Register' : 'रजिस्टर करें'}
              </button>
            </div>
          )}

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

          {activeTab === 'login' || isAppAdmin ? (
            <div className="space-y-4">
              <form onSubmit={handleSubmitLogin} className="space-y-3.5 text-xs font-semibold">
                {isAppAdmin ? (
                  <>
                    <div className="space-y-1">
                      <label className="text-[#444653] block uppercase tracking-wider">
                        {language === 'en' ? 'Admin Username' : 'एडमिन यूज़रनेम'}
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444653]/60" />
                        <input
                          type="text"
                          required
                          value={adminUsername}
                          onChange={(e) => setAdminUsername(e.target.value)}
                          placeholder="e.g. admin"
                          className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl pl-10 pr-3 py-2 text-sm text-[#1a1b22] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[#444653] block uppercase tracking-wider">
                        {language === 'en' ? 'Admin Password' : 'एडमिन पासवर्ड'}
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444653]/60" />
                        <input
                          type="password"
                          required
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl pl-10 pr-3 py-2 text-sm text-[#1a1b22] focus:outline-none"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <label className="text-[#444653] block uppercase tracking-wider">
                        {language === 'en' ? 'Phone Number' : 'फोन नंबर'}
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444653]/60" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. 9999999999"
                          className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl pl-10 pr-3 py-2 text-sm text-[#1a1b22] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[#444653] block uppercase tracking-wider">
                        {language === 'en' ? 'Security Password' : 'सुरक्षा पासवर्ड'}
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444653]/60" />
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl pl-10 pr-3 py-2 text-sm text-[#1a1b22] focus:outline-none"
                        />
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-2.5 bg-[#00288e] text-white text-sm font-bold rounded-xl hover:bg-[#1e40af] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer mt-4 disabled:opacity-50"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{isLoggingIn ? (language === 'en' ? 'Signing In...' : 'साइन इन हो रहा है...') : t.signInButton}</span>
                </button>
              </form>

              {isAppAdmin && (
                <button
                  type="button"
                  onClick={() => { window.location.href = '/'; }}
                  className="w-full py-2 bg-white text-[#00288e] border border-[#dde1ff] text-xs font-bold rounded-xl hover:bg-[#f4f2fc] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  ← {language === 'en' ? 'Go to Banquet Operator Login' : 'बैंक्वेट ऑपरेटर लॉगिन पर जाएं'}
                </button>
              )}


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

              <div className="grid grid-cols-2 gap-4 bg-[#f4f2fc]/30 p-4 rounded-xl border border-[#eeedf7]">
                <div className="col-span-2 text-[10px] text-[#00288e] uppercase font-bold flex items-center gap-1">
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Login Credentials' : 'लॉगिन क्रेडेंशियल'}</span>
                </div>
                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <label className="text-[#444653] block text-[10px] uppercase font-bold">
                    {language === 'en' ? 'Phone Number *' : 'फोन नंबर *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={newOwnerPhone}
                    onChange={(e) => setNewOwnerPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full bg-white border border-[#c4c5d5] rounded-lg px-2.5 py-2 text-sm text-[#1a1b22] focus:outline-none font-bold"
                  />
                </div>
                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <label className="text-[#444653] block text-[10px] uppercase font-bold">
                    {language === 'en' ? 'Password *' : 'पासवर्ड *'}
                  </label>
                  <input
                    type="password"
                    required
                    value={newOwnerPass}
                    onChange={(e) => setNewOwnerPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-[#c4c5d5] rounded-lg px-2.5 py-2 text-sm text-[#1a1b22] focus:outline-none"
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

