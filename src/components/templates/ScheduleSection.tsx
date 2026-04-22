import type { ScheduleItem, ScheduleStyle } from '@/types/card';

interface Props {
  items: ScheduleItem[];
  style?: ScheduleStyle;
  title?: string;
}

export default function ScheduleSection({
  items,
  style = 'timeline',
  title = 'Chương trình',
}: Props) {
  if (items.length === 0) return null;

  if (style === 'timeline') {
    return (
      <div
        className="px-8 py-12"
        style={{ background: 'var(--card-secondary)' }}
      >
        <div className="mx-auto max-w-lg">
          <h2
            className="mb-10 text-center text-sm tracking-[0.25em] uppercase"
            style={{
              color: 'var(--card-accent)',
              fontFamily: 'var(--card-font-heading, serif)',
            }}
          >
            {title}
          </h2>
          <div className="relative pl-8">
            {/* Vertical line */}
            <div
              className="absolute top-2 bottom-2 left-3 w-px"
              style={{ background: 'var(--card-accent)', opacity: 0.25 }}
            />
            <div className="space-y-8">
              {items.map((item, i) => (
                <div key={i} className="relative flex gap-5">
                  {/* Dot */}
                  <div
                    className="absolute -left-8 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2"
                    style={{
                      borderColor: 'var(--card-accent)',
                      background: 'var(--card-secondary)',
                    }}
                  >
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ background: 'var(--card-accent)' }}
                    />
                  </div>
                  <div>
                    <p
                      className="text-xs font-bold tracking-wider"
                      style={{ color: 'var(--card-accent)' }}
                    >
                      {item.time}
                    </p>
                    <p
                      className="mt-0.5 font-semibold"
                      style={{
                        fontFamily: 'var(--card-font-heading, serif)',
                        color: 'var(--card-primary)',
                      }}
                    >
                      {item.title}
                    </p>
                    {item.description && (
                      <p
                        className="mt-0.5 text-sm"
                        style={{ color: 'var(--card-primary)', opacity: 0.6 }}
                      >
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (style === 'cards') {
    return (
      <div className="px-8 py-12">
        <div className="mx-auto max-w-lg">
          <h2
            className="mb-8 text-center text-sm tracking-[0.25em] uppercase"
            style={{
              color: 'var(--card-accent)',
              fontFamily: 'var(--card-font-heading, serif)',
            }}
          >
            {title}
          </h2>
          <div className="space-y-3">
            {items.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-2xl p-4"
                style={{
                  background: 'var(--card-secondary)',
                  border: '1px solid var(--card-accent)',
                  opacity: 1,
                }}
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold"
                  style={{ background: 'var(--card-accent)', color: '#fff' }}
                >
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <p
                      className="text-xs font-bold"
                      style={{ color: 'var(--card-accent)' }}
                    >
                      {item.time}
                    </p>
                    <p
                      className="font-semibold"
                      style={{
                        fontFamily: 'var(--card-font-heading, serif)',
                        color: 'var(--card-primary)',
                      }}
                    >
                      {item.title}
                    </p>
                  </div>
                  {item.description && (
                    <p
                      className="mt-0.5 text-sm"
                      style={{ color: 'var(--card-primary)', opacity: 0.6 }}
                    >
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (style === 'minimal') {
    return (
      <div className="px-8 py-10">
        <div className="mx-auto max-w-lg">
          <p
            className="mb-6 text-xs tracking-[0.3em] uppercase"
            style={{ color: 'var(--card-accent)', opacity: 0.7 }}
          >
            {title}
          </p>
          <div className="space-y-0">
            {items.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-6 border-b py-3 last:border-0"
                style={{ borderColor: 'var(--card-accent)' }}
              >
                <span
                  className="w-14 shrink-0 pt-0.5 text-xs font-bold tabular-nums"
                  style={{ color: 'var(--card-accent)' }}
                >
                  {item.time}
                </span>
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: 'var(--card-primary)' }}
                  >
                    {item.title}
                  </p>
                  {item.description && (
                    <p
                      className="text-xs"
                      style={{ color: 'var(--card-primary)', opacity: 0.55 }}
                    >
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (style === 'elegant') {
    return (
      <div
        className="px-8 py-14"
        style={{ background: 'var(--card-secondary)' }}
      >
        <div className="mx-auto max-w-sm text-center">
          <h2
            className="mb-10 text-xs tracking-[0.35em] uppercase"
            style={{
              color: 'var(--card-accent)',
              fontFamily: 'var(--card-font-heading, serif)',
            }}
          >
            {title}
          </h2>
          {items.map((item, i) => (
            <div key={i}>
              <p
                className="text-xs font-bold tracking-widest"
                style={{ color: 'var(--card-accent)' }}
              >
                {item.time}
              </p>
              <p
                className="mt-1 text-base font-medium"
                style={{
                  fontFamily: 'var(--card-font-heading, serif)',
                  color: 'var(--card-primary)',
                }}
              >
                {item.title}
              </p>
              {item.description && (
                <p
                  className="mt-0.5 text-sm"
                  style={{ color: 'var(--card-primary)', opacity: 0.6 }}
                >
                  {item.description}
                </p>
              )}
              {i < items.length - 1 && (
                <div className="my-5 flex items-center justify-center gap-3">
                  <div
                    className="h-px w-12"
                    style={{ background: 'var(--card-accent)', opacity: 0.3 }}
                  />
                  <span
                    style={{ color: 'var(--card-accent)', fontSize: '0.5rem' }}
                  >
                    ◆
                  </span>
                  <div
                    className="h-px w-12"
                    style={{ background: 'var(--card-accent)', opacity: 0.3 }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // steps
  return (
    <div className="px-8 py-12">
      <div className="mx-auto max-w-lg">
        <h2
          className="mb-8 text-center text-sm tracking-[0.25em] uppercase"
          style={{
            color: 'var(--card-accent)',
            fontFamily: 'var(--card-font-heading, serif)',
          }}
        >
          {title}
        </h2>
        <div className="space-y-6">
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-5">
              <div
                className="shrink-0 text-4xl leading-none font-bold"
                style={{
                  color: 'var(--card-accent)',
                  opacity: 0.18,
                  fontFamily: 'var(--card-font-heading, serif)',
                  minWidth: '2.5rem',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="pt-1">
                <p
                  className="text-xs font-bold tracking-wider"
                  style={{ color: 'var(--card-accent)' }}
                >
                  {item.time}
                </p>
                <p
                  className="mt-0.5 font-semibold"
                  style={{
                    fontFamily: 'var(--card-font-heading, serif)',
                    color: 'var(--card-primary)',
                  }}
                >
                  {item.title}
                </p>
                {item.description && (
                  <p
                    className="mt-0.5 text-sm"
                    style={{ color: 'var(--card-primary)', opacity: 0.6 }}
                  >
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
