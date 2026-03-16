import productPatches from '@/data/product-patches.json';

export interface PatchSetOption {
  id: string;
  name: string;
  image: string;
  price: number;
}

// Re-export for backward compatibility with CartContext
export type PatchOption = PatchSetOption;

const patchData = productPatches as Record<string, Array<{ name: string; price: number; image: string }>>;

export function getPatchSetsForProduct(productHandle: string): PatchSetOption[] {
  const sets = patchData[productHandle];
  if (!sets || sets.length === 0) return [];

  return sets.map((s, i) => ({
    id: `${productHandle}__patch-${i}`,
    name: s.name,
    image: s.image,
    price: s.price,
  }));
}

// Legacy function - still used by non-La-Liga leagues
export function getPatchesForTeam(leagueSlug: string, subLeague?: string): PatchSetOption[] {
  return [];
}
