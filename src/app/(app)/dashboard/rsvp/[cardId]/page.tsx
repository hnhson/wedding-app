import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Card } from '@/types/card';
import type { RSVP } from '@/types/rsvp';
import { ChevronLeft } from 'lucide-react';

export default async function RsvpCardPage({
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
    .from('rsvps')
    .select('*')
    .eq('card_id', cardId)
    .order('created_at', { ascending: false });

  const rsvpList = (data ?? []) as RSVP[];
  const attending = rsvpList.filter((r) => r.attending);
  const notAttending = rsvpList.filter((r) => !r.attending);
  const totalGuests = attending.reduce((s, r) => s + r.guest_count, 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/dashboard/rsvp"
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
        >
          <ChevronLeft size={16} />
          RSVP
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-semibold text-gray-900">{cardName}</h1>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border bg-white p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-gray-900">{rsvpList.length}</p>
          <p className="mt-1 text-xs text-gray-400">Tổng phản hồi</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-green-600">
            {attending.length}
          </p>
          <p className="mt-1 text-xs text-gray-400">Sẽ tham dự</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-blue-600">{totalGuests}</p>
          <p className="mt-1 text-xs text-gray-400">Tổng số người</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-red-500">
            {notAttending.length}
          </p>
          <p className="mt-1 text-xs text-gray-400">Không tham dự</p>
        </div>
      </div>

      {rsvpList.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 py-20 text-center">
          <p className="mb-3 text-3xl">📋</p>
          <p className="text-gray-500">Chưa có phản hồi nào.</p>
          <p className="mt-1 text-sm text-gray-400">
            Khách mời sẽ xác nhận qua trang thiệp cưới của bạn.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Attending */}
          {attending.length > 0 && (
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-700">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs text-green-700">
                  ✓
                </span>
                Sẽ tham dự
                <span className="ml-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-normal text-green-700">
                  {attending.length} người · {totalGuests} chỗ
                </span>
              </h2>
              <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                {attending.map((r, i) => (
                  <div
                    key={r.id}
                    className={`flex items-center justify-between px-5 py-3.5 ${
                      i < attending.length - 1 ? 'border-b' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-50 text-sm font-bold text-green-600">
                        {r.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{r.name}</p>
                        {r.email && (
                          <p className="text-xs text-gray-400">{r.email}</p>
                        )}
                        {r.message && (
                          <p className="mt-0.5 text-xs text-gray-400 italic">
                            &ldquo;{r.message}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
                        {r.guest_count} người
                      </span>
                      <p className="mt-1 text-xs text-gray-300">
                        {new Date(r.created_at).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Not attending */}
          {notAttending.length > 0 && (
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-700">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs text-red-600">
                  ✗
                </span>
                Không tham dự
                <span className="ml-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-normal text-red-600">
                  {notAttending.length} người
                </span>
              </h2>
              <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                {notAttending.map((r, i) => (
                  <div
                    key={r.id}
                    className={`flex items-center justify-between px-5 py-3.5 ${
                      i < notAttending.length - 1 ? 'border-b' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-sm font-bold text-red-400">
                        {r.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{r.name}</p>
                        {r.email && (
                          <p className="text-xs text-gray-400">{r.email}</p>
                        )}
                        {r.message && (
                          <p className="mt-0.5 text-xs text-gray-400 italic">
                            &ldquo;{r.message}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-300">
                      {new Date(r.created_at).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
