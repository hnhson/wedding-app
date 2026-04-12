import type { CardConfig } from '@/types/card';

interface Props {
  config: CardConfig;
  /** 'light' = dark text on light bg (default), 'dark' = light text on dark bg */
  variant?: 'light' | 'dark';
}

/**
 * Reusable families section rendered inside all templates.
 * Shows bride & groom families side-by-side only when data exists.
 */
export default function FamiliesSection({ config, variant = 'light' }: Props) {
  const families = config.families ?? [];
  const groom = families.find((f) => f.side === 'groom');
  const bride = families.find((f) => f.side === 'bride');

  if (!groom?.members.length && !bride?.members.length) return null;

  const isDark = variant === 'dark';
  const textColor = isDark ? 'rgba(245,240,232,0.9)' : 'var(--card-primary)';
  const subColor = isDark ? 'rgba(245,240,232,0.55)' : 'rgba(0,0,0,0.5)';
  const dividerColor = 'var(--card-accent)';
  const colBg = isDark ? 'rgba(255,255,255,0.05)' : 'var(--card-secondary)';

  return (
    <div
      style={{
        padding: '32px 32px 40px',
        maxWidth: '640px',
        margin: '0 auto',
      }}
    >
      {/* Section label */}
      <p
        style={{
          textAlign: 'center',
          fontSize: '0.62rem',
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: dividerColor,
          opacity: 0.85,
          marginBottom: '10px',
        }}
      >
        Gia đình hai họ
      </p>

      {/* Thin accent rule */}
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
            background: dividerColor,
            opacity: 0.35,
          }}
        />
        <span style={{ color: dividerColor, fontSize: '11px', opacity: 0.7 }}>
          ✦
        </span>
        <div
          style={{
            height: '1px',
            flex: 1,
            background: dividerColor,
            opacity: 0.35,
          }}
        />
      </div>

      {/* Two columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: groom && bride ? '1fr 1fr' : '1fr',
          gap: '16px',
        }}
      >
        {groom && groom.members.length > 0 && (
          <div
            style={{
              background: colBg,
              borderRadius: '8px',
              padding: '16px 20px',
            }}
          >
            <p
              style={{
                fontSize: '0.6rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: dividerColor,
                marginBottom: '10px',
                fontWeight: 600,
              }}
            >
              Nhà trai
            </p>
            {groom.members.map((m, i) => (
              <p
                key={i}
                style={{
                  fontSize: '0.82rem',
                  color: textColor,
                  lineHeight: 1.7,
                }}
              >
                {m}
              </p>
            ))}
          </div>
        )}

        {bride && bride.members.length > 0 && (
          <div
            style={{
              background: colBg,
              borderRadius: '8px',
              padding: '16px 20px',
            }}
          >
            <p
              style={{
                fontSize: '0.6rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: dividerColor,
                marginBottom: '10px',
                fontWeight: 600,
              }}
            >
              Nhà gái
            </p>
            {bride.members.map((m, i) => (
              <p
                key={i}
                style={{
                  fontSize: '0.82rem',
                  color: textColor,
                  lineHeight: 1.7,
                }}
              >
                {m}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Only show if just one side has data — center it */}
      {(!groom?.members.length || !bride?.members.length) && (
        <p
          style={{
            fontSize: '0.72rem',
            color: subColor,
            textAlign: 'center',
            marginTop: '8px',
          }}
        >
          {/* empty placeholder */}
        </p>
      )}
    </div>
  );
}
