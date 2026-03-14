import { notFound } from 'next/navigation';
import { getProductByHandle } from '@/lib/data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductDetailClient from '@/components/ProductDetailClient';

interface Props {
  params: Promise<{ handle: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const result = getProductByHandle(handle);
  if (!result) return notFound();

  const { product, teamId, teamName, leagueName, leagueSlug } = result;

  return (
    <>
      <Header />
      <ProductDetailClient
        product={product}
        teamId={teamId}
        teamName={teamName}
        leagueName={leagueName}
        leagueSlug={leagueSlug}
      />
      <Footer />
    </>
  );
}
