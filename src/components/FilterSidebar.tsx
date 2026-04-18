'use client';

import { CATEGORIES } from '@/lib/types';

interface FilterSidebarProps {
  activeCategories: Set<string>;
  availableCategories: string[];
  onToggle: (cat: string) => void;
  onReset: () => void;
  productCount: number;
  filteredCount: number;
}

export default function FilterSidebar({ activeCategories, availableCategories, onToggle, onReset, productCount, filteredCount }: FilterSidebarProps) {
  return (
    <div className="bg-[#d0d0d0] rounded-xl p-5 border border-gray-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-sm uppercase tracking-wider text-gray-900">Filter</h3>
        {activeCategories.size > 0 && (
          <button onClick={onReset} className="text-xs text-[var(--red-main)] hover:text-[var(--gold)] transition-colors">
            Zurücksetzen
          </button>
        )}
      </div>

      <div className="space-y-2.5">
        {availableCategories.map(cat => (
          <label key={cat} className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              className="filter-checkbox"
              checked={activeCategories.has(cat)}
              onChange={() => onToggle(cat)}
            />
            <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
              {CATEGORIES[cat] || cat}
            </span>
          </label>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-gray-200 text-xs text-gray-500">
        {filteredCount} von {productCount} Produkten
      </div>
    </div>
  );
}
