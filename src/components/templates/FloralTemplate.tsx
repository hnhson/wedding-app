import type { CardConfig } from '@/types/card';
import CountdownWidget from '@/components/CountdownWidget';
import FamiliesSection from './FamiliesSection';
import ScheduleSection from './ScheduleSection';

export default function FloralTemplate({ config }: { config: CardConfig }) {
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
        fontFamily: 'var(--card-font-body, serif)',
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

      {/* Decorative top border */}
      <div
        className="h-3"
        style={{
          background: `linear-gradient(to right, var(--card-primary), var(--card-accent), var(--card-primary))`,
        }}
      />

      <div className="flex flex-col items-center px-8 py-20 text-center">
        <p
          className="mb-2 text-sm tracking-widest uppercase"
          style={{
            color: 'var(--card-accent)',
            animation: 'wFadeIn 1s ease both',
          }}
        >
          <span
            style={{
              animation: 'wFloat 3s ease-in-out infinite',
              display: 'inline-block',
            }}
          >
            ✿
          </span>{' '}
          Kính mời{' '}
          <span
            style={{
              animation: 'wFloat 3s ease-in-out infinite',
              display: 'inline-block',
              animationDelay: '0.4s',
            }}
          >
            ✿
          </span>
        </p>

        {heroImage && (
          <div
            className="my-8 overflow-hidden border-4"
            style={{
              borderColor: 'var(--card-accent)',
              width: '256px',
              height: '256px',
              borderRadius: '50%',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            }}
          >
            <img
              src={heroImage}
              alt="Hero"
              className="h-full w-full object-cover"
              style={{ objectPosition: 'center top' }}
            />
          </div>
        )}

        <h1
          className="text-6xl"
          style={{
            fontFamily: 'var(--card-font-heading, cursive)',
            color: 'var(--card-primary)',
            animation: 'wFadeInUp 0.9s ease 0.15s both',
          }}
        >
          {coupleNames.partner1 || 'Cô Dâu'}
        </h1>
        <p
          className="my-4 text-3xl"
          style={{
            color: 'var(--card-accent)',
            animation: 'wPulse 2s ease-in-out infinite',
          }}
        >
          ❤
        </p>
        <h1
          className="text-6xl"
          style={{
            fontFamily: 'var(--card-font-heading, cursive)',
            color: 'var(--card-primary)',
            animation: 'wFadeInUp 0.9s ease 0.7s both',
          }}
        >
          {coupleNames.partner2 || 'Chú Rể'}
        </h1>

        <div className="my-8 flex items-center gap-4">
          <div
            className="h-px w-20"
            style={{
              background: 'var(--card-accent)',
              animation: 'wExpandLine 0.8s ease 0.3s both',
              transformOrigin: 'center',
            }}
          />
          <div>
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
                <CountdownWidget weddingDate={weddingDate} />
              </div>
            )}
            <p
              className="text-lg"
              style={{ animation: 'wFadeIn 0.8s ease 1s both' }}
            >
              {formattedDate}
            </p>
            {weddingTime && (
              <p
                style={{ fontSize: '1.1rem', opacity: 0.85, marginTop: '6px' }}
              >
                🕐 {weddingTime}
              </p>
            )}
          </div>
          <div
            className="h-px w-20"
            style={{
              background: 'var(--card-accent)',
              animation: 'wExpandLine 0.8s ease 0.3s both',
              transformOrigin: 'center',
            }}
          />
        </div>

        {venue.name && (
          <p
            className="text-base opacity-80"
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

      <FamiliesSection config={config} />

      {loveStory && (
        <div className="mx-auto max-w-2xl px-8 py-10 text-center">
          <p
            className="mb-4 text-3xl"
            style={{
              color: 'var(--card-accent)',
              fontFamily: 'var(--card-font-heading)',
            }}
          >
            Chuyện tình của chúng tôi
          </p>
          <p className="leading-relaxed whitespace-pre-wrap italic opacity-90">
            {loveStory}
          </p>
        </div>
      )}

      <ScheduleSection items={schedule} style={scheduleStyle} />

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
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        className="h-3"
        style={{
          background: `linear-gradient(to right, var(--card-primary), var(--card-accent), var(--card-primary))`,
        }}
      />
    </div>
  );
}
