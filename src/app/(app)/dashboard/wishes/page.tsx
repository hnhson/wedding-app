import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Card } from '@/types/card';
import { MessageSquare, ChevronRight } from 'lucide-react';

export default async function WishesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: cards } = await supabase
    .from('cards')
    .select('id, config')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const cardList = (cards ?? []) as Pick<Card, 'id' | 'config'>[];
  const cardIds = cardList.map((c) => c.id);

  // Count wishes per card
  const wishCounts: Record<string, number> =
    cardIds.length > 0
      ? await supabase
          .from('wishes')
          .select('card_id')
          .in('card_id', cardIds)
          .then((r) =>
            (r.data ?? []).reduce<Record<string, number>>((acc, row) => {
              acc[row.card_id] = (acc[row.card_id] ?? 0) + 1;
              return acc;
            }, {}),
          )
      : {};

  const totalWishes = Object.values(wishCounts).reduce((s, n) => s + n, 0);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-gray-900">Lời chúc</h1>
      <p className="mb-6 text-sm text-gray-400">
        {totalWishes} lời chúc từ {cardList.length} thiệp
      </p>

      {cardList.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 py-20 text-center">
          <p className="mb-3 text-3xl">❀</p>
          <p className="text-gray-500">Bạn chưa có thiệp nào.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cardList.map((card) => {
            const { partner1, partner2 } = card.config.coupleNames;
            const name =
              partner1 && partner2
                ? `${partner1} & ${partner2}`
                : 'Thiệp chưa đặt tên';
            const count = wishCounts[card.id] ?? 0;

            return (
              <Link
                key={card.id}
                href={`/dashboard/wishes/${card.id}`}
                className="flex items-center justify-between rounded-xl border bg-white px-5 py-4 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                    <MessageSquare size={18} className="text-amber-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{name}</p>
                    <p className="mt-0.5 text-sm text-gray-400">
                      {count > 0 ? `${count} lời chúc` : 'Chưa có lời chúc'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {count > 0 && (
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                      {count}
                    </span>
                  )}
                  <ChevronRight size={18} className="text-gray-300" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
