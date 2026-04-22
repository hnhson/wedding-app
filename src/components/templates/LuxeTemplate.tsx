import type { CardConfig } from '@/types/card';
import CountdownWidget from '@/components/CountdownWidget';
import FamiliesSection from './FamiliesSection';
import ScheduleSection from './ScheduleSection';

export default function LuxeTemplate({ config }: { config: CardConfig }) {
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
        background: 'var(--card-primary)',
        color: '#f5f0e8',
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

      {/* Full gold top line */}
      <div
        style={{
          height: '3px',
          background: 'var(--card-accent)',
          width: '100%',
          animation: 'wExpandLine 0.8s ease both',
          transformOrigin: 'center',
        }}
      />

      {/* Hero */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 40px 50px',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        {heroImage && (
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 50%, rgba(0,0,0,0.3) 100%)',
              }}
            />
          </div>
        )}
        <div style={{ position: 'relative', zIndex: 10, width: '100%' }}>
          <p
            style={{
              color: 'var(--card-accent)',
              fontSize: '0.65rem',
              letterSpacing: '0.45em',
              textTransform: 'uppercase',
              marginBottom: '36px',
              opacity: 0.85,
              animation: 'wFadeIn 1s ease both',
            }}
          >
            Trân trọng kính mời
          </p>

          <h1
            style={{
              fontFamily: 'var(--card-font-couple, Georgia, serif)',
              fontSize: '5rem',
              fontWeight: 700,
              color: 'var(--card-accent)',
              lineHeight: 1.0,
              letterSpacing: '0.02em',
              textShadow: '0 2px 20px rgba(0,0,0,0.4)',
              animation: 'wFadeInUp 1s ease 0.2s both',
            }}
          >
            {coupleNames.partner1 || 'Cô Dâu'}
          </h1>

          {/* Full-width gold line separator */}
          <div
            style={{
              margin: '28px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              animation: 'wFadeIn 0.8s ease 0.45s both',
            }}
          >
            <div
              style={{
                flex: 1,
                height: '1px',
                background: 'var(--card-accent)',
                opacity: 0.5,
                animation: 'wExpandLine 0.8s ease 0.45s both',
                transformOrigin: 'center',
              }}
            />
            <span
              style={{
                color: 'var(--card-accent)',
                fontFamily: 'var(--card-font-heading, Georgia, serif)',
                fontSize: '1.6rem',
                fontStyle: 'italic',
                opacity: 0.9,
              }}
            >
              &amp;
            </span>
            <div
              style={{
                flex: 1,
                height: '1px',
                background: 'var(--card-accent)',
                opacity: 0.5,
                animation: 'wExpandLine 0.8s ease 0.45s both',
                transformOrigin: 'center',
              }}
            />
          </div>

          <h1
            style={{
              fontFamily: 'var(--card-font-couple, Georgia, serif)',
              fontSize: '5rem',
              fontWeight: 700,
              color: 'var(--card-accent)',
              lineHeight: 1.0,
              letterSpacing: '0.02em',
              textShadow: '0 2px 20px rgba(0,0,0,0.4)',
              animation: 'wFadeInUp 1s ease 0.6s both',
            }}
          >
            {coupleNames.partner2 || 'Chú Rể'}
          </h1>

          {/* Gold separator */}
          <div
            style={{
              margin: '36px auto 0',
              height: '1px',
              width: '120px',
              background: 'var(--card-accent)',
              opacity: 0.6,
              animation: 'wExpandLine 0.8s ease 0.8s both',
              transformOrigin: 'center',
            }}
          />

          {/* Countdown */}
          {weddingDate && (
            <div
              style={{
                marginTop: '24px',
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
                  marginBottom: '10px',
                  color: '#f5f0e8',
                }}
              >
                Đếm ngược đến ngày trọng đại
              </p>
              <CountdownWidget weddingDate={weddingDate} />
            </div>
          )}

          <p
            style={{
              marginTop: '20px',
              fontSize: '0.85rem',
              letterSpacing: '0.1em',
              color: '#f5f0e8',
              opacity: 0.75,
              animation: 'wFadeIn 0.8s ease 1s both',
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
                marginTop: '6px',
                fontSize: '0.8rem',
                color: 'var(--card-accent)',
                opacity: 0.7,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                animation: 'wFadeIn 0.8s ease 1.2s both',
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
      </div>

      {/* Full-width gold separator */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 40px' }}>
        <div
          style={{
            flex: 1,
            height: '1px',
            background: 'var(--card-accent)',
            opacity: 0.35,
            animation: 'wExpandLine 0.8s ease 0.45s both',
            transformOrigin: 'center',
          }}
        />
        <span
          style={{
            margin: '0 14px',
            color: 'var(--card-accent)',
            fontSize: '12px',
            opacity: 0.7,
            animation: 'wShimmer 3s ease-in-out infinite',
          }}
        >
          ◆
        </span>
        <div
          style={{
            flex: 1,
            height: '1px',
            background: 'var(--card-accent)',
            opacity: 0.35,
            animation: 'wExpandLine 0.8s ease 0.45s both',
            transformOrigin: 'center',
          }}
        />
      </div>

      <FamiliesSection config={config} />

      {/* Love Story */}
      {loveStory && (
        <div
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: '48px 48px 40px',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              color: 'var(--card-accent)',
              fontSize: '0.65rem',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              marginBottom: '20px',
              opacity: 0.7,
            }}
          >
            Câu chuyện tình yêu
          </p>
          <p
            style={{
              fontSize: '0.88rem',
              lineHeight: 2,
              color: '#f5f0e8',
              opacity: 0.7,
              whiteSpace: 'pre-wrap',
              fontStyle: 'italic',
            }}
          >
            {loveStory}
          </p>
        </div>
      )}

      {/* Full-width gold separator */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 40px' }}>
        <div
          style={{
            flex: 1,
            height: '1px',
            background: 'var(--card-accent)',
            opacity: 0.35,
            animation: 'wExpandLine 0.8s ease 0.45s both',
            transformOrigin: 'center',
          }}
        />
        <span
          style={{
            margin: '0 14px',
            color: 'var(--card-accent)',
            fontSize: '12px',
            opacity: 0.7,
            animation: 'wShimmer 3s ease-in-out infinite',
          }}
        >
          ◆
        </span>
        <div
          style={{
            flex: 1,
            height: '1px',
            background: 'var(--card-accent)',
            opacity: 0.35,
            animation: 'wExpandLine 0.8s ease 0.45s both',
            transformOrigin: 'center',
          }}
        />
      </div>

      <ScheduleSection items={schedule} style={scheduleStyle} />

      {/* Full-width gold separator */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 40px' }}>
        <div
          style={{
            flex: 1,
            height: '1px',
            background: 'var(--card-accent)',
            opacity: 0.35,
            animation: 'wExpandLine 0.8s ease 0.45s both',
            transformOrigin: 'center',
          }}
        />
        <span
          style={{
            margin: '0 14px',
            color: 'var(--card-accent)',
            fontSize: '12px',
            opacity: 0.7,
            animation: 'wShimmer 3s ease-in-out infinite',
          }}
        >
          ◆
        </span>
        <div
          style={{
            flex: 1,
            height: '1px',
            background: 'var(--card-accent)',
            opacity: 0.35,
            animation: 'wExpandLine 0.8s ease 0.45s both',
            transformOrigin: 'center',
          }}
        />
      </div>

      {/* Venue */}
      {venue.address && (
        <div
          style={{
            maxWidth: '560px',
            margin: '0 auto',
            padding: '48px 48px 60px',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              color: 'var(--card-accent)',
              fontSize: '0.65rem',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              marginBottom: '16px',
              opacity: 0.7,
            }}
          >
            Địa điểm
          </p>
          <p
            style={{
              fontWeight: 700,
              fontSize: '1.05rem',
              color: '#f5f0e8',
              marginBottom: '6px',
            }}
          >
            {venue.name}
          </p>
          <p style={{ fontSize: '0.85rem', opacity: 0.6, color: '#f5f0e8' }}>
            {venue.address}
          </p>
          {venue.mapUrl && (
            <a
              href={venue.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                marginTop: '20px',
                padding: '10px 28px',
                border: '1px solid var(--card-accent)',
                color: 'var(--card-accent)',
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              Chỉ đường
            </a>
          )}
        </div>
      )}

      {/* Gallery */}
      {config.gallery && config.gallery.length > 0 && (
        <div
          style={{
            padding: '32px 40px 40px',
            borderTop: '1px solid',
            borderColor: 'rgba(212,175,55,0.2)',
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
              opacity: 0.7,
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
                  border: '1px solid rgba(212,175,55,0.3)',
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

      {/* Full gold bottom line */}
      <div
        style={{
          height: '3px',
          background: 'var(--card-accent)',
          width: '100%',
          animation: 'wExpandLine 0.8s ease both',
          transformOrigin: 'center',
        }}
      />
    </div>
  );
}
