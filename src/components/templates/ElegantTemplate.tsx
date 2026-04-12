import type { CardConfig } from '@/types/card';
import FamiliesSection from './FamiliesSection';

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
      `}</style>

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
                style={{ opacity: 0.12, objectPosition: 'center top' }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.1) 100%)',
                }}
              />
            </div>
          )}
          <div className="relative z-10 w-full">
            <p
              className="mb-8 text-xs tracking-[0.4em] uppercase"
              style={{
                color: 'var(--card-accent)',
                animation: 'wFadeIn 1s ease both',
              }}
            >
              Trân trọng kính mời
            </p>

            {/* Top ornament */}
            <div
              className="mb-10 flex items-center justify-center gap-4"
              style={{ color: 'var(--card-accent)' }}
            >
              <span
                style={{
                  fontSize: '10px',
                  letterSpacing: '6px',
                  animation: 'wFloat 3s ease-in-out infinite',
                  display: 'inline-block',
                }}
              >
                <span
                  style={{
                    animation: 'wShimmer 2.5s ease-in-out infinite',
                    animationDelay: '0s',
                    display: 'inline-block',
                  }}
                >
                  ✦
                </span>{' '}
                <span
                  style={{
                    animation: 'wShimmer 2.5s ease-in-out infinite',
                    animationDelay: '0.4s',
                    display: 'inline-block',
                  }}
                >
                  ✦
                </span>{' '}
                <span
                  style={{
                    animation: 'wShimmer 2.5s ease-in-out infinite',
                    animationDelay: '0.8s',
                    display: 'inline-block',
                  }}
                >
                  ✦
                </span>{' '}
                ◆{' '}
                <span
                  style={{
                    animation: 'wShimmer 2.5s ease-in-out infinite',
                    animationDelay: '1.2s',
                    display: 'inline-block',
                  }}
                >
                  ✦
                </span>{' '}
                <span
                  style={{
                    animation: 'wShimmer 2.5s ease-in-out infinite',
                    animationDelay: '1.6s',
                    display: 'inline-block',
                  }}
                >
                  ✦
                </span>{' '}
                <span
                  style={{
                    animation: 'wShimmer 2.5s ease-in-out infinite',
                    animationDelay: '2.0s',
                    display: 'inline-block',
                  }}
                >
                  ✦
                </span>
              </span>
            </div>

            <h1
              className="mb-3 font-bold"
              style={{
                fontFamily: 'var(--card-font-heading, Georgia, serif)',
                fontSize: '3.5rem',
                lineHeight: 1.15,
                letterSpacing: '0.02em',
                animation: 'wFadeInUp 0.9s ease 0.15s both',
              }}
            >
              {coupleNames.partner1 || 'Cô Dâu'}
            </h1>

            {/* Gold divider with & */}
            <div
              className="my-5 flex items-center justify-center gap-5"
              style={{ animation: 'wFadeIn 0.8s ease 0.5s both' }}
            >
              <div
                style={{
                  height: '1px',
                  width: '60px',
                  background: 'var(--card-accent)',
                  animation: 'wExpandLine 0.8s ease 0.3s both',
                  transformOrigin: 'center',
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
                  animation: 'wExpandLine 0.8s ease 0.3s both',
                  transformOrigin: 'center',
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
                animation: 'wFadeInUp 0.9s ease 0.7s both',
              }}
            >
              {coupleNames.partner2 || 'Chú Rể'}
            </h1>

            {/* Bottom ornament */}
            <div
              className="mb-10 flex items-center justify-center gap-4"
              style={{
                color: 'var(--card-accent)',
                animation: 'wFloat 3s ease-in-out infinite',
              }}
            >
              <span style={{ fontSize: '10px', letterSpacing: '6px' }}>
                ❧ ◆ ❧
              </span>
            </div>

            {weddingDate && (
              <div
                style={{
                  marginBottom: '8px',
                  animation: 'wFadeIn 0.8s ease 0.9s both',
                }}
              >
                <p
                  style={{
                    fontSize: '0.6rem',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    opacity: 0.55,
                    marginBottom: '8px',
                  }}
                >
                  Đếm ngược đến ngày trọng đại
                </p>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '16px',
                  }}
                >
                  {[
                    { label: 'Ngày', value: '---' },
                    { label: 'Giờ', value: '--' },
                    { label: 'Phút', value: '--' },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          fontSize: '1.4rem',
                          fontWeight: 700,
                          color: 'var(--card-accent)',
                          lineHeight: 1,
                        }}
                      >
                        {value}
                      </div>
                      <div
                        style={{
                          fontSize: '0.55rem',
                          letterSpacing: '0.15em',
                          opacity: 0.55,
                          textTransform: 'uppercase',
                          marginTop: '3px',
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
              className="mb-2 text-base"
              style={{
                letterSpacing: '0.1em',
                color: 'var(--card-primary)',
                opacity: 0.85,
                animation: 'wFadeIn 0.8s ease 1s both',
              }}
            >
              {formattedDate}
            </p>
            {venue.name && (
              <p
                className="mt-2 text-sm tracking-widest uppercase"
                style={{
                  color: 'var(--card-accent)',
                  opacity: 0.9,
                  animation: 'wFadeIn 0.8s ease 1.2s both',
                }}
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
              animation: 'wExpandLine 0.8s ease 0.3s both',
              transformOrigin: 'center',
            }}
          />
          <span
            style={{
              margin: '0 16px',
              color: 'var(--card-accent)',
              fontSize: '12px',
              animation: 'wShimmer 2.5s ease-in-out infinite',
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
              animation: 'wExpandLine 0.8s ease 0.3s both',
              transformOrigin: 'center',
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
              animation: 'wExpandLine 0.8s ease 0.3s both',
              transformOrigin: 'center',
            }}
          />
          <span
            style={{
              margin: '0 16px',
              color: 'var(--card-accent)',
              fontSize: '12px',
              animation: 'wShimmer 2.5s ease-in-out infinite',
              animationDelay: '0.8s',
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
              animation: 'wExpandLine 0.8s ease 0.3s both',
              transformOrigin: 'center',
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
              animation: 'wExpandLine 0.8s ease 0.3s both',
              transformOrigin: 'center',
            }}
          />
          <span
            style={{
              margin: '0 16px',
              color: 'var(--card-accent)',
              fontSize: '12px',
              animation: 'wShimmer 2.5s ease-in-out infinite',
              animationDelay: '1.6s',
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
              animation: 'wExpandLine 0.8s ease 0.3s both',
              transformOrigin: 'center',
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

        <FamiliesSection config={config} />

        {/* Gallery */}
        {config.gallery && config.gallery.length > 0 && (
          <div style={{ padding: '32px 24px 40px' }}>
            <p
              style={{
                textAlign: 'center',
                color: 'var(--card-accent)',
                fontSize: '0.65rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                marginBottom: '20px',
                animation: 'wFadeIn 0.8s ease both',
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
                    borderRadius: '8px',
                    animation: `wFadeInUp 0.7s ease ${0.1 * i}s both`,
                  }}
                >
                  <img
                    src={src}
                    alt=""
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom ornament */}
        <div
          className="flex items-center justify-center pb-12"
          style={{
            color: 'var(--card-accent)',
            animation: 'wFloat 3s ease-in-out infinite',
          }}
        >
          <span style={{ fontSize: '10px', letterSpacing: '8px' }}>
            <span
              style={{
                animation: 'wShimmer 2.5s ease-in-out infinite',
                animationDelay: '0s',
                display: 'inline-block',
              }}
            >
              ✦
            </span>{' '}
            ◆{' '}
            <span
              style={{
                animation: 'wShimmer 2.5s ease-in-out infinite',
                animationDelay: '0.6s',
                display: 'inline-block',
              }}
            >
              ❧
            </span>{' '}
            ◆{' '}
            <span
              style={{
                animation: 'wShimmer 2.5s ease-in-out infinite',
                animationDelay: '1.2s',
                display: 'inline-block',
              }}
            >
              ✦
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
