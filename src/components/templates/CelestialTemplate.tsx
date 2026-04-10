import type { CardConfig } from '@/types/card';

const STARS: {
  top: string;
  left: string;
  size: number;
  opacity: number;
  char: string;
}[] = [
  { top: '4%', left: '8%', size: 14, opacity: 0.6, char: '★' },
  { top: '7%', left: '22%', size: 9, opacity: 0.4, char: '✦' },
  { top: '3%', left: '55%', size: 11, opacity: 0.5, char: '☆' },
  { top: '10%', left: '72%', size: 8, opacity: 0.35, char: '★' },
  { top: '5%', left: '88%', size: 13, opacity: 0.55, char: '✦' },
  { top: '18%', left: '3%', size: 7, opacity: 0.3, char: '☆' },
  { top: '25%', left: '93%', size: 10, opacity: 0.45, char: '★' },
  { top: '35%', left: '6%', size: 12, opacity: 0.5, char: '✦' },
  { top: '42%', left: '90%', size: 8, opacity: 0.4, char: '☆' },
  { top: '55%', left: '2%', size: 9, opacity: 0.35, char: '★' },
  { top: '60%', left: '95%', size: 11, opacity: 0.5, char: '✦' },
  { top: '70%', left: '8%', size: 7, opacity: 0.3, char: '☆' },
  { top: '75%', left: '88%', size: 10, opacity: 0.45, char: '★' },
  { top: '85%', left: '5%', size: 13, opacity: 0.55, char: '✦' },
  { top: '90%', left: '78%', size: 8, opacity: 0.35, char: '☆' },
  { top: '93%', left: '20%', size: 11, opacity: 0.4, char: '★' },
  { top: '96%', left: '50%', size: 7, opacity: 0.3, char: '✦' },
];

