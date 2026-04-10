import type { CardConfig } from '@/types/card';

export default function RomanceTemplate({ config }: { config: CardConfig }) {
  const { coupleNames, weddingDate, venue, loveStory, schedule, heroImage } =
    config;
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
        background: `linear-gradient(160deg, var(--card-secondary) 0%, var(--card-bg) 60%, var(--card-secondary) 100%)`,
        color: 'var(--card-primary)',
        fontFamily: 'var(--card-font-body, Georgia, serif)',
      }}
    >
      {/* Hero */}
      <div className="relative flex flex-col items-center justify-center px-8 py-20 text-center">
        {heroImage && (
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ borderRadius: '0' }}
          >
            <img
              src={heroImage}
              alt="Hero"
              className="h-full w-full object-cover"
              style={{ opacity: 0.15 }}
            />
          </div>
        )}

        <div className="relative z-10 w-full">
          {/* Tagline */}
          <p
            className="mb-8 text-xs tracking-[0.35em] uppercase"
            style={{ color: 'var(--card-accent)', opacity: 0.85 }}
          >
            Cùng nhau mãi mãi
          </p>

          {/* Names in large italic flowing style */}
          <h1
            className="mb-1"
            style={{
              fontFamily: 'var(--card-font-heading, Georgia, serif)',
              fontSize: '4rem',
              fontStyle: 'italic',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
            }}
          >
            {coupleNames.partner1 || 'Cô Dâu'}
          </h1>

          {/* Heart divider */}
          <div className="my-6 flex items-center justify-center gap-4">
            <div
              style={{
                height: '1px',
                width: '50px',
                background: 'var(--card-accent)',
                opacity: 0.5,
              }}
            />
            <span
              style={{
                color: 'var(--card-accent)',
                fontSize: '1.8rem',
                lineHeight: 1,
              }}
            >
              ♥
            </span>
            <div
              style={{
                height: '1px',
                width: '50px',
                background: 'var(--card-accent)',
                opacity: 0.5,
              }}
            />
          </div>

          <h1
            className="mb-8"
            style={{
              fontFamily: 'var(--card-font-heading, Georgia, serif)',
              fontSize: '4rem',
              fontStyle: 'italic',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
            }}
          >
            {coupleNames.partner2 || 'Chú Rể'}
          </h1>

          <p
            className="mt-4 text-sm"
            style={{ opacity: 0.75, letterSpacing: '0.08em' }}
          >
            {formattedDate}
          </p>
          {venue.name && (
            <p className="mt-1 text-sm" style={{ opacity: 0.65 }}>
              {venue.name}
            </p>
          )}
        </div>
      </div>

      {/* Soft wave divider */}
      <div
        className="py-2 text-center"
        style={{ color: 'var(--card-accent)', opacity: 0.4 }}
      >
        <span style={{ fontSize: '13px', letterSpacing: '4px' }}>
          ~ ~ ~ ♥ ~ ~ ~
        </span>
      </div>

      {/* Love story */}
      {loveStory && (
        <div className="mx-auto max-w-xl px-10 py-14 text-center">
          <h2
            className="mb-6 text-sm"
            style={{
              fontFamily: 'var(--card-font-heading, Georgia, serif)',
              fontStyle: 'italic',
              color: 'var(--card-accent)',
              fontSize: '1.3rem',
            }}
          >
            Chuyện tình của chúng mình
          </h2>
          <p
            className="text-sm leading-relaxed whitespace-pre-wrap"
            style={{ opacity: 0.8, lineHeight: 1.95, fontStyle: 'italic' }}
          >
            {loveStory}
          </p>
        </div>
      )}

      {/* Heart divider */}
      <div
        className="py-2 text-center"
        style={{ color: 'var(--card-accent)', opacity: 0.4 }}
      >
        <span style={{ fontSize: '13px', letterSpacing: '4px' }}>
          ~ ~ ~ ♥ ~ ~ ~
        </span>
      </div>

      {/* Schedule */}
      {schedule.length > 0 && (
        <div
          className="mx-auto max-w-lg px-10 py-14"
          style={{
            background: 'rgba(255,255,255,0.25)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <h2
            className="mb-8 text-center"
            style={{
              fontFamily: 'var(--card-font-heading, Georgia, serif)',
              fontStyle: 'italic',
              color: 'var(--card-accent)',
              fontSize: '1.3rem',
            }}
          >
            Lịch trình
          </h2>
          <div className="space-y-7">
            {schedule.map((item, i) => (
              <div key={i} className="text-center">
                <span
                  className="text-xs font-semibold tracking-wider uppercase"
                  style={{ color: 'var(--card-accent)' }}
                >
                  {item.time}
                </span>
                <p className="mt-1 text-sm font-semibold">{item.title}</p>
                {item.description && (
                  <p
                    className="mt-0.5 text-xs italic"
                    style={{ opacity: 0.65 }}
                  >
                    {item.description}
                  </p>
                )}
                {i < schedule.length - 1 && (
                  <div
                    className="mx-auto mt-5"
                    style={{
                      height: '1px',
                      width: '40px',
                      background: 'var(--card-accent)',
                      opacity: 0.3,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Heart divider */}
      <div
        className="py-2 text-center"
        style={{ color: 'var(--card-accent)', opacity: 0.4 }}
      >
        <span style={{ fontSize: '13px', letterSpacing: '4px' }}>
          ~ ~ ~ ♥ ~ ~ ~
        </span>
      </div>

      {/* Venue */}
      {venue.address && (
        <div className="px-10 py-14 text-center">
          <h2
            className="mb-5"
            style={{
              fontFamily: 'var(--card-font-heading, Georgia, serif)',
              fontStyle: 'italic',
              color: 'var(--card-accent)',
              fontSize: '1.3rem',
            }}
          >
            Địa điểm
          </h2>
          <p className="mb-1 text-sm font-semibold">{venue.name}</p>
          <p className="text-sm" style={{ opacity: 0.7 }}>
            {venue.address}
          </p>
          {venue.mapUrl && (
            <a
              href={venue.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block rounded-full px-7 py-2.5 text-xs font-medium text-white"
              style={{ background: 'var(--card-accent)' }}
            >
              Chỉ đường ♥
            </a>
          )}
        </div>
      )}

      {/* Footer tagline */}
      <div
        className="pt-2 pb-12 text-center"
        style={{
          fontFamily: 'var(--card-font-heading, Georgia, serif)',
          fontStyle: 'italic',
          color: 'var(--card-accent)',
          opacity: 0.6,
          fontSize: '1rem',
        }}
      >
        Cùng nhau mãi mãi ♥
      </div>
    </div>
  );
}
