'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
  Eye,
  Share2,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Save,
  ExternalLink,
} from 'lucide-react';

type Tab = 'content' | 'style' | 'media' | 'map';

const TOOLS: { id: Tab; icon: React.ReactNode; label: string }[] = [
  { id: 'content', icon: <FileText size={19} />, label: 'Nội dung' },
  { id: 'style', icon: <Palette size={19} />, label: 'Phong cách' },
  { id: 'media', icon: <ImageIcon size={19} />, label: 'Ảnh & Media' },
  { id: 'map', icon: <MapPin size={19} />, label: 'Địa điểm' },
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
    // Place image centered horizontally, ~1/3 down the visible card
    const newEl: OverlayElement = {
      id: `el-${Date.now()}`,
      type: 'image',
      url,
      x: Math.round((CARD_W - imgSize) / 2),
      y: 300,
      width: imgSize,
      height: imgSize,
    };
    setConfig((prev) => ({
      ...prev,
      overlayElements: [...(prev.overlayElements ?? []), newEl],
    }));
    setSelectedElId(newEl.id);
    // Switch to canvas view
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
