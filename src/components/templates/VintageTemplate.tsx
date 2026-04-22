import type { CardConfig } from '@/types/card';
import CountdownWidget from '@/components/CountdownWidget';
import FamiliesSection from './FamiliesSection';
import ScheduleSection from './ScheduleSection';

export default function VintageTemplate({ config }: { config: CardConfig }) {
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
        background: 'var(--card-bg)',
        color: 'var(--card-primary)',
        fontFamily: 'var(--card-font-body, Georgia, serif)',
        filter: 'sepia(8%)',
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
        @keyframes wFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
        @keyframes wExpandLine {
          from { transform: scaleX(0); opacity: 0; }
          to   { transform: scaleX(1); opacity: 1; }
        }
      `}</style>

      {/* Stamp-style dashed outer border */}
      <div
        style={{
          margin: '18px',
          border: '3px dashed var(--card-accent)',
          minHeight: cardHeight - 36,
          position: 'relative',
          animation: 'wFadeIn 1s ease both',
        }}
      >
        {/* Inner dotted second border */}
        <div
          style={{
            margin: '8px',
            border: '1px dotted var(--card-primary)',
            minHeight: cardHeight - 68,
            opacity: 0.3,
            position: 'absolute',
            inset: '8px',
            pointerEvents: 'none',
          }}
        />

        {/* Hero image */}
        {heroImage && (
          <div
            style={{
              height: '240px',
              overflow: 'hidden',
              animation: 'wFadeIn 1.2s ease 0.1s both',
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
                filter: 'sepia(30%) contrast(0.9) brightness(0.95)',
              }}
            />
          </div>
        )}

        {/* Postmark header */}
        <div style={{ padding: '40px 48px 10px', textAlign: 'center' }}>
          {/* Vintage postcard label */}
          <div
            style={{
              display: 'inline-block',
              border: '1px solid var(--card-primary)',
              padding: '3px 18px',
              fontSize: '0.6rem',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              opacity: 0.5,
              marginBottom: '28px',
              animation: 'wFadeIn 0.8s ease 0.2s both',
            }}
          >
            Thiệp Cưới
          </div>

          {/* ~~~ flourish */}
          <div
            style={{
              color: 'var(--card-accent)',
              fontSize: '1rem',
              letterSpacing: '4px',
              marginBottom: '20px',
              opacity: 0.7,
              animation: 'wFloat 4s ease-in-out infinite',
            }}
          >
            ~~~✦~~~
          </div>

          <p
            style={{
              fontSize: '0.7rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              opacity: 0.55,
              marginBottom: '16px',
              animation: 'wFadeIn 0.8s ease 0.3s both',
            }}
          >
            Kính mời quý vị đến dự lễ thành hôn
          </p>

          <h1
            style={{
              fontFamily: 'var(--card-font-couple, Georgia, serif)',
              fontSize: '3.2rem',
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '0.01em',
              animation: 'wFadeInUp 0.9s ease 0.4s both',
            }}
          >
            {coupleNames.partner1 || 'Cô Dâu'}
          </h1>

          <div
            style={{
              color: 'var(--card-accent)',
              fontSize: '0.9rem',
              letterSpacing: '8px',
              margin: '10px 0',
              opacity: 0.7,
              animation: 'wFadeIn 0.8s ease 0.65s both',
            }}
          >
            ~~~&amp;~~~
          </div>

          <h1
            style={{
              fontFamily: 'var(--card-font-couple, Georgia, serif)',
              fontSize: '3.2rem',
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '0.01em',
              animation: 'wFadeInUp 0.9s ease 0.8s both',
            }}
          >
            {coupleNames.partner2 || 'Chú Rể'}
          </h1>

          {/* ~~~ flourish */}
          <div
            style={{
              color: 'var(--card-accent)',
              fontSize: '1rem',
              letterSpacing: '4px',
              margin: '20px 0',
              opacity: 0.7,
              animation: 'wFloat 4s ease-in-out 0.5s infinite',
            }}
          >
            ~~~✦~~~
          </div>

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
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  opacity: 0.45,
                  marginBottom: '10px',
                  fontStyle: 'italic',
                }}
              >
                Đếm ngược đến ngày trọng đại
              </p>
              <CountdownWidget weddingDate={weddingDate} />
            </div>
          )}

          <p
            style={{
              fontSize: '0.9rem',
              letterSpacing: '0.05em',
              opacity: 0.75,
              marginBottom: '6px',
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
                fontSize: '0.82rem',
                opacity: 0.6,
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

        <FamiliesSection config={config} />

        {/* Love Story */}
        {loveStory && (
          <div
            style={{
              padding: '32px 52px',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <span
                style={{
                  fontFamily: 'var(--card-font-heading, Georgia, serif)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: 'var(--card-accent)',
                }}
              >
                ~~~ Câu chuyện tình yêu ~~~
              </span>
            </div>
            <p
              style={{
                fontSize: '0.88rem',
                lineHeight: 2,
                opacity: 0.78,
                whiteSpace: 'pre-wrap',
                fontStyle: 'italic',
                textAlign: 'center',
              }}
            >
              {loveStory}
            </p>
          </div>
        )}

        {/* Dashed rule */}
        <div
          style={{
            margin: '8px 52px',
            borderTop: '1px dashed var(--card-accent)',
            opacity: 0.4,
          }}
        />

        <ScheduleSection items={schedule} style={scheduleStyle} />

        {/* Dashed rule */}
        <div
          style={{
            margin: '8px 52px',
            borderTop: '1px dashed var(--card-accent)',
            opacity: 0.4,
          }}
        />

        {/* Venue */}
        {venue.address && (
          <div style={{ padding: '28px 52px 36px', textAlign: 'center' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <span
                style={{
                  fontFamily: 'var(--card-font-heading, Georgia, serif)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: 'var(--card-accent)',
                }}
              >
                ~~~ Địa điểm ~~~
              </span>
            </div>
            <p
              style={{
                fontWeight: 700,
                fontSize: '0.95rem',
                marginBottom: '5px',
              }}
            >
              {venue.name}
            </p>
            <p
              style={{ fontSize: '0.85rem', opacity: 0.7, fontStyle: 'italic' }}
            >
              {venue.address}
            </p>
            {venue.mapUrl && (
              <a
                href={venue.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  marginTop: '16px',
                  padding: '8px 22px',
                  border: '1px solid var(--card-primary)',
                  color: 'var(--card-primary)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontStyle: 'italic',
                  opacity: 0.8,
                }}
              >
                Chỉ đường
              </a>
            )}
          </div>
        )}

        {/* Gallery */}
        {config.gallery && config.gallery.length > 0 && (
          <div style={{ padding: '16px 52px 36px' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <span
                style={{
                  fontFamily: 'var(--card-font-heading, Georgia, serif)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: 'var(--card-accent)',
                }}
              >
                ~~~ Kỷ niệm ~~~
              </span>
            </div>
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
                    borderRadius: '4px',
                    border: '1px dashed var(--card-accent)',
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
                      filter: 'sepia(20%) contrast(0.95)',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom flourish */}
        <div
          style={{
            textAlign: 'center',
            paddingBottom: '32px',
            color: 'var(--card-accent)',
            fontSize: '1rem',
            letterSpacing: '4px',
            opacity: 0.6,
            animation: 'wFloat 4s ease-in-out 1s infinite',
          }}
        >
          ~~~✦~~~
        </div>
      </div>
    </div>
  );
}
