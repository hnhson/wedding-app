import type { CardConfig } from '@/types/card';

interface Props {
  config: CardConfig;
}

export default function ClassicTemplate({ config }: Props) {
  const {
    coupleNames,
    weddingDate,
    venue,
    loveStory,
    schedule,
    families,
    heroImage,
  } = config;
  const formattedDate = weddingDate
    ? new Date(weddingDate).toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Chưa có ngày';

  const cardHeight = config.cardHeight ?? 900;

  return (
    <div
      style={{
        minHeight: cardHeight,
        background: 'var(--card-bg)',
        color: 'var(--card-primary)',
        fontFamily: 'var(--card-font-body, serif)',
      }}
    >
      {/* Hero */}
      <div className="relative flex flex-col items-center justify-center py-20 text-center">
        {heroImage && (
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={heroImage}
              alt="Hero"
              className="h-full w-full object-cover opacity-20"
            />
          </div>
        )}
        <div className="relative z-10">
          <p
            className="mb-4 text-lg tracking-widest uppercase"
            style={{ color: 'var(--card-accent)' }}
          >
            Trân trọng kính mời
          </p>
          <h1
            className="mb-2 text-5xl font-bold"
            style={{ fontFamily: 'var(--card-font-heading, serif)' }}
          >
            {coupleNames.partner1 || 'Người 1'}
          </h1>
          <p className="my-4 text-3xl" style={{ color: 'var(--card-accent)' }}>
            &amp;
          </p>
          <h1
            className="mb-6 text-5xl font-bold"
            style={{ fontFamily: 'var(--card-font-heading, serif)' }}
          >
            {coupleNames.partner2 || 'Người 2'}
          </h1>
          <div
            className="mx-auto mb-6 h-px w-32"
            style={{ background: 'var(--card-accent)' }}
          />
          <p className="text-xl">{formattedDate}</p>
          {venue.name && (
            <p className="mt-2 text-base opacity-80">{venue.name}</p>
          )}
        </div>
      </div>

      {/* Love Story */}
      {loveStory && (
        <div className="mx-auto max-w-2xl px-8 py-12 text-center">
          <h2
            className="mb-6 text-2xl"
            style={{
              fontFamily: 'var(--card-font-heading, serif)',
              color: 'var(--card-accent)',
            }}
          >
            Câu chuyện của chúng tôi
          </h2>
          <p className="leading-relaxed whitespace-pre-wrap opacity-90">
            {loveStory}
          </p>
        </div>
      )}

      {/* Schedule */}
      {schedule.length > 0 && (
        <div
          className="px-8 py-12"
          style={{ background: 'var(--card-secondary)' }}
        >
          <div className="mx-auto max-w-2xl">
            <h2
              className="mb-8 text-center text-2xl"
              style={{
                fontFamily: 'var(--card-font-heading, serif)',
                color: 'var(--card-accent)',
              }}
            >
              Lịch trình
            </h2>
            <div className="space-y-6">
              {schedule.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div
                    className="w-20 shrink-0 text-right text-sm font-semibold"
                    style={{ color: 'var(--card-accent)' }}
                  >
                    {item.time}
                  </div>
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    {item.description && (
                      <p className="mt-1 text-sm opacity-70">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Gallery images are placed as draggable overlay elements — not rendered here */}

      {/* Venue */}
      {venue.address && (
        <div
          className="px-8 py-12 text-center"
          style={{ background: 'var(--card-secondary)' }}
        >
          <h2
            className="mb-4 text-2xl"
            style={{
              fontFamily: 'var(--card-font-heading, serif)',
              color: 'var(--card-accent)',
            }}
          >
            Địa điểm
          </h2>
          <p className="text-lg font-semibold">{venue.name}</p>
          <p className="mt-1 opacity-80">{venue.address}</p>
          {venue.mapUrl && (
            <a
              href={venue.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block rounded px-4 py-2 text-sm font-medium text-white"
              style={{ background: 'var(--card-primary)' }}
            >
              Chỉ đường
            </a>
          )}
        </div>
      )}
    </div>
  );
}
