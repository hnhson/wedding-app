import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Card } from '@/types/card';
import DeleteCardButton from '@/components/dashboard/DeleteCardButton';
import NewCardDialog from '@/components/dashboard/NewCardDialog';

export default async function DashboardPage() {
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

  const [totalViews, rsvpRows, wishCount, recentViews] =
    cardIds.length > 0
      ? await Promise.all([
          supabase
            .from('page_views')
            .select('id', { count: 'exact', head: true })
            .in('card_id', cardIds)
            .then((r) => r.count ?? 0),
          supabase
            .from('rsvps')
            .select('card_id, attending')
            .in('card_id', cardIds)
            .then((r) => r.data ?? []),
          supabase
            .from('wishes')
            .select('id', { count: 'exact', head: true })
            .in('card_id', cardIds)
            .then((r) => r.count ?? 0),
          // views last 7 days
          supabase
            .from('page_views')
            .select('view_date')
            .in('card_id', cardIds)
            .gte(
              'view_date',
              // Vietnam time UTC+7, last 7 days
              // eslint-disable-next-line react-hooks/purity
              new Date(Date.now() + 7 * 3600 * 1000 - 7 * 86400000)
                .toISOString()
                .split('T')[0],
            )
            .then((r) => r.data ?? []),
        ])
      : [0, [], 0, []];

  const rsvpList = rsvpRows as { card_id: string; attending: boolean }[];
  const totalRsvps = rsvpList.length;
  const totalAttending = rsvpList.filter((r) => r.attending).length;
  const totalNotAttending = totalRsvps - totalAttending;
  const viewsLast7 = (recentViews as { view_date: string }[]).length;

  // Per-card stats
  const viewsPerCard =
    cardIds.length > 0
      ? await supabase
          .from('page_views')
          .select('card_id')
          .in('card_id', cardIds)
          .then((r) =>
            (r.data ?? []).reduce<Record<string, number>>((acc, row) => {
              acc[row.card_id] = (acc[row.card_id] ?? 0) + 1;
              return acc;
            }, {}),
          )
      : {};

  const rsvpPerCard = rsvpList.reduce<Record<string, number>>((acc, row) => {
    acc[row.card_id] = (acc[row.card_id] ?? 0) + 1;
    return acc;
  }, {});

  const firstName = user.email?.split('@')[0] ?? 'bạn';

  const statCards = [
    {
      label: 'Thiệp đã tạo',
      value: cardList.length,
      icon: '✦',
      color: '#c9a96e',
      bg: '#fdf8f0',
      border: '#f0e0c0',
    },
    {
      label: 'Tổng lượt xem',
      value: totalViews,
      icon: '◎',
      color: '#4a90d9',
      bg: '#f0f6ff',
      border: '#c8ddf7',
    },
    {
      label: 'Lượt xem 7 ngày',
      value: viewsLast7,
      icon: '↗',
      color: '#3daa7c',
      bg: '#f0faf5',
      border: '#b8e8d0',
    },
    {
      label: 'Tổng RSVP',
      value: totalRsvps,
      icon: '✓',
      color: '#8b5cf6',
      bg: '#f5f0ff',
      border: '#d8c8f8',
    },
    {
      label: 'Tham dự',
      value: totalAttending,
      icon: '♡',
      color: '#e07070',
      bg: '#fff0f0',
      border: '#f8d0d0',
    },
    {
      label: 'Không tham dự',
      value: totalNotAttending,
      icon: '○',
      color: '#9e9590',
      bg: '#f8f6f4',
      border: '#e0dbd6',
    },
    {
      label: 'Lời chúc',
      value: wishCount,
      icon: '❀',
      color: '#d97706',
      bg: '#fffbf0',
      border: '#f8e4b0',
    },
  ];

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-400">Xin chào,</p>
          <h1 className="text-2xl font-semibold text-gray-900">
            {firstName} 👋
          </h1>
        </div>
        <NewCardDialog />
      </div>

      {/* ── Tổng quan stats ── */}
      <section className="mb-10">
        <h2 className="mb-4 text-base font-semibold text-gray-700">
          Tổng quan
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {statCards.map((s) => (
            <div
              key={s.label}
              style={{
                background: s.bg,
                border: `1px solid ${s.border}`,
              }}
              className="rounded-xl p-4"
            >
              <span style={{ color: s.color, fontSize: '1.1rem' }}>
                {s.icon}
              </span>
              <p
                style={{ color: s.color }}
                className="mt-2 text-2xl leading-none font-bold"
              >
                {s.value}
              </p>
              <p className="mt-1.5 text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── RSVP breakdown bar ── */}
      {totalRsvps > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-base font-semibold text-gray-700">
            Tỷ lệ tham dự
          </h2>
          <div className="rounded-xl border bg-white p-5">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="font-medium text-green-700">
                Tham dự: {totalAttending} người
              </span>
              <span className="font-medium text-gray-400">
                Không tham dự: {totalNotAttending} người
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-green-500 transition-all"
                style={{
                  width: `${Math.round((totalAttending / totalRsvps) * 100)}%`,
                }}
              />
            </div>
            <p className="mt-2 text-xs text-gray-400">
              {Math.round((totalAttending / totalRsvps) * 100)}% xác nhận tham
              dự
            </p>
          </div>
        </section>
      )}

      {/* ── Danh sách thiệp ── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-700">
            Thiệp của tôi{' '}
            <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-normal text-gray-500">
              {cardList.length}
            </span>
          </h2>
        </div>

        {cardList.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-gray-200 py-20 text-center">
            <p className="mb-4 text-4xl">✦</p>
            <p className="font-medium text-gray-500">Bạn chưa có thiệp nào.</p>
            <p className="mt-1 mb-4 text-sm text-gray-400">
              Tạo thiệp đầu tiên để bắt đầu
            </p>
            <NewCardDialog
              trigger={
                <button className="inline-flex items-center gap-1 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700">
                  + Tạo thiệp đầu tiên
                </button>
              }
            />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cardList.map((card) => {
              const { coupleNames, weddingDate } = card.config;
              const name =
                coupleNames.partner1 && coupleNames.partner2
                  ? `${coupleNames.partner1} & ${coupleNames.partner2}`
                  : 'Thiệp chưa đặt tên';
              const views =
                (viewsPerCard as Record<string, number>)[card.id] ?? 0;
              const rsvps =
                (rsvpPerCard as Record<string, number>)[card.id] ?? 0;

              return (
                <div
                  key={card.id}
                  className="flex flex-col rounded-xl border bg-white shadow-sm transition hover:shadow-md"
                >
                  {/* Card header */}
                  <div className="border-b px-5 py-4">
                    <h3 className="truncate font-semibold text-gray-900">
                      {name}
                    </h3>
                    {weddingDate && (
                      <p className="mt-0.5 text-sm text-gray-400">
                        {new Date(weddingDate).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                    <p className="mt-0.5 truncate text-xs text-gray-300">
                      /invitation/{card.slug}
                    </p>
                  </div>

                  {/* Mini stats */}
                  <div className="flex divide-x border-b text-center">
                    <div className="flex-1 py-3">
                      <p className="text-lg font-bold text-blue-600">{views}</p>
                      <p className="text-xs text-gray-400">Lượt xem</p>
                    </div>
                    <div className="flex-1 py-3">
                      <p className="text-lg font-bold text-purple-600">
                        {rsvps}
                      </p>
                      <p className="text-xs text-gray-400">RSVP</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 p-4">
                    <Link
                      href={`/cards/${card.id}/edit`}
                      className="rounded-lg border border-gray-200 px-2 py-2 text-center text-sm text-gray-700 hover:bg-gray-50"
                    >
                      ✎ Chỉnh sửa
                    </Link>
                    <Link
                      href={`/cards/${card.id}/preview`}
                      className="rounded-lg border border-gray-200 px-2 py-2 text-center text-sm text-gray-700 hover:bg-gray-50"
                    >
                      ◉ Xem trước
                    </Link>
                    <Link
                      href={`/cards/${card.id}/guests`}
                      className="rounded-lg border border-gray-200 px-2 py-2 text-center text-sm text-gray-700 hover:bg-gray-50"
                    >
                      ✓ Khách mời
                    </Link>
                    <Link
                      href={`/cards/${card.id}/analytics`}
                      className="rounded-lg border border-gray-200 px-2 py-2 text-center text-sm text-gray-700 hover:bg-gray-50"
                    >
                      ◎ Thống kê
                    </Link>
                    <DeleteCardButton cardId={card.id} cardName={name} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
