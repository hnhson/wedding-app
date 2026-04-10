import type { CardConfig } from '@/types/card';

export default function FloralTemplate({ config }: { config: CardConfig }) {
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

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'var(--card-bg)',
        color: 'var(--card-primary)',
        fontFamily: 'var(--card-font-body, serif)',
      }}
    >
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
          style={{ color: 'var(--card-accent)' }}
        >
          ✿ Kính mời ✿
        </p>

        {heroImage && (
          <div
            className="my-8 h-64 w-64 overflow-hidden rounded-full border-4"
            style={{ borderColor: 'var(--card-accent)' }}
          >
            <img
              src={heroImage}
              alt="Hero"
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <h1
          className="text-6xl"
          style={{
            fontFamily: 'var(--card-font-heading, cursive)',
            color: 'var(--card-primary)',
          }}
        >
          {coupleNames.partner1 || 'Người 1'}
        </h1>
        <p className="my-4 text-3xl" style={{ color: 'var(--card-accent)' }}>
          ❤
        </p>
        <h1
          className="text-6xl"
          style={{
            fontFamily: 'var(--card-font-heading, cursive)',
            color: 'var(--card-primary)',
          }}
        >
          {coupleNames.partner2 || 'Người 2'}
        </h1>

        <div className="my-8 flex items-center gap-4">
          <div
            className="h-px w-20"
            style={{ background: 'var(--card-accent)' }}
          />
          <p className="text-lg">{formattedDate}</p>
          <div
            className="h-px w-20"
            style={{ background: 'var(--card-accent)' }}
          />
        </div>

        {venue.name && <p className="text-base opacity-80">{venue.name}</p>}
      </div>

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

      {schedule.length > 0 && (
        <div
          className="px-8 py-12"
          style={{ background: 'var(--card-secondary)' }}
        >
          <div className="mx-auto max-w-lg text-center">
            <p
              className="mb-8 text-3xl"
              style={{
                fontFamily: 'var(--card-font-heading)',
                color: 'var(--card-accent)',
              }}
            >
              Chương trình
            </p>
            {schedule.map((item, i) => (
              <div key={i} className="mb-6">
                <p
                  className="text-sm font-semibold"
                  style={{ color: 'var(--card-accent)' }}
                >
                  {item.time}
                </p>
                <p className="font-medium">{item.title}</p>
                {item.description && (
                  <p className="text-sm opacity-70">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gallery images are placed as draggable overlay elements — not rendered here */}

      <div
        className="h-3"
        style={{
          background: `linear-gradient(to right, var(--card-primary), var(--card-accent), var(--card-primary))`,
        }}
      />
    </div>
  );
}
