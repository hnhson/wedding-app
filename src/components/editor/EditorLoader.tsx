'use client';

import dynamic from 'next/dynamic';
import type { Card } from '@/types/card';

const EditorShell = dynamic(() => import('./EditorShell'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[calc(100vh-49px)] items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />
        <p className="text-sm text-gray-500">Đang tải editor...</p>
      </div>
    </div>
  ),
});

export default function EditorLoader({ card }: { card: Card }) {
  return <EditorShell card={card} />;
}
