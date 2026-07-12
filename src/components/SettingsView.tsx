import React, { useState } from 'react';
import { 
  Settings, Users, Layers, Shield, Save, CheckCircle2, Plus, 
  Trash2, Mail, MapPin, IndianRupee, Sparkles, User, HelpCircle, X, Wrench,
  Edit2, AlertTriangle
} from 'lucide-react';
import { VenueSettings, TeamMember, VenueSpace } from '../types';

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
  onUpdateVenueSpace
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
            <h3 className="font-sans font-bold text-base text-[#1a1b22] flex items-center gap-1.5 border-b border-[#e3e1eb] pb-3">
              <Users className="w-4.5 h-4.5 text-[#00288e]" />
              <span>Back-Office Operators</span>
            </h3>

            <p className="text-[10px] text-[#444653] leading-relaxed font-semibold">
              Select any operator below to dynamically change the active session administrator throughout the workspace.
            </p>

            <div className="space-y-2.5">
              {teamMembers.map((member) => {
                const isActive = activeAdminId === member.id;
                return (
                  <div
                    key={member.id}
                    onClick={() => onSelectActiveAdmin(member)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isActive 
                        ? 'bg-[#dde1ff]/35 border-[#00288e] ring-1 ring-[#00288e]' 
                        : 'bg-white border-[#e3e1eb] hover:bg-[#f4f2fc]/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
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
                          <span>{member.name}</span>
                          {member.status === 'Online' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                          )}
                        </h4>
                        <p className="text-[9px] text-[#444653] uppercase font-bold tracking-wider mt-0.5">{member.role}</p>
                      </div>
                    </div>

                    {isActive && (
                      <span className="text-[8px] uppercase tracking-widest font-extrabold bg-[#00288e] text-white px-2 py-0.5 rounded">
                        Active
                      </span>
                    )}
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
    </div>
  );
}
