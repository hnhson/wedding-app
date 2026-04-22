'use client';

import type { CardConfig } from '@/types/card';
import {
  COLOR_PALETTES,
  FONT_PAIRS,
  COUPLE_FONTS,
  SCHEDULE_FONTS,
} from '@/lib/templates/presets';
import { TEMPLATES } from '@/lib/templates/data';

interface Props {
  config: CardConfig;
  onChange: (patch: Partial<CardConfig>) => void;
}

/* Mini visual thumbnail for each template */
function TemplateThumbnail({
  bg,
  accent,
  style,
  active,
}: {
  bg: string;
  accent: string;
  style: string;
  active: boolean;
}) {
  const ring = active ? `2px solid ${accent}` : '2px solid transparent';

  const base = {
    width: '100%',
    height: 72,
    background: bg,
    borderRadius: 8,
    overflow: 'hidden' as const,
    position: 'relative' as const,
    border: ring,
    transition: 'border 0.15s',
  };

  if (style === 'luxe' || style === 'celestial') {
    return (
      <div style={base}>
        <div style={{ position: 'absolute', inset: 0, background: bg }}>
          {style === 'celestial' && (
            <>
              <span
                style={{
                  position: 'absolute',
                  top: 4,
                  left: 8,
                  color: accent,
                  fontSize: 8,
                }}
              >
                ★
              </span>
              <span
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 12,
                  color: accent,
                  fontSize: 6,
                }}
              >
                ✦
              </span>
              <span
                style={{
                  position: 'absolute',
                  bottom: 10,
                  left: 16,
                  color: accent,
                  fontSize: 7,
                }}
              >
                ☆
              </span>
            </>
          )}
          <div
            style={{
              position: 'absolute',
              top: 12,
              left: 0,
              right: 0,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 40,
                height: 1,
                background: accent,
                margin: '0 auto 4px',
              }}
            />
            <div
              style={{
                fontSize: 9,
                color: accent,
                fontWeight: 'bold',
                letterSpacing: 1,
              }}
            >
              A & B
            </div>
            <div
              style={{
                width: 40,
                height: 1,
                background: accent,
                margin: '4px auto 0',
              }}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 10,
              left: 0,
              right: 0,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 7, color: accent, opacity: 0.8 }}>
              01.01.2025
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (style === 'elegant') {
    return (
      <div style={base}>
        <div
          style={{
            position: 'absolute',
            inset: 4,
            border: `1px solid ${accent}`,
            borderRadius: 4,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 3,
              border: `0.5px solid ${accent}`,
              borderRadius: 2,
              opacity: 0.5,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              transform: 'translateY(-50%)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 7, color: accent, letterSpacing: 2 }}>
              ✦
            </div>
            <div
              style={{
                fontSize: 9,
                color: accent,
                fontWeight: 'bold',
                fontStyle: 'italic',
              }}
            >
              A & B
            </div>
            <div style={{ fontSize: 7, color: accent, letterSpacing: 2 }}>
              ✦
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (style === 'romance') {
    return (
      <div
        style={{
          ...base,
          background: `linear-gradient(160deg, ${bg} 60%, ${accent}22)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            transform: 'translateY(-50%)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 9,
              color: accent,
              fontStyle: 'italic',
              fontWeight: 'bold',
            }}
          >
            A & B
          </div>
          <div style={{ fontSize: 10, color: accent, margin: '2px 0' }}>♥</div>
          <div style={{ fontSize: 7, color: accent, opacity: 0.7 }}>
            01.01.2025
          </div>
        </div>
      </div>
    );
  }

  if (style === 'garden') {
    return (
      <div style={base}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 24,
            background: accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: 8, color: bg, fontWeight: 'bold' }}>
            A & B
          </span>
        </div>
        <span
          style={{
            position: 'absolute',
            top: 2,
            left: 3,
            fontSize: 9,
            color: bg,
            opacity: 0.8,
          }}
        >
          ✿
        </span>
        <span
          style={{
            position: 'absolute',
            top: 2,
            right: 3,
            fontSize: 9,
            color: bg,
            opacity: 0.8,
          }}
        >
          ❀
        </span>
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            left: 0,
            right: 0,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 7, color: accent }}>01.01.2025</div>
        </div>
      </div>
    );
  }

  if (style === 'vintage') {
    return (
      <div style={{ ...base, background: bg }}>
        <div
          style={{
            position: 'absolute',
            inset: 3,
            border: `1.5px dashed ${accent}`,
            borderRadius: 4,
            opacity: 0.6,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            transform: 'translateY(-50%)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 7,
              color: accent,
              letterSpacing: 1,
              opacity: 0.7,
            }}
          >
            ~ ~ ~
          </div>
          <div style={{ fontSize: 9, color: accent, fontWeight: 'bold' }}>
            A & B
          </div>
          <div
            style={{
              fontSize: 7,
              color: accent,
              letterSpacing: 1,
              opacity: 0.7,
            }}
          >
            ~ ~ ~
          </div>
        </div>
      </div>
    );
  }

  // Default: classic / modern / minimal / floral
  return (
    <div style={base}>
      {style === 'floral' && (
        <>
          <span
            style={{
              position: 'absolute',
              top: 3,
              left: 4,
              fontSize: 10,
              color: accent,
              opacity: 0.5,
            }}
          >
            ❀
          </span>
          <span
            style={{
              position: 'absolute',
              top: 3,
              right: 4,
              fontSize: 10,
              color: accent,
              opacity: 0.5,
            }}
          >
            ❀
          </span>
          <span
            style={{
              position: 'absolute',
              bottom: 3,
              left: 4,
              fontSize: 10,
              color: accent,
              opacity: 0.5,
            }}
          >
            ✿
          </span>
          <span
            style={{
              position: 'absolute',
              bottom: 3,
              right: 4,
              fontSize: 10,
              color: accent,
              opacity: 0.5,
            }}
          >
            ✿
          </span>
        </>
      )}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          transform: 'translateY(-50%)',
          textAlign: 'center',
        }}
      >
        {style === 'modern' && (
          <div
            style={{
              width: 24,
              height: 2,
              background: accent,
              margin: '0 auto 4px',
            }}
          />
        )}
        <div style={{ fontSize: 9, color: accent, fontWeight: 'bold' }}>
          A & B
        </div>
        <div
          style={{
            width: 30,
            height: 0.5,
            background: accent,
            margin: '3px auto',
          }}
        />
        <div style={{ fontSize: 7, color: accent, opacity: 0.7 }}>
          01.01.2025
        </div>
        {style === 'minimal' && (
          <div
            style={{
              width: 20,
              height: 0.5,
              background: accent,
              margin: '3px auto 0',
            }}
          />
        )}
      </div>
    </div>
  );
}

export default function StylePanel({ config, onChange }: Props) {
  return (
    <div className="space-y-6">
      {/* Template selection */}
      <div>
        <p className="mb-3 text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
          Mẫu thiệp
        </p>
        <div className="grid grid-cols-2 gap-2">
          {TEMPLATES.map((template) => {
            const active = config.templateId === template.id;
            return (
              <button
                key={template.id}
                onClick={() => onChange({ templateId: template.id })}
                className={`group flex flex-col overflow-hidden rounded-xl border-2 transition-all ${
                  active
                    ? 'border-blue-500 shadow-md'
                    : 'border-gray-100 hover:border-gray-300'
                }`}
              >
                <TemplateThumbnail
                  bg={template.thumbnail.bg}
                  accent={template.thumbnail.accent}
                  style={template.thumbnail.style}
                  active={active}
                />
                <div
                  className={`px-2 py-1.5 text-left ${active ? 'bg-blue-50' : 'bg-white'}`}
                >
                  <p
                    className={`text-[11px] font-semibold ${active ? 'text-blue-700' : 'text-gray-700'}`}
                  >
                    {template.name}
                  </p>
                  <p className="text-[9px] text-gray-400">
                    {template.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Color palettes */}
      <div>
        <p className="mb-2 text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
          Bảng màu
        </p>
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(COLOR_PALETTES).map(([key, palette]) => (
            <button
              key={key}
              onClick={() => onChange({ colorPalette: key })}
              title={key}
              className={`h-9 rounded-xl border-2 transition-all hover:scale-105 ${
                config.colorPalette === key
                  ? 'scale-105 border-gray-800 shadow-md'
                  : 'border-transparent'
              }`}
              style={{
                background: `linear-gradient(135deg, ${palette.primary} 50%, ${palette.accent} 50%)`,
              }}
            />
          ))}
        </div>
        <p className="mt-1.5 text-[10px] text-gray-400">
          Đang dùng: {config.colorPalette}
        </p>
      </div>

      {/* Font pairs — tổng thể */}
      <div>
        <p className="mb-2 text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
          Font chữ tổng thể
        </p>
        <div className="space-y-1.5">
          {Object.entries(FONT_PAIRS).map(([key, pair]) => {
            const active = config.fontPair === key;
            return (
              <button
                key={key}
                onClick={() => onChange({ fontPair: key })}
                className={`w-full rounded-xl border px-3 py-2 text-left transition-all ${
                  active
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                <p
                  style={{
                    fontFamily: `"${pair.heading}", serif`,
                    fontSize: 16,
                    lineHeight: 1.2,
                  }}
                  className={active ? 'text-blue-700' : 'text-gray-800'}
                >
                  {pair.heading}
                </p>
                <p
                  style={{
                    fontFamily: `"${pair.body}", sans-serif`,
                    fontSize: 11,
                  }}
                  className="mt-0.5 text-gray-400"
                >
                  {pair.body}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Font tên cô dâu chú rể */}
      <div>
        <p className="mb-2 text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
          Font tên cô dâu & chú rể
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {COUPLE_FONTS.map((font) => {
            const active = (config.fontCouple ?? '') === font;
            return (
              <button
                key={font}
                onClick={() => onChange({ fontCouple: font })}
                className={`rounded-xl border px-2 py-2.5 text-center transition-all ${
                  active
                    ? 'border-rose-400 bg-rose-50'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                <p
                  style={{
                    fontFamily: `"${font}", serif`,
                    fontSize: 15,
                    lineHeight: 1.2,
                  }}
                  className={active ? 'text-rose-700' : 'text-gray-800'}
                >
                  Lan & Khoa
                </p>
                <p
                  style={{ fontSize: 9 }}
                  className="mt-0.5 truncate text-gray-400"
                >
                  {font}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Font chương trình */}
      <div>
        <p className="mb-2 text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
          Font chương trình
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {SCHEDULE_FONTS.map((font) => {
            const active = (config.fontSchedule ?? '') === font;
            return (
              <button
                key={font}
                onClick={() => onChange({ fontSchedule: font })}
                className={`rounded-xl border px-2 py-2.5 text-center transition-all ${
                  active
                    ? 'border-indigo-400 bg-indigo-50'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                <p
                  style={{
                    fontFamily: `"${font}", sans-serif`,
                    fontSize: 13,
                    lineHeight: 1.3,
                  }}
                  className={active ? 'text-indigo-700' : 'text-gray-700'}
                >
                  08:00 Lễ thành hôn
                </p>
                <p
                  style={{ fontSize: 9 }}
                  className="mt-0.5 truncate text-gray-400"
                >
                  {font}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
