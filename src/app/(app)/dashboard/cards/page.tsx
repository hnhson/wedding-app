import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Card } from '@/types/card';
import DeleteCardButton from '@/components/dashboard/DeleteCardButton';

export default async function CardsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: cards } = await supabase
    .from('cards')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  const cardList = (cards ?? []) as Card[];

  const cardIds = cardList.map((c) => c.id);
  const viewsPerCard: Record<string, number> = {};
  const rsvpPerCard: Record<string, number> = {};

  if (cardIds.length > 0) {
    const [viewRows, rsvpRows] = await Promise.all([
      supabase.from('page_views').select('card_id').in('card_id', cardIds).then((r) => r.data ?? []),
      supabase.from('rsvps').select('card_id').in('card_id', cardIds).then((r) => r.data ?? []),
    ]);
    for (const row of viewRows) viewsPerCard[row.card_id] = (viewsPerCard[row.card_id] ?? 0) + 1;
    for (const row of rsvpRows) rsvpPerCard[row.card_id] = (rsvpPerCard[row.card_id] ?? 0) + 1;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Thiệp online</h1>
          <p className="mt-1 text-sm text-gray-400">{cardList.length} thiệp đã tạo</p>
        </div>
        <Link
          href="/cards/new"
          className="inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          + Tạo thiệp mới
        </Link>
      </div>

      {cardList.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 py-20 text-center">
          <p className="text-3xl mb-3">✦</p>
          <p className="text-gray-500 font-medium">Bạn chưa có thiệp nào.</p>
          <Link
            href="/cards/new"
            className="mt-4 inline-flex items-center gap-1 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
          >
            + Tạo thiệp đầu tiên
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cardList.map((card) => {
            const { coupleNames, weddingDate } = card.config;
            const name =
              coupleNames.partner1 && coupleNames.partner2
                ? `${coupleNames.partner1} & ${coupleNames.partner2}`
                : 'Thiệp chưa đặt tên';
            const views = viewsPerCard[card.id] ?? 0;
            const rsvps = rsvpPerCard[card.id] ?? 0;
            const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';

            return (
              <div key={card.id} className="flex flex-col rounded-xl border bg-white shadow-sm hover:shadow-md transition">
                <div className="border-b px-5 py-4">
                  <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
                  {weddingDate && (
                    <p className="mt-0.5 text-sm text-gray-400">
                      {new Date(weddingDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </p>
                  )}
                  <a
                    href={`${appUrl}/invitation/${card.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 block text-xs text-blue-400 hover:underline truncate"
                  >
                    /invitation/{card.slug}
                  </a>
                </div>

                <div className="flex divide-x border-b text-center">
                  <div className="flex-1 py-3">
                    <p className="text-lg font-bold text-blue-600">{views}</p>
                    <p className="text-xs text-gray-400">Lượt xem</p>
                  </div>
                  <div className="flex-1 py-3">
                    <p className="text-lg font-bold text-purple-600">{rsvps}</p>
                    <p className="text-xs text-gray-400">RSVP</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 p-4">
                  <Link href={`/cards/${card.id}/edit`} className="rounded-lg border border-gray-200 px-2 py-2 text-center text-sm text-gray-700 hover:bg-gray-50">✎ Chỉnh sửa</Link>
                  <Link href={`/cards/${card.id}/preview`} className="rounded-lg border border-gray-200 px-2 py-2 text-center text-sm text-gray-700 hover:bg-gray-50">◉ Xem trước</Link>
                  <Link href={`/cards/${card.id}/guests`} className="rounded-lg border border-gray-200 px-2 py-2 text-center text-sm text-gray-700 hover:bg-gray-50">✓ Khách mời</Link>
                  <Link href={`/cards/${card.id}/analytics`} className="rounded-lg border border-gray-200 px-2 py-2 text-center text-sm text-gray-700 hover:bg-gray-50">◎ Thống kê</Link>
                  <DeleteCardButton cardId={card.id} cardName={name} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
