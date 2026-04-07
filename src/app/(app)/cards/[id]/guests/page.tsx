import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { RSVP, Wish } from '@/types/rsvp'

export default async function GuestsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: card } = await supabase
    .from('cards')
    .select('id, slug, config')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!card) notFound()

  const [{ data: rsvps }, { data: wishes }] = await Promise.all([
    supabase
      .from('rsvps')
      .select('*')
      .eq('card_id', id)
      .order('created_at', { ascending: false }),
    supabase
      .from('wishes')
      .select('*')
      .eq('card_id', id)
      .order('created_at', { ascending: false }),
  ])

  const rsvpList = (rsvps ?? []) as RSVP[]
  const wishesList = (wishes ?? []) as Wish[]

  const attending = rsvpList.filter(r => r.attending)
  const notAttending = rsvpList.filter(r => !r.attending)
  const totalGuests = attending.reduce((sum, r) => sum + r.guest_count, 0)

  const { partner1, partner2 } = card.config.coupleNames

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-3">
        <Link href="/dashboard" className="text-sm text-gray-500 hover:underline">
          ← Dashboard
        </Link>
        <span className="text-gray-300">|</span>
        <h1 className="text-xl font-semibold text-gray-900">
          {partner1 && partner2 ? `${partner1} & ${partner2}` : 'Thiệp'} — Khách mời
        </h1>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="rounded-lg border bg-white p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">{rsvpList.length}</p>
          <p className="mt-1 text-sm text-gray-500">Phản hồi</p>
        </div>
        <div className="rounded-lg border bg-white p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{attending.length}</p>
          <p className="mt-1 text-sm text-gray-500">Tham dự ({totalGuests} người)</p>
        </div>
        <div className="rounded-lg border bg-white p-4 text-center">
          <p className="text-3xl font-bold text-red-500">{notAttending.length}</p>
          <p className="mt-1 text-sm text-gray-500">Vắng mặt</p>
        </div>
      </div>

      {/* RSVPs */}
      <div className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Xác nhận tham dự
        </h2>
        {rsvpList.length === 0 ? (
          <p className="text-sm text-gray-500">Chưa có phản hồi nào.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="border-b text-left text-xs text-gray-500">
                  <th className="px-4 py-3">Tên</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Tham dự</th>
                  <th className="px-4 py-3">Số người</th>
                  <th className="px-4 py-3">Lời chúc</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {rsvpList.map(rsvp => (
                  <tr key={rsvp.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-medium text-gray-900">{rsvp.name}</td>
                    <td className="px-4 py-3 text-gray-500">{rsvp.email ?? '—'}</td>
                    <td className="px-4 py-3">
                      {rsvp.attending ? (
                        <span className="font-medium text-green-600">✓ Có</span>
                      ) : (
                        <span className="text-red-500">✗ Không</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {rsvp.attending ? rsvp.guest_count : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{rsvp.message ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Wishes */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Sổ lưu bút ({wishesList.length})
        </h2>
        {wishesList.length === 0 ? (
          <p className="text-sm text-gray-500">Chưa có lời chúc nào.</p>
        ) : (
          <div className="space-y-3">
            {wishesList.map(wish => (
              <div key={wish.id} className="rounded-lg border bg-white p-4">
                <p className="text-sm font-semibold text-gray-900">{wish.name}</p>
                <p className="mt-1 text-sm text-gray-700">{wish.message}</p>
                <p className="mt-2 text-xs text-gray-400">
                  {new Date(wish.created_at).toLocaleDateString('vi-VN')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
