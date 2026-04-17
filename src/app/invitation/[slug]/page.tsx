import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import CardView from '@/components/templates/CardView';
import ShareButtons from '@/components/invitation/ShareButtons';
import QRCodeDownload from '@/components/invitation/QRCodeDownload';
import RSVPForm from '@/components/invitation/RSVPForm';
import GuestbookSection from '@/components/invitation/GuestbookSection';
import InvitationClient from '@/components/invitation/InvitationClient';
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

// Service-role client — bypasses RLS, server-side only, never exposed to browser
function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
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

  // Track view — use admin client to bypass RLS (server-side only)
  const headersList = await headers();
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0].trim() ??
    headersList.get('x-real-ip') ??
    'unknown';
  const ua = headersList.get('user-agent') ?? '';
  const viewHash = await hashViewKey(ip, ua);
  // Use Vietnam time (UTC+7) so views are grouped by the correct local date
  // eslint-disable-next-line react-hooks/purity
  const today = new Date(Date.now() + 7 * 3600 * 1000)
    .toISOString()
    .split('T')[0];
  void getAdminSupabase()
    .from('page_views')
    .upsert(
      { card_id: card.id, view_date: today, view_hash: viewHash },
      { onConflict: 'card_id,view_date,view_hash', ignoreDuplicates: true },
    )
    .then(({ error }) => {
      if (error) console.error('[view-track]', error.message);
    });

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

      {/* Card container — fixed width centered; only shrinks when no white space left */}
      <div className="flex min-h-screen justify-center py-10">
        <div className="w-[420px] max-w-full overflow-hidden bg-white shadow-2xl sm:rounded-2xl">
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

      {/* Splash + music */}
      <InvitationClient
        partner1={card.config.coupleNames.partner1}
        partner2={card.config.coupleNames.partner2}
        music={card.config.music}
      />
    </div>
  );
}
