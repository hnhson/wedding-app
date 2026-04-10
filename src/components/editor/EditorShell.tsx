'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { GripHorizontal } from 'lucide-react';
import Link from 'next/link';
import type { Card, CardConfig, OverlayElement } from '@/types/card';
import DraggableCanvas from './DraggableCanvas';
import ContentPanel from './ContentPanel';
import StylePanel from './StylePanel';
import MediaPanel from './MediaPanel';
import MapPanel from './MapPanel';
import { FONT_PAIRS } from '@/lib/templates/presets';
import {
  FileText,
  Palette,
  ImageIcon,
  MapPin,
  Shapes,
  Type,
  Music,
  Eye,
  Share2,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Save,
  ExternalLink,
} from 'lucide-react';
import type { MusicConfig } from '@/types/card';

type Tab = 'content' | 'style' | 'media' | 'map' | 'decor' | 'text' | 'music';

const TOOLS: { id: Tab; icon: React.ReactNode; label: string }[] = [
  { id: 'content', icon: <FileText size={19} />, label: 'Nội dung' },
  { id: 'style', icon: <Palette size={19} />, label: 'Phong cách' },
  { id: 'media', icon: <ImageIcon size={19} />, label: 'Ảnh & Media' },
  { id: 'map', icon: <MapPin size={19} />, label: 'Địa điểm' },
  { id: 'text', icon: <Type size={19} />, label: 'Văn bản' },
  { id: 'music', icon: <Music size={19} />, label: 'Nhạc' },
  { id: 'decor', icon: <Shapes size={19} />, label: 'Trang trí' },
];

