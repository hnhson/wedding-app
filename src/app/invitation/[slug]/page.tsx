import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import TemplateRenderer from '@/components/templates/TemplateRenderer';
import CountdownWidget from '@/components/CountdownWidget';
import ShareButtons from '@/components/invitation/ShareButtons';
import QRCodeDownload from '@/components/invitation/QRCodeDownload';
import { hashViewKey } from '@/lib/hash';
import type { Card } from '@/types/card';
import { FONT_PAIRS } from '@/lib/templates/presets';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data } = await getSupabase()
    .from('cards')
    .select('config')
    .eq('slug', slug)
    .single();
  if (!data) return {};

  const { partner1, partner2 } = data.config.coupleNames;
  const title = `${partner1} & ${partner2} — Thiệp cưới`;

  return {
    title,
    description: `Trân trọng kính mời bạn đến dự lễ cưới của ${partner1} và ${partner2}`,
    openGraph: { title, type: 'website' },
  };
}

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = getSupabase();

  const { data } = await supabase
    .from('cards')
    .select('*')
    .eq('slug', slug)
    .single();
  if (!data) notFound();

  const card = data as Card;

  // Track view: hash IP + User-Agent, upsert into page_views (fire-and-forget)
  const headersList = await headers();
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0].trim() ??
    headersList.get('x-real-ip') ??
    'unknown';
  const ua = headersList.get('user-agent') ?? '';
  const viewHash = await hashViewKey(ip, ua);
  const today = new Date().toISOString().split('T')[0];
  // intentionally not awaited — don't block page render on analytics
  supabase
    .from('page_views')
    .upsert(
      { card_id: card.id, view_date: today, view_hash: viewHash },
      { onConflict: 'card_id,view_date,view_hash', ignoreDuplicates: true },
    );

  const fontPair = FONT_PAIRS[card.config.fontPair];
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';
  const publicUrl = `${appUrl}/invitation/${slug}`;
  const title =
    card.config.coupleNames.partner1 && card.config.coupleNames.partner2
      ? `${card.config.coupleNames.partner1} & ${card.config.coupleNames.partner2}`
      : 'Thiệp cưới';

  return (
    <div className="min-h-screen">
      {/* Load fonts */}
      {fontPair && (
        <link
          rel="stylesheet"
          href={`https://fonts.googleapis.com/css2?family=${fontPair.heading.replace(/ /g, '+')}:wght@400;700&family=${fontPair.body.replace(/ /g, '+')}:wght@400;600&display=swap`}
        />
      )}

      {/* Countdown */}
      {card.config.weddingDate && (
        <div className="py-10 text-center">
          <CountdownWidget weddingDate={card.config.weddingDate} />
        </div>
      )}

      {/* Wedding template */}
      <TemplateRenderer config={card.config} />

      {/* Share & QR section */}
      <div className="bg-gray-50 py-14 text-center">
        <h2 className="mb-6 text-lg font-semibold text-gray-700">
          Chia sẻ thiệp cưới
        </h2>
        <ShareButtons url={publicUrl} title={title} />
        <div className="mt-10">
          <QRCodeDownload url={publicUrl} slug={slug} />
        </div>
      </div>
    </div>
  );
}
