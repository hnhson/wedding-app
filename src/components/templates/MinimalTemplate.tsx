import type { CardConfig } from '@/types/card';
import CountdownWidget from '@/components/CountdownWidget';
import FamiliesSection from './FamiliesSection';
import ScheduleSection from './ScheduleSection';

export default function MinimalTemplate({ config }: { config: CardConfig }) {
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
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const cardHeight = config.cardHeight ?? 900;

  return (
    <div
      className="px-8 py-20"
      style={{
        minHeight: cardHeight,
        background: 'var(--card-bg)',
        color: 'var(--card-primary)',
        fontFamily: 'var(--card-font-body, sans-serif)',
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

      <div className="mx-auto max-w-xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <p
            className="mb-6 text-xs tracking-widest uppercase"
            style={{
              color: 'var(--card-accent)',
              animation: 'wFadeIn 1s ease both',
            }}
          >
            Trân trọng kính mời
          </p>
          <h1
            className="text-4xl"
            style={{
              fontFamily: 'var(--card-font-couple, serif)',
              animation: 'wFadeInUp 0.9s ease 0.15s both',
            }}
          >
            {coupleNames.partner1 || 'Cô Dâu'}
          </h1>
          <p
            className="my-3 text-xl"
            style={{
              color: 'var(--card-accent)',
              animation: 'wFadeIn 0.8s ease 0.5s both',
            }}
          >
            &amp;
          </p>
          <h1
            className="text-4xl"
            style={{
              fontFamily: 'var(--card-font-couple, serif)',
              animation: 'wFadeInUp 0.9s ease 0.7s both',
            }}
          >
            {coupleNames.partner2 || 'Chú Rể'}
          </h1>
          <div
            style={{
              height: '1px',
              width: '48px',
              background: 'var(--card-accent)',
              margin: '20px auto 0',
              animation: 'wExpandLine 0.8s ease 0.3s both',
              transformOrigin: 'center',
            }}
          />
          {weddingDate && (
            <div
              style={{
                marginTop: '20px',
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
              <CountdownWidget weddingDate={weddingDate} />
            </div>
          )}
          {formattedDate && (
            <p
              className="mt-4 text-sm tracking-widest uppercase opacity-60"
              style={{ animation: 'wFadeIn 0.8s ease 1s both' }}
            >
              {formattedDate}
            </p>
          )}
          {weddingTime && (
            <p style={{ fontSize: '1.1rem', opacity: 0.85, marginTop: '6px' }}>
              🕐 {weddingTime}
            </p>
          )}
          {venue.name && (
            <p
              className="mt-1 text-sm opacity-50"
              style={{ animation: 'wFadeIn 0.8s ease 1.2s both' }}
            >
              {venue.name}
            </p>
          )}
          {venue.address && (
            <p
              className="mt-1 text-sm opacity-60"
              style={{ animation: 'wFadeIn 0.8s ease 1.35s both' }}
            >
              {venue.address}
            </p>
          )}
        </div>

        {heroImage && (
          <img
            src={heroImage}
            alt="Hero"
            className="mb-16 w-full rounded object-cover"
            style={{ maxHeight: '400px', objectPosition: 'center top' }}
          />
        )}

        <FamiliesSection config={config} />

        {loveStory && (
          <div className="mb-16">
            <p className="text-center leading-relaxed whitespace-pre-wrap opacity-80">
              {loveStory}
            </p>
          </div>
        )}

        <ScheduleSection items={schedule} style={scheduleStyle} />

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

        {/* Gallery */}
        {config.gallery && config.gallery.length > 0 && (
          <div style={{ padding: '32px 0 8px' }}>
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
      </div>
    </div>
  );
}
