import React, { useState } from 'react';
import { 
  ChefHat, Plus, Search, Sparkles, Trash2, Edit2, CheckCircle, 
  X, HelpCircle, Utensils, AlertCircle, ShoppingBag 
} from 'lucide-react';
import { CateringItem } from '../types';

interface MenuViewProps {
  searchQuery: string;
  cateringItems: CateringItem[];
  onAddCateringItem: (item: CateringItem) => void;
  onUpdateCateringItem: (item: CateringItem) => void;
  onDeleteCateringItem: (id: string) => void;
}

type MenuCategory = 'All' | 'Starter' | 'Main Course' | 'Dessert' | 'Beverage';

export default function MenuView({
  searchQuery,
  cateringItems,
  onAddCateringItem,
  onUpdateCateringItem,
  onDeleteCateringItem
}: MenuViewProps) {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('All');
  
  // States for adding a new item
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDishName, setNewDishName] = useState('');
  const [newDishCategory, setNewDishCategory] = useState<CateringItem['category']>('Starter');
  const [newDishPrice, setNewDishPrice] = useState('');
  const [newDishDesc, setNewDishDesc] = useState('');
  const [isBestseller, setIsBestseller] = useState(false);

  // Filter menu items
  const filteredItems = cateringItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (activeCategory === 'All') return true;
    return item.category === activeCategory;
  });

  // Toggle availability in real time
  const handleToggleAvailability = (item: CateringItem) => {
    const updated = {
      ...item,
      isAvailable: !item.isAvailable
    };
    onUpdateCateringItem(updated);
  };

  const handleCreateDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim()) {
      alert('Please fill in required fields');
      return;
    }

    const newItem: CateringItem = {
      id: `CAT-${Date.now().toString().slice(-4)}`,
      name: newDishName,
      category: newDishCategory,
      description: newDishDesc || 'No description provided.',
      price: 0,
      isAvailable: true,
      image: '', // local default gradient
      isBestseller
    };

    onAddCateringItem(newItem);
    
    // reset form
    setNewDishName('');
    setNewDishPrice('');
    setNewDishDesc('');
    setIsBestseller(false);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans font-bold text-3xl text-[#1a1b22] tracking-tight">Catering Menu Management</h2>
          <p className="text-[#444653] text-sm mt-1">Configure premium recipes, live stocks, bestseller badges, and pricing tiers.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#00288e] text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-[#1e40af] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Add Menu Item</span>
        </button>
      </div>

      {/* Categories Tabs row */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e3e1eb] pb-1">
        <div className="flex gap-2">
          {(['All', 'Starter', 'Main Course', 'Dessert', 'Beverage'] as MenuCategory[]).map((cat) => {
            const count = cat === 'All' 
              ? cateringItems.length 
              : cateringItems.filter(i => i.category === cat).length;
            
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-sm font-semibold relative transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'text-[#00288e] border-b-2 border-[#00288e]'
                    : 'text-[#444653] hover:text-[#1a1b22]'
                }`}
              >
                <span>{cat}s</span>
                <span className="ml-1.5 text-xs bg-[#eeedf7] text-[#444653] px-2 py-0.5 rounded-full font-medium">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Food Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center border border-[#e3e1eb] rounded-2xl">
            <ChefHat className="w-12 h-12 text-[#444653]/40 mx-auto mb-3" />
            <p className="font-bold text-[#1a1b22]">No items found in this category</p>
            <p className="text-xs text-[#444653] mt-1">Try adjusting filters or search phrase.</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div 
              key={item.id}
              className={`bg-white rounded-2xl shadow-sm border border-[#e3e1eb] overflow-hidden flex flex-col justify-between group transition-all duration-300 ${
                !item.isAvailable ? 'opacity-70' : 'hover:shadow-md'
              }`}
            >
              {/* Product Card Top Layout */}
              <div>
                {/* Visual Area */}
                <div className="h-48 bg-gradient-to-tr from-[#eeedf7] to-[#dde1ff] relative overflow-hidden flex items-center justify-center">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="text-center p-6 text-[#00288e]/40">
                      <ChefHat className="w-12 h-12 mx-auto mb-2" />
                      <span className="font-bold text-[10px] uppercase tracking-wider">Premium Recipe Preview</span>
                    </div>
                  )}

                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                    <span className="bg-white/90 backdrop-blur-sm text-[#1a1b22] px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider border">
                      {item.category}
                    </span>
                    {item.isBestseller && (
                      <span className="bg-[#dde1ff] text-[#00288e] px-2.5 py-1 rounded-lg text-[9px] font-extrabold flex items-center gap-1 uppercase tracking-wider border border-[#00288e]/30">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>Bestseller</span>
                      </span>
                    )}
                  </div>

                  {/* Stock Availability indicator top right */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-widest ${
                      item.isAvailable 
                        ? 'bg-[#10B981] text-white' 
                        : 'bg-[#ba1a1a] text-white'
                    }`}>
                      {item.isAvailable ? 'In Stock' : 'Sold Out'}
                    </span>
                  </div>
                </div>

                {/* Info details */}
                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-sans font-bold text-base text-[#1a1b22] line-clamp-1">{item.name}</h4>
                  </div>
                  <p className="text-xs text-[#444653] font-medium leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Action and Toggles at bottom */}
              <div className="p-6 pt-0 flex justify-between items-center border-t border-[#e3e1eb]/60 mt-4">
                {/* Toggle switch for stock */}
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-[10px] text-[#444653] uppercase font-bold tracking-wider">Available</span>
                  <button
                    onClick={() => handleToggleAvailability(item)}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer relative ${
                      item.isAvailable ? 'bg-[#00288e]' : 'bg-[#e3e1eb]'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      item.isAvailable ? 'translate-x-4' : 'translate-x-0'
                    }`}></div>
                  </button>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => {
                    if (confirm(`Remove ${item.name} from global menu?`)) {
                      onDeleteCateringItem(item.id);
                    }
                  }}
                  className="mt-4 p-2 text-[#444653] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded-xl transition-all cursor-pointer"
                  title="Delete recipe"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add New Culinary Recipe Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center border-b border-[#e3e1eb] pb-3">
              <h3 className="font-sans font-bold text-lg text-[#1a1b22]">Add New Recipe</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-[#f4f2fc] rounded-full text-[#444653] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDish} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-[#444653] uppercase tracking-wider block">Dish Title *</label>
                  <input
                    type="text"
                    required
                    value={newDishName}
                    onChange={(e) => setNewDishName(e.target.value)}
                    placeholder="E.g. Garlic Baked Lobsters"
                    className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl px-3 py-2 text-sm text-[#1a1b22] focus:outline-none focus:ring-1 focus:ring-[#00288e]"
                  />
                </div>

                {/* Category dropdown */}
                <div className="space-y-1">
                  <label className="text-[#444653] uppercase tracking-wider block">Course Category</label>
                  <select
                    value={newDishCategory}
                    onChange={(e) => setNewDishCategory(e.target.value as CateringItem['category'])}
                    className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl px-3 py-2 text-sm text-[#1a1b22] focus:outline-none"
                  >
                    <option value="Starter">Starter</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Beverage">Beverage</option>
                  </select>
                </div>
              </div>

              {/* Bestseller check */}
              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="bestseller_check"
                  checked={isBestseller}
                  onChange={(e) => setIsBestseller(e.target.checked)}
                  className="w-4 h-4 rounded border-[#c4c5d5] text-[#00288e] focus:ring-[#00288e] cursor-pointer"
                />
                <label htmlFor="bestseller_check" className="text-sm text-[#1a1b22] cursor-pointer font-bold">
                  Mark as Bestseller
                </label>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[#444653] uppercase tracking-wider block">Culinary Description</label>
                <textarea
                  rows={3}
                  value={newDishDesc}
                  onChange={(e) => setNewDishDesc(e.target.value)}
                  placeholder="Ingredients list, allergen details, presentation hints..."
                  className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl px-3 py-2 text-sm text-[#1a1b22] focus:outline-none"
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-[#e3e1eb]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-white text-[#444653] rounded-xl hover:bg-[#f4f2fc] border border-[#c4c5d5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00288e] text-white rounded-xl hover:bg-[#1e40af] cursor-pointer"
                >
                  Register Recipe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
