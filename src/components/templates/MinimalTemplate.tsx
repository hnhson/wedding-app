import type { CardConfig } from '@/types/card';

export default function MinimalTemplate({ config }: { config: CardConfig }) {
  const { coupleNames, weddingDate, venue, loveStory, schedule, heroImage } =
    config;
  const formattedDate = weddingDate
    ? new Date(weddingDate).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div
      className="min-h-screen px-8 py-20"
      style={{
        background: 'var(--card-bg)',
        color: 'var(--card-primary)',
        fontFamily: 'var(--card-font-body, sans-serif)',
      }}
    >
      <div className="mx-auto max-w-xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1
            className="text-4xl"
            style={{ fontFamily: 'var(--card-font-heading, serif)' }}
          >
            {coupleNames.partner1 || 'Người 1'} &{' '}
            {coupleNames.partner2 || 'Người 2'}
          </h1>
          <p className="mt-4 text-sm tracking-widest uppercase opacity-60">
            {formattedDate}
          </p>
          {venue.name && (
            <p className="mt-1 text-sm opacity-50">{venue.name}</p>
          )}
        </div>

        {heroImage && (
          <img
            src={heroImage}
            alt="Hero"
            className="mb-16 w-full rounded object-cover"
            style={{ maxHeight: '400px' }}
          />
        )}

        {loveStory && (
          <div className="mb-16">
            <p className="text-center leading-relaxed whitespace-pre-wrap opacity-80">
              {loveStory}
            </p>
          </div>
        )}

        {schedule.length > 0 && (
          <div className="mb-16">
            <p className="mb-6 text-xs tracking-widest uppercase opacity-50">
              Lịch trình
            </p>
            {schedule.map((item, i) => (
              <div key={i} className="mb-4 flex gap-6 text-sm">
                <span className="w-14 shrink-0 opacity-50">{item.time}</span>
                <span>{item.title}</span>
              </div>
            ))}
          </div>
        )}

        {venue.address && (
          <div className="text-center text-sm opacity-70">
            <p>{venue.address}</p>
            {venue.mapUrl && (
              <a
                href={venue.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block underline"
              >
                Xem bản đồ
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
