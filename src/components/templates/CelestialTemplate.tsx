import type { CardConfig } from '@/types/card';
import CountdownWidget from '@/components/CountdownWidget';
import FamiliesSection from './FamiliesSection';
import ScheduleSection from './ScheduleSection';

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
  const {
    coupleNames,
    weddingDate,
    venue,
    loveStory,
    schedule,
    scheduleStyle,
    heroImage,
  } = config;

  const weddingTime = config.weddingTime ?? '';
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
        animation: 'wFadeIn 0.6s ease both',
      }}
    >
      <style>{`
        @keyframes wFadeInUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes wFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes wTwinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50%      { opacity: 0.95; transform: scale(1.4); }
        }
        @keyframes wFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-7px); }
        }
        @keyframes wShimmer {
          0%, 100% { opacity: 0.45; }
          50%      { opacity: 1; }
        }
        @keyframes wExpandLine {
          from { transform: scaleX(0); opacity: 0; }
          to   { transform: scaleX(1); opacity: 1; }
        }
      `}</style>

      {/* Scattered stars — each twinkles at different rate */}
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
            animation: `wTwinkle ${2 + (i % 3) * 0.8}s ease-in-out ${i * 0.2}s infinite`,
          }}
        >
          {star.char}
        </span>
      ))}

      {/* Hero image overlay */}
      {heroImage && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '340px',
            overflow: 'hidden',
            animation: 'wFadeIn 1.5s ease both',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt="Hero"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.15,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '120px',
              background: 'linear-gradient(to bottom, transparent, #0f1628)',
            }}
          />
        </div>
      )}

      {/* Inner "card" — cream panel */}
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
          animation: 'wFadeInUp 0.9s ease 0.3s both',
        }}
      >
        {/* Hero section */}
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
          {/* Inner corner stars */}
          <span
            style={{
              position: 'absolute',
              top: 14,
              left: 24,
              color: 'var(--card-accent)',
              fontSize: 12,
              opacity: 0.5,
              animation: 'wTwinkle 2.4s ease-in-out 0.2s infinite',
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
              animation: 'wTwinkle 3.1s ease-in-out 0.6s infinite',
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
              animation: 'wTwinkle 2.8s ease-in-out 1s infinite',
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
              animation: 'wTwinkle 2s ease-in-out 0.4s infinite',
            }}
          >
            ★
          </span>

          {/* Moon */}
          <div
            style={{
              marginBottom: '20px',
              animation: 'wFloat 5s ease-in-out infinite',
            }}
          >
            <span
              style={{
                fontSize: '2.2rem',
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
                animation: 'wFadeIn 0.8s ease 0.3s both',
              }}
            >
              Trân trọng kính mời
            </p>
          </div>

          <h1
            style={{
              fontFamily: 'var(--card-font-couple, Georgia, serif)',
              fontSize: '3.4rem',
              fontWeight: 700,
              lineHeight: 1.1,
              color: 'var(--card-bg)',
              letterSpacing: '0.01em',
              animation: 'wFadeInUp 0.9s ease 0.5s both',
            }}
          >
            {coupleNames.partner1 || 'Cô Dâu'}
          </h1>

          {/* Constellation divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              margin: '18px 0',
              animation: 'wFadeIn 0.8s ease 0.75s both',
            }}
          >
            <div
              style={{
                height: '1px',
                width: '30px',
                background: 'var(--card-accent)',
                opacity: 0.5,
                transformOrigin: 'right',
                animation: 'wExpandLine 0.7s ease 0.8s both',
              }}
            />
            <span
              style={{
                color: 'var(--card-accent)',
                fontSize: '10px',
                animation: 'wShimmer 2.5s ease-in-out infinite',
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
                animation: 'wShimmer 2.5s ease-in-out 0.5s infinite',
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
                transformOrigin: 'left',
                animation: 'wExpandLine 0.7s ease 0.8s both',
              }}
            />
          </div>

          <h1
            style={{
              fontFamily: 'var(--card-font-couple, Georgia, serif)',
              fontSize: '3.4rem',
              fontWeight: 700,
              lineHeight: 1.1,
              color: 'var(--card-bg)',
              letterSpacing: '0.01em',
              animation: 'wFadeInUp 0.9s ease 0.8s both',
            }}
          >
            {coupleNames.partner2 || 'Chú Rể'}
          </h1>

          {/* Bottom constellation divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              margin: '22px 0 16px',
              animation: 'wFadeIn 0.8s ease 1s both',
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
                animation: 'wShimmer 3s ease-in-out 0.3s infinite',
              }}
            >
              ✦
            </span>
            <span
              style={{
                color: 'var(--card-accent)',
                fontSize: '12px',
                opacity: 0.8,
                animation: 'wShimmer 2s ease-in-out infinite',
              }}
            >
              ★
            </span>
            <span
              style={{
                color: 'var(--card-accent)',
                fontSize: '8px',
                opacity: 0.6,
                animation: 'wShimmer 3s ease-in-out 0.7s infinite',
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

          {/* Countdown */}
          {weddingDate && (
            <div
              style={{
                marginBottom: '16px',
                animation: 'wFadeIn 0.8s ease 1s both',
              }}
            >
              <p
                style={{
                  fontSize: '0.58rem',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  opacity: 0.5,
                  marginBottom: '10px',
                  color: 'var(--card-accent)',
                }}
              >
                Đếm ngược đến ngày trọng đại
              </p>
              <CountdownWidget weddingDate={weddingDate} />
            </div>
          )}

          <p
            style={{
              fontSize: '0.85rem',
              letterSpacing: '0.06em',
              opacity: 0.75,
              color: 'var(--card-bg)',
              marginBottom: '4px',
              animation: 'wFadeIn 0.8s ease 1.1s both',
            }}
          >
            {formattedDate}
          </p>
          {weddingTime && (
            <p style={{ fontSize: '1.1rem', opacity: 0.85, marginTop: '6px' }}>
              🕐 {weddingTime}
            </p>
          )}
          {venue.name && (
            <p
              style={{
                fontSize: '0.78rem',
                color: 'var(--card-accent)',
                opacity: 0.7,
                fontStyle: 'italic',
                animation: 'wFadeIn 0.8s ease 1.25s both',
              }}
            >
              {venue.name}
            </p>
          )}
          {venue.address && (
            <p
              style={{
                fontSize: '0.75rem',
                opacity: 0.55,
                fontStyle: 'italic',
                marginTop: '3px',
                animation: 'wFadeIn 0.8s ease 1.35s both',
              }}
            >
              {venue.address}
            </p>
          )}
        </div>

        {/* Cream content area */}
        <div
          style={{ background: 'var(--card-bg)', color: 'var(--card-primary)' }}
        >
          <FamiliesSection config={config} />

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

          <ScheduleSection items={schedule} style={scheduleStyle} />

          {/* Venue */}
          {venue.address && (
            <div
              style={{
                padding: '32px 48px 36px',
                maxWidth: '580px',
                margin: '0 auto',
                textAlign: 'center',
              }}
            >
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

          {/* Gallery */}
          {config.gallery && config.gallery.length > 0 && (
            <div style={{ padding: '16px 48px 40px' }}>
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
              <p
                style={{
                  textAlign: 'center',
                  color: 'var(--card-accent)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  marginBottom: '16px',
                  opacity: 0.75,
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
                      borderRadius: '6px',
                      border: '1px solid rgba(212,175,55,0.25)',
                      animation: `wFadeInUp 0.7s ease ${0.1 * i}s both`,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
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
          animation: 'wShimmer 3s ease-in-out infinite',
        }}
      >
        ★ ✦ ☆ ✦ ★
      </div>
    </div>
  );
}
