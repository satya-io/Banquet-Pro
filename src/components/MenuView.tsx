import React, { useState, useMemo } from 'react';
import { 
  ChefHat, Plus, Search, Sparkles, Trash2, 
  X, Utensils, ChevronDown, ChevronRight, GripVertical
} from 'lucide-react';
import { CateringItem } from '../types';

interface MenuViewProps {
  searchQuery: string;
  cateringItems: CateringItem[];
  onAddCateringItem: (item: CateringItem) => void;
  onUpdateCateringItem: (item: CateringItem) => void;
  onDeleteCateringItem: (id: string) => void;
}

export default function MenuView({
  searchQuery,
  cateringItems,
  onAddCateringItem,
  onUpdateCateringItem,
  onDeleteCateringItem
}: MenuViewProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDishName, setNewDishName] = useState('');
  const [newDishCategory, setNewDishCategory] = useState('');
  const [newDishDesc, setNewDishDesc] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<string>('All');

  // Get unique categories from actual data
  const categories = useMemo(() => {
    const cats = new Set<string>();
    cateringItems.forEach(item => cats.add(item.category));
    return Array.from(cats).sort();
  }, [cateringItems]);

  // Filter items by search
  const filteredItems = useMemo(() => {
    return cateringItems.filter(item => {
      const matchesSearch = !searchQuery || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = activeFilter === 'All' || item.category === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [cateringItems, searchQuery, activeFilter]);

  // Group items by category
  const groupedItems = useMemo(() => {
    const groups: Record<string, CateringItem[]> = {};
    filteredItems.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, [filteredItems]);

  const sortedCategories = Object.keys(groupedItems).sort();

  const toggleCategory = (cat: string) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const handleCreateDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim() || !newDishCategory.trim()) {
      alert('Please fill in the dish name and category.');
      return;
    }

    const newItem: CateringItem = {
      id: `CAT-NEW-${Date.now().toString().slice(-6)}`,
      name: newDishName,
      category: newDishCategory.toUpperCase(),
      description: newDishDesc || newDishName,
      price: 0,
      isAvailable: true,
      image: '',
      isBestseller: false,
    };

    onAddCateringItem(newItem);
    setNewDishName('');
    setNewDishCategory('');
    setNewDishDesc('');
    setShowAddModal(false);
  };

  // Category color palette
  const getCategoryColor = (index: number) => {
    const colors = [
      { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
      { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
      { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
      { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
      { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', badge: 'bg-rose-100 text-rose-700', dot: 'bg-rose-500' },
      { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', badge: 'bg-teal-100 text-teal-700', dot: 'bg-teal-500' },
      { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', badge: 'bg-indigo-100 text-indigo-700', dot: 'bg-indigo-500' },
      { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
      { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', badge: 'bg-cyan-100 text-cyan-700', dot: 'bg-cyan-500' },
      { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700', badge: 'bg-pink-100 text-pink-700', dot: 'bg-pink-500' },
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans font-bold text-3xl text-[#1a1b22] tracking-tight">Catering Menu</h2>
          <p className="text-[#444653] text-sm mt-1">
            {cateringItems.length} items across {categories.length} categories
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#00288e] text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-[#1e40af] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Add Menu Item</span>
        </button>
      </div>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 max-h-[120px] overflow-y-auto sm:max-h-none">
        <button
          onClick={() => setActiveFilter('All')}
          className={`px-3 py-1.5 sm:px-3.5 rounded-full text-[11px] sm:text-xs font-semibold transition-all cursor-pointer ${
            activeFilter === 'All'
              ? 'bg-[#00288e] text-white shadow-md'
              : 'bg-white text-[#444653] border border-[#e3e1eb] hover:border-[#00288e]/30 hover:text-[#00288e]'
          }`}
        >
          All ({cateringItems.length})
        </button>
        {categories.map(cat => {
          const count = cateringItems.filter(i => i.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-3 py-1.5 sm:px-3.5 rounded-full text-[11px] sm:text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === cat
                  ? 'bg-[#00288e] text-white shadow-md'
                  : 'bg-white text-[#444653] border border-[#e3e1eb] hover:border-[#00288e]/30 hover:text-[#00288e]'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Category Groups */}
      <div className="space-y-4">
        {sortedCategories.length === 0 ? (
          <div className="bg-white p-12 text-center border border-[#e3e1eb] rounded-2xl">
            <ChefHat className="w-12 h-12 text-[#444653]/40 mx-auto mb-3" />
            <p className="font-bold text-[#1a1b22]">No items found</p>
            <p className="text-xs text-[#444653] mt-1">Try adjusting your search or filters.</p>
          </div>
        ) : (
          sortedCategories.map((category, catIndex) => {
            const items = groupedItems[category];
            const isCollapsed = collapsedCategories.has(category);
            const colors = getCategoryColor(catIndex);

            return (
              <div 
                key={category} 
                className={`bg-white rounded-xl border border-[#e3e1eb] overflow-hidden transition-all`}
              >
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category)}
                  className={`w-full flex items-center justify-between px-5 py-3.5 ${colors.bg} border-b ${colors.border} cursor-pointer hover:brightness-95 transition-all`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${colors.dot}`}></div>
                    <h3 className={`font-bold text-sm uppercase tracking-wider ${colors.text}`}>
                      {category}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>
                      {items.length} {items.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                  {isCollapsed ? (
                    <ChevronRight className={`w-4 h-4 ${colors.text}`} />
                  ) : (
                    <ChevronDown className={`w-4 h-4 ${colors.text}`} />
                  )}
                </button>

                {/* Items Grid */}
                {!isCollapsed && (
                  <div className="p-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1.5 sm:gap-2">
                      {items.map(item => (
                        <div
                          key={item.id}
                          className="group relative bg-[#f8f8fc] hover:bg-[#eeedf7] border border-[#e3e1eb] hover:border-[#00288e]/30 rounded-lg px-3 py-2.5 sm:py-2 transition-all duration-200 flex items-center justify-between gap-2"
                        >
                          <span className="text-sm text-[#1a1b22] font-medium truncate flex-1" title={item.name}>
                            {item.name}
                          </span>
                          <button
                            onClick={() => {
                              if (confirm(`Remove "${item.name}" from menu?`)) {
                                onDeleteCateringItem(item.id);
                              }
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-[#444653] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded transition-all cursor-pointer flex-shrink-0"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add New Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center border-b border-[#e3e1eb] pb-3">
              <h3 className="font-sans font-bold text-lg text-[#1a1b22]">Add Menu Item</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-[#f4f2fc] rounded-full text-[#444653] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDish} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Item Name */}
                <div className="space-y-1">
                  <label className="text-[#444653] uppercase tracking-wider block">Item Name *</label>
                  <input
                    type="text"
                    required
                    value={newDishName}
                    onChange={(e) => setNewDishName(e.target.value)}
                    placeholder="E.g. Paneer Malai Tikka"
                    className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl px-3 py-2 text-sm text-[#1a1b22] focus:outline-none focus:ring-1 focus:ring-[#00288e]"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="text-[#444653] uppercase tracking-wider block">Category *</label>
                  <input
                    type="text"
                    required
                    list="categoryList"
                    value={newDishCategory}
                    onChange={(e) => setNewDishCategory(e.target.value)}
                    placeholder="E.g. STARTERS"
                    className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl px-3 py-2 text-sm text-[#1a1b22] focus:outline-none focus:ring-1 focus:ring-[#00288e]"
                  />
                  <datalist id="categoryList">
                    {categories.map(cat => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[#444653] uppercase tracking-wider block">Description (optional)</label>
                <input
                  type="text"
                  value={newDishDesc}
                  onChange={(e) => setNewDishDesc(e.target.value)}
                  placeholder="Brief description..."
                  className="w-full bg-[#f4f2fc] border border-[#c4c5d5] rounded-xl px-3 py-2 text-sm text-[#1a1b22] focus:outline-none focus:ring-1 focus:ring-[#00288e]"
                />
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
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
