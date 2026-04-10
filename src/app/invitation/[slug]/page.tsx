import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import CardView from '@/components/templates/CardView';
import CountdownWidget from '@/components/CountdownWidget';
import ShareButtons from '@/components/invitation/ShareButtons';
import QRCodeDownload from '@/components/invitation/QRCodeDownload';
import RSVPForm from '@/components/invitation/RSVPForm';
import GuestbookSection from '@/components/invitation/GuestbookSection';
import MusicPlayer from '@/components/invitation/MusicPlayer';
import { hashViewKey } from '@/lib/hash';
import type { Card } from '@/types/card';
import { FONT_PAIRS } from '@/lib/templates/presets';
import Footer from '@/components/Footer';

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

  // Track view (fire-and-forget)
  const headersList = await headers();
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0].trim() ??
    headersList.get('x-real-ip') ??
    'unknown';
  const ua = headersList.get('user-agent') ?? '';
  const viewHash = await hashViewKey(ip, ua);
  const today = new Date().toISOString().split('T')[0];
  void Promise.resolve()
    .then(() =>
      supabase
        .from('page_views')
        .upsert(
          { card_id: card.id, view_date: today, view_hash: viewHash },
          { onConflict: 'card_id,view_date,view_hash', ignoreDuplicates: true },
        ),
    )
    .catch(console.error);

  const fontPair = FONT_PAIRS[card.config.fontPair];
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';
  const publicUrl = `${appUrl}/invitation/${slug}`;
  const title =
    card.config.coupleNames.partner1 && card.config.coupleNames.partner2
      ? `${card.config.coupleNames.partner1} & ${card.config.coupleNames.partner2}`
      : 'Thiệp cưới';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Load fonts */}
      {fontPair && (
        <link
          rel="stylesheet"
          href={`https://fonts.googleapis.com/css2?family=${fontPair.heading.replace(/ /g, '+')}:wght@400;700&family=${fontPair.body.replace(/ /g, '+')}:wght@400;600&display=swap`}
        />
      )}

      {/* Card container — 1/4 screen width, centered */}
      <div className="flex min-h-screen justify-center px-4 py-10">
        <div className="w-full max-w-[25vw] min-w-[320px] overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Countdown */}
          {card.config.weddingDate && (
            <div className="py-8 text-center">
              <CountdownWidget weddingDate={card.config.weddingDate} />
            </div>
          )}

          {/* Wedding template + overlay elements */}
          <CardView config={card.config} />

          {/* RSVP section */}
          <div className="bg-white px-6 py-10">
            <h2 className="mb-2 text-center text-xl font-semibold text-gray-900">
              Xác nhận tham dự
            </h2>
            <p className="mb-6 text-center text-sm text-gray-500">
              Vui lòng xác nhận để chúng tôi chuẩn bị tốt nhất cho ngày trọng
              đại
            </p>
            <RSVPForm cardId={card.id} />
          </div>

          {/* Guestbook section */}
          <div className="bg-gray-50 px-6 py-10">
            <h2 className="mb-2 text-center text-xl font-semibold text-gray-900">
              Sổ lưu bút
            </h2>
            <p className="mb-6 text-center text-sm text-gray-500">
              Để lại lời chúc cho đôi uyên ương
            </p>
            <GuestbookSection cardId={card.id} />
          </div>

          {/* Share & QR section */}
          <div className="bg-white py-10 text-center">
            <h2 className="mb-4 text-base font-semibold text-gray-700">
              Chia sẻ thiệp cưới
            </h2>
            <ShareButtons url={publicUrl} title={title} />
            <div className="mt-8">
              <QRCodeDownload url={publicUrl} slug={slug} />
            </div>
          </div>

          <Footer />
        </div>
      </div>

      {/* Music player */}
      {card.config.music?.url && <MusicPlayer music={card.config.music} />}
    </div>
  );
}
