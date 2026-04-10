import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TEMPLATES } from '@/lib/templates/data';
import { MOCK_CARD_CONFIG } from '@/lib/templates/mockConfig';
import TemplateRenderer from '@/components/templates/TemplateRenderer';
import { createClient } from '@/lib/supabase/server';
import Logo from '@/components/Logo';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return TEMPLATES.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const template = TEMPLATES.find((t) => t.id === id);
  if (!template) return {};
  return {
    title: `Mẫu ${template.name} — Thiệp cưới đẹp`,
    description: `Xem trước mẫu thiệp cưới phong cách ${template.name}: ${template.description}`,
  };
}

const TEMPLATE_FONTS: Record<string, string> = {
  classic: 'playfair-lato',
  modern: 'cinzel-raleway',
  minimal: 'libre-nunito',
  floral: 'great-vibes-montserrat',
  elegant: 'cormorant-jost',
  romance: 'sacramento-poppins',
  garden: 'alex-josefin',
  luxe: 'cinzel-raleway',
  vintage: 'libre-nunito',
  celestial: 'cormorant-jost',
};

const TEMPLATE_PALETTES: Record<string, string> = {
  classic: 'rose-gold',
  modern: 'midnight-blue',
  minimal: 'charcoal',
  floral: 'blush-pink',
  elegant: 'ivory-gold',
  romance: 'dusty-rose',
  garden: 'emerald',
  luxe: 'ivory-gold',
  vintage: 'ivory-gold',
  celestial: 'navy-silver',
};

export default async function TemplatePreviewPage({ params }: Props) {
  const { id } = await params;
  const template = TEMPLATES.find((t) => t.id === id);
  if (!template) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const config = {
    ...MOCK_CARD_CONFIG,
    templateId: template.id,
    colorPalette: TEMPLATE_PALETTES[template.id] ?? 'rose-gold',
    fontPair: TEMPLATE_FONTS[template.id] ?? 'playfair-lato',
  };

  const currentIndex = TEMPLATES.findIndex((t) => t.id === id);
  const prevTemplate = currentIndex > 0 ? TEMPLATES[currentIndex - 1] : null;
  const nextTemplate =
    currentIndex < TEMPLATES.length - 1 ? TEMPLATES[currentIndex + 1] : null;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Cinzel:wght@400;600;700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Great+Vibes&family=Sacramento&family=Alex+Brush&family=Lato:wght@300;400;700&family=Jost:wght@300;400;600&family=Raleway:wght@300;400;600&family=Nunito:wght@300;400;600&family=Montserrat:wght@300;400;600&family=Poppins:wght@300;400;600&family=Josefin+Sans:wght@300;400;600&family=Open+Sans:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      <div className="min-h-screen bg-gray-50">
        {/* Sticky top bar */}
        <div className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5">
            {/* Back */}
            <Link
              href="/templates"
              className="flex shrink-0 items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-800"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Mẫu thiệp
            </Link>

            <div className="h-4 w-px shrink-0 bg-gray-200" />

            {/* Template name */}
            <span className="truncate text-sm font-semibold text-gray-800">
              {template.name}
              <span className="ml-1.5 font-normal text-gray-400">
                {template.description}
              </span>
            </span>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Prev/Next */}
            {prevTemplate && (
              <Link
                href={`/templates/${prevTemplate.id}`}
                className="hidden shrink-0 items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 transition-all hover:bg-gray-50 sm:flex"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                {prevTemplate.name}
              </Link>
            )}
            {nextTemplate && (
              <Link
                href={`/templates/${nextTemplate.id}`}
                className="hidden shrink-0 items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 transition-all hover:bg-gray-50 sm:flex"
              >
                {nextTemplate.name}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            )}

            <Link
              href={user ? '/cards/new' : '/register'}
              className="shrink-0 rounded-full bg-rose-500 px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600"
            >
              Dùng mẫu này
            </Link>
          </div>
        </div>

        {/* Main content */}
        <div className="mx-auto max-w-lg px-4 py-8">
          {/* Template card */}
          <div className="overflow-hidden rounded-2xl shadow-2xl">
            <TemplateRenderer config={config} />
          </div>

          {/* Bottom nav on mobile */}
          <div className="mt-6 flex gap-3 sm:hidden">
            {prevTemplate && (
              <Link
                href={`/templates/${prevTemplate.id}`}
                className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-gray-200 py-2.5 text-sm text-gray-600"
              >
                ← {prevTemplate.name}
              </Link>
            )}
            {nextTemplate && (
              <Link
                href={`/templates/${nextTemplate.id}`}
                className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-gray-200 py-2.5 text-sm text-gray-600"
              >
                {nextTemplate.name} →
              </Link>
            )}
          </div>

          {/* CTA bottom */}
          <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
            <h2 className="mb-1 text-lg font-bold text-gray-900">
              Thích mẫu {template.name}?
            </h2>
            <p className="mb-5 text-sm text-gray-500">
              Tạo thiệp với mẫu này, thêm thông tin của bạn và chia sẻ link
              ngay.
            </p>
            <Link
              href={user ? '/cards/new' : '/register'}
              className="inline-block rounded-full bg-rose-500 px-8 py-3 font-semibold text-white shadow-md transition hover:bg-rose-600"
            >
              {user ? 'Tạo thiệp với mẫu này' : 'Đăng ký miễn phí để dùng mẫu'}
            </Link>
            {!user && (
              <p className="mt-3 text-xs text-gray-400">
                Đã có tài khoản?{' '}
                <Link href="/login" className="text-rose-500 hover:underline">
                  Đăng nhập
                </Link>
              </p>
            )}
          </div>

          {/* All templates grid */}
          <div className="mt-8">
            <p className="mb-4 text-sm font-semibold text-gray-700">
              Các mẫu khác
            </p>
            <div className="grid grid-cols-3 gap-3">
              {TEMPLATES.filter((t) => t.id !== id)
                .slice(0, 6)
                .map((t) => (
                  <Link
                    key={t.id}
                    href={`/templates/${t.id}`}
                    className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div
                      className="flex h-16 items-center justify-center p-2 text-center"
                      style={{ background: t.thumbnail.bg }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 9,
                            color: t.thumbnail.accent,
                            fontFamily: 'Georgia, serif',
                            fontWeight: 700,
                          }}
                        >
                          Lan Anh
                        </div>
                        <div
                          style={{
                            fontSize: 7,
                            color: t.thumbnail.accent,
                            opacity: 0.6,
                          }}
                        >
                          &amp;
                        </div>
                        <div
                          style={{
                            fontSize: 9,
                            color: t.thumbnail.accent,
                            fontFamily: 'Georgia, serif',
                            fontWeight: 700,
                          }}
                        >
                          Minh Khoa
                        </div>
                      </div>
                    </div>
                    <div className="bg-white px-2 py-1.5">
                      <p className="text-[11px] font-medium text-gray-700">
                        {t.name}
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
            <div className="mt-4 text-center">
              <Link
                href="/templates"
                className="text-sm text-rose-500 hover:underline"
              >
                Xem tất cả {TEMPLATES.length} mẫu →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
