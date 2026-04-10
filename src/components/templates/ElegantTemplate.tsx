import type { CardConfig } from '@/types/card';

export default function ElegantTemplate({ config }: { config: CardConfig }) {
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
        background: 'var(--card-bg)',
        color: 'var(--card-primary)',
        fontFamily: 'var(--card-font-body, Georgia, serif)',
      }}
    >
      {/* Outer double-frame border */}
      <div
        style={{
          margin: '20px',
          border: '1px solid var(--card-accent)',
          outline: '1px solid var(--card-accent)',
          outlineOffset: '-6px',
          minHeight: cardHeight - 40,
        }}
      >
        {/* Hero section */}
        <div className="relative flex flex-col items-center justify-center px-10 py-20 text-center">
          {heroImage && (
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={heroImage}
                alt="Hero"
                className="h-full w-full object-cover"
                style={{ opacity: 0.12 }}
              />
            </div>
          )}
          <div className="relative z-10 w-full">
            <p
              className="mb-8 text-xs tracking-[0.4em] uppercase"
              style={{ color: 'var(--card-accent)' }}
            >
              Trân trọng kính mời
            </p>

            {/* Top ornament */}
            <div
              className="mb-10 flex items-center justify-center gap-4"
              style={{ color: 'var(--card-accent)' }}
            >
              <span style={{ fontSize: '10px', letterSpacing: '6px' }}>
                ✦ ✦ ✦ ◆ ✦ ✦ ✦
              </span>
            </div>

            <h1
              className="mb-3 font-bold"
              style={{
                fontFamily: 'var(--card-font-heading, Georgia, serif)',
                fontSize: '3.5rem',
                lineHeight: 1.15,
                letterSpacing: '0.02em',
              }}
            >
              {coupleNames.partner1 || 'Cô Dâu'}
            </h1>

            {/* Gold divider with &amp; */}
            <div className="my-5 flex items-center justify-center gap-5">
              <div
                style={{
                  height: '1px',
                  width: '60px',
                  background: 'var(--card-accent)',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--card-font-heading, Georgia, serif)',
                  color: 'var(--card-accent)',
                  fontSize: '1.6rem',
                  fontStyle: 'italic',
                }}
              >
                &amp;
              </span>
              <div
                style={{
                  height: '1px',
                  width: '60px',
                  background: 'var(--card-accent)',
                }}
              />
            </div>

            <h1
              className="mb-10 font-bold"
              style={{
                fontFamily: 'var(--card-font-heading, Georgia, serif)',
                fontSize: '3.5rem',
                lineHeight: 1.15,
                letterSpacing: '0.02em',
              }}
            >
              {coupleNames.partner2 || 'Chú Rể'}
            </h1>

            {/* Bottom ornament */}
            <div
              className="mb-10 flex items-center justify-center gap-4"
              style={{ color: 'var(--card-accent)' }}
            >
              <span style={{ fontSize: '10px', letterSpacing: '6px' }}>
                ❧ ◆ ❧
              </span>
            </div>

            <p
              className="mb-2 text-base"
              style={{
                letterSpacing: '0.1em',
                color: 'var(--card-primary)',
                opacity: 0.85,
              }}
            >
              {formattedDate}
            </p>
            {venue.name && (
              <p
                className="mt-2 text-sm tracking-widest uppercase"
                style={{ color: 'var(--card-accent)', opacity: 0.9 }}
              >
                {venue.name}
              </p>
            )}
          </div>
        </div>

        {/* Gold thin divider */}
        <div className="mb-2 flex items-center justify-center px-16">
          <div
            style={{
              height: '1px',
              flex: 1,
              background: 'var(--card-accent)',
              opacity: 0.4,
            }}
          />
          <span
            style={{
              margin: '0 16px',
              color: 'var(--card-accent)',
              fontSize: '12px',
            }}
          >
            ✦
          </span>
          <div
            style={{
              height: '1px',
              flex: 1,
              background: 'var(--card-accent)',
              opacity: 0.4,
            }}
          />
        </div>

        {/* Love Story */}
        {loveStory && (
          <div className="mx-auto max-w-xl px-10 py-14 text-center">
            <h2
              className="mb-2 mb-6 text-xs tracking-[0.3em] uppercase"
              style={{ color: 'var(--card-accent)' }}
            >
              Câu chuyện tình yêu
            </h2>
            <p
              className="text-sm leading-loose whitespace-pre-wrap"
              style={{ opacity: 0.85, fontStyle: 'italic', lineHeight: 2 }}
            >
              {loveStory}
            </p>
          </div>
        )}

        {/* Gold divider */}
        <div className="mb-2 flex items-center justify-center px-16">
          <div
            style={{
              height: '1px',
              flex: 1,
              background: 'var(--card-accent)',
              opacity: 0.4,
            }}
          />
          <span
            style={{
              margin: '0 16px',
              color: 'var(--card-accent)',
              fontSize: '12px',
            }}
          >
            ◆
          </span>
          <div
            style={{
              height: '1px',
              flex: 1,
              background: 'var(--card-accent)',
              opacity: 0.4,
            }}
          />
        </div>

        {/* Schedule */}
        {schedule.length > 0 && (
          <div className="mx-auto max-w-lg px-10 py-14">
            <h2
              className="mb-8 text-center text-xs tracking-[0.3em] uppercase"
              style={{ color: 'var(--card-accent)' }}
            >
              Chương trình
            </h2>
            <div className="space-y-6">
              {schedule.map((item, i) => (
                <div key={i} className="flex items-start gap-6">
                  <div
                    className="w-16 shrink-0 pt-0.5 text-right text-xs font-semibold"
                    style={{
                      color: 'var(--card-accent)',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {item.time}
                  </div>
                  <div
                    style={{
                      width: '1px',
                      background: 'var(--card-accent)',
                      opacity: 0.4,
                      minHeight: '40px',
                    }}
                  />
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ letterSpacing: '0.05em' }}
                    >
                      {item.title}
                    </p>
                    {item.description && (
                      <p className="mt-1 text-xs italic opacity-60">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gold divider */}
        <div className="mb-2 flex items-center justify-center px-16">
          <div
            style={{
              height: '1px',
              flex: 1,
              background: 'var(--card-accent)',
              opacity: 0.4,
            }}
          />
          <span
            style={{
              margin: '0 16px',
              color: 'var(--card-accent)',
              fontSize: '12px',
            }}
          >
            ✦
          </span>
          <div
            style={{
              height: '1px',
              flex: 1,
              background: 'var(--card-accent)',
              opacity: 0.4,
            }}
          />
        </div>

        {/* Venue */}
        {venue.address && (
          <div className="px-10 py-14 text-center">
            <h2
              className="mb-6 text-xs tracking-[0.3em] uppercase"
              style={{ color: 'var(--card-accent)' }}
            >
              Địa điểm
            </h2>
            <p
              className="mb-1 text-base font-semibold"
              style={{ letterSpacing: '0.05em' }}
            >
              {venue.name}
            </p>
            <p className="text-sm opacity-70">{venue.address}</p>
            {venue.mapUrl && (
              <a
                href={venue.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block px-6 py-2 text-xs tracking-widest uppercase"
                style={{
                  border: '1px solid var(--card-accent)',
                  color: 'var(--card-accent)',
                }}
              >
                Chỉ đường
              </a>
            )}
          </div>
        )}

        {/* Bottom ornament */}
        <div
          className="flex items-center justify-center pb-12"
          style={{ color: 'var(--card-accent)' }}
        >
          <span style={{ fontSize: '10px', letterSpacing: '8px' }}>
            ✦ ◆ ❧ ◆ ✦
          </span>
        </div>
      </div>
    </div>
  );
}
