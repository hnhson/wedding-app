'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Card, CardConfig } from '@/types/card';
import TemplateRenderer from '@/components/templates/TemplateRenderer';
import ContentPanel from './ContentPanel';
import StylePanel from './StylePanel';
import MediaPanel from './MediaPanel';
import MapPanel from './MapPanel';
import { FONT_PAIRS } from '@/lib/templates/presets';

type Tab = 'content' | 'style' | 'media' | 'map';

const TAB_LABELS: Record<Tab, string> = {
  content: 'Nội dung',
  style: 'Phong cách',
  media: 'Ảnh',
  map: 'Địa điểm',
};

interface Props {
  card: Card;
}

export default function EditorShell({ card }: Props) {
  const [config, setConfig] = useState<CardConfig>(card.config);
  const [activeTab, setActiveTab] = useState<Tab>('content');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>(
    'saved',
  );
  const autoSaveRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  // Load Google Font when fontPair changes
  useEffect(() => {
    const fontPair = FONT_PAIRS[config.fontPair];
    if (!fontPair) return;
    const id = `font-${config.fontPair}`;
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    const families = [
      `${fontPair.heading.replace(/ /g, '+')}:wght@400;700`,
      `${fontPair.body.replace(/ /g, '+')}:wght@400;600`,
    ].join('&family=');
    link.href = `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
    document.head.appendChild(link);
  }, [config.fontPair]);

  const save = useCallback(
    async (latestConfig: CardConfig) => {
      setSaveStatus('saving');
      try {
        await fetch(`/api/cards/${card.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ config: latestConfig }),
        });
        setSaveStatus('saved');
      } catch {
        setSaveStatus('unsaved');
      }
    },
    [card.id],
  );

  // Auto-save with 500ms debounce
  useEffect(() => {
    clearTimeout(autoSaveRef.current);
    autoSaveRef.current = setTimeout(() => {
      setSaveStatus('unsaved');
      save(config);
    }, 500);
    return () => clearTimeout(autoSaveRef.current);
  }, [config, save]);

  // beforeunload fallback
  useEffect(() => {
    const handler = () => {
      if (saveStatus === 'unsaved') {
        navigator.sendBeacon(
          `/api/cards/${card.id}`,
          JSON.stringify({ config }),
        );
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [config, card.id, saveStatus]);

  function updateConfig(patch: Partial<CardConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div className="flex w-80 flex-col border-r bg-white">
        {/* Tabs */}
        <div className="flex border-b">
          {(Object.keys(TAB_LABELS) as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-xs font-medium transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-gray-900 text-gray-900'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>

        {/* Save status */}
        <div className="border-b px-4 py-2">
          <p className="text-xs text-gray-400">
            {saveStatus === 'saving'
              ? 'Đang lưu...'
              : saveStatus === 'saved'
                ? '✓ Đã lưu'
                : '● Chưa lưu'}
          </p>
        </div>

        {/* Panel content */}
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
            />
          )}
          {activeTab === 'map' && (
            <MapPanel config={config} onChange={updateConfig} />
          )}
        </div>
      </div>

      {/* Live preview */}
      <div className="flex-1 overflow-y-auto bg-gray-100 p-4">
        <div className="mx-auto max-w-2xl overflow-hidden rounded-lg shadow-lg">
          <TemplateRenderer config={config} />
        </div>
      </div>
    </div>
  );
}