export default function CelestialTemplate({ config }: { config: CardConfig }) {
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
        background: '#0f1628',
        fontFamily: 'var(--card-font-body, Georgia, serif)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Scattered stars */}
      {STARS.map((star, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            top: star.top,
            left: star.left,
            fontSize: `${star.size}px`,
            color: 'var(--card-accent)',
            opacity: star.opacity,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {star.char}
        </span>
      ))}

      {/* Hero image overlay at top */}
      {heroImage && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '320px',
            overflow: 'hidden',
          }}
        >
          <img
            src={heroImage}
            alt="Hero"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.12,
            }}
          />
          {/* Gradient fade from image to dark bg */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '100px',
              background: 'linear-gradient(to bottom, transparent, #0f1628)',
            }}
          />
        </div>
      )}

      {/* Inner "card" — white/cream panel */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          margin: '48px 28px',
          background: 'var(--card-bg)',
          borderRadius: '4px',
          overflow: 'hidden',
          boxShadow: '0 8px 48px rgba(0,0,0,0.5)',
          minHeight: cardHeight - 96,
        }}
      >
        {/* Hero section inside inner card */}
        <div
          style={{
            padding: '56px 40px 44px',
            textAlign: 'center',
            background: `linear-gradient(160deg, var(--card-primary) 0%, var(--card-secondary) 100%)`,
            color: 'var(--card-bg)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Inner stars on the colored panel */}
          <span
            style={{
              position: 'absolute',
              top: 14,
              left: 24,
              color: 'var(--card-accent)',
              fontSize: 12,
              opacity: 0.5,
            }}
          >
            ★
          </span>
          <span
            style={{
              position: 'absolute',
              top: 22,
              right: 28,
              color: 'var(--card-accent)',
              fontSize: 9,
              opacity: 0.4,
            }}
          >
            ✦
          </span>
          <span
            style={{
              position: 'absolute',
              bottom: 18,
              left: 36,
              color: 'var(--card-accent)',
              fontSize: 10,
              opacity: 0.35,
            }}
          >
            ☆
          </span>
          <span
            style={{
              position: 'absolute',
              bottom: 14,
              right: 20,
              color: 'var(--card-accent)',
              fontSize: 14,
              opacity: 0.5,
            }}
          >
            ★
          </span>

          {/* Moon & invitation */}
          <div style={{ marginBottom: '20px' }}>
            <span
              style={{
                fontSize: '2rem',
                color: 'var(--card-accent)',
                display: 'block',
                marginBottom: '12px',
                lineHeight: 1,
              }}
            >
              ☽
            </span>
            <p
              style={{
                fontSize: '0.62rem',
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
                opacity: 0.7,
                color: 'var(--card-accent)',
              }}
            >
              Trân trọng kính mời
            </p>
          </div>

          <h1
            style={{
              fontFamily: 'var(--card-font-heading, Georgia, serif)',
              fontSize: '3.4rem',
              fontWeight: 700,
              lineHeight: 1.1,
              color: 'var(--card-bg)',
              letterSpacing: '0.01em',
            }}
          >
            {coupleNames.partner1 || 'Cô Dâu'}
          </h1>

          {/* Constellation-style divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              margin: '18px 0',
            }}
          >
            <div
              style={{
                height: '1px',
                width: '30px',
                background: 'var(--card-accent)',
                opacity: 0.5,
              }}
            />
            <span
              style={{
                color: 'var(--card-accent)',
                fontSize: '10px',
                opacity: 0.7,
              }}
            >
              ★
            </span>
            <div
              style={{
                height: '1px',
                width: '16px',
                background: 'var(--card-accent)',
                opacity: 0.3,
              }}
            />
            <span
              style={{
                fontFamily: 'var(--card-font-heading, Georgia, serif)',
                color: 'var(--card-accent)',
                fontSize: '1.5rem',
                fontStyle: 'italic',
              }}
            >
              &amp;
            </span>
            <div
              style={{
                height: '1px',
                width: '16px',
                background: 'var(--card-accent)',
                opacity: 0.3,
              }}
            />
            <span
              style={{
                color: 'var(--card-accent)',
                fontSize: '10px',
                opacity: 0.7,
              }}
            >
              ★
            </span>
            <div
              style={{
                height: '1px',
                width: '30px',
                background: 'var(--card-accent)',
                opacity: 0.5,
              }}
            />
          </div>

          <h1
            style={{
              fontFamily: 'var(--card-font-heading, Georgia, serif)',
              fontSize: '3.4rem',
              fontWeight: 700,
              lineHeight: 1.1,
              color: 'var(--card-bg)',
              letterSpacing: '0.01em',
            }}
          >
            {coupleNames.partner2 || 'Chú Rể'}
          </h1>

          {/* Constellation bottom divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              margin: '22px 0 16px',
            }}
          >
            <div
              style={{
                height: '1px',
                width: '50px',
                background: 'var(--card-accent)',
                opacity: 0.4,
              }}
            />
            <span
              style={{
                color: 'var(--card-accent)',
                fontSize: '8px',
                opacity: 0.6,
              }}
            >
              ✦
            </span>
            <span
              style={{
                color: 'var(--card-accent)',
                fontSize: '12px',
                opacity: 0.8,
              }}
            >
              ★
            </span>
            <span
              style={{
                color: 'var(--card-accent)',
                fontSize: '8px',
                opacity: 0.6,
              }}
            >
              ✦
            </span>
            <div
              style={{
                height: '1px',
                width: '50px',
                background: 'var(--card-accent)',
                opacity: 0.4,
              }}
            />
          </div>

          <p
            style={{
              fontSize: '0.85rem',
              letterSpacing: '0.06em',
              opacity: 0.75,
              color: 'var(--card-bg)',
              marginBottom: '4px',
            }}
          >
            {formattedDate}
          </p>
          {venue.name && (
            <p
              style={{
                fontSize: '0.78rem',
                color: 'var(--card-accent)',
                opacity: 0.7,
                fontStyle: 'italic',
              }}
            >
              {venue.name}
            </p>
          )}
        </div>

        {/* Cream content area */}
        <div
          style={{ background: 'var(--card-bg)', color: 'var(--card-primary)' }}
        >
          {/* Love Story */}
          {loveStory && (
            <div
              style={{
                padding: '44px 48px 32px',
                maxWidth: '580px',
                margin: '0 auto',
                textAlign: 'center',
              }}
            >
              {/* Constellation divider */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    height: '1px',
                    flex: 1,
                    background: 'var(--card-accent)',
                    opacity: 0.3,
                  }}
                />
                <span style={{ color: 'var(--card-accent)', fontSize: '10px' }}>
                  ☽ ★ ☽
                </span>
                <div
                  style={{
                    height: '1px',
                    flex: 1,
                    background: 'var(--card-accent)',
                    opacity: 0.3,
                  }}
                />
              </div>
              <h2
                style={{
                  fontFamily: 'var(--card-font-heading, Georgia, serif)',
                  fontSize: '1.1rem',
                  color: 'var(--card-primary)',
                  marginBottom: '16px',
                  letterSpacing: '0.05em',
                }}
              >
                Câu chuyện của chúng tôi
              </h2>
              <p
                style={{
                  fontSize: '0.88rem',
                  lineHeight: 1.95,
                  opacity: 0.8,
                  whiteSpace: 'pre-wrap',
                  fontStyle: 'italic',
                }}
              >
                {loveStory}
              </p>
            </div>
          )}

          {/* Schedule */}
          {schedule.length > 0 && (
            <div
              style={{
                padding: '32px 48px',
                maxWidth: '580px',
                margin: '0 auto',
              }}
            >
              {/* Constellation divider */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    height: '1px',
                    flex: 1,
                    background: 'var(--card-accent)',
                    opacity: 0.3,
                  }}
                />
                <span style={{ color: 'var(--card-accent)', fontSize: '10px' }}>
                  ★ ✦ ★
                </span>
                <div
                  style={{
                    height: '1px',
                    flex: 1,
                    background: 'var(--card-accent)',
                    opacity: 0.3,
                  }}
                />
              </div>
              <h2
                style={{
                  fontFamily: 'var(--card-font-heading, Georgia, serif)',
                  fontSize: '1.1rem',
                  color: 'var(--card-primary)',
                  marginBottom: '20px',
                  textAlign: 'center',
                  letterSpacing: '0.05em',
                }}
              >
                Chương trình
              </h2>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '0' }}
              >
                {schedule.map((item, i) => (
                  <div key={i}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '16px',
                        padding: '13px 0',
                      }}
                    >
                      <span
                        style={{
                          color: 'var(--card-accent)',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          minWidth: '52px',
                          paddingTop: '2px',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {item.time}
                      </span>
                      <span
                        style={{
                          color: 'var(--card-accent)',
                          fontSize: '9px',
                          paddingTop: '4px',
                        }}
                      >
                        ★
                      </span>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '0.88rem' }}>
                          {item.title}
                        </p>
                        {item.description && (
                          <p
                            style={{
                              fontSize: '0.78rem',
                              opacity: 0.6,
                              marginTop: '3px',
                              fontStyle: 'italic',
                            }}
                          >
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                    {i < schedule.length - 1 && (
                      <div
                        style={{
                          height: '1px',
                          background: 'var(--card-accent)',
                          opacity: 0.12,
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Venue */}
          {venue.address && (
            <div
              style={{
                padding: '32px 48px 52px',
                maxWidth: '580px',
                margin: '0 auto',
                textAlign: 'center',
              }}
            >
              {/* Constellation divider */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    height: '1px',
                    flex: 1,
                    background: 'var(--card-accent)',
                    opacity: 0.3,
                  }}
                />
                <span style={{ color: 'var(--card-accent)', fontSize: '10px' }}>
                  ☽ ✦ ☽
                </span>
                <div
                  style={{
                    height: '1px',
                    flex: 1,
                    background: 'var(--card-accent)',
                    opacity: 0.3,
                  }}
                />
              </div>
              <h2
                style={{
                  fontFamily: 'var(--card-font-heading, Georgia, serif)',
                  fontSize: '1.1rem',
                  color: 'var(--card-primary)',
                  marginBottom: '12px',
                  letterSpacing: '0.05em',
                }}
              >
                Địa điểm
              </h2>
              <p
                style={{
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  marginBottom: '5px',
                }}
              >
                {venue.name}
              </p>
              <p style={{ fontSize: '0.85rem', opacity: 0.65 }}>
                {venue.address}
              </p>
              {venue.mapUrl && (
                <a
                  href={venue.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    marginTop: '18px',
                    padding: '9px 26px',
                    background: 'var(--card-primary)',
                    color: 'var(--card-bg)',
                    fontSize: '0.78rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    borderRadius: '2px',
                  }}
                >
                  Chỉ đường
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom stars */}
      <div
        style={{
          textAlign: 'center',
          paddingBottom: '20px',
          color: 'var(--card-accent)',
          fontSize: '12px',
          letterSpacing: '8px',
          opacity: 0.5,
          position: 'relative',
          zIndex: 10,
        }}
      >
        ★ ✦ ☆ ✦ ★
      </div>
    </div>
  );
}
