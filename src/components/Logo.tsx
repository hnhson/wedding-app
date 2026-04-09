interface LogoProps {
  /** px size of the mark (height). Width scales proportionally. */
  size?: number;
  /** 'dark' = mark dark + text dark (on light bg). 'light' = all white (on dark bg). */
  variant?: 'dark' | 'light';
  /** Show the wordmark beside the mark */
  showText?: boolean;
  className?: string;
}

export default function Logo({
  size = 36,
  variant = 'dark',
  showText = true,
  className = '',
}: LogoProps) {
  const gold = variant === 'light' ? '#e8c97a' : '#c9a96e';
  const dark = variant === 'light' ? '#ffffff' : '#1a1714';
  const markSize = size;

  return (
    <span
      className={`inline-flex items-center gap-2.5 select-none ${className}`}
      aria-label="Thiệp Cưới"
    >
      {/* ── Mark ── */}
      <svg
        width={markSize}
        height={markSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Background circle */}
        <circle cx="24" cy="24" r="23" fill={dark} />

        {/* Two interlocking rings */}
        <circle
          cx="19"
          cy="24"
          r="7.5"
          stroke={gold}
          strokeWidth="2"
          fill="none"
        />
        <circle
          cx="29"
          cy="24"
          r="7.5"
          stroke={gold}
          strokeWidth="2"
          fill="none"
        />

        {/* Small diamond on top of the rings junction */}
        <path
          d="M24 13.5 L26 16.5 L24 19.5 L22 16.5 Z"
          fill={gold}
        />

        {/* Leaf sprigs — left */}
        <path
          d="M10 20 Q7 17 8 14 Q11 15 11 19"
          stroke={gold}
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M10 20 Q6 20 5 17 Q8 16 10 20"
          stroke={gold}
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Leaf sprigs — right */}
        <path
          d="M38 20 Q41 17 40 14 Q37 15 37 19"
          stroke={gold}
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M38 20 Q42 20 43 17 Q40 16 38 20"
          stroke={gold}
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Small dots at bottom */}
        <circle cx="18" cy="34" r="1.2" fill={gold} opacity="0.6" />
        <circle cx="24" cy="36" r="1.5" fill={gold} />
        <circle cx="30" cy="34" r="1.2" fill={gold} opacity="0.6" />
      </svg>

      {/* ── Wordmark ── */}
      {showText && (
        <span
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: size * 0.58,
            fontWeight: 600,
            color: dark,
            letterSpacing: '0.01em',
            lineHeight: 1,
          }}
        >
          Thiệp Cưới
        </span>
      )}
    </span>
  );
}
