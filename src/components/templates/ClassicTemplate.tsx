import type { CardConfig } from '@/types/card';
import CountdownWidget from '@/components/CountdownWidget';
import FamiliesSection from './FamiliesSection';
import ScheduleSection from './ScheduleSection';

interface Props {
  config: CardConfig;
}

export default function ClassicTemplate({ config }: Props) {
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

      {/* Hero */}
      <div className="relative flex flex-col items-center justify-center py-20 text-center">
        {heroImage && (
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={heroImage}
              alt="Hero"
              className="h-full w-full object-cover"
              style={{ opacity: 0.18, objectPosition: 'center top' }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.15) 100%)',
              }}
            />
          </div>
        )}
        <div className="relative z-10">
          <p
            className="mb-4 text-lg tracking-widest uppercase"
            style={{
              color: 'var(--card-accent)',
              animation: 'wFadeIn 1s ease both',
            }}
          >
            Trân trọng kính mời
          </p>
          <h1
            className="mb-2 text-5xl font-bold"
            style={{
              fontFamily: 'var(--card-font-heading, serif)',
              animation: 'wFadeInUp 0.9s ease 0.15s both',
            }}
          >
            {coupleNames.partner1 || 'Cô Dâu'}
          </h1>
          <p
            className="my-4 text-3xl"
            style={{
              color: 'var(--card-accent)',
              animation: 'wFadeIn 0.8s ease 0.5s both',
            }}
          >
            &amp;
          </p>
          <h1
            className="mb-6 text-5xl font-bold"
            style={{
              fontFamily: 'var(--card-font-heading, serif)',
              animation: 'wFadeInUp 0.9s ease 0.7s both',
            }}
          >
            {coupleNames.partner2 || 'Chú Rể'}
          </h1>
          <div
            className="mx-auto mb-6 h-px w-32"
            style={{
              background: 'var(--card-accent)',
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
                }}
              >
                Đếm ngược đến ngày trọng đại
              </p>
              <CountdownWidget weddingDate={weddingDate} />
            </div>
          )}
          <p
            className="text-xl"
            style={{ animation: 'wFadeIn 0.8s ease 1s both' }}
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
              className="mt-2 text-base opacity-80"
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
      </div>

      <FamiliesSection config={config} />

      {/* Love Story */}
      {loveStory && (
        <div className="mx-auto max-w-2xl px-8 py-12 text-center">
          <h2
            className="mb-6 text-2xl"
            style={{
              fontFamily: 'var(--card-font-heading, serif)',
              color: 'var(--card-accent)',
            }}
          >
            Câu chuyện của chúng tôi
          </h2>
          <p className="leading-relaxed whitespace-pre-wrap opacity-90">
            {loveStory}
          </p>
        </div>
      )}

      <ScheduleSection items={schedule} style={scheduleStyle} />

      {/* Venue */}
      {venue.address && (
        <div
          className="px-8 py-12 text-center"
          style={{ background: 'var(--card-secondary)' }}
        >
          <h2
            className="mb-4 text-2xl"
            style={{
              fontFamily: 'var(--card-font-heading, serif)',
              color: 'var(--card-accent)',
            }}
          >
            Địa điểm
          </h2>
          <p className="text-lg font-semibold">{venue.name}</p>
          <p className="mt-1 opacity-80">{venue.address}</p>
          {venue.mapUrl && (
            <a
              href={venue.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block rounded px-4 py-2 text-sm font-medium text-white"
              style={{ background: 'var(--card-primary)' }}
            >
              Chỉ đường
            </a>
          )}
        </div>
      )}

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
