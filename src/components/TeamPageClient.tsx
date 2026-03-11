'use client';

import { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import FilterSidebar from './FilterSidebar';
import { Product, CATEGORIES } from '@/lib/types';

interface TeamPageClientProps {
  teamName: string;
  leagueName: string;
  leagueSlug: string;
  products: Product[];
}

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

export default function TeamPageClient({ teamName, leagueName, leagueSlug, products }: TeamPageClientProps) {
  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('default');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Get available categories from products
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach(p => p.c.forEach(c => cats.add(c)));
    // Sort by CATEGORIES order
    const order = Object.keys(CATEGORIES);
    return Array.from(cats).sort((a, b) => order.indexOf(a) - order.indexOf(b));
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p => p.t.toLowerCase().includes(q));
    }

    // Category filter
    if (activeCategories.size > 0) {
      result = result.filter(p => p.c.some(c => activeCategories.has(c)));
    }

    // Sort
    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => parseFloat(a.p) - parseFloat(b.p));
        break;
      case 'price-desc':
        result.sort((a, b) => parseFloat(b.p) - parseFloat(a.p));
        break;
      case 'name-asc':
        result.sort((a, b) => a.t.localeCompare(b.t));
        break;
      case 'name-desc':
        result.sort((a, b) => b.t.localeCompare(a.t));
        break;
    }

    return result;
  }, [products, search, activeCategories, sort]);

  const toggleCategory = (cat: string) => {
    setActiveCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const resetFilters = () => {
    setActiveCategories(new Set());
    setSearch('');
    setSort('default');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 w-full sm:max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Trikot suchen..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[var(--red-main)] transition-colors"
          />
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={e => setSort(e.target.value as SortOption)}
          className="bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--red-main)] cursor-pointer"
        >
          <option value="default">Sortierung</option>
          <option value="price-asc">Preis: Tief → Hoch</option>
          <option value="price-desc">Preis: Hoch → Tief</option>
          <option value="name-asc">Name: A → Z</option>
          <option value="name-desc">Name: Z → A</option>
        </select>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="lg:hidden flex items-center gap-2 bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filter {activeCategories.size > 0 && `(${activeCategories.size})`}
        </button>
      </div>

      {/* Active filter tags */}
      {activeCategories.size > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {Array.from(activeCategories).map(cat => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className="flex items-center gap-1.5 bg-[var(--red-main)]/20 text-[var(--red-main)] text-xs font-medium px-3 py-1.5 rounded-full hover:bg-[var(--red-main)]/30 transition-colors"
            >
              {CATEGORIES[cat] || cat}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ))}
          <button
            onClick={resetFilters}
            className="text-xs text-gray-500 hover:text-white px-3 py-1.5 transition-colors"
          >
            Alle entfernen
          </button>
        </div>
      )}

      <div className="flex gap-8">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-20">
            <FilterSidebar
              activeCategories={activeCategories}
              availableCategories={availableCategories}
              onToggle={toggleCategory}
              onReset={resetFilters}
              productCount={products.length}
              filteredCount={filteredProducts.length}
            />
          </div>
        </aside>

        {/* Sidebar - Mobile overlay */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setMobileFilterOpen(false)} />
            <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-[#111] p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Filter</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="p-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <FilterSidebar
                activeCategories={activeCategories}
                availableCategories={availableCategories}
                onToggle={toggleCategory}
                onReset={resetFilters}
                productCount={products.length}
                filteredCount={filteredProducts.length}
              />
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg mb-2">Keine Trikots gefunden</p>
              <p className="text-gray-600 text-sm">Versuche andere Filter oder Suchbegriffe.</p>
              <button onClick={resetFilters} className="mt-4 text-sm text-[var(--red-main)] hover:text-[var(--gold)] transition-colors">
                Filter zurücksetzen
              </button>
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-500 mb-4">{filteredProducts.length} Trikots</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {filteredProducts.map((product, idx) => (
                  <ProductCard key={`${product.h}-${idx}`} product={product} teamName={teamName} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
