import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import TemplateRenderer from '@/components/templates/TemplateRenderer';
import CountdownWidget from '@/components/CountdownWidget';
import type { Card } from '@/types/card';
import { FONT_PAIRS } from '@/lib/templates/presets';

export default async function PreviewCardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data } = await supabase
    .from('cards')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!data) notFound();

  const card = data as Card;
  const fontPair = FONT_PAIRS[card.config.fontPair];

  return (
    <div>
      {/* Toolbar */}
      <div className="fixed top-16 right-0 left-0 z-10 flex items-center justify-between border-b bg-white px-6 py-2 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href={`/cards/${id}/edit`}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Quay lại chỉnh sửa
          </Link>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-600">
            Preview — slug:{' '}
            <code className="rounded bg-gray-100 px-1 text-xs">
              {card.slug}
            </code>
          </span>
        </div>
        <Link
          href={`/invitation/${card.slug}`}
          target="_blank"
          className="text-sm font-medium text-gray-900 hover:underline"
        >
          Xem trang công khai ↗
        </Link>
      </div>

      {/* Load fonts */}
      {fontPair && (
        <link
          rel="stylesheet"
          href={`https://fonts.googleapis.com/css2?family=${fontPair.heading.replace(/ /g, '+')}:wght@400;700&family=${fontPair.body.replace(/ /g, '+')}:wght@400;600&display=swap`}
        />
      )}

      {/* Countdown */}
      {card.config.weddingDate && (
        <div className="pt-24 pb-4 text-center">
          <CountdownWidget weddingDate={card.config.weddingDate} />
        </div>
      )}

      {/* Template */}
      <div className="pt-4">
        <TemplateRenderer config={card.config} />
      </div>
    </div>
  );
}
