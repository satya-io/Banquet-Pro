import React, { useState, useEffect } from 'react';
import { 
  Settings, Users, Layers, Shield, Save, CheckCircle2, Plus, 
  Trash2, Mail, MapPin, IndianRupee, Sparkles, User, HelpCircle, X, Wrench,
  Edit2, AlertTriangle, Building, Power, RefreshCw
} from 'lucide-react';
import { VenueSettings, TeamMember, VenueSpace } from '../types';
import { getAdminTenantsApi, activateTenantApi, deactivateTenantApi } from '../api/tenants';

interface SettingsViewProps {
  venueSettings: VenueSettings;
  onUpdateSettings: (settings: VenueSettings) => void;
  teamMembers: TeamMember[];
  onSelectActiveAdmin: (member: TeamMember) => void;
  activeAdminId: string;
  venueSpaces: VenueSpace[];
  onAddVenueSpace: (space: VenueSpace) => void;
  onDeleteVenueSpace: (id: string) => void;
  onUpdateVenueSpace: (space: VenueSpace) => void;
  onAddTeamMember: (member: TeamMember) => void;
  onUpdateTeamMember: (id: string, member: Partial<TeamMember>) => void;
  onDeleteTeamMember: (id: string) => void;
  role?: 'admin' | 'sales_agent';
  tenantId?: string;
}

