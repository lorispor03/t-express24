'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
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
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [activeCategories, setActiveCategories] = useState<Set<string>>(() => {
    const cats = searchParams.get('filter');
    return cats ? new Set(cats.split(',')) : new Set<string>();
  });
  const [search, setSearch] = useState(() => searchParams.get('q') || '');
  const [sort, setSort] = useState<SortOption>(() => (searchParams.get('sort') as SortOption) || 'default');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);
  const PER_PAGE = 20;

  const updateURL = useCallback((cats: Set<string>, q: string, s: string) => {
    const params = new URLSearchParams();
    if (cats.size > 0) params.set('filter', Array.from(cats).join(','));
    if (q) params.set('q', q);
    if (s !== 'default') params.set('sort', s);
    const qs = params.toString();
    router.replace(`${pathname}${qs ? '?' + qs : ''}`, { scroll: false });
  }, [router, pathname]);

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

    // Search filter — Titel, Handle, Keywords, Jahreszahlen
    if (search.trim()) {
      const KMAP: Record<string, string[]> = {
        'heim': ['heimtrikot', 'home'], 'zuhause': ['heimtrikot', 'home'],
        'auswaerts': ['auswaertstrikot', 'away'], 'auswarts': ['auswaertstrikot', 'away'],
        'langarm': ['langarm', 'long sleeve', 'longsleeve'], 'kinder': ['kinder', 'kids'],
        'damen': ['damen', 'female', 'women'], 'frauen': ['damen', 'female', 'women'],
        'spieler': ['player'], 'retro': ['retro'], 'torwart': ['torwarttrikot', 'goalkeeper'],
        'spezial': ['sondertrikot', 'special'], 'ausweich': ['ausweichtrikot', 'third'],
        'training': ['trainingsanzug', 'training'], 'windbreaker': ['windbreaker'],
      };
      const norm = (s: string) => s.toLowerCase()
        .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
        .replace(/[^a-z0-9\s]/g, '');
      const words = norm(search).split(/\s+/).filter(Boolean);
      const expandedWords = words.map(w => {
        const variants = [w];
        if (KMAP[w]) variants.push(...KMAP[w].map(k => k.toLowerCase()));
        // Jahreszahl: 2008 → 07 08, 08 09
        const ym = w.match(/^(19|20)(\d{2})$/);
        if (ym) {
          const yy = parseInt(ym[2]);
          variants.push(`${String(yy - 1).padStart(2, '0')} ${ym[2]}`, `${ym[2]} ${String(yy + 1).padStart(2, '0')}`);
        }
        if (/^\d{4}$/.test(w) && !w.startsWith('19') && !w.startsWith('20')) {
          variants.push(w.slice(0, 2) + ' ' + w.slice(2));
        }
        return variants;
      });
      result = result.filter(p => {
        const haystack = norm(p.t) + ' ' + p.h.replace(/-/g, ' ').toLowerCase() + ' ' + p.c.join(' ');
        return expandedWords.every(variants => variants.some(v => haystack.includes(v)));
      });
    }

    // Category filter
    if (activeCategories.size > 0) {
      result = result.filter(p => p.c.some(c => activeCategories.has(c)));
    }

    // Sort
    const getDefaultScore = (p: Product): number => {
      const t = p.t.toLowerCase();
      const cats = p.c;

      // 1) Produkt-Typ: Trikots zuerst, Nebenprodukte hinten
      const isJersey = /heimtrikot|auswärtstrikot|ausweichtrikot|torwarttrikot|sondertrikot|home|away|third|gk/i.test(p.t);
      const isRetroJersey = isJersey && (cats.includes('retro') || cats.includes('kids-retro'));
      let productType = 0;
      if (isJersey && !isRetroJersey) productType = 0;      // Aktuelle Trikots
      else if (isRetroJersey) productType = 2;               // Retro-Trikots
      else productType = 3;                                   // Windbreaker, Training, T-Shirt etc.

      // 2) Saison: aktuellste zuerst
      let season = 5;
      if (t.includes('26/27')) season = 0;
      else if (t.includes('25/26') || t.includes('wm 2026')) season = 1;
      else if (t.includes('24/25')) season = 2;
      else if (t.includes('23/24')) season = 3;
      else if (/\d{2}\/\d{2}|\d{4}/.test(t)) season = 4;

      // 3) Trikotart: Heim → Auswärts → Ausweich → Torwart → Sonder → Rest
      let jerseyType = 5;
      if (/heimtrikot|home/i.test(p.t)) jerseyType = 0;
      else if (/auswärtstrikot|away/i.test(p.t)) jerseyType = 1;
      else if (/ausweichtrikot|third/i.test(p.t)) jerseyType = 2;
      else if (/torwarttrikot|gk/i.test(p.t)) jerseyType = 3;
      else if (/sondertrikot|special/i.test(p.t)) jerseyType = 4;

      // 4) Variante: Player → Fan → Langarm → Kinder → Damen
      let variant = 1;
      if (cats.includes('player')) variant = 0;
      else if (cats.includes('longsleeve')) variant = 2;
      else if (cats.includes('kids') || cats.includes('kids-retro')) variant = 3;
      else if (cats.includes('female')) variant = 4;

      return productType * 10000 + season * 1000 + jerseyType * 100 + variant;
    };

    switch (sort) {
      case 'default':
        result.sort((a, b) => getDefaultScore(a) - getDefaultScore(b));
        break;
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
      updateURL(next, search, sort);
      return next;
    });
    setVisibleCount(PER_PAGE);
  };

  const handleSearch = (q: string) => {
    setSearch(q);
    updateURL(activeCategories, q, sort);
    setVisibleCount(PER_PAGE);
  };

  const handleSort = (s: SortOption) => {
    setSort(s);
    updateURL(activeCategories, search, s);
  };

  const resetFilters = () => {
    setActiveCategories(new Set());
    setSearch('');
    setSort('default');
    updateURL(new Set(), '', 'default');
    setVisibleCount(PER_PAGE);
  };

  return (
    <div className="max-w-[1920px] mx-auto px-4 md:px-8 xl:px-12 2xl:px-16 py-3 md:py-8">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-3 md:mb-6">
        {/* Search */}
        <div className="relative flex-1 w-full sm:max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Trikot suchen..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
            className="w-full bg-[#d0d0d0] border border-gray-300 rounded-lg pl-10 pr-9 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-[var(--red-main)] transition-colors"
          />
          {search && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Sort + Mobile Filter (side by side on mobile) */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex items-center flex-1 sm:flex-none">
            <svg className="absolute left-3 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
            <select
              value={sort}
              onChange={e => handleSort(e.target.value as SortOption)}
              className="w-full sm:w-auto bg-[#d0d0d0] border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[var(--red-main)] cursor-pointer appearance-none"
            >
              <option value="default">Sortierung</option>
              <option value="price-asc">Preis: Tief → Hoch</option>
              <option value="price-desc">Preis: Hoch → Tief</option>
              <option value="name-asc">Name: A → Z</option>
              <option value="name-desc">Name: Z → A</option>
            </select>
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden flex items-center gap-2 bg-[#d0d0d0] border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter {activeCategories.size > 0 && `(${activeCategories.size})`}
          </button>
        </div>
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
            className="flex items-center gap-1.5 bg-[var(--red-main)]/20 text-[var(--red-main)] text-xs font-medium px-3 py-1.5 rounded-full hover:bg-[var(--red-main)]/30 transition-colors"
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
            <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white p-6 overflow-y-auto">
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
              <p className="text-xs text-gray-500 mb-4">{filteredProducts.length} Artikel</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {filteredProducts.slice(0, visibleCount).map((product, idx) => (
                  <ProductCard key={`${product.h}-${idx}`} product={product} teamName={teamName} />
                ))}
              </div>
              {visibleCount < filteredProducts.length && (
                <div className="flex flex-col items-center mt-8 gap-2">
                  <button
                    onClick={() => setVisibleCount(prev => prev + PER_PAGE)}
                    className="bg-[var(--red-main)] hover:bg-[#a81d27] text-white text-sm font-semibold px-8 py-3 rounded-xl transition-colors"
                  >
                    Mehr anzeigen
                  </button>
                  <p className="text-[11px] text-gray-600">
                    {Math.min(visibleCount, filteredProducts.length)} von {filteredProducts.length}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
