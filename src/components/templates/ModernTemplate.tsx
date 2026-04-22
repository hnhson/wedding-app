import type { CardConfig } from '@/types/card';
import CountdownWidget from '@/components/CountdownWidget';
import FamiliesSection from './FamiliesSection';
import ScheduleSection from './ScheduleSection';

export default function ModernTemplate({ config }: { config: CardConfig }) {
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
    : 'Chưa có ngày';

  const cardHeight = config.cardHeight ?? 900;

  return (
    <div
      style={{
        minHeight: cardHeight,
        background: 'var(--card-bg)',
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

      {/* Split hero */}
      <div className="grid md:grid-cols-2" style={{ minHeight: cardHeight }}>
        <div className="flex flex-col items-start justify-center px-12 py-20">
          <p
            className="mb-6 text-xs tracking-widest uppercase"
            style={{
              color: 'var(--card-accent)',
              animation: 'wFadeIn 1s ease both',
            }}
          >
            We Are Getting Married
          </p>
          <h1
            className="mb-2 text-6xl font-light"
            style={{
              fontFamily: 'var(--card-font-couple, serif)',
              color: 'var(--card-primary)',
              animation: 'wFadeInUp 0.9s ease 0.15s both',
            }}
          >
            {coupleNames.partner1 || 'Cô Dâu'}
          </h1>
          <p
            className="my-3 text-2xl"
            style={{
              color: 'var(--card-accent)',
              animation: 'wFadeIn 0.8s ease 0.5s both',
            }}
          >
            —
          </p>
          <h1
            className="mb-8 text-6xl font-light"
            style={{
              fontFamily: 'var(--card-font-couple, serif)',
              color: 'var(--card-primary)',
              animation: 'wFadeInUp 0.9s ease 0.7s both',
            }}
          >
            {coupleNames.partner2 || 'Chú Rể'}
          </h1>
          <div
            style={{
              height: '1px',
              width: '60px',
              background: 'var(--card-accent)',
              marginBottom: '20px',
              animation: 'wExpandLine 0.8s ease 0.3s both',
              transformOrigin: 'center',
            }}
          />
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
                  color: 'var(--card-primary)',
                }}
              >
                Đếm ngược đến ngày trọng đại
              </p>
              <CountdownWidget weddingDate={weddingDate} />
            </div>
          )}
          <p
            className="text-lg opacity-70"
            style={{
              color: 'var(--card-primary)',
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
              className="mt-2 text-base opacity-60"
              style={{
                color: 'var(--card-primary)',
                animation: 'wFadeIn 0.8s ease 1.2s both',
              }}
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
        <div
          className="relative overflow-hidden"
          style={{ background: 'var(--card-secondary)' }}
        >
          {heroImage ? (
            <img
              src={heroImage}
              alt="Hero"
              className="h-full w-full object-cover"
              style={{ objectPosition: 'center top' }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              Ảnh chính
            </div>
          )}
        </div>
      </div>

      <FamiliesSection config={config} />

      {loveStory && (
        <div className="mx-auto max-w-2xl px-8 py-16">
          <h2
            className="mb-6 text-xl font-light"
            style={{
              fontFamily: 'var(--card-font-heading, serif)',
              color: 'var(--card-accent)',
            }}
          >
            Our Story
          </h2>
          <p
            className="leading-relaxed whitespace-pre-wrap opacity-80"
            style={{ color: 'var(--card-primary)' }}
          >
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
    </div>
  );
}
