'use client';

import { useRef, useState, useEffect } from 'react';
import { X, Move } from 'lucide-react';
import TemplateRenderer from '@/components/templates/TemplateRenderer';
import type { CardConfig, OverlayElement } from '@/types/card';

type Dir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

const CARD_NATURAL_W = 480;

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

interface DragOp {
  type: 'drag' | 'resize';
  id: string;
  dir?: Dir;
  startPX: number; // pointer x at drag-start (client space)
  startPY: number; // pointer y at drag-start (client space)
  startX: number; // element x at drag-start (card space)
  startY: number;
  startW: number;
  startH: number;
  snapshot: OverlayElement[];
  pxPerUnit: number; // card-space px per viewport px (from getBoundingClientRect)
}

interface Props {
  config: CardConfig;
  scale: number;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdateElements: (elements: OverlayElement[]) => void;
}

// Inline text editor rendered inside a text overlay element
function TextEditor({
  el,
  onCommit,
  onClose,
}: {
  el: OverlayElement;
  onCommit: (text: string) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [val, setVal] = useState(el.text ?? '');

  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);

  function commit() {
    onCommit(val);
    onClose();
  }

  return (
    <textarea
      ref={ref}
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onClose();
          e.preventDefault();
        }
        // Ctrl/Cmd+Enter commits
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
          commit();
          e.preventDefault();
        }
        e.stopPropagation();
      }}
      onPointerDown={(e) => e.stopPropagation()}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        resize: 'none',
        background: 'rgba(255,255,255,0.15)',
        border: '2px solid #3b82f6',
        borderRadius: el.borderRadius ?? 0,
        outline: 'none',
        padding: 4,
        fontSize: el.fontSize ?? 24,
        fontFamily: el.fontFamily ?? 'inherit',
        fontWeight: el.fontWeight ?? 'normal',
        fontStyle: el.fontStyle ?? 'normal',
        color: el.color ?? '#1a1714',
        textAlign: el.textAlign ?? 'center',
        lineHeight: el.lineHeight ?? 1.4,
        letterSpacing: el.letterSpacing ? `${el.letterSpacing}px` : undefined,
        caretColor: el.color ?? '#1a1714',
        backdropFilter: 'none',
      }}
    />
  );
}

export default function DraggableCanvas({
  config,
  selectedId,
  onSelect,
  onUpdateElements,
}: Props) {
  const elements = config.overlayElements ?? [];
  const rootRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragOp | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  function pxPerUnit() {
    const rect = rootRef.current?.getBoundingClientRect();
    return rect && rect.width > 0 ? rect.width / CARD_NATURAL_W : 1;
  }

  // ── Pointer down on element body → drag ──
  function onElPointerDown(e: React.PointerEvent, id: string) {
    e.stopPropagation();
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    const el = elements.find((x) => x.id === id)!;
    dragRef.current = {
      type: 'drag',
      id,
      startPX: e.clientX,
      startPY: e.clientY,
      startX: el.x,
      startY: el.y,
      startW: el.width,
      startH: el.height,
      snapshot: [...elements],
      pxPerUnit: pxPerUnit(),
    };
    setActiveId(id);
    onSelect(id);
  }

  // ── Pointer down on resize handle ──
  function onHandlePointerDown(e: React.PointerEvent, id: string, dir: Dir) {
    e.stopPropagation();
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    const el = elements.find((x) => x.id === id)!;
    dragRef.current = {
      type: 'resize',
      id,
      dir,
      startPX: e.clientX,
      startPY: e.clientY,
      startX: el.x,
      startY: el.y,
      startW: el.width,
      startH: el.height,
      snapshot: [...elements],
      pxPerUnit: pxPerUnit(),
    };
  }

  // ── Pointer move (fired on the element that captured the pointer) ──
  function onPointerMove(e: React.PointerEvent) {
    const d = dragRef.current;
    if (!d) return;

    const dx = (e.clientX - d.startPX) / d.pxPerUnit;
    const dy = (e.clientY - d.startPY) / d.pxPerUnit;

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

  // ── Pointer up ──
  function onPointerUp(e: React.PointerEvent) {
    dragRef.current = null;
    setActiveId(null);
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  }

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
      <TemplateRenderer config={config} />

      {/* Overlay — pointer-events:none on container, each element opts back in */}
      <div className="absolute inset-0" style={{ pointerEvents: 'none' }}>
        {elements.map((el) => {
          const sel = selectedId === el.id;
          const dragging = activeId === el.id;

          const isEditing = editingId === el.id;

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
                touchAction: 'none',
                outline: isEditing
                  ? 'none'
                  : sel
                    ? '2px solid #3b82f6'
                    : '1.5px dashed rgba(59,130,246,0.5)',
                outlineOffset: sel ? 1 : 0,
                cursor: isEditing ? 'text' : dragging ? 'grabbing' : 'grab',
                boxSizing: 'border-box',
                userSelect: 'none',
                zIndex: sel || isEditing ? 10 : 1,
              }}
              onPointerDown={(e) => {
                if (isEditing) return;
                onElPointerDown(e, el.id);
              }}
              onPointerMove={(e) => {
                if (isEditing) return;
                onPointerMove(e);
              }}
              onPointerUp={(e) => {
                if (isEditing) return;
                onPointerUp(e);
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(el.id);
              }}
              onDoubleClick={(e) => {
                if (el.type !== 'text') return;
                e.stopPropagation();
                setEditingId(el.id);
              }}
            >
              {/* ── Image ── */}
              {el.type === 'image' && el.url && (
                <img
                  src={el.url}
                  alt=""
                  draggable={false}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: el.objectFit ?? 'cover',
                    display: 'block',
                    pointerEvents: 'none',
                    userSelect: 'none',
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

              {/* ── Rect ── */}
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
                    pointerEvents: 'none',
                  }}
                />
              )}

              {/* ── Text ── */}
              {el.type === 'text' && !isEditing && (
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
                    pointerEvents: 'none',
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
                    {el.text || (sel ? '✎ Nhấn đúp để sửa' : '')}
                  </p>
                </div>
              )}

              {/* ── Inline text editor ── */}
              {el.type === 'text' && isEditing && (
                <TextEditor
                  el={el}
                  onCommit={(text) => {
                    onUpdateElements(
                      elements.map((x) =>
                        x.id === el.id ? { ...x, text } : x,
                      ),
                    );
                  }}
                  onClose={() => setEditingId(null)}
                />
              )}

              {/* Delete button */}
              {sel && (
                <button
                  onPointerDown={(e) => e.stopPropagation()}
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
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600"
                >
                  <X size={10} />
                </button>
              )}

              {/* Move handle */}
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
                    pointerEvents: 'auto',
                    touchAction: 'none',
                  }}
                  onPointerDown={(e) => onElPointerDown(e, el.id)}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                >
                  <Move size={12} />
                </div>
              )}

              {/* Resize handles */}
              {sel &&
                HANDLES.map(({ dir, style }) => (
                  <div
                    key={dir}
                    style={{
                      position: 'absolute',
                      width: 10,
                      height: 10,
                      background: '#fff',
                      border: '2px solid #3b82f6',
                      borderRadius: 2,
                      zIndex: 20,
                      pointerEvents: 'auto',
                      touchAction: 'none',
                      ...style,
                    }}
                    onPointerDown={(e) => onHandlePointerDown(e, el.id, dir)}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                  />
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
