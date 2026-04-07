import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Card } from '@/types/card';

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

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Thiệp của tôi
          </h1>
          <p className="mt-1 text-gray-600">{cardList.length} thiệp</p>
        </div>
        <Link
          href="/cards/new"
          className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          + Tạo thiệp mới
        </Link>
      </div>

      {cardList.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-200 py-20 text-center">
          <p className="text-gray-500">Bạn chưa có thiệp nào.</p>
          <Link
            href="/cards/new"
            className="mt-3 inline-block text-blue-600 hover:underline"
          >
            Tạo thiệp đầu tiên →
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cardList.map((card) => {
            const { coupleNames, weddingDate } = card.config;
            return (
              <div
                key={card.id}
                className="rounded-lg border bg-white p-5 shadow-sm"
              >
                <h3 className="font-semibold text-gray-900">
                  {coupleNames.partner1 && coupleNames.partner2
                    ? `${coupleNames.partner1} & ${coupleNames.partner2}`
                    : 'Thiệp chưa đặt tên'}
                </h3>
                {weddingDate && (
                  <p className="mt-1 text-sm text-gray-500">
                    {new Date(weddingDate).toLocaleDateString('vi-VN')}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-400">
                  /invitation/{card.slug}
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <Link
                    href={`/cards/${card.id}/edit`}
                    className="rounded border border-gray-300 px-2 py-1.5 text-center text-sm hover:bg-gray-50"
                  >
                    Chỉnh sửa
                  </Link>
                  <Link
                    href={`/cards/${card.id}/preview`}
                    className="rounded border border-gray-300 px-2 py-1.5 text-center text-sm hover:bg-gray-50"
                  >
                    Xem trước
                  </Link>
                  <Link
                    href={`/cards/${card.id}/guests`}
                    className="rounded border border-gray-300 px-2 py-1.5 text-center text-sm hover:bg-gray-50"
                  >
                    Khách mời
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
