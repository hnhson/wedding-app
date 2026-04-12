import type { CardConfig } from '@/types/card';
import FamiliesSection from './FamiliesSection';

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
      <style>{`
        @keyframes wFadeInUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes wFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes wPulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @keyframes wFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes wExpandLine {
          from { transform: scaleX(0); opacity: 0; }
          to { transform: scaleX(1); opacity: 1; }
        }
        @keyframes wShimmer {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes wTwinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.3); }
        }
      `}</style>

      {/* Hero */}
      <div
        className="relative flex flex-col items-center justify-center px-8 py-20 text-center"
        style={{ animation: 'wFadeIn 1.2s ease both' }}
      >
        {heroImage && (
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ borderRadius: '0' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImage}
              alt="Hero"
              className="h-full w-full object-cover"
              style={{ opacity: 0.18 }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.45) 100%)',
              }}
            />
          </div>
        )}

        <div className="relative z-10 w-full">
          {/* Tagline */}
          <p
            className="mb-8 text-xs tracking-[0.35em]"
            style={{
              color: 'var(--card-accent)',
              opacity: 0.85,
              animation: 'wFadeIn 1s ease both',
            }}
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
              animation: 'wFadeInUp 0.9s ease 0.15s both',
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
                animation: 'wExpandLine 0.8s ease 0.5s both',
                transformOrigin: 'center',
              }}
            />
            <span
              style={{
                color: 'var(--card-accent)',
                fontSize: '1.8rem',
                lineHeight: 1,
                animation: 'wPulse 2s ease-in-out infinite',
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
                animation: 'wExpandLine 0.8s ease 0.5s both',
                transformOrigin: 'center',
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
              animation: 'wFadeInUp 0.9s ease 0.7s both',
            }}
          >
            {coupleNames.partner2 || 'Chú Rể'}
          </h1>

          {/* Countdown */}
          {weddingDate && (
            <div
              style={{
                marginBottom: '16px',
                animation: 'wFadeIn 0.8s ease 0.9s both',
              }}
            >
              <p
                style={{
                  fontSize: '0.6rem',
                  letterSpacing: '0.2em',
                  opacity: 0.5,
                  marginBottom: '10px',
                  fontStyle: 'italic',
                }}
              >
                đếm ngược đến ngày trọng đại
              </p>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '20px',
                }}
              >
                {[
                  { label: 'Ngày', value: '---' },
                  { label: 'Giờ', value: '--' },
                  { label: 'Phút', value: '--' },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    style={{ textAlign: 'center', minWidth: '40px' }}
                  >
                    <div
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: 'var(--card-accent)',
                        lineHeight: 1,
                        fontFamily: 'var(--card-font-heading)',
                      }}
                    >
                      {value}
                    </div>
                    <div
                      style={{
                        fontSize: '0.55rem',
                        letterSpacing: '0.15em',
                        opacity: 0.5,
                        fontStyle: 'italic',
                        marginTop: '4px',
                      }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p
            className="mt-4 text-sm"
            style={{
              opacity: 0.75,
              letterSpacing: '0.08em',
              animation: 'wFadeIn 0.8s ease 1s both',
            }}
          >
            {formattedDate}
          </p>
          {venue.name && (
            <p
              className="mt-1 text-sm"
              style={{
                opacity: 0.65,
                animation: 'wFadeIn 0.8s ease 1.2s both',
              }}
            >
              {venue.name}
            </p>
          )}
        </div>
      </div>

      {/* Soft wave divider */}
      <div
        className="py-2 text-center"
        style={{
          color: 'var(--card-accent)',
          opacity: 0.4,
          animation: 'wFadeIn 0.8s ease 1.3s both',
        }}
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

      <FamiliesSection config={config} />

      {/* Gallery */}
      {config.gallery && config.gallery.length > 0 && (
        <div
          style={{
            padding: '32px 24px 40px',
            background: 'rgba(255,255,255,0.4)',
            borderRadius: '12px',
            margin: '0 16px 24px',
          }}
        >
          <p
            style={{
              textAlign: 'center',
              color: 'var(--card-accent)',
              fontSize: '0.65rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            Kỷ niệm
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
            }}
          >
            {config.gallery.slice(0, 3).map((src, i) => (
              <div
                key={i}
                style={{
                  aspectRatio: '1',
                  overflow: 'hidden',
                  borderRadius: '12px',
                  animation: `wFadeInUp 0.7s ease ${0.1 * i}s both`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
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
        Cùng nhau mãi mãi{' '}
        <span
          style={{
            animation: 'wPulse 2s ease-in-out infinite',
            display: 'inline-block',
          }}
        >
          ♥
        </span>
      </div>
    </div>
  );
}