export default function SettingsView({
  venueSettings,
  onUpdateSettings,
  teamMembers,
  onSelectActiveAdmin,
  activeAdminId,
  venueSpaces,
  onAddVenueSpace,
  onDeleteVenueSpace,
  onUpdateVenueSpace,
  onAddTeamMember,
  onUpdateTeamMember,
  onDeleteTeamMember,
  role = 'admin',
  tenantId = ''
}: SettingsViewProps) {
  // Local state for settings form
  const [nameInput, setNameInput] = useState(venueSettings.name);
  const [emailInput, setEmailInput] = useState(venueSettings.email);
  const [addressInput, setAddressInput] = useState(venueSettings.address);
  const [baseDepositInput, setBaseDepositInput] = useState(String(venueSettings.baseDeposit));
  const [weekendSurge, setWeekendSurge] = useState(venueSettings.weekendSurge);
  const [peakSeason, setPeakSeason] = useState(venueSettings.peakSeason);
  const [showSuccessBadge, setShowSuccessBadge] = useState(false);

  // Local state for new venue space
  const [showSpaceModal, setShowSpaceModal] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState('');
  const [newMinCap, setNewMinCap] = useState('');
  const [newMaxCap, setNewMaxCap] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newFeaturesList, setNewFeaturesList] = useState<string[]>([]);
  const [editingSpace, setEditingSpace] = useState<VenueSpace | null>(null);
  const [deleteConfirmSpace, setDeleteConfirmSpace] = useState<VenueSpace | null>(null);

  // Local state for team member creation
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberPassword, setNewMemberPassword] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'Admin' | 'Manager' | 'Staff'>('Staff');
  const [deleteConfirmMember, setDeleteConfirmMember] = useState<TeamMember | null>(null);

  // Local state for editing team member
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [editMemberName, setEditMemberName] = useState('');
  const [editMemberEmail, setEditMemberEmail] = useState('');
  const [editMemberPhone, setEditMemberPhone] = useState('');
  const [editMemberPassword, setEditMemberPassword] = useState('');
  const [editMemberRole, setEditMemberRole] = useState<'Admin' | 'Manager' | 'Staff'>('Staff');

  const handleSaveEditMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    if (!editMemberName.trim() || !editMemberEmail.trim() || !editMemberPhone.trim() || !editMemberPassword.trim()) {
      alert('All fields are required');
      return;
    }

    onUpdateTeamMember(editingMember.id, {
      name: editMemberName.trim(),
      email: editMemberEmail.trim(),
      phone: editMemberPhone.trim(),
      password: editMemberPassword.trim(),
      role: editMemberRole
    });

    setEditingMember(null);
  };

  // Handle general save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      name: nameInput,
      email: emailInput,
      address: addressInput,
      logo: venueSettings.logo,
      weekendSurge,
      peakSeason,
      baseDeposit: parseFloat(baseDepositInput) || 5000
    });

    setShowSuccessBadge(true);
    setTimeout(() => {
      setShowSuccessBadge(false);
    }, 2500);
  };

  // Add feature helper
  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setNewFeaturesList(prev => [...prev, newFeature.trim()]);
      setNewFeature('');
    }
  };

  // Create or Update venue space
  const handleCreateSpace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpaceName.trim() || !newMinCap || !newMaxCap) {
      alert('Please fill out all space values');
      return;
    }

    if (editingSpace) {
      const updatedSpace: VenueSpace = {
        ...editingSpace,
        name: newSpaceName,
        capacityMin: parseInt(newMinCap) || 50,
        capacityMax: parseInt(newMaxCap) || 200,
        features: newFeaturesList.length > 0 ? newFeaturesList : ['Standard acoustics', 'Modern air-conditioning']
      };
      onUpdateVenueSpace(updatedSpace);
    } else {
      const newSpace: VenueSpace = {
        id: `SPACE-${Date.now().toString().slice(-3)}`,
        name: newSpaceName,
        capacityMin: parseInt(newMinCap) || 50,
        capacityMax: parseInt(newMaxCap) || 200,
        image: '',
        status: 'Active',
        features: newFeaturesList.length > 0 ? newFeaturesList : ['Standard acoustics', 'Modern air-conditioning']
      };
      onAddVenueSpace(newSpace);
    }

    // Reset
    setNewSpaceName('');
    setNewMinCap('');
    setNewMaxCap('');
    setNewFeaturesList([]);
    setEditingSpace(null);
    setShowSpaceModal(false);
  };

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim() || !newMemberPhone.trim() || !newMemberPassword.trim()) {
      alert('Please fill in all fields (name, email, phone, and password)');
      return;
    }

    const newMember: TeamMember = {
      id: `TEAM-${Date.now().toString().slice(-4)}`,
      name: newMemberName.trim(),
      email: newMemberEmail.trim(),
      phone: newMemberPhone.trim(),
      password: newMemberPassword.trim(),
      role: newMemberRole,
      status: 'Offline',
      lastActive: new Date().toLocaleDateString('en-IN'),
      avatar: '',
      active: true
    };

    onAddTeamMember(newMember);

    // Reset
    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberPhone('');
    setNewMemberPassword('');
    setNewMemberRole('Staff');
    setShowAddMemberModal(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Action Header */}
      <div>
        <h2 className="font-sans font-bold text-3xl text-[#1a1b22] tracking-tight">Venue Settings</h2>
        <p className="text-[#444653] text-sm mt-1">Configure general banquet values, surge ratios, and manage user authorizations.</p>
      </div>


      {/* Main Grid: Forms Left, Team & Spaces Right */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* Left Form: General Venue Settings */}
        <div className="bg-white p-6 rounded-2xl border border-[#e3e1eb] shadow-sm xl:col-span-2 space-y-6">
          <h3 className="font-sans font-bold text-base text-[#1a1b22] flex items-center gap-2 border-b border-[#e3e1eb] pb-3">
            <Settings className="w-4.5 h-4.5 text-[#00288e]" />
            <span>General Venue Setup</span>
          </h3>

          <form onSubmit={handleSaveSettings} className="space-y-5 text-xs font-semibold">
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[#444653] uppercase tracking-wider block">Official Venue Name</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl px-3 py-2 text-sm font-semibold text-[#1a1b22] focus:outline-none focus:ring-1 focus:ring-[#00288e]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#444653] uppercase tracking-wider block">Operations Contact Email</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl px-3 py-2 text-sm font-semibold text-[#1a1b22] focus:outline-none"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1">
              <label className="text-[#444653] uppercase tracking-wider block">Postal Street Address</label>
              <input
                type="text"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl px-3 py-2 text-sm font-semibold text-[#1a1b22] focus:outline-none"
              />
            </div>

            {/* Financial Reservation Deposit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[#444653] uppercase tracking-wider block">Base Reservation Deposit (INR)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#444653]">₹</span>
                  <input
                    type="number"
                    value={baseDepositInput}
                    onChange={(e) => setBaseDepositInput(e.target.value)}
                    className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl pl-6 pr-3 py-2 text-sm font-semibold text-[#1a1b22] focus:outline-none"
                  />
                </div>
              </div>

              {/* Informative info box */}
              <div className="bg-[#dde1ff]/30 p-3 rounded-xl border border-[#c4c5d5]/30 flex items-center text-[10px] text-[#001453] leading-normal font-semibold">
                This is the standard deposit generated automatically inside contract drafts. It can be manually overridden.
              </div>
            </div>

            {/* Smart Pricing Toggles */}
            <div className="space-y-3 pt-3 border-t border-[#e3e1eb]">
              <h4 className="text-[10px] uppercase font-bold tracking-wider text-[#444653]">Surge & Peak Optimization Settings</h4>

              {/* Toggle 1: Weekend surge */}
              <div className="flex items-center justify-between bg-[#f4f2fc]/50 p-4 rounded-xl border border-[#eeedf7]">
                <div className="space-y-0.5 max-w-md">
                  <p className="text-xs font-bold text-[#1a1b22]">Automated Weekend Surge Markup (+15%)</p>
                  <p className="text-[10px] text-[#444653]/80 leading-relaxed font-semibold">
                    Automatically applies a 15% surcharge to total pricing calculations for any bookings scheduled on Fridays, Saturdays, or Sundays.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setWeekendSurge(prev => !prev)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 relative ${
                    weekendSurge ? 'bg-[#00288e]' : 'bg-[#e3e1eb]'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    weekendSurge ? 'translate-x-4' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>

              {/* Toggle 2: Peak Season markup */}
              <div className="flex items-center justify-between bg-[#f4f2fc]/50 p-4 rounded-xl border border-[#eeedf7]">
                <div className="space-y-0.5 max-w-md">
                  <p className="text-xs font-bold text-[#1a1b22]">Peak Wedding Season Optimization (+25%)</p>
                  <p className="text-[10px] text-[#444653]/80 leading-relaxed font-semibold">
                    Configures a 25% inflation markup on caterings and halls during national festive months (Oct - Feb).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPeakSeason(prev => !prev)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 relative ${
                    peakSeason ? 'bg-[#00288e]' : 'bg-[#e3e1eb]'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    peakSeason ? 'translate-x-4' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>
            </div>

            {/* Buttons Row */}
            <div className="flex items-center justify-between pt-4 border-t border-[#e3e1eb]">
              {showSuccessBadge ? (
                <div className="flex items-center gap-1.5 text-[#006c49] font-bold text-xs bg-[#6cf8bb]/30 px-3 py-1.5 rounded-lg animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span>Settings updated successfully</span>
                </div>
              ) : (
                <div></div>
              )}
              <button
                type="submit"
                className="bg-[#00288e] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#1e40af] flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>Save Setup Configurations</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right side widgets: Team Identity switcher & Space Manager */}
        <div className="space-y-6">
          {/* Team Identity Switcher Card (Extremely cool interactive design) */}
          <div className="bg-white p-6 rounded-2xl border border-[#e3e1eb] shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-[#e3e1eb] pb-3">
              <h3 className="font-sans font-bold text-base text-[#1a1b22] flex items-center gap-1.5">
                <Users className="w-4.5 h-4.5 text-[#00288e]" />
                <span>Back-Office Operators</span>
              </h3>
              <button
                onClick={() => setShowAddMemberModal(true)}
                className="p-1.5 hover:bg-[#f4f2fc] text-[#00288e] rounded-lg transition-colors cursor-pointer"
                title="Add Team Member"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[10px] text-[#444653] leading-relaxed font-semibold">
              Select any operator below to dynamically change the active session administrator throughout the workspace.
            </p>

            <div className="space-y-2.5">
              {teamMembers.map((member) => {
                const isActive = activeAdminId === member.id;
                const isMemberActive = member.active !== false;
                return (
                  <div
                    key={member.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                      isActive 
                        ? 'bg-[#dde1ff]/35 border-[#00288e] ring-1 ring-[#00288e]' 
                        : 'bg-white border-[#e3e1eb] hover:bg-[#f4f2fc]/10'
                    }`}
                  >
                    <div 
                      className="flex items-center gap-3 cursor-pointer flex-1"
                      onClick={() => onSelectActiveAdmin(member)}
                    >
                      {/* Avatar preview */}
                      <div className="w-9 h-9 rounded-full bg-[#dde1ff] overflow-hidden border border-[#c4c5d5]/30">
                        {member.avatar ? (
                          <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-xs text-[#00288e]">
                            {member.name[0]}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-sans font-bold text-xs text-[#1a1b22] flex items-center gap-1.5">
                          <span className={isMemberActive ? '' : 'line-through text-[#8e90a6]'}>{member.name}</span>
                          {member.status === 'Online' && isMemberActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                          )}
                          {!isMemberActive && (
                            <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">Deactivated</span>
                          )}
                        </h4>
                        <p className="text-[9px] text-[#444653] uppercase font-bold tracking-wider mt-0.5">{member.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Edit Operator */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingMember(member);
                          setEditMemberName(member.name);
                          setEditMemberEmail(member.email || '');
                          setEditMemberPhone(member.phone || '');
                          setEditMemberPassword(member.password || '');
                          setEditMemberRole(member.role);
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 border border-blue-100 rounded-lg transition-colors cursor-pointer"
                        title="Edit Operator"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Toggle Active status */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateTeamMember(member.id, { active: !isMemberActive });
                        }}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isMemberActive 
                            ? 'text-green-600 hover:bg-green-50 border-green-200' 
                            : 'text-red-500 hover:bg-red-50 border-red-200'
                        }`}
                        title={isMemberActive ? 'Deactivate Operator' : 'Activate Operator'}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Operator */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmMember(member);
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-50 border border-red-100 rounded-lg transition-colors cursor-pointer"
                        title="Delete Operator"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {isActive && (
                        <span className="text-[8px] uppercase tracking-widest font-extrabold bg-[#00288e] text-white px-2 py-0.5 rounded">
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Venue Spaces Manager Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#e3e1eb] shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-[#e3e1eb] pb-3">
              <h3 className="font-sans font-bold text-base text-[#1a1b22] flex items-center gap-1.5">
                <Layers className="w-4.5 h-4.5 text-[#00288e]" />
                <span>Venue Allocation spaces</span>
              </h3>
              <button
                onClick={() => {
                  setEditingSpace(null);
                  setNewSpaceName('');
                  setNewMinCap('');
                  setNewMaxCap('');
                  setNewFeaturesList([]);
                  setShowSpaceModal(true);
                }}
                className="p-1.5 hover:bg-[#f4f2fc] text-[#00288e] rounded-lg transition-colors cursor-pointer"
                title="Create space"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {venueSpaces.map((space) => (
                <div key={space.id} className="p-3.5 bg-[#f4f2fc]/40 rounded-xl border border-[#eeedf7] space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-sans font-bold text-xs text-[#1a1b22]">{space.name}</h4>
                      <span className="inline-block text-[9px] bg-[#6cf8bb]/30 text-[#00714d] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md mt-1">
                        Active Hall
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setEditingSpace(space);
                          setNewSpaceName(space.name);
                          setNewMinCap(String(space.capacityMin));
                          setNewMaxCap(String(space.capacityMax));
                          setNewFeaturesList(space.features || []);
                          setShowSpaceModal(true);
                        }}
                        className="p-1 hover:bg-[#eeedf7] text-[#00288e] rounded-lg transition-colors cursor-pointer"
                        title="Edit Space"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteConfirmSpace(space);
                        }}
                        className="p-1 hover:bg-[#ffdad6] hover:text-[#ba1a1a] text-[#444653] rounded-lg transition-colors cursor-pointer"
                        title="Remove Space"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-[10px] text-[#444653] font-semibold pt-1 border-t border-[#eeedf7]">
                    <span>Min Cap: {space.capacityMin} Pax</span>
                    <span className="text-right">Max Cap: {space.capacityMax} Pax</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Space Modal */}
      {showSpaceModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center border-b border-[#e3e1eb] pb-3">
              <h3 className="font-sans font-bold text-lg text-[#1a1b22]">
                {editingSpace ? 'Edit Venue Space' : 'Add New Venue Space'}
              </h3>
              <button 
                onClick={() => {
                  setShowSpaceModal(false);
                  setEditingSpace(null);
                }}
                className="p-1 hover:bg-[#f4f2fc] rounded-full text-[#444653] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSpace} className="space-y-4 text-xs font-semibold">
              {/* Space Name */}
              <div className="space-y-1">
                <label className="text-[#444653] uppercase tracking-wider block">Space Name *</label>
                <input
                  type="text"
                  required
                  value={newSpaceName}
                  onChange={(e) => setNewSpaceName(e.target.value)}
                  placeholder="E.g. Sapphire Terrace"
                  className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl px-3 py-2 text-sm text-[#1a1b22] focus:outline-none focus:ring-1 focus:ring-[#00288e]"
                />
              </div>

              {/* Capacities */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[#444653] uppercase tracking-wider block">Min capacity (Pax) *</label>
                  <input
                    type="number"
                    required
                    value={newMinCap}
                    onChange={(e) => setNewMinCap(e.target.value)}
                    placeholder="E.g. 100"
                    className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl px-3 py-2 text-sm text-[#1a1b22] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#444653] uppercase tracking-wider block">Max Capacity (Pax) *</label>
                  <input
                    type="number"
                    required
                    value={newMaxCap}
                    onChange={(e) => setNewMaxCap(e.target.value)}
                    placeholder="E.g. 500"
                    className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl px-3 py-2 text-sm text-[#1a1b22] focus:outline-none"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-[#e3e1eb]">
                <button
                  type="button"
                  onClick={() => {
                    setShowSpaceModal(false);
                    setEditingSpace(null);
                  }}
                  className="px-4 py-2 bg-white text-[#444653] rounded-xl hover:bg-[#f4f2fc] border border-[#c4c5d5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00288e] text-white rounded-xl hover:bg-[#1e40af] cursor-pointer"
                >
                  {editingSpace ? 'Update Space Details' : 'Register Space'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmSpace && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl animate-scale-up text-center">
            <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <div className="space-y-1.5">
              <h3 className="font-sans font-extrabold text-base text-[#1a1b22]">Delete Venue Space?</h3>
              <p className="text-xs text-[#444653] leading-relaxed">
                Are you sure you want to remove <span className="font-bold text-[#1a1b22]">{deleteConfirmSpace.name}</span>? This allocation space will be deleted from your venue list.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmSpace(null)}
                className="flex-1 py-2 bg-white text-[#444653] font-semibold text-xs rounded-xl hover:bg-[#f4f2fc] border border-[#c4c5d5] cursor-pointer transition-colors"
              >
                No, Keep it
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteVenueSpace(deleteConfirmSpace.id);
                  setDeleteConfirmSpace(null);
                }}
                className="flex-1 py-2 bg-red-600 text-white font-semibold text-xs rounded-xl hover:bg-red-700 cursor-pointer transition-colors shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Add New Team Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center border-b border-[#e3e1eb] pb-3">
              <h3 className="font-sans font-bold text-lg text-[#1a1b22]">Add New Back-Office Operator</h3>
              <button 
                onClick={() => setShowAddMemberModal(false)}
                className="p-1 hover:bg-[#f4f2fc] rounded-full text-[#444653] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="space-y-4 text-xs font-semibold">
              {/* Operator Name */}
              <div className="space-y-1">
                <label className="text-[#444653] uppercase tracking-wider block">Operator Name *</label>
                <input
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="E.g. Jordan Miller"
                  className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl px-3 py-2.5 text-sm text-[#1a1b22] focus:outline-none focus:ring-1 focus:ring-[#00288e]"
                />
              </div>

              {/* Operator Email */}
              <div className="space-y-1">
                <label className="text-[#444653] uppercase tracking-wider block">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="E.g. jordan@banquetpro.com"
                  className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl px-3 py-2.5 text-sm text-[#1a1b22] focus:outline-none"
                />
              </div>

              {/* Operator Phone */}
              <div className="space-y-1">
                <label className="text-[#444653] uppercase tracking-wider block">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={newMemberPhone}
                  onChange={(e) => setNewMemberPhone(e.target.value)}
                  placeholder="E.g. 9876543210"
                  className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl px-3 py-2.5 text-sm text-[#1a1b22] focus:outline-none"
                />
              </div>

              {/* Operator Password */}
              <div className="space-y-1">
                <label className="text-[#444653] uppercase tracking-wider block">Security Password *</label>
                <input
                  type="password"
                  required
                  value={newMemberPassword}
                  onChange={(e) => setNewMemberPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl px-3 py-2.5 text-sm text-[#1a1b22] focus:outline-none"
                />
              </div>

              {/* Operator Role */}
              <div className="space-y-1">
                <label className="text-[#444653] uppercase tracking-wider block">Role Access Level</label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value as 'Admin' | 'Manager' | 'Staff')}
                  className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl px-3 py-2.5 text-sm text-[#1a1b22] focus:outline-none cursor-pointer"
                >
                  <option value="Staff">Staff (Sales Agent)</option>
                  <option value="Manager">Manager (Coordinator)</option>
                  <option value="Admin">Admin (Full Owner)</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-[#e3e1eb]">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2 bg-white text-[#444653] rounded-xl hover:bg-[#f4f2fc] border border-[#c4c5d5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00288e] text-white rounded-xl hover:bg-[#1e40af] cursor-pointer"
                >
                  Register Operator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Team Member Confirmation Modal */}
      {deleteConfirmMember && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-scale-up text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-sans font-bold text-base text-[#1a1b22]">Delete Back-Office Operator?</h3>
              <p className="text-[11px] text-[#444653] font-medium leading-relaxed">
                Are you sure you want to delete <span className="font-bold text-[#1a1b22]">{deleteConfirmMember.name}</span>? This action is permanent and cannot be undone.
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmMember(null)}
                className="flex-1 py-2 bg-[#f4f2fc] text-[#444653] font-semibold text-xs rounded-xl hover:bg-[#e3e1eb] border border-[#c4c5d5]/30 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteTeamMember(deleteConfirmMember.id);
                  setDeleteConfirmMember(null);
                }}
                className="flex-1 py-2 bg-red-600 text-white font-semibold text-xs rounded-xl hover:bg-red-700 cursor-pointer transition-colors shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Team Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center border-b border-[#e3e1eb] pb-3">
              <h3 className="font-sans font-bold text-lg text-[#1a1b22]">Edit Back-Office Operator</h3>
              <button 
                onClick={() => setEditingMember(null)}
                className="p-1 hover:bg-[#f4f2fc] rounded-full text-[#444653] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditMember} className="space-y-4 text-xs font-semibold">
              {/* Operator Name */}
              <div className="space-y-1">
                <label className="text-[#444653] uppercase tracking-wider block">Operator Name *</label>
                <input
                  type="text"
                  required
                  value={editMemberName}
                  onChange={(e) => setEditMemberName(e.target.value)}
                  className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl px-3 py-2.5 text-sm text-[#1a1b22] focus:outline-none focus:ring-1 focus:ring-[#00288e]"
                />
              </div>

              {/* Operator Email */}
              <div className="space-y-1">
                <label className="text-[#444653] uppercase tracking-wider block">Email Address *</label>
                <input
                  type="email"
                  required
                  value={editMemberEmail}
                  onChange={(e) => setEditMemberEmail(e.target.value)}
                  className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl px-3 py-2.5 text-sm text-[#1a1b22] focus:outline-none"
                />
              </div>

              {/* Operator Phone */}
              <div className="space-y-1">
                <label className="text-[#444653] uppercase tracking-wider block">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={editMemberPhone}
                  onChange={(e) => setEditMemberPhone(e.target.value)}
                  className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl px-3 py-2.5 text-sm text-[#1a1b22] focus:outline-none"
                />
              </div>

              {/* Operator Password / Reset Password */}
              <div className="space-y-1">
                <label className="text-[#444653] uppercase tracking-wider block">Security Password *</label>
                <input
                  type="text"
                  required
                  value={editMemberPassword}
                  onChange={(e) => setEditMemberPassword(e.target.value)}
                  placeholder="Enter new or existing password"
                  className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl px-3 py-2.5 text-sm text-[#1a1b22] focus:outline-none font-bold"
                />
              </div>

              {/* Operator Role */}
              <div className="space-y-1">
                <label className="text-[#444653] uppercase tracking-wider block">Role Access Level</label>
                <select
                  value={editMemberRole}
                  onChange={(e) => setEditMemberRole(e.target.value as 'Admin' | 'Manager' | 'Staff')}
                  className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl px-3 py-2.5 text-sm text-[#1a1b22] focus:outline-none cursor-pointer"
                >
                  <option value="Staff">Staff (Sales Agent)</option>
                  <option value="Manager">Manager (Coordinator)</option>
                  <option value="Admin">Admin (Full Owner)</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-[#e3e1eb]">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 bg-white text-[#444653] rounded-xl hover:bg-[#f4f2fc] border border-[#c4c5d5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00288e] text-white rounded-xl hover:bg-[#1e40af] cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
