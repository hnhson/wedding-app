import type { CardConfig } from '@/types/card';
import FamiliesSection from './FamiliesSection';

export default function GardenTemplate({ config }: { config: CardConfig }) {
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
        background: '#ffffff',
        color: 'var(--card-primary)',
        fontFamily: 'var(--card-font-body, sans-serif)',
        position: 'relative',
        overflow: 'hidden',
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

      {/* Botanical corner decorations */}
      {/* Top-left */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          color: 'var(--card-accent)',
          fontSize: '22px',
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
          animation: 'wFloat 3s ease-in-out 0s infinite',
        }}
      >
        ✿<br />
        <span style={{ fontSize: '16px', marginLeft: '10px' }}>❀</span>
        <br />
        <span style={{ fontSize: '12px', marginLeft: '20px' }}>⚘</span>
      </div>
      {/* Top-right */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          color: 'var(--card-accent)',
          fontSize: '22px',
          lineHeight: 1,
          textAlign: 'right',
          pointerEvents: 'none',
          userSelect: 'none',
          animation: 'wFloat 3s ease-in-out 0.5s infinite',
        }}
      >
        ✿<br />
        <span style={{ fontSize: '16px', marginRight: '10px' }}>❀</span>
        <br />
        <span style={{ fontSize: '12px', marginRight: '20px' }}>⚘</span>
      </div>
      {/* Bottom-left */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          color: 'var(--card-accent)',
          fontSize: '12px',
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
          animation: 'wFloat 3s ease-in-out 1s infinite',
        }}
      >
        ⚘<br />
        <span style={{ fontSize: '16px', marginLeft: '10px' }}>❀</span>
        <br />
        <span style={{ fontSize: '22px', marginLeft: '20px' }}>✿</span>
      </div>
      {/* Bottom-right */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          right: 12,
          color: 'var(--card-accent)',
          fontSize: '12px',
          lineHeight: 1,
          textAlign: 'right',
          pointerEvents: 'none',
          userSelect: 'none',
          animation: 'wFloat 3s ease-in-out 1.5s infinite',
        }}
      >
        ⚘<br />
        <span style={{ fontSize: '16px', marginRight: '10px' }}>❀</span>
        <br />
        <span style={{ fontSize: '22px', marginRight: '20px' }}>✿</span>
      </div>

      {/* Hero image strip */}
      {heroImage && (
        <div
          style={{
            height: '240px',
            overflow: 'hidden',
            animation: 'wFadeIn 1s both',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt="Hero"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}

      {/* Colored name band — left-aligned asymmetric */}
      <div
        style={{
          background: 'var(--card-primary)',
          padding: '28px 48px 28px 40px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          animation: 'wFadeInUp 0.8s ease 0.2s both',
        }}
      >
        <div>
          <p
            style={{
              color: 'var(--card-accent)',
              fontSize: '0.65rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              marginBottom: '6px',
            }}
          >
            Trân trọng kính mời
          </p>
          <h1
            style={{
              fontFamily: 'var(--card-font-heading, sans-serif)',
              fontSize: '2.6rem',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.1,
            }}
          >
            {coupleNames.partner1 || 'Cô Dâu'}
            <span
              style={{
                color: 'var(--card-accent)',
                margin: '0 12px',
                fontSize: '2rem',
              }}
            >
              &amp;
            </span>
            {coupleNames.partner2 || 'Chú Rể'}
          </h1>
        </div>
      </div>

      {/* Date & venue strip */}
      <div
        style={{
          background: 'var(--card-secondary)',
          padding: '12px 40px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          animation: 'wFadeIn 0.8s ease 0.5s both',
        }}
      >
        <span style={{ color: 'var(--card-accent)', fontSize: '1.1rem' }}>
          ❀
        </span>
        <span
          style={{ fontSize: '0.82rem', letterSpacing: '0.05em', opacity: 0.9 }}
        >
          {formattedDate}
        </span>
        {venue.name && (
          <>
            <span style={{ color: 'var(--card-accent)', opacity: 0.5 }}>•</span>
            <span style={{ fontSize: '0.82rem', opacity: 0.75 }}>
              {venue.name}
            </span>
          </>
        )}
      </div>

      {/* Countdown */}
      {weddingDate && (
        <div
          style={{
            padding: '20px 40px 8px',
            animation: 'wFadeIn 0.8s ease 0.9s both',
          }}
        >
          <p
            style={{
              fontSize: '0.6rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              opacity: 0.55,
              marginBottom: '10px',
              textAlign: 'center',
            }}
          >
            Đếm ngược đến ngày trọng đại
          </p>
          <div
            style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}
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
                    opacity: 0.55,
                    textTransform: 'uppercase',
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

      <FamiliesSection config={config} />

      {/* Love Story */}
      {loveStory && (
        <div
          style={{
            padding: '48px 48px 32px',
            maxWidth: '640px',
            margin: '0 auto',
          }}
        >
          {/* Nature-inspired divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '24px',
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
            <span style={{ color: 'var(--card-accent)', fontSize: '14px' }}>
              ✿ ❀ ✿
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
              fontFamily: 'var(--card-font-heading, sans-serif)',
              fontSize: '1.1rem',
              fontWeight: 600,
              color: 'var(--card-primary)',
              marginBottom: '14px',
              letterSpacing: '0.03em',
            }}
          >
            Câu chuyện của chúng tôi
          </h2>
          <p
            style={{
              fontSize: '0.88rem',
              lineHeight: 1.9,
              opacity: 0.8,
              whiteSpace: 'pre-wrap',
            }}
          >
            {loveStory}
          </p>
        </div>
      )}

      {/* Schedule */}
      {schedule.length > 0 && (
        <div
          style={{ padding: '32px 48px', maxWidth: '640px', margin: '0 auto' }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '24px',
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
            <span style={{ color: 'var(--card-accent)', fontSize: '14px' }}>
              ⚘ ❀ ⚘
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
              fontFamily: 'var(--card-font-heading, sans-serif)',
              fontSize: '1.1rem',
              fontWeight: 600,
              color: 'var(--card-primary)',
              marginBottom: '20px',
              letterSpacing: '0.03em',
            }}
          >
            Chương trình
          </h2>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {schedule.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  padding: '12px 16px',
                  background: 'var(--card-secondary)',
                  borderLeft: '3px solid var(--card-accent)',
                  borderRadius: '0 6px 6px 0',
                }}
              >
                <span
                  style={{
                    color: 'var(--card-accent)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    minWidth: '52px',
                    paddingTop: '2px',
                  }}
                >
                  {item.time}
                </span>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.88rem' }}>
                    {item.title}
                  </p>
                  {item.description && (
                    <p
                      style={{
                        fontSize: '0.78rem',
                        opacity: 0.65,
                        marginTop: '3px',
                      }}
                    >
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Venue */}
      {venue.address && (
        <div
          style={{
            padding: '32px 48px 56px',
            maxWidth: '640px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '24px',
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
            <span style={{ color: 'var(--card-accent)', fontSize: '14px' }}>
              ✿ ⚘ ✿
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
              fontFamily: 'var(--card-font-heading, sans-serif)',
              fontSize: '1.1rem',
              fontWeight: 600,
              color: 'var(--card-primary)',
              marginBottom: '10px',
            }}
          >
            Địa điểm tổ chức
          </h2>
          <p
            style={{
              fontWeight: 600,
              fontSize: '0.95rem',
              marginBottom: '4px',
            }}
          >
            {venue.name}
          </p>
          <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>{venue.address}</p>
          {venue.mapUrl && (
            <a
              href={venue.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                marginTop: '16px',
                padding: '9px 24px',
                background: 'var(--card-primary)',
                color: '#ffffff',
                fontSize: '0.8rem',
                borderRadius: '4px',
                fontWeight: 500,
                letterSpacing: '0.03em',
              }}
            >
              Chỉ đường
            </a>
          )}
        </div>
      )}

      {/* Gallery */}
      {config.gallery && config.gallery.length > 0 && (
        <div style={{ padding: '32px 24px 40px', background: 'inherit' }}>
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
                  borderRadius: '8px',
                  borderLeft: '3px solid var(--card-accent)',
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
    </div>
  );
}
