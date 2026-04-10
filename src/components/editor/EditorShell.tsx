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
  Eye,
  Share2,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Save,
  ExternalLink,
} from 'lucide-react';

type Tab = 'content' | 'style' | 'media' | 'map' | 'decor';

const TOOLS: { id: Tab; icon: React.ReactNode; label: string }[] = [
  { id: 'content', icon: <FileText size={19} />, label: 'Nội dung' },
  { id: 'style', icon: <Palette size={19} />, label: 'Phong cách' },
  { id: 'media', icon: <ImageIcon size={19} />, label: 'Ảnh & Media' },
  { id: 'map', icon: <MapPin size={19} />, label: 'Địa điểm' },
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

  function addToCanvas(url: string) {
    const CARD_W = 480;
    const imgSize = 200;
    setConfig((prev) => {
      const existing = prev.overlayElements ?? [];
      // Offset each new image slightly so multiple images don't stack exactly
      const offset = (existing.length % 5) * 24;
      const newEl: OverlayElement = {
        id: `el-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: 'image',
        url,
        x: Math.round((CARD_W - imgSize) / 2) + offset,
        y: 300 + offset,
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
        y: 300 + offset,
        width: opts.width,
        height: opts.height,
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
