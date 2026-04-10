'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Move } from 'lucide-react';
import TemplateRenderer from '@/components/templates/TemplateRenderer';
import type { CardConfig, OverlayElement } from '@/types/card';

type Dir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

const CARD_NATURAL_W = 480; // natural width of the card in px (before CSS scale)

const HANDLES: { dir: Dir; style: React.CSSProperties }[] = [
  { dir: 'nw', style: { top: -5, left: -5, cursor: 'nw-resize' } },
  {
    dir: 'n',
    style: {
      top: -5,
      left: '50%',
      transform: 'translateX(-50%)',
      cursor: 'n-resize',
    },
  },
  { dir: 'ne', style: { top: -5, right: -5, cursor: 'ne-resize' } },
  {
    dir: 'e',
    style: {
      top: '50%',
      right: -5,
      transform: 'translateY(-50%)',
      cursor: 'e-resize',
    },
  },
  { dir: 'se', style: { bottom: -5, right: -5, cursor: 'se-resize' } },
  {
    dir: 's',
    style: {
      bottom: -5,
      left: '50%',
      transform: 'translateX(-50%)',
      cursor: 's-resize',
    },
  },
  { dir: 'sw', style: { bottom: -5, left: -5, cursor: 'sw-resize' } },
  {
    dir: 'w',
    style: {
      top: '50%',
      left: -5,
      transform: 'translateY(-50%)',
      cursor: 'w-resize',
    },
  },
];

interface DragState {
  type: 'drag' | 'resize';
  id: string;
  dir?: Dir;
  startMX: number;
  startMY: number;
  startX: number;
  startY: number;
  startW: number;
  startH: number;
  snapshot: OverlayElement[];
  /** actual px-per-card-unit at drag start, computed from getBoundingClientRect */
  pxPerUnit: number;
}

interface Props {
  config: CardConfig;
  scale: number;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdateElements: (elements: OverlayElement[]) => void;
}

