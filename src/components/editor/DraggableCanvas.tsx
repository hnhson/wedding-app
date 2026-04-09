'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import TemplateRenderer from '@/components/templates/TemplateRenderer';
import type { CardConfig, OverlayElement } from '@/types/card';

type Dir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

const HANDLES: { dir: Dir; style: React.CSSProperties }[] = [
  { dir: 'nw', style: { top: -5,    left: -5,                                       cursor: 'nw-resize' } },
  { dir: 'n',  style: { top: -5,    left: '50%', transform: 'translateX(-50%)',     cursor: 'n-resize'  } },
  { dir: 'ne', style: { top: -5,    right: -5,                                      cursor: 'ne-resize' } },
  { dir: 'e',  style: { top: '50%', right: -5,   transform: 'translateY(-50%)',     cursor: 'e-resize'  } },
  { dir: 'se', style: { bottom: -5, right: -5,                                      cursor: 'se-resize' } },
  { dir: 's',  style: { bottom: -5, left: '50%', transform: 'translateX(-50%)',     cursor: 's-resize'  } },
  { dir: 'sw', style: { bottom: -5, left: -5,                                       cursor: 'sw-resize' } },
  { dir: 'w',  style: { top: '50%', left: -5,    transform: 'translateY(-50%)',     cursor: 'w-resize'  } },
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
  snapshot: OverlayElement[]; // all elements at drag-start
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
  scale,
  selectedId,
  onSelect,
  onUpdateElements,
}: Props) {
  const elements = config.overlayElements ?? [];
  const dragRef = useRef<DragState | null>(null);

  /* ── Global mouse handlers ── */
  useEffect(() => {
    function onMove(e: MouseEvent) {
      const d = dragRef.current;
      if (!d) return;

      // All deltas are in card-space (divide viewport delta by scale)
      const dx = (e.clientX - d.startMX) / scale;
      const dy = (e.clientY - d.startMY) / scale;

      const next = d.snapshot.map((el) => {
        if (el.id !== d.id) return el;

        if (d.type === 'drag') {
          return { ...el, x: d.startX + dx, y: d.startY + dy };
        }

        // resize: compute new x/y/w/h from start state + delta
        let x = d.startX, y = d.startY, w = d.startW, h = d.startH;
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
    }

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [scale, onUpdateElements]);

  /* ── Drag start ── */
  function startDrag(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    e.preventDefault();
    const el = elements.find((x) => x.id === id)!;
    dragRef.current = {
      type: 'drag', id,
      startMX: e.clientX, startMY: e.clientY,
      startX: el.x, startY: el.y,
      startW: el.width, startH: el.height,
      snapshot: elements,
    };
    onSelect(id);
  }

  /* ── Resize start ── */
  function startResize(e: React.MouseEvent, id: string, dir: Dir) {
    e.stopPropagation();
    e.preventDefault();
    const el = elements.find((x) => x.id === id)!;
    dragRef.current = {
      type: 'resize', id, dir,
      startMX: e.clientX, startMY: e.clientY,
      startX: el.x, startY: el.y,
      startW: el.width, startH: el.height,
      snapshot: elements,
    };
  }

  /* ── Delete ── */
  function deleteEl(id: string) {
    onUpdateElements(elements.filter((e) => e.id !== id));
    onSelect(null);
  }

  return (
    <div className="relative select-none" onClick={() => onSelect(null)}>
      {/* Template */}
      <TemplateRenderer config={config} />

      {/* Overlay — pointer-events: none so template links still work; each element opts back in */}
      <div className="absolute inset-0" style={{ pointerEvents: 'none' }}>
        {elements.map((el) => {
          const sel = selectedId === el.id;
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
                  : '1.5px dashed rgba(0,0,0,0.18)',
                outlineOffset: sel ? 1 : 0,
                cursor: 'move',
                boxSizing: 'border-box',
              }}
              onMouseDown={(e) => startDrag(e, el.id)}
              onClick={(e) => { e.stopPropagation(); onSelect(el.id); }}
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
                  onClick={(e) => { e.stopPropagation(); deleteEl(el.id); }}
                  style={{ position: 'absolute', top: -12, right: -12, zIndex: 20 }}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 transition-colors"
                >
                  <X size={10} />
                </button>
              )}

              {/* Resize handles */}
              {sel && HANDLES.map(({ dir, style }) => (
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
