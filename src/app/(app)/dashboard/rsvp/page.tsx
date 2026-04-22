import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Card } from '@/types/card';
import type { RSVP } from '@/types/rsvp';
import { ChevronRight, ClipboardList } from 'lucide-react';

export default async function RsvpPage() {
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

  const rsvpRows: RSVP[] =
    cardIds.length > 0
      ? ((await supabase.from('rsvps').select('*').in('card_id', cardIds))
          .data ?? [])
      : [];

  // Group by card
  const rsvpByCard: Record<string, RSVP[]> = {};
  for (const r of rsvpRows) {
    rsvpByCard[r.card_id] = rsvpByCard[r.card_id] ?? [];
    rsvpByCard[r.card_id].push(r);
  }

  const totalResponses = rsvpRows.length;
  const totalAttending = rsvpRows.filter((r) => r.attending).length;
  const totalGuests = rsvpRows
    .filter((r) => r.attending)
    .reduce((s, r) => s + r.guest_count, 0);
  const totalNotAttending = rsvpRows.filter((r) => !r.attending).length;

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-gray-900">
        Thống kê RSVP
      </h1>
      <p className="mb-6 text-sm text-gray-400">
        {totalResponses} phản hồi từ {cardList.length} thiệp
      </p>

      {/* Summary stats */}
      {totalResponses > 0 && (
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-gray-900">{totalResponses}</p>
            <p className="mt-1 text-xs text-gray-400">Tổng phản hồi</p>
          </div>
          <div className="rounded-xl border bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-green-600">
              {totalAttending}
            </p>
            <p className="mt-1 text-xs text-gray-400">Sẽ tham dự</p>
          </div>
          <div className="rounded-xl border bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-blue-600">{totalGuests}</p>
            <p className="mt-1 text-xs text-gray-400">Tổng số người</p>
          </div>
          <div className="rounded-xl border bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-red-500">
              {totalNotAttending}
            </p>
            <p className="mt-1 text-xs text-gray-400">Không tham dự</p>
          </div>
        </div>
      )}

      {/* Card list */}
      {cardList.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 py-20 text-center">
          <p className="mb-3 text-3xl">📋</p>
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
            const rsvps = rsvpByCard[card.id] ?? [];
            const attending = rsvps.filter((r) => r.attending);
            const guests = attending.reduce((s, r) => s + r.guest_count, 0);
            const notAttending = rsvps.filter((r) => !r.attending);

            return (
              <Link
                key={card.id}
                href={`/dashboard/rsvp/${card.id}`}
                className="flex items-center justify-between rounded-xl border bg-white px-5 py-4 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
                    <ClipboardList size={18} className="text-purple-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{name}</p>
                    {rsvps.length === 0 ? (
                      <p className="mt-0.5 text-sm text-gray-400">
                        Chưa có phản hồi
                      </p>
                    ) : (
                      <p className="mt-0.5 text-sm text-gray-400">
                        <span className="font-medium text-green-600">
                          {attending.length} tham dự
                        </span>
                        {' · '}
                        <span className="font-medium text-blue-600">
                          {guests} người
                        </span>
                        {notAttending.length > 0 && (
                          <>
                            {' · '}
                            <span className="font-medium text-red-500">
                              {notAttending.length} vắng
                            </span>
                          </>
                        )}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {rsvps.length > 0 && (
                    <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-700">
                      {rsvps.length}
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