export default function EditorShell({ card }: { card: Card }) {
  const [config, setConfig] = useState<CardConfig>(card.config);
  const [activeTab, setActiveTab] = useState<Tab | null>('content');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>(
    'saved',
  );
  const [copied, setCopied] = useState(false);
  const [scale, setScale] = useState(0.38);
  const [selectedElId, setSelectedElId] = useState<string | null>(null);
  const autoSaveRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const canvasRef = useRef<HTMLDivElement>(null);

  const slug = card.slug;
  const coupleName =
    config.coupleNames.partner1 && config.coupleNames.partner2
      ? `${config.coupleNames.partner1} & ${config.coupleNames.partner2}`
      : 'Thiệp cưới';

  // Load Google Font
  useEffect(() => {
    const fp = FONT_PAIRS[config.fontPair];
    if (!fp) return;
    const id = `font-${config.fontPair}`;
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    const fams = [
      `${fp.heading.replace(/ /g, '+')}:wght@400;700`,
      `${fp.body.replace(/ /g, '+')}:wght@400;600`,
    ].join('&family=');
    link.href = `https://fonts.googleapis.com/css2?family=${fams}&display=swap`;
    document.head.appendChild(link);
  }, [config.fontPair]);

  const save = useCallback(
    async (cfg: CardConfig) => {
      setSaveStatus('saving');
      try {
        await fetch(`/api/cards/${card.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ config: cfg }),
        });
        setSaveStatus('saved');
      } catch {
        setSaveStatus('unsaved');
      }
    },
    [card.id],
  );

  useEffect(() => {
    clearTimeout(autoSaveRef.current);
    autoSaveRef.current = setTimeout(() => {
      setSaveStatus('unsaved');
      save(config);
    }, 500);
    return () => clearTimeout(autoSaveRef.current);
  }, [config, save]);

  useEffect(() => {
    const h = () => {
      if (saveStatus === 'unsaved')
        navigator.sendBeacon(
          `/api/cards/${card.id}`,
          JSON.stringify({ config }),
        );
    };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [config, card.id, saveStatus]);

  // Auto-scale canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    const obs = new ResizeObserver(([e]) => {
      const w = e?.contentRect.width ?? 600;
      setScale(Math.min(0.6, Math.max(0.25, (w - 80) / 480)));
    });
    obs.observe(canvasRef.current);
    return () => obs.disconnect();
  }, []);

  function updateConfig(patch: Partial<CardConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  const updateElements = useCallback((elements: OverlayElement[]) => {
    setConfig((prev) => ({ ...prev, overlayElements: elements }));
  }, []);

  /**
   * Returns the Y coordinate (in card-space px) of the center of the
   * currently visible portion of the canvas.  Used so newly added
   * elements appear where the user is looking instead of at the top.
   *
   * Layout inside canvasRef (overflow-y-auto):
   *   40px  — py-10 top padding
   *   48px  — mt-10 on card wrapper  (40px) + zoom bar overlap (~8px)
   *   card  — scaled by `scale`, origin top-center
   */
  function getVisibleCenterY(): number {
    const el = canvasRef.current;
    if (!el) return 300;
    // Approximate top of the card within the scrollable canvas
    const CARD_OFFSET_PX = 88; // py-10 (40) + mt-10 (40) + a little for zoom bar
    const visibleCenterInCanvas = el.scrollTop + el.clientHeight / 2;
    const cardSpaceY = (visibleCenterInCanvas - CARD_OFFSET_PX) / scale;
    return Math.max(0, Math.round(cardSpaceY));
  }

  function updateElement(id: string, patch: Partial<OverlayElement>) {
    setConfig((prev) => ({
      ...prev,
      overlayElements: (prev.overlayElements ?? []).map((el) =>
        el.id === id ? { ...el, ...patch } : el,
      ),
    }));
  }

  function addToCanvas(url: string) {
    const CARD_W = 480;
    const imgSize = 200;
    const centerY = getVisibleCenterY();
    setConfig((prev) => {
      const existing = prev.overlayElements ?? [];
      const offset = (existing.length % 5) * 24;
      const newEl: OverlayElement = {
        id: `el-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: 'image',
        url,
        x: Math.round((CARD_W - imgSize) / 2) + offset,
        y: Math.round(centerY - imgSize / 2) + offset,
        width: imgSize,
        height: imgSize,
      };
      setSelectedElId(newEl.id);
      return { ...prev, overlayElements: [...existing, newEl] };
    });
    setActiveTab(null);
  }

  function addRect(opts: {
    backgroundColor: string;
    borderRadius: number;
    opacity: number;
    width: number;
    height: number;
  }) {
    const CARD_W = 480;
    const centerY = getVisibleCenterY();
    setConfig((prev) => {
      const existing = prev.overlayElements ?? [];
      const offset = (existing.length % 5) * 20;
      const newEl: OverlayElement = {
        id: `el-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: 'rect',
        backgroundColor: opts.backgroundColor,
        borderRadius: opts.borderRadius,
        opacity: opts.opacity,
        x: Math.round((CARD_W - opts.width) / 2) + offset,
        y: Math.round(centerY - opts.height / 2) + offset,
        width: opts.width,
        height: opts.height,
      };
      setSelectedElId(newEl.id);
      return { ...prev, overlayElements: [...existing, newEl] };
    });
    setActiveTab(null);
  }

  function addText(opts: {
    text: string;
    fontSize: number;
    fontFamily: string;
    color: string;
    fontWeight: 'normal' | 'bold';
    fontStyle: 'normal' | 'italic';
    textAlign: 'left' | 'center' | 'right';
  }) {
    const CARD_W = 480;
    const centerY = getVisibleCenterY();
    setConfig((prev) => {
      const existing = prev.overlayElements ?? [];
      const offset = (existing.length % 5) * 24;
      const elH = Math.max(48, opts.fontSize * 2.2);
      const newEl: OverlayElement = {
        id: `el-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: 'text',
        text: opts.text,
        fontSize: opts.fontSize,
        fontFamily: opts.fontFamily,
        color: opts.color,
        fontWeight: opts.fontWeight,
        fontStyle: opts.fontStyle,
        textAlign: opts.textAlign,
        x: Math.round((CARD_W - 320) / 2) + offset,
        y: Math.round(centerY - elH / 2) + offset,
        width: 320,
        height: elH,
      };
      setSelectedElId(newEl.id);
      return { ...prev, overlayElements: [...existing, newEl] };
    });
    setActiveTab(null);
  }

  function toggleTab(tab: Tab) {
    setActiveTab((prev) => (prev === tab ? null : tab));
  }

  function copyLink() {
    const url = `${window.location.origin}/invitation/${slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const PANEL_W = 296;

  return (
    <div
      className="flex overflow-hidden"
      style={{ height: 'calc(100vh - 49px)', background: '#f0f0f0' }}
    >
      {/* ── 1. Icon toolbar ── */}
      <div className="z-10 flex w-14 flex-shrink-0 flex-col items-center gap-0.5 border-r border-gray-200 bg-white py-3">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => toggleTab(tool.id)}
            title={tool.label}
            className={`group relative flex h-12 w-12 flex-col items-center justify-center gap-0.5 rounded-xl text-[10px] transition-all ${
              activeTab === tool.id
                ? 'bg-gray-900 text-white'
                : 'text-gray-400 hover:bg-gray-100 hover:text-gray-800'
            }`}
          >
            {tool.icon}
            <span className="leading-none">{tool.label.split(' ')[0]}</span>
            {/* Tooltip */}
            <span className="pointer-events-none absolute left-[54px] z-50 rounded-lg bg-gray-900 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              {tool.label}
            </span>
          </button>
        ))}

        <div className="my-2 h-px w-8 bg-gray-100" />

        <Link
          href="/dashboard"
          title="Về dashboard"
          className="group relative flex h-12 w-12 flex-col items-center justify-center gap-0.5 rounded-xl text-[10px] text-gray-400 hover:bg-gray-100 hover:text-gray-800"
        >
          <ChevronLeft size={19} />
          <span>Về</span>
          <span className="pointer-events-none absolute left-[54px] z-50 rounded-lg bg-gray-900 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
            Về dashboard
          </span>
        </Link>
      </div>

      {/* ── 2. Sliding edit panel ── */}
      <div
        className="flex-shrink-0 overflow-hidden border-r border-gray-200 bg-white transition-[width] duration-200 ease-in-out"
        style={{ width: activeTab ? PANEL_W : 0 }}
      >
        <div className="flex h-full flex-col" style={{ width: PANEL_W }}>
          <div className="flex items-center justify-between border-b px-4 py-2.5">
            <span className="text-xs font-semibold text-gray-700">
              {TOOLS.find((t) => t.id === activeTab)?.label}
            </span>
            <button
              onClick={() => setActiveTab(null)}
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
            >
              <ChevronLeft size={15} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'content' && (
              <ContentPanel config={config} onChange={updateConfig} />
            )}
            {activeTab === 'style' && (
              <StylePanel config={config} onChange={updateConfig} />
            )}
            {activeTab === 'media' && (
              <MediaPanel
                config={config}
                onChange={updateConfig}
                cardId={card.id}
                onAddToCanvas={addToCanvas}
              />
            )}
            {activeTab === 'map' && (
              <MapPanel config={config} onChange={updateConfig} />
            )}
            {activeTab === 'text' && <TextPanel addText={addText} />}
            {activeTab === 'music' && (
              <MusicPanel
                music={config.music}
                onChange={(m) => updateConfig({ music: m })}
              />
            )}
            {activeTab === 'decor' && (
              <DecorPanel
                cardHeight={config.cardHeight ?? 900}
                onChangeHeight={(h) => updateConfig({ cardHeight: h })}
                addRect={addRect}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── 3. Canvas ── */}
      <div
        ref={canvasRef}
        className="relative flex flex-1 flex-col items-center overflow-y-auto py-10"
        style={{
          background: '#e4e4e4',
          backgroundImage: 'radial-gradient(#c8c8c8 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      >
        {/* Zoom controls */}
        <div className="absolute top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border border-gray-200 bg-white/95 px-3 py-1.5 text-xs text-gray-600 shadow-sm backdrop-blur-sm">
          <button
            onClick={() =>
              setScale((s) => Math.max(0.2, +(s - 0.05).toFixed(2)))
            }
            className="flex h-5 w-5 items-center justify-center rounded hover:bg-gray-100"
          >
            −
          </button>
          <span className="w-10 text-center font-medium">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => setScale((s) => Math.min(1, +(s + 0.05).toFixed(2)))}
            className="flex h-5 w-5 items-center justify-center rounded hover:bg-gray-100"
          >
            +
          </button>
        </div>

        {/* Card — draggable canvas */}
        <div
          className="mt-10"
          style={{
            transformOrigin: 'top center',
            transform: `scale(${scale})`,
            width: 480,
          }}
        >
          <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
            <DraggableCanvas
              config={config}
              scale={scale}
              selectedId={selectedElId}
              onSelect={setSelectedElId}
              onUpdateElements={updateElements}
            />
          </div>

          {/* Height resize handle */}
          <HeightHandle
            scale={scale}
            cardHeight={config.cardHeight ?? 900}
            onChange={(h) => updateConfig({ cardHeight: h })}
          />
        </div>

        {/* Padding at bottom so content isn't cut */}
        <div style={{ height: Math.max(40, 480 * scale + 80) }} />
      </div>

      {/* ── 4. Right panel ── */}
      <div className="flex w-60 flex-shrink-0 flex-col border-l border-gray-200 bg-white">
        {/* Image edit panel — shown when an image element is selected */}
        {selectedElId &&
          (() => {
            const el = (config.overlayElements ?? []).find(
              (e) => e.id === selectedElId,
            );
            if (!el) return null;
            return (
              <ImageEditPanel
                el={el}
                onChange={(patch) => updateElement(selectedElId, patch)}
                onDelete={() => {
                  updateElements(
                    (config.overlayElements ?? []).filter(
                      (e) => e.id !== selectedElId,
                    ),
                  );
                  setSelectedElId(null);
                }}
              />
            );
          })()}

        {/* Save status */}
        <div className="flex h-10 items-center gap-2 border-b px-4">
          {saveStatus === 'saving' && (
            <>
              <Save size={12} className="animate-pulse text-amber-500" />
              <span className="text-xs text-amber-600">Đang lưu...</span>
            </>
          )}
          {saveStatus === 'saved' && (
            <>
              <Check size={12} className="text-green-500" />
              <span className="text-xs text-green-600">Đã lưu tự động</span>
            </>
          )}
          {saveStatus === 'unsaved' && (
            <>
              <Save size={12} className="text-gray-400" />
              <span className="text-xs text-gray-400">Chưa lưu</span>
            </>
          )}
        </div>

        <div className="flex-1 divide-y divide-gray-100 overflow-y-auto">
          {/* Card info */}
          <div className="px-4 py-3">
            <p className="mb-1.5 text-[9px] font-bold tracking-widest text-gray-400 uppercase">
              Thông tin
            </p>
            <p className="truncate text-sm font-semibold text-gray-900">
              {coupleName}
            </p>
            {config.weddingDate && (
              <p className="mt-0.5 text-xs text-gray-400">
                {new Date(config.weddingDate).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </p>
            )}
          </div>

          {/* Mini preview thumbnail */}
          <div className="px-4 py-3">
            <p className="mb-2 text-[9px] font-bold tracking-widest text-gray-400 uppercase">
              Bản xem trước
            </p>
            <div
              className="relative cursor-pointer overflow-hidden rounded-xl border border-gray-100 bg-gray-50 transition-colors hover:border-gray-300"
              style={{ height: 164 }}
              onClick={() => window.open(`/cards/${card.id}/preview`, '_blank')}
            >
              <div
                style={{
                  transform: 'scale(0.195)',
                  transformOrigin: 'top left',
                  width: '512%',
                  pointerEvents: 'none',
                }}
              >
                <div style={{ width: 480 }}>
                  <DraggableCanvas
                    config={config}
                    scale={0.195}
                    selectedId={null}
                    onSelect={() => {}}
                    onUpdateElements={() => {}}
                  />
                </div>
              </div>
              <div className="absolute inset-0 flex items-end justify-center bg-black/10 pb-2 opacity-0 transition-opacity hover:opacity-100">
                <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-gray-700 shadow">
                  Xem đầy đủ
                </span>
              </div>
            </div>
          </div>

          {/* Share link */}
          <div className="px-4 py-3">
            <p className="mb-2 text-[9px] font-bold tracking-widest text-gray-400 uppercase">
              Link chia sẻ
            </p>
            <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5">
              <span className="flex-1 truncate text-[11px] text-gray-500">
                /invitation/{slug}
              </span>
              <button
                onClick={copyLink}
                className="flex-shrink-0 rounded p-1 transition-colors hover:bg-gray-200"
                title="Sao chép"
              >
                {copied ? (
                  <Check size={12} className="text-green-500" />
                ) : (
                  <Copy size={12} className="text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="px-4 py-3">
            <p className="mb-2 text-[9px] font-bold tracking-widest text-gray-400 uppercase">
              Thao tác nhanh
            </p>
            <div className="space-y-1.5">
              <a
                href={`/invitation/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-gray-100 px-3 py-2 text-xs text-gray-600 transition-all hover:border-gray-200 hover:bg-gray-50"
              >
                <ExternalLink size={12} className="text-gray-400" />
                Trang khách xem
              </a>
              <Link
                href={`/cards/${card.id}/preview`}
                target="_blank"
                className="flex items-center gap-2 rounded-lg border border-gray-100 px-3 py-2 text-xs text-gray-600 transition-all hover:border-gray-200 hover:bg-gray-50"
              >
                <Eye size={12} className="text-gray-400" />
                Xem thiệp đầy đủ
              </Link>
              <Link
                href={`/cards/${card.id}/guests`}
                className="flex items-center gap-2 rounded-lg border border-gray-100 px-3 py-2 text-xs text-gray-600 transition-all hover:border-gray-200 hover:bg-gray-50"
              >
                <Share2 size={12} className="text-gray-400" />
                Quản lý khách mời
              </Link>
              <Link
                href={`/cards/${card.id}/analytics`}
                className="flex items-center gap-2 rounded-lg border border-gray-100 px-3 py-2 text-xs text-gray-600 transition-all hover:border-gray-200 hover:bg-gray-50"
              >
                <Eye size={12} className="text-gray-400" />
                Xem thống kê
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="border-t p-3">
          <button
            onClick={() => setActiveTab(activeTab ? null : 'content')}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-gray-900 py-2.5 text-xs font-medium text-white transition-colors hover:bg-gray-700"
          >
            <ChevronRight size={12} />
            {activeTab ? 'Đóng bảng chỉnh sửa' : 'Mở bảng chỉnh sửa'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Height resize handle ─────────────────────────────────────────── */
function HeightHandle({
  scale,
  cardHeight,
  onChange,
}: {
  scale: number;
  cardHeight: number;
  onChange: (h: number) => void;
}) {
  const startRef = useRef<{ py: number; startH: number } | null>(null);

  function onPointerDown(e: React.PointerEvent) {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    startRef.current = { py: e.clientY, startH: cardHeight };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!startRef.current) return;
    const dy = (e.clientY - startRef.current.py) / scale;
    const next = Math.max(400, Math.round(startRef.current.startH + dy));
    onChange(next);
  }

  function onPointerUp(e: React.PointerEvent) {
    startRef.current = null;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  }

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      title={`Kéo để thay đổi chiều dài thiệp (hiện tại: ${cardHeight}px)`}
      style={{
        width: '100%',
        height: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'ns-resize',
        background: 'rgba(59,130,246,0.08)',
        borderTop: '2px dashed rgba(59,130,246,0.35)',
        borderRadius: '0 0 16px 16px',
        userSelect: 'none',
        touchAction: 'none',
        gap: 6,
        color: '#3b82f6',
        fontSize: 11,
        fontWeight: 500,
      }}
    >
      <GripHorizontal size={14} />
      <span>Kéo để thay đổi chiều dài</span>
      <span style={{ opacity: 0.6 }}>({cardHeight}px)</span>
    </div>
  );
}

/* ── Decor Panel ──────────────────────────────────────────────────── */
const QUICK = [
  { label: 'Dải trắng', bg: '#ffffff', r: 0, o: 1, w: 480, h: 80 },
  { label: 'Dải kem', bg: '#faf8f5', r: 0, o: 1, w: 480, h: 80 },
  { label: 'Dải hồng', bg: '#fce7f3', r: 0, o: 1, w: 480, h: 80 },
  { label: 'Dải vàng gold', bg: '#fef9ee', r: 0, o: 1, w: 480, h: 80 },
  { label: 'Đường kẻ gold', bg: '#c9a96e', r: 0, o: 1, w: 480, h: 3 },
  { label: 'Đường kẻ đen', bg: '#1a1714', r: 0, o: 1, w: 480, h: 2 },
  { label: 'Khối mờ trắng', bg: '#ffffff', r: 16, o: 0.7, w: 360, h: 160 },
  { label: 'Khối hồng bo góc', bg: '#fce7f3', r: 20, o: 1, w: 320, h: 120 },
  { label: 'Khối đen tối', bg: '#1a1714', r: 0, o: 0.85, w: 480, h: 120 },
];

function DecorPanel({
  cardHeight,
  onChangeHeight,
  addRect,
}: {
  cardHeight: number;
  onChangeHeight: (h: number) => void;
  addRect: (opts: {
    backgroundColor: string;
    borderRadius: number;
    opacity: number;
    width: number;
    height: number;
  }) => void;
}) {
  const [color, setColor] = useState('#ffffff');
  const [radius, setRadius] = useState(0);
  const [opacity, setOpacity] = useState(100);
  const [width, setWidth] = useState(480);
  const [height, setHeight] = useState(100);

  return (
    <div className="space-y-5">
      {/* Card height */}
      <div>
        <p className="mb-2 text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
          Chiều dài thiệp
        </p>
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
          <div className="mb-3 text-center">
            <span className="text-2xl font-bold text-gray-800">
              {cardHeight}
            </span>
            <span className="ml-1 text-xs text-gray-400">px</span>
          </div>
          {/* Step buttons */}
          <div className="mb-3 grid grid-cols-2 gap-2">
            {[100, 200].map((step) => (
              <button
                key={step}
                onClick={() =>
                  onChangeHeight(Math.min(5000, cardHeight + step))
                }
                className="rounded-lg border border-gray-200 bg-white py-1.5 text-xs font-medium text-gray-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              >
                + {step}px
              </button>
            ))}
            {[100, 200].map((step) => (
              <button
                key={step}
                onClick={() => onChangeHeight(Math.max(400, cardHeight - step))}
                className="rounded-lg border border-gray-200 bg-white py-1.5 text-xs font-medium text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                − {step}px
              </button>
            ))}
          </div>
          {/* Slider */}
          <input
            type="range"
            min={400}
            max={5000}
            step={50}
            value={cardHeight}
            onChange={(e) => onChangeHeight(+e.target.value)}
            className="w-full accent-blue-500"
          />
          <div className="mt-1 flex justify-between text-[10px] text-gray-400">
            <span>400px</span>
            <span>5000px</span>
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Quick presets */}
      <div>
        <p className="mb-2 text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
          Mẫu nhanh
        </p>
        <div className="grid grid-cols-1 gap-1.5">
          {QUICK.map((q) => (
            <button
              key={q.label}
              onClick={() =>
                addRect({
                  backgroundColor: q.bg,
                  borderRadius: q.r,
                  opacity: q.o,
                  width: q.w,
                  height: q.h,
                })
              }
              className="flex items-center gap-2.5 rounded-lg border border-gray-100 bg-white px-2.5 py-2 text-left transition hover:border-blue-200 hover:bg-blue-50"
            >
              <div
                style={{
                  width: 40,
                  height: Math.max(10, Math.min(28, q.h / 3)),
                  background: q.bg,
                  borderRadius: q.r > 0 ? 6 : 2,
                  border: '1px solid #e5e7eb',
                  opacity: q.o,
                  flexShrink: 0,
                }}
              />
              <span className="text-xs text-gray-700">{q.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Custom builder */}
      <div>
        <p className="mb-3 text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
          Tuỳ chỉnh
        </p>
        <div className="space-y-3">
          {/* Color */}
          <div className="flex items-center justify-between">
            <label className="text-xs text-gray-600">Màu nền</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-7 w-10 cursor-pointer rounded border border-gray-200"
              />
              <span className="font-mono text-xs text-gray-400">{color}</span>
            </div>
          </div>

          {/* Width */}
          <div>
            <div className="mb-1 flex justify-between text-xs text-gray-600">
              <span>Chiều rộng</span>
              <span className="text-gray-400">{width}px</span>
            </div>
            <input
              type="range"
              min={40}
              max={480}
              value={width}
              onChange={(e) => setWidth(+e.target.value)}
              className="w-full accent-blue-500"
            />
          </div>

          {/* Height */}
          <div>
            <div className="mb-1 flex justify-between text-xs text-gray-600">
              <span>Chiều cao</span>
              <span className="text-gray-400">{height}px</span>
            </div>
            <input
              type="range"
              min={2}
              max={600}
              value={height}
              onChange={(e) => setHeight(+e.target.value)}
              className="w-full accent-blue-500"
            />
          </div>

          {/* Border radius */}
          <div>
            <div className="mb-1 flex justify-between text-xs text-gray-600">
              <span>Bo góc</span>
              <span className="text-gray-400">{radius}px</span>
            </div>
            <input
              type="range"
              min={0}
              max={80}
              value={radius}
              onChange={(e) => setRadius(+e.target.value)}
              className="w-full accent-blue-500"
            />
          </div>

          {/* Opacity */}
          <div>
            <div className="mb-1 flex justify-between text-xs text-gray-600">
              <span>Độ mờ</span>
              <span className="text-gray-400">{opacity}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              value={opacity}
              onChange={(e) => setOpacity(+e.target.value)}
              className="w-full accent-blue-500"
            />
          </div>

          {/* Preview + add */}
          <div
            style={{
              width: '100%',
              height: Math.max(24, Math.min(80, height / 3)),
              background: color,
              borderRadius: radius / 3,
              opacity: opacity / 100,
              border: '1px solid #e5e7eb',
            }}
          />

          <button
            onClick={() =>
              addRect({
                backgroundColor: color,
                borderRadius: radius,
                opacity: opacity / 100,
                width,
                height,
              })
            }
            className="w-full rounded-lg bg-gray-900 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
          >
            + Thêm vào thiệp
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Image / Element Edit Panel ───────────────────────────────────── */
const FONT_OPTIONS = [
  { label: 'Mặc định', value: 'inherit' },
  { label: 'Serif', value: 'Georgia, serif' },
  { label: 'Sans-serif', value: 'Arial, sans-serif' },
  { label: 'Monospace', value: 'monospace' },
  { label: 'Playfair Display', value: "'Playfair Display', serif" },
  { label: 'Dancing Script', value: "'Dancing Script', cursive" },
  { label: 'Great Vibes', value: "'Great Vibes', cursive" },
  { label: 'Cormorant Garamond', value: "'Cormorant Garamond', serif" },
];

function ImageEditPanel({
  el,
  onChange,
  onDelete,
}: {
  el: OverlayElement;
  onChange: (patch: Partial<OverlayElement>) => void;
  onDelete: () => void;
}) {
  const isImage = el.type === 'image';
  const isText = el.type === 'text';

  const labelMap = {
    image: '🖼 Chỉnh sửa ảnh',
    rect: '⬛ Chỉnh sửa khối',
    text: '✍ Chỉnh sửa văn bản',
  };

  return (
    <div className="border-b border-gray-200 bg-blue-50/40">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-blue-100 px-4 py-2.5">
        <span className="text-[11px] font-semibold text-blue-700">
          {labelMap[el.type]}
        </span>
        <button
          onClick={onDelete}
          className="rounded-md px-2 py-0.5 text-[10px] font-medium text-red-500 hover:bg-red-50"
        >
          Xoá
        </button>
      </div>

      <div className="space-y-3 px-4 py-3">
        {/* Opacity — all elements */}
        <SliderRow
          label="Độ mờ"
          value={Math.round((el.opacity ?? 1) * 100)}
          min={10}
          max={100}
          unit="%"
          onChange={(v) => onChange({ opacity: v / 100 })}
        />

        {/* Border radius — all */}
        <SliderRow
          label="Bo góc"
          value={el.borderRadius ?? 0}
          min={0}
          max={120}
          unit="px"
          onChange={(v) => onChange({ borderRadius: v })}
        />

        {/* Border */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[11px] text-gray-600">Viền</span>
            <span className="text-[10px] text-gray-400">
              {el.borderWidth ?? 0}px
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={20}
              value={el.borderWidth ?? 0}
              onChange={(e) => onChange({ borderWidth: +e.target.value })}
              className="flex-1 accent-blue-500"
            />
            <input
              type="color"
              value={el.borderColor ?? '#ffffff'}
              onChange={(e) => onChange({ borderColor: e.target.value })}
              className="h-6 w-8 cursor-pointer rounded border border-gray-200"
            />
          </div>
        </div>

        {/* Text-only controls */}
        {isText && (
          <>
            {/* Text content */}
            <div>
              <p className="mb-1 text-[11px] text-gray-600">Nội dung</p>
              <textarea
                value={el.text ?? ''}
                onChange={(e) => onChange({ text: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-gray-200 p-2 text-xs text-gray-800 focus:border-blue-400 focus:outline-none"
                placeholder="Nhập văn bản..."
              />
            </div>

            {/* Font size */}
            <SliderRow
              label="Cỡ chữ"
              value={el.fontSize ?? 24}
              min={8}
              max={120}
              unit="px"
              onChange={(v) => onChange({ fontSize: v })}
            />

            {/* Color */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-600">Màu chữ</span>
              <input
                type="color"
                value={el.color ?? '#1a1714'}
                onChange={(e) => onChange({ color: e.target.value })}
                className="h-7 w-12 cursor-pointer rounded border border-gray-200"
              />
            </div>

            {/* Font family */}
            <div>
              <p className="mb-1 text-[11px] text-gray-600">Font chữ</p>
              <select
                value={el.fontFamily ?? 'inherit'}
                onChange={(e) => onChange({ fontFamily: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 focus:border-blue-400 focus:outline-none"
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Style toggles */}
            <div>
              <p className="mb-1.5 text-[11px] text-gray-600">Kiểu chữ</p>
              <div className="flex gap-1.5">
                <button
                  onClick={() =>
                    onChange({
                      fontWeight: el.fontWeight === 'bold' ? 'normal' : 'bold',
                    })
                  }
                  className={`flex-1 rounded-md border py-1 text-xs font-bold transition ${
                    el.fontWeight === 'bold'
                      ? 'border-blue-400 bg-blue-100 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300'
                  }`}
                >
                  B
                </button>
                <button
                  onClick={() =>
                    onChange({
                      fontStyle:
                        el.fontStyle === 'italic' ? 'normal' : 'italic',
                    })
                  }
                  className={`flex-1 rounded-md border py-1 text-xs italic transition ${
                    el.fontStyle === 'italic'
                      ? 'border-blue-400 bg-blue-100 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300'
                  }`}
                >
                  I
                </button>
              </div>
            </div>

            {/* Text align */}
            <div>
              <p className="mb-1.5 text-[11px] text-gray-600">Căn lề</p>
              <div className="flex gap-1">
                {(
                  [
                    { v: 'left', label: '≡ Trái' },
                    { v: 'center', label: '≡ Giữa' },
                    { v: 'right', label: '≡ Phải' },
                  ] as { v: OverlayElement['textAlign']; label: string }[]
                ).map(({ v, label }) => (
                  <button
                    key={v}
                    onClick={() => onChange({ textAlign: v })}
                    className={`flex-1 rounded-md py-1 text-[10px] font-medium transition ${
                      (el.textAlign ?? 'center') === v
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-200 bg-white text-gray-600 hover:border-blue-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Line height */}
            <SliderRow
              label="Giãn dòng"
              value={Math.round((el.lineHeight ?? 1.4) * 10)}
              min={8}
              max={30}
              unit=""
              onChange={(v) => onChange({ lineHeight: v / 10 })}
            />

            {/* Letter spacing */}
            <SliderRow
              label="Giãn chữ"
              value={el.letterSpacing ?? 0}
              min={-5}
              max={20}
              unit="px"
              onChange={(v) => onChange({ letterSpacing: v })}
            />

            <div className="h-px bg-gray-100" />
          </>
        )}

        {/* Image-only controls */}
        {isImage && (
          <>
            {/* Object fit */}
            <div>
              <p className="mb-1.5 text-[11px] text-gray-600">Kiểu hiển thị</p>
              <div className="flex gap-1">
                {(
                  [
                    { v: 'cover', label: 'Lấp đầy' },
                    { v: 'contain', label: 'Vừa khung' },
                    { v: 'fill', label: 'Kéo giãn' },
                  ] as { v: OverlayElement['objectFit']; label: string }[]
                ).map(({ v, label }) => (
                  <button
                    key={v}
                    onClick={() => onChange({ objectFit: v })}
                    className={`flex-1 rounded-md py-1 text-[10px] font-medium transition ${
                      (el.objectFit ?? 'cover') === v
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-200 bg-white text-gray-600 hover:border-blue-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Flip */}
            <div>
              <p className="mb-1.5 text-[11px] text-gray-600">Lật ảnh</p>
              <div className="flex gap-2">
                <button
                  onClick={() => onChange({ flipH: !el.flipH })}
                  className={`flex-1 rounded-md border py-1 text-[10px] font-medium transition ${
                    el.flipH
                      ? 'border-blue-400 bg-blue-100 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300'
                  }`}
                >
                  ↔ Ngang
                </button>
                <button
                  onClick={() => onChange({ flipV: !el.flipV })}
                  className={`flex-1 rounded-md border py-1 text-[10px] font-medium transition ${
                    el.flipV
                      ? 'border-blue-400 bg-blue-100 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300'
                  }`}
                >
                  ↕ Dọc
                </button>
              </div>
            </div>

            {/* Brightness */}
            <SliderRow
              label="Độ sáng"
              value={el.brightness ?? 100}
              min={0}
              max={200}
              unit="%"
              onChange={(v) => onChange({ brightness: v })}
            />

            {/* Contrast */}
            <SliderRow
              label="Tương phản"
              value={el.contrast ?? 100}
              min={0}
              max={200}
              unit="%"
              onChange={(v) => onChange({ contrast: v })}
            />

            {/* Grayscale */}
            <SliderRow
              label="Đen trắng"
              value={el.grayscale ?? 0}
              min={0}
              max={100}
              unit="%"
              onChange={(v) => onChange({ grayscale: v })}
            />

            {/* Sepia */}
            <SliderRow
              label="Tông nâu (Sepia)"
              value={el.sepia ?? 0}
              min={0}
              max={100}
              unit="%"
              onChange={(v) => onChange({ sepia: v })}
            />

            {/* Blur */}
            <SliderRow
              label="Làm mờ"
              value={el.blur ?? 0}
              min={0}
              max={20}
              unit="px"
              onChange={(v) => onChange({ blur: v })}
            />

            {/* Reset */}
            <button
              onClick={() =>
                onChange({
                  brightness: 100,
                  contrast: 100,
                  grayscale: 0,
                  sepia: 0,
                  blur: 0,
                  flipH: false,
                  flipV: false,
                  opacity: 1,
                  borderRadius: 0,
                  borderWidth: 0,
                  objectFit: 'cover',
                })
              }
              className="w-full rounded-lg border border-gray-200 bg-white py-1.5 text-[11px] text-gray-500 transition hover:border-gray-300 hover:text-gray-700"
            >
              Đặt lại về mặc định
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Music Panel ──────────────────────────────────────────────────── */
function MusicPanel({
  music,
  onChange,
}: {
  music: MusicConfig | undefined;
  onChange: (m: MusicConfig | undefined) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [nameInput, setNameInput] = useState(music?.name ?? '');
  const [error, setError] = useState('');

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const res = await fetch(
        `/api/upload?filename=${encodeURIComponent(file.name)}`,
        { method: 'POST', headers: { 'Content-Type': file.type }, body: file },
      );
      if (!res.ok) throw new Error('Upload thất bại');
      const data = await res.json();
      onChange({
        url: data.url,
        name: file.name.replace(/\.[^.]+$/, ''),
        autoPlay: music?.autoPlay ?? true,
        loop: music?.loop ?? true,
      });
      setNameInput(file.name.replace(/\.[^.]+$/, ''));
    } catch {
      setError('Upload thất bại. Thử lại.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  function applyUrl() {
    const url = urlInput.trim();
    if (!url) return;
    onChange({
      url,
      name: nameInput.trim() || 'Nhạc nền',
      autoPlay: music?.autoPlay ?? true,
      loop: music?.loop ?? true,
    });
    setUrlInput('');
  }

  function updateField(patch: Partial<MusicConfig>) {
    if (!music) return;
    onChange({ ...music, ...patch });
  }

  return (
    <div className="space-y-5">
      {/* Current track */}
      {music?.url ? (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-lg">🎵</span>
            <span className="flex-1 truncate text-sm font-medium text-green-800">
              {music.name || 'Nhạc nền'}
            </span>
          </div>
          <audio
            src={music.url}
            controls
            className="mt-2 w-full"
            style={{ height: 32 }}
          />
          <button
            onClick={() => onChange(undefined)}
            className="mt-3 w-full rounded-lg border border-red-200 py-1.5 text-xs text-red-500 transition hover:bg-red-50"
          >
            Xoá nhạc
          </button>
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-5 text-center">
          <p className="text-2xl">🎵</p>
          <p className="mt-1 text-sm font-medium text-gray-600">
            Chưa có nhạc nền
          </p>
          <p className="mt-0.5 text-xs text-gray-400">
            Tải file MP3 lên hoặc dán link bên dưới
          </p>
        </div>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
          {error}
        </p>
      )}

      {/* Upload */}
      <div>
        <p className="mb-2 text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
          Tải file lên
        </p>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50 py-4 text-sm font-medium text-blue-600 transition hover:border-blue-400 hover:bg-blue-100 disabled:opacity-60"
        >
          {uploading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
              Đang tải lên...
            </>
          ) : (
            <>🎵 Chọn file MP3 / AAC / OGG</>
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {/* URL input */}
      <div>
        <p className="mb-2 text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
          Hoặc dán link nhạc
        </p>
        <div className="space-y-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://... (link MP3 trực tiếp)"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-700 focus:border-blue-400 focus:outline-none"
            onKeyDown={(e) => e.key === 'Enter' && applyUrl()}
          />
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Tên bài hát (tuỳ chọn)"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-700 focus:border-blue-400 focus:outline-none"
          />
          <button
            onClick={applyUrl}
            disabled={!urlInput.trim()}
            className="w-full rounded-lg bg-gray-900 py-2 text-xs font-medium text-white transition hover:bg-gray-700 disabled:opacity-40"
          >
            Áp dụng
          </button>
        </div>
      </div>

      {/* Settings */}
      {music?.url && (
        <div>
          <p className="mb-3 text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
            Cài đặt
          </p>
          <div className="space-y-3">
            {/* Track name */}
            <div>
              <p className="mb-1 text-[11px] text-gray-600">Tên hiển thị</p>
              <input
                type="text"
                value={music.name ?? ''}
                onChange={(e) => updateField({ name: e.target.value })}
                placeholder="Tên bài hát..."
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-700 focus:border-blue-400 focus:outline-none"
              />
            </div>

            {/* Autoplay toggle */}
            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
              <div>
                <p className="text-xs font-medium text-gray-700">
                  Tự động phát
                </p>
                <p className="text-[10px] text-gray-400">
                  Phát nhạc khi khách mở thiệp
                </p>
              </div>
              <div
                onClick={() => updateField({ autoPlay: !music.autoPlay })}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  music.autoPlay ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    music.autoPlay ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </div>
            </label>

            {/* Loop toggle */}
            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
              <div>
                <p className="text-xs font-medium text-gray-700">Lặp lại</p>
                <p className="text-[10px] text-gray-400">
                  Phát lại từ đầu khi hết bài
                </p>
              </div>
              <div
                onClick={() => updateField({ loop: !music.loop })}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  music.loop ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    music.loop ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </div>
            </label>
          </div>
        </div>
      )}

      <div className="rounded-xl bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-700">
        💡 Nhạc sẽ xuất hiện dưới dạng nút nổi ở góc phải thiệp. Khách có thể
        nhấn để bật/tắt nhạc.
      </div>
    </div>
  );
}

/* ── Text Panel ───────────────────────────────────────────────────── */
const TEXT_PRESETS = [
  {
    label: 'Tiêu đề lớn',
    text: 'Tiêu đề',
    fontSize: 48,
    fontWeight: 'bold' as const,
    fontStyle: 'normal' as const,
    color: '#1a1714',
  },
  {
    label: 'Tiêu đề nhỏ',
    text: 'Tiêu đề phụ',
    fontSize: 28,
    fontWeight: 'normal' as const,
    fontStyle: 'normal' as const,
    color: '#1a1714',
  },
  {
    label: 'Đoạn văn',
    text: 'Nhập nội dung...',
    fontSize: 16,
    fontWeight: 'normal' as const,
    fontStyle: 'normal' as const,
    color: '#555555',
  },
  {
    label: 'Chữ ký / Tên',
    text: 'Tên đôi',
    fontSize: 36,
    fontWeight: 'normal' as const,
    fontStyle: 'italic' as const,
    color: '#c9a96e',
  },
  {
    label: 'Ghi chú nhỏ',
    text: 'Chú thích',
    fontSize: 12,
    fontWeight: 'normal' as const,
    fontStyle: 'normal' as const,
    color: '#888888',
  },
  {
    label: 'Trích dẫn',
    text: '"Yêu thương mãi mãi"',
    fontSize: 20,
    fontWeight: 'normal' as const,
    fontStyle: 'italic' as const,
    color: '#c9a96e',
  },
];

function TextPanel({
  addText,
}: {
  addText: (opts: {
    text: string;
    fontSize: number;
    fontFamily: string;
    color: string;
    fontWeight: 'normal' | 'bold';
    fontStyle: 'normal' | 'italic';
    textAlign: 'left' | 'center' | 'right';
  }) => void;
}) {
  const [text, setText] = useState('Nhập văn bản');
  const [fontSize, setFontSize] = useState(24);
  const [color, setColor] = useState('#1a1714');
  const [fontFamily, setFontFamily] = useState('inherit');
  const [fontWeight, setFontWeight] = useState<'normal' | 'bold'>('normal');
  const [fontStyle, setFontStyle] = useState<'normal' | 'italic'>('normal');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>(
    'center',
  );

  function add() {
    addText({
      text,
      fontSize,
      fontFamily,
      color,
      fontWeight,
      fontStyle,
      textAlign,
    });
  }

  return (
    <div className="space-y-4">
      {/* Quick presets */}
      <div>
        <p className="mb-2 text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
          Mẫu nhanh
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {TEXT_PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() =>
                addText({
                  text: p.text,
                  fontSize: p.fontSize,
                  fontFamily: 'inherit',
                  color: p.color,
                  fontWeight: p.fontWeight,
                  fontStyle: p.fontStyle,
                  textAlign: 'center',
                })
              }
              className="flex flex-col items-start rounded-xl border border-gray-100 bg-white px-3 py-2.5 text-left transition hover:border-blue-200 hover:bg-blue-50"
            >
              <span
                style={{
                  fontSize: Math.max(10, Math.min(18, p.fontSize / 2.5)),
                  fontWeight: p.fontWeight,
                  fontStyle: p.fontStyle,
                  color: p.color,
                  lineHeight: 1.3,
                }}
              >
                {p.label}
              </span>
              <span className="mt-0.5 text-[9px] text-gray-400">
                {p.fontSize}px
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Custom */}
      <div>
        <p className="mb-3 text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
          Tuỳ chỉnh
        </p>
        <div className="space-y-3">
          {/* Text input */}
          <div>
            <p className="mb-1 text-[11px] text-gray-600">Nội dung</p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-gray-200 p-2 text-xs text-gray-800 focus:border-blue-400 focus:outline-none"
              placeholder="Nhập văn bản..."
            />
          </div>

          {/* Font size slider */}
          <div>
            <div className="mb-1 flex justify-between text-[11px] text-gray-600">
              <span>Cỡ chữ</span>
              <span className="text-gray-400">{fontSize}px</span>
            </div>
            <input
              type="range"
              min={8}
              max={120}
              value={fontSize}
              onChange={(e) => setFontSize(+e.target.value)}
              className="w-full accent-blue-500"
            />
          </div>

          {/* Color */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-600">Màu chữ</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-7 w-10 cursor-pointer rounded border border-gray-200"
              />
              <span className="font-mono text-[10px] text-gray-400">
                {color}
              </span>
            </div>
          </div>

          {/* Font family */}
          <div>
            <p className="mb-1 text-[11px] text-gray-600">Font chữ</p>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 focus:border-blue-400 focus:outline-none"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          {/* Style */}
          <div className="flex gap-2">
            <button
              onClick={() =>
                setFontWeight((v) => (v === 'bold' ? 'normal' : 'bold'))
              }
              className={`flex-1 rounded-lg border py-1.5 text-xs font-bold transition ${
                fontWeight === 'bold'
                  ? 'border-blue-400 bg-blue-100 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300'
              }`}
            >
              B In đậm
            </button>
            <button
              onClick={() =>
                setFontStyle((v) => (v === 'italic' ? 'normal' : 'italic'))
              }
              className={`flex-1 rounded-lg border py-1.5 text-xs italic transition ${
                fontStyle === 'italic'
                  ? 'border-blue-400 bg-blue-100 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300'
              }`}
            >
              I Nghiêng
            </button>
          </div>

          {/* Align */}
          <div className="flex gap-1">
            {(['left', 'center', 'right'] as const).map((a) => (
              <button
                key={a}
                onClick={() => setTextAlign(a)}
                className={`flex-1 rounded-lg border py-1.5 text-xs transition ${
                  textAlign === a
                    ? 'border-blue-400 bg-blue-600 text-white'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300'
                }`}
              >
                {a === 'left'
                  ? '◀ Trái'
                  : a === 'center'
                    ? '▶◀ Giữa'
                    : 'Phải ▶'}
              </button>
            ))}
          </div>

          {/* Preview */}
          <div
            className="overflow-hidden rounded-lg border border-gray-100 bg-gray-50 p-3"
            style={{ minHeight: 48 }}
          >
            <p
              style={{
                fontSize: Math.min(fontSize, 32),
                fontFamily,
                fontWeight,
                fontStyle,
                color,
                textAlign,
                lineHeight: 1.4,
                wordBreak: 'break-word',
                margin: 0,
              }}
            >
              {text || 'Xem trước...'}
            </p>
          </div>

          <button
            onClick={add}
            className="w-full rounded-lg bg-gray-900 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
          >
            + Thêm vào thiệp
          </button>
        </div>
      </div>
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[11px] text-gray-600">{label}</span>
        <span className="text-[10px] text-gray-400">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="w-full accent-blue-500"
      />
    </div>
  );
}
