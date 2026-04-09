import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Card } from '@/types/card';
import type { Wish } from '@/types/rsvp';

export default async function WishesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: cards } = await supabase
    .from('cards')
    .select('id, config')
    .eq('user_id', user.id);

  const cardList = (cards ?? []) as Pick<Card, 'id' | 'config'>[];
  const cardMap = Object.fromEntries(
    cardList.map((c) => [
      c.id,
      c.config.coupleNames.partner1 && c.config.coupleNames.partner2
        ? `${c.config.coupleNames.partner1} & ${c.config.coupleNames.partner2}`
        : 'Thiệp chưa đặt tên',
    ]),
  );

  const cardIds = cardList.map((c) => c.id);

  const wishes: Wish[] =
    cardIds.length > 0
      ? await supabase
          .from('wishes')
          .select('*')
          .in('card_id', cardIds)
          .order('created_at', { ascending: false })
          .then((r) => (r.data ?? []) as Wish[])
      : [];

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold text-gray-900">Lời chúc</h1>
      <p className="mb-6 text-sm text-gray-400">
        {wishes.length} lời chúc từ tất cả thiệp
      </p>

      {wishes.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 py-20 text-center">
          <p className="text-3xl mb-3">❀</p>
          <p className="text-gray-500">Chưa có lời chúc nào.</p>
          <p className="mt-1 text-sm text-gray-400">
            Khách mời sẽ để lại lời chúc qua trang thiệp cưới của bạn.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {wishes.map((wish) => (
            <div
              key={wish.id}
              className="rounded-xl border bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-amber-50 text-sm font-bold text-amber-600">
                    {wish.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{wish.name}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(wish.created_at).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <span className="flex-shrink-0 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500">
                  {cardMap[wish.card_id] ?? 'Thiệp'}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-gray-700">
                {wish.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
