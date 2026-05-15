import { notFound } from 'next/navigation';
import { getProductByHandle } from '@/lib/data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductDetailClient from '@/components/ProductDetailClient';

interface Props {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ from?: string }>;
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { handle } = await params;
  const { from } = await searchParams;
  const result = getProductByHandle(handle, from);
  if (!result) return notFound();

  const { product, teamId, teamName, leagueName, leagueSlug, subLeague } = result;

  return (
    <>
      <Header />
      <ProductDetailClient
        product={product}
        teamId={teamId}
        teamName={teamName}
        leagueName={leagueName}
        leagueSlug={leagueSlug}
        subLeague={subLeague}
      />
      <Footer />
    </>
  );
}
