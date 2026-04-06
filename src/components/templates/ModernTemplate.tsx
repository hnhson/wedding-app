import type { CardConfig } from '@/types/card'

export default function ModernTemplate({ config }: { config: CardConfig }) {
  const { coupleNames, weddingDate, venue, loveStory, schedule, heroImage, gallery } = config
  const formattedDate = weddingDate ? new Date(weddingDate).toLocaleDateString('vi-VN', {
    year: 'numeric', month: 'long', day: 'numeric',
  }) : 'Chưa có ngày'

  return (
    <div className="min-h-screen" style={{ background: 'var(--card-bg)', fontFamily: 'var(--card-font-body, sans-serif)' }}>
      {/* Split hero */}
      <div className="grid min-h-screen md:grid-cols-2">
        <div className="flex flex-col items-start justify-center px-12 py-20">
          <p className="mb-6 text-xs tracking-widest uppercase" style={{ color: 'var(--card-accent)' }}>We Are Getting Married</p>
          <h1 className="mb-2 text-6xl font-light" style={{ fontFamily: 'var(--card-font-heading, serif)', color: 'var(--card-primary)' }}>
            {coupleNames.partner1 || 'Người 1'}
          </h1>
          <p className="my-3 text-2xl" style={{ color: 'var(--card-accent)' }}>—</p>
          <h1 className="mb-8 text-6xl font-light" style={{ fontFamily: 'var(--card-font-heading, serif)', color: 'var(--card-primary)' }}>
            {coupleNames.partner2 || 'Người 2'}
          </h1>
          <p className="text-lg opacity-70" style={{ color: 'var(--card-primary)' }}>{formattedDate}</p>
          {venue.name && <p className="mt-2 text-base opacity-60" style={{ color: 'var(--card-primary)' }}>{venue.name}</p>}
        </div>
        <div className="relative overflow-hidden" style={{ background: 'var(--card-secondary)' }}>
          {heroImage
            ? <img src={heroImage} alt="Hero" className="h-full w-full object-cover" />
            : <div className="flex h-full items-center justify-center text-gray-400">Ảnh chính</div>
          }
        </div>
      </div>

      {loveStory && (
        <div className="mx-auto max-w-2xl px-8 py-16">
          <h2 className="mb-6 text-xl font-light" style={{ fontFamily: 'var(--card-font-heading, serif)', color: 'var(--card-accent)' }}>Our Story</h2>
          <p className="leading-relaxed opacity-80 whitespace-pre-wrap" style={{ color: 'var(--card-primary)' }}>{loveStory}</p>
        </div>
      )}

      {schedule.length > 0 && (
        <div className="border-t px-8 py-16" style={{ borderColor: 'var(--card-secondary)', color: 'var(--card-primary)' }}>
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-8 text-xl font-light" style={{ fontFamily: 'var(--card-font-heading, serif)', color: 'var(--card-accent)' }}>Schedule</h2>
            {schedule.map((item, i) => (
              <div key={i} className="mb-6 flex gap-8 border-b pb-6" style={{ borderColor: 'var(--card-secondary)' }}>
                <p className="w-16 shrink-0 text-sm font-bold" style={{ color: 'var(--card-accent)' }}>{item.time}</p>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  {item.description && <p className="mt-1 text-sm opacity-60">{item.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {gallery.length > 0 && (
        <div className="px-8 py-16">
          <div className="mx-auto max-w-3xl">
            <div className="grid grid-cols-3 gap-2">
              {gallery.map((url, i) => (
                <img key={i} src={url} alt="" className="aspect-square w-full object-cover" />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
