import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import ViewsChart from '@/components/analytics/ViewsChart';
import type { DailyView } from '@/types/analytics';

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Verify ownership
  const { data: card } = await supabase
    .from('cards')
    .select('id, slug, config')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();
  if (!card) notFound();

  // Last 14 days of page views
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 13);
  const fromDateStr = fromDate.toISOString().split('T')[0];

  const [{ data: viewRows }, { data: rsvps }, { count: wishCount }] =
    await Promise.all([
      supabase
        .from('page_views')
        .select('view_date')
        .eq('card_id', id)
        .gte('view_date', fromDateStr),
      supabase.from('rsvps').select('attending, guest_count').eq('card_id', id),
      supabase
        .from('wishes')
        .select('id', { count: 'exact', head: true })
        .eq('card_id', id),
    ]);

  // Group page views by date
  const viewMap = new Map<string, number>();
  for (const row of viewRows ?? []) {
    viewMap.set(row.view_date, (viewMap.get(row.view_date) ?? 0) + 1);
  }
  const recentDays: DailyView[] = Array.from(viewMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([view_date, view_count]) => ({ view_date, view_count }));
  const totalViews = recentDays.reduce((sum, d) => sum + d.view_count, 0);

  // RSVP stats
  const rsvpList = rsvps ?? [];
  const rsvpAttending = rsvpList.filter((r) => r.attending).length;
  const rsvpNotAttending = rsvpList.filter((r) => !r.attending).length;
  const totalGuests = rsvpList
    .filter((r) => r.attending)
    .reduce((sum, r) => sum + r.guest_count, 0);

  const { partner1, partner2 } = card.config.coupleNames;
  const coupleTitle =
    partner1 && partner2 ? `${partner1} & ${partner2}` : 'Thiệp';

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:underline"
        >
          ← Dashboard
        </Link>
        <span className="text-gray-300">|</span>
        <h1 className="text-xl font-semibold text-gray-900">
          {coupleTitle} — Thống kê
        </h1>
      </div>

      {/* Top stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border bg-white p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{totalViews}</p>
          <p className="mt-1 text-sm text-gray-500">Lượt xem (14 ngày)</p>
        </div>
        <div className="rounded-lg border bg-white p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">{rsvpList.length}</p>
          <p className="mt-1 text-sm text-gray-500">Phản hồi RSVP</p>
        </div>
        <div className="rounded-lg border bg-white p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{rsvpAttending}</p>
          <p className="mt-1 text-sm text-gray-500">
            Tham dự ({totalGuests} người)
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4 text-center">
          <p className="text-3xl font-bold text-purple-600">{wishCount ?? 0}</p>
          <p className="mt-1 text-sm text-gray-500">Lời chúc</p>
        </div>
      </div>

      {/* Views chart */}
      <div className="mb-8 rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-gray-900">
          Lượt xem 14 ngày gần nhất
        </h2>
        <ViewsChart days={recentDays} />
      </div>

      {/* RSVP breakdown */}
      {rsvpList.length > 0 && (
        <div className="rounded-lg border bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-gray-900">
            Phân tích RSVP
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-28 text-sm text-gray-600">Tham dự</span>
              <div className="flex-1 rounded-full bg-gray-100">
                <div
                  className="h-4 rounded-full bg-green-400"
                  style={{
                    width: `${Math.round((rsvpAttending / rsvpList.length) * 100)}%`,
                  }}
                />
              </div>
              <span className="w-12 text-right text-sm font-medium text-gray-700">
                {rsvpAttending}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-28 text-sm text-gray-600">Vắng mặt</span>
              <div className="flex-1 rounded-full bg-gray-100">
                <div
                  className="h-4 rounded-full bg-red-400"
                  style={{
                    width: `${Math.round((rsvpNotAttending / rsvpList.length) * 100)}%`,
                  }}
                />
              </div>
              <span className="w-12 text-right text-sm font-medium text-gray-700">
                {rsvpNotAttending}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
