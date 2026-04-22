import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Card } from '@/types/card';
import type { Wish } from '@/types/rsvp';
import { ChevronLeft } from 'lucide-react';

export default async function CardWishesPage({
  params,
}: {
  params: Promise<{ cardId: string }>;
}) {
  const { cardId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Verify ownership
  const { data: card } = await supabase
    .from('cards')
    .select('id, config')
    .eq('id', cardId)
    .eq('user_id', user.id)
    .single();
  if (!card) notFound();

  const { partner1, partner2 } = (card as Pick<Card, 'id' | 'config'>).config
    .coupleNames;
  const cardName =
    partner1 && partner2 ? `${partner1} & ${partner2}` : 'Thiệp chưa đặt tên';

  const { data } = await supabase
    .from('wishes')
    .select('*')
    .eq('card_id', cardId)
    .order('created_at', { ascending: false });

  const wishes = (data ?? []) as Wish[];

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/dashboard/wishes"
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
        >
          <ChevronLeft size={16} />
          Lời chúc
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-semibold text-gray-900">{cardName}</h1>
      </div>

      <p className="mb-6 text-sm text-gray-400">
        {wishes.length > 0
          ? `${wishes.length} lời chúc`
          : 'Chưa có lời chúc nào'}
      </p>

      {wishes.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 py-20 text-center">
          <p className="mb-3 text-3xl">❀</p>
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
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-50 text-sm font-bold text-amber-600">
                  {wish.name[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{wish.name}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(wish.created_at).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
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