export default function DraggableCanvas({
  config,
  selectedId,
  onSelect,
  onUpdateElements,
}: Props) {
  const elements = config.overlayElements ?? [];
  const dragRef = useRef<DragState | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  /** Compute the current px-per-card-unit from the element's actual rendered size */
  function getPxPerUnit(): number {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return 1;
    return rect.width / CARD_NATURAL_W;
  }

  /* ── Global move/up handlers ── */
  useEffect(() => {
    function getXY(e: MouseEvent | TouchEvent) {
      if ('touches' in e && e.touches.length > 0) {
        return { x: e.touches[0]!.clientX, y: e.touches[0]!.clientY };
      }
      if ('clientX' in e) return { x: e.clientX, y: e.clientY };
      return { x: 0, y: 0 };
    }

    function onMove(e: MouseEvent | TouchEvent) {
      const d = dragRef.current;
      if (!d) return;
      if ('touches' in e) e.preventDefault();

      const { x: cx, y: cy } = getXY(e);
      // convert viewport delta → card-space delta using the scale captured at drag-start
      const dx = (cx - d.startMX) / d.pxPerUnit;
      const dy = (cy - d.startMY) / d.pxPerUnit;

      const next = d.snapshot.map((el) => {
        if (el.id !== d.id) return el;

        if (d.type === 'drag') {
          return { ...el, x: d.startX + dx, y: d.startY + dy };
        }

        // resize
        let x = d.startX,
          y = d.startY,
          w = d.startW,
          h = d.startH;
        const dir = d.dir!;

        if (dir.includes('e')) w = Math.max(40, d.startW + dx);
        if (dir.includes('s')) h = Math.max(40, d.startH + dy);
        if (dir.includes('w')) {
          w = Math.max(40, d.startW - dx);
          x = d.startX + d.startW - w;
        }
        if (dir.includes('n')) {
          h = Math.max(40, d.startH - dy);
          y = d.startY + d.startH - h;
        }

        return { ...el, x, y, width: w, height: h };
      });

      onUpdateElements(next);
    }

    function onUp() {
      dragRef.current = null;
      setDraggingId(null);
    }

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove as EventListener, {
      passive: false,
    });
    window.addEventListener('touchend', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove as EventListener);
      window.removeEventListener('touchend', onUp);
    };
  }, [onUpdateElements]);

  /* ── Drag start (mouse) ── */
  function startDrag(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    e.preventDefault();
    const el = elements.find((x) => x.id === id)!;
    dragRef.current = {
      type: 'drag',
      id,
      startMX: e.clientX,
      startMY: e.clientY,
      startX: el.x,
      startY: el.y,
      startW: el.width,
      startH: el.height,
      snapshot: [...elements],
      pxPerUnit: getPxPerUnit(),
    };
    setDraggingId(id);
    onSelect(id);
  }

  /* ── Drag start (touch) ── */
  function startDragTouch(e: React.TouchEvent, id: string) {
    e.stopPropagation();
    const touch = e.touches[0];
    if (!touch) return;
    const el = elements.find((x) => x.id === id)!;
    dragRef.current = {
      type: 'drag',
      id,
      startMX: touch.clientX,
      startMY: touch.clientY,
      startX: el.x,
      startY: el.y,
      startW: el.width,
      startH: el.height,
      snapshot: [...elements],
      pxPerUnit: getPxPerUnit(),
    };
    setDraggingId(id);
    onSelect(id);
  }

  /* ── Resize start ── */
  function startResize(e: React.MouseEvent, id: string, dir: Dir) {
    e.stopPropagation();
    e.preventDefault();
    const el = elements.find((x) => x.id === id)!;
    dragRef.current = {
      type: 'resize',
      id,
      dir,
      startMX: e.clientX,
      startMY: e.clientY,
      startX: el.x,
      startY: el.y,
      startW: el.width,
      startH: el.height,
      snapshot: [...elements],
      pxPerUnit: getPxPerUnit(),
    };
  }

  /* ── Delete ── */
  function deleteEl(id: string) {
    onUpdateElements(elements.filter((e) => e.id !== id));
    onSelect(null);
  }

  return (
    <div
      ref={rootRef}
      className="relative select-none"
      onClick={() => onSelect(null)}
    >
      {/* Template base */}
      <TemplateRenderer config={config} />

      {/* Overlay */}
      <div className="absolute inset-0" style={{ pointerEvents: 'none' }}>
        {elements.map((el) => {
          const sel = selectedId === el.id;
          const dragging = draggingId === el.id;

          return (
            <div
              key={el.id}
              style={{
                position: 'absolute',
                left: el.x,
                top: el.y,
                width: el.width,
                height: el.height,
                pointerEvents: 'auto',
                outline: sel
                  ? '2px solid #3b82f6'
                  : '1.5px dashed rgba(59,130,246,0.45)',
                outlineOffset: sel ? 1 : 0,
                cursor: dragging ? 'grabbing' : 'grab',
                boxSizing: 'border-box',
              }}
              onMouseDown={(e) => startDrag(e, el.id)}
              onTouchStart={(e) => startDragTouch(e, el.id)}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(el.id);
              }}
            >
              {/* Image */}
              <img
                src={el.url}
                alt=""
                draggable={false}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              />

              {/* Delete button */}
              {sel && (
                <button
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteEl(el.id);
                  }}
                  style={{
                    position: 'absolute',
                    top: -12,
                    right: -12,
                    zIndex: 20,
                  }}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-colors hover:bg-red-600"
                >
                  <X size={10} />
                </button>
              )}

              {/* Move handle (top-left, shown when selected) */}
              {sel && (
                <div
                  style={{
                    position: 'absolute',
                    top: -12,
                    left: -12,
                    zIndex: 20,
                    background: '#3b82f6',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: dragging ? 'grabbing' : 'grab',
                    color: '#fff',
                  }}
                  onMouseDown={(e) => startDrag(e, el.id)}
                  onTouchStart={(e) => startDragTouch(e, el.id)}
                >
                  <Move size={12} />
                </div>
              )}

              {/* Resize handles */}
              {sel &&
                HANDLES.map(({ dir, style }) => (
                  <div
                    key={dir}
                    onMouseDown={(e) => startResize(e, el.id, dir)}
                    style={{
                      position: 'absolute',
                      width: 10,
                      height: 10,
                      background: '#fff',
                      border: '2px solid #3b82f6',
                      borderRadius: 2,
                      zIndex: 20,
                      ...style,
                    }}
                  />
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
