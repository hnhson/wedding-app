import TemplateRenderer from './TemplateRenderer';
import type { CardConfig, OverlayElement } from '@/types/card';

/**
 * CardView — read-only card renderer used on the invitation & preview pages.
 * Renders the template AND all overlay elements (images, rects, text)
 * that the user placed in the editor.
 */
export default function CardView({ config }: { config: CardConfig }) {
  const elements = config.overlayElements ?? [];

  return (
    <div className="relative">
      <TemplateRenderer config={config} />

      {/* Overlay elements */}
      {elements.length > 0 && (
        <div className="pointer-events-none absolute inset-0">
          {elements.map((el) => (
            <OverlayItem key={el.id} el={el} />
          ))}
        </div>
      )}
    </div>
  );
}

function OverlayItem({ el }: { el: OverlayElement }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: el.x,
        top: el.y,
        width: el.width,
        height: el.height,
        boxSizing: 'border-box',
      }}
    >
      {/* Image */}
      {el.type === 'image' && el.url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={el.url}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: el.objectFit ?? 'cover',
            display: 'block',
            borderRadius: el.borderRadius ?? 0,
            opacity: el.opacity ?? 1,
            transform: `scaleX(${el.flipH ? -1 : 1}) scaleY(${el.flipV ? -1 : 1})`,
            filter:
              [
                el.brightness !== undefined && el.brightness !== 100
                  ? `brightness(${el.brightness}%)`
                  : '',
                el.contrast !== undefined && el.contrast !== 100
                  ? `contrast(${el.contrast}%)`
                  : '',
                el.grayscale ? `grayscale(${el.grayscale}%)` : '',
                el.sepia ? `sepia(${el.sepia}%)` : '',
                el.blur ? `blur(${el.blur}px)` : '',
              ]
                .filter(Boolean)
                .join(' ') || undefined,
            outline:
              el.borderWidth && el.borderWidth > 0
                ? `${el.borderWidth}px solid ${el.borderColor ?? '#ffffff'}`
                : undefined,
            outlineOffset:
              el.borderWidth && el.borderWidth > 0
                ? -el.borderWidth
                : undefined,
          }}
        />
      )}

      {/* Rect */}
      {el.type === 'rect' && (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: el.backgroundColor ?? '#ffffff',
            borderRadius: el.borderRadius ?? 0,
            opacity: el.opacity ?? 1,
            outline:
              el.borderWidth && el.borderWidth > 0
                ? `${el.borderWidth}px solid ${el.borderColor ?? '#ffffff'}`
                : undefined,
            outlineOffset:
              el.borderWidth && el.borderWidth > 0
                ? -el.borderWidth
                : undefined,
          }}
        />
      )}

      {/* Text */}
      {el.type === 'text' && (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent:
              el.textAlign === 'left'
                ? 'flex-start'
                : el.textAlign === 'right'
                  ? 'flex-end'
                  : 'center',
            padding: 4,
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          <p
            style={{
              fontSize: el.fontSize ?? 24,
              fontFamily: el.fontFamily ?? 'inherit',
              fontWeight: el.fontWeight ?? 'normal',
              fontStyle: el.fontStyle ?? 'normal',
              color: el.color ?? '#1a1714',
              textAlign: el.textAlign ?? 'center',
              lineHeight: el.lineHeight ?? 1.4,
              letterSpacing: el.letterSpacing
                ? `${el.letterSpacing}px`
                : undefined,
              opacity: el.opacity ?? 1,
              margin: 0,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              width: '100%',
            }}
          >
            {el.text}
          </p>
        </div>
      )}
    </div>
  );
}
