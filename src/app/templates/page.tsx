import Link from 'next/link';
import { TEMPLATES } from '@/lib/templates/data';
import { createClient } from '@/lib/supabase/server';
import Logo from '@/components/Logo';
import NavActions from '@/components/NavActions';

export const metadata = {
  title: 'Mẫu thiệp cưới đẹp — Chọn mẫu và tạo thiệp miễn phí',
  description:
    'Khám phá bộ sưu tập 10 mẫu thiệp cưới đẹp: Classic, Modern, Elegant, Romance, Garden, Luxe, Vintage, Celestial và nhiều hơn nữa.',
};

const STYLE_PREVIEWS: Record<string, { gradient: string; badge: string }> = {
  classic: {
    gradient: 'from-[#FFF9F9] to-[#F7E7E9]',
    badge: 'bg-rose-100 text-rose-700',
  },
  modern: {
    gradient: 'from-[#F8FAFC] to-[#E8EFF5]',
    badge: 'bg-slate-100 text-slate-700',
  },
  minimal: {
    gradient: 'from-[#FAFAFA] to-[#F0F0F0]',
    badge: 'bg-gray-100 text-gray-700',
  },
  floral: {
    gradient: 'from-[#FFF9F9] to-[#FFE8F0]',
    badge: 'bg-pink-100 text-pink-700',
  },
  elegant: {
    gradient: 'from-[#FFFDF5] to-[#FAF0D0]',
    badge: 'bg-yellow-100 text-yellow-700',
  },
  romance: {
    gradient: 'from-[#FFF0F2] to-[#FFD6DC]',
    badge: 'bg-red-100 text-red-700',
  },
  garden: {
    gradient: 'from-[#F0F7F4] to-[#D4EDE3]',
    badge: 'bg-green-100 text-green-700',
  },
  luxe: {
    gradient: 'from-[#1a1714] to-[#2d2520]',
    badge: 'bg-amber-100 text-amber-800',
  },
  vintage: {
    gradient: 'from-[#FAF3E0] to-[#EDE0C4]',
    badge: 'bg-orange-100 text-orange-700',
  },
  celestial: {
    gradient: 'from-[#0f1628] to-[#1a2444]',
    badge: 'bg-indigo-100 text-indigo-700',
  },
};

const ACCENT_COLORS: Record<string, string> = {
  classic: '#B76E79',
  modern: '#1B3A4B',
  minimal: '#3A3A3A',
  floral: '#B76E79',
  elegant: '#D4AF37',
  romance: '#D4A0A7',
  garden: '#2E7D5E',
  luxe: '#D4AF37',
  vintage: '#8B7355',
  celestial: '#D4AF37',
};

const IS_DARK: Record<string, boolean> = {
  luxe: true,
  celestial: true,
};

export default async function TemplatesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      <div className="min-h-screen bg-white">
        {/* Nav */}
        <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-2">
              <Logo size={30} variant="dark" />
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-sm text-gray-500 transition-colors hover:text-gray-800"
              >
                Trang chủ
              </Link>
              <NavActions
                user={
                  user
                    ? {
                        email: user.email,
                        avatarUrl: user.user_metadata?.avatar_url as
                          | string
                          | undefined,
                        initial: (user.email ?? 'U')[0].toUpperCase(),
                      }
                    : null
                }
              />
            </div>
          </div>
        </nav>

        {/* Hero */}
        <div className="bg-gradient-to-b from-rose-50 to-white px-6 py-16 text-center">
          <p className="mb-3 text-sm font-medium tracking-widest text-rose-400 uppercase">
            Bộ sưu tập
          </p>
          <h1
            className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Mẫu thiệp cưới
          </h1>
          <p className="mx-auto max-w-xl text-gray-500">
            Chọn một mẫu thiệp phù hợp với phong cách của bạn. Tất cả đều có thể
            tuỳ chỉnh màu sắc, font chữ và nội dung.
          </p>
        </div>

        {/* Grid */}
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {TEMPLATES.map((template) => {
              const preview =
                STYLE_PREVIEWS[template.layout] ?? STYLE_PREVIEWS.classic;
              const accent = ACCENT_COLORS[template.layout] ?? '#B76E79';
              const dark = IS_DARK[template.layout] ?? false;

              return (
                <Link
                  key={template.id}
                  href={`/templates/${template.id}`}
                  className="group block overflow-hidden rounded-2xl border border-gray-100 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Card preview thumbnail */}
                  <div
                    className={`relative h-64 bg-gradient-to-br ${preview.gradient} overflow-hidden`}
                  >
                    {/* Mini card preview */}
                    <div className="absolute inset-4 flex flex-col items-center justify-center">
                      <TemplateMiniCard
                        style={template.layout}
                        accent={accent}
                        dark={dark}
                      />
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/20 group-hover:opacity-100">
                      <span className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-gray-900 shadow-lg">
                        Xem mẫu
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="bg-white p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {template.name}
                        </h3>
                        <p className="mt-0.5 text-sm text-gray-500">
                          {template.description}
                        </p>
                      </div>
                      <span
                        className={`mt-0.5 ml-2 shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${preview.badge}`}
                      >
                        Miễn phí
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-rose-50 px-6 py-16 text-center">
          <h2
            className="mb-4 text-3xl font-bold text-gray-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Sẵn sàng tạo thiệp của bạn?
          </h2>
          <p className="mb-8 text-gray-500">
            Chọn mẫu, điền thông tin, chia sẻ link — chỉ vài phút.
          </p>
          <Link
            href={user ? '/cards/new' : '/register'}
            className="inline-block rounded-full bg-rose-500 px-8 py-3 font-semibold text-white shadow-md transition hover:bg-rose-600"
          >
            {user ? 'Tạo thiệp ngay' : 'Đăng ký miễn phí'}
          </Link>
        </div>
      </div>
    </>
  );
}

/* ── Mini card visual per style ── */
function TemplateMiniCard({
  style,
  accent,
  dark,
}: {
  style: string;
  accent: string;
  dark: boolean;
}) {
  const textColor = dark ? accent : accent;
  const subColor = dark ? 'rgba(255,255,255,0.5)' : `${accent}99`;

  if (style === 'elegant') {
    return (
      <div
        className="flex h-full w-full flex-col items-center justify-center gap-2"
        style={{ color: accent }}
      >
        <div
          style={{ width: 60, height: 1, background: accent, opacity: 0.5 }}
        />
        <div
          style={{
            fontSize: 8,
            letterSpacing: 3,
            opacity: 0.6,
            textTransform: 'uppercase',
          }}
        >
          Thiệp Cưới
        </div>
        <div
          style={{
            fontSize: 20,
            fontFamily: 'Georgia, serif',
            fontWeight: 700,
          }}
        >
          Lan Anh
        </div>
        <div style={{ fontSize: 11, letterSpacing: 2, opacity: 0.6 }}>
          ✦ & ✦
        </div>
        <div
          style={{
            fontSize: 20,
            fontFamily: 'Georgia, serif',
            fontWeight: 700,
          }}
        >
          Minh Khoa
        </div>
        <div
          style={{ width: 60, height: 1, background: accent, opacity: 0.5 }}
        />
        <div style={{ fontSize: 9, opacity: 0.6 }}>18 · 10 · 2025</div>
      </div>
    );
  }

  if (style === 'romance') {
    return (
      <div
        className="flex h-full w-full flex-col items-center justify-center gap-1.5"
        style={{ color: accent }}
      >
        <div style={{ fontSize: 9, fontStyle: 'italic', opacity: 0.6 }}>
          Chúng tôi trân trọng kính mời
        </div>
        <div
          style={{
            fontSize: 22,
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            fontWeight: 700,
          }}
        >
          Lan Anh
        </div>
        <div style={{ fontSize: 16, opacity: 0.8 }}>♥</div>
        <div
          style={{
            fontSize: 22,
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            fontWeight: 700,
          }}
        >
          Minh Khoa
        </div>
        <div style={{ fontSize: 9, opacity: 0.6, marginTop: 4 }}>
          18 tháng 10, 2025
        </div>
        <div style={{ fontSize: 8, opacity: 0.5 }}>Grand Palace Ballroom</div>
      </div>
    );
  }

  if (style === 'garden') {
    return (
      <div
        className="flex h-full w-full flex-col overflow-hidden rounded-lg"
        style={{ color: accent }}
      >
        <div
          style={{
            background: accent,
            padding: '8px 12px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              color: '#fff',
              fontSize: 8,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            Thiệp Cưới
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-1.5">
          <div style={{ fontSize: 10, opacity: 0.5 }}>✿ ❀ ✿</div>
          <div
            style={{
              fontSize: 19,
              fontFamily: 'Georgia, serif',
              fontWeight: 700,
            }}
          >
            Lan Anh
          </div>
          <div style={{ fontSize: 11, opacity: 0.6 }}>&amp;</div>
          <div
            style={{
              fontSize: 19,
              fontFamily: 'Georgia, serif',
              fontWeight: 700,
            }}
          >
            Minh Khoa
          </div>
          <div style={{ fontSize: 9, opacity: 0.6, marginTop: 4 }}>
            18 · 10 · 2025
          </div>
        </div>
      </div>
    );
  }

  if (style === 'luxe') {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2">
        <div
          style={{ width: '100%', height: 1, background: accent, opacity: 0.6 }}
        />
        <div
          style={{
            fontSize: 8,
            color: accent,
            letterSpacing: 4,
            opacity: 0.7,
            textTransform: 'uppercase',
          }}
        >
          Wedding
        </div>
        <div
          style={{
            fontSize: 22,
            fontFamily: 'Georgia, serif',
            fontWeight: 700,
            color: accent,
          }}
        >
          Lan Anh
        </div>
        <div
          style={{
            fontSize: 10,
            color: accent,
            opacity: 0.6,
            letterSpacing: 3,
          }}
        >
          — & —
        </div>
        <div
          style={{
            fontSize: 22,
            fontFamily: 'Georgia, serif',
            fontWeight: 700,
            color: accent,
          }}
        >
          Minh Khoa
        </div>
        <div style={{ fontSize: 8, color: accent, opacity: 0.5 }}>
          18 · 10 · 2025
        </div>
        <div
          style={{ width: '100%', height: 1, background: accent, opacity: 0.6 }}
        />
      </div>
    );
  }

  if (style === 'vintage') {
    return (
      <div
        className="flex h-full w-full flex-col items-center justify-center gap-2 rounded"
        style={{ border: `2px dashed ${accent}99`, color: accent }}
      >
        <div style={{ fontSize: 9, opacity: 0.6, letterSpacing: 2 }}>
          ~~~✦~~~
        </div>
        <div
          style={{
            fontSize: 8,
            letterSpacing: 3,
            opacity: 0.5,
            textTransform: 'uppercase',
          }}
        >
          Thiệp Cưới
        </div>
        <div
          style={{
            fontSize: 19,
            fontFamily: 'Georgia, serif',
            fontWeight: 700,
          }}
        >
          Lan Anh
        </div>
        <div style={{ fontSize: 9, opacity: 0.6, letterSpacing: 2 }}>
          ~~~&amp;~~~
        </div>
        <div
          style={{
            fontSize: 19,
            fontFamily: 'Georgia, serif',
            fontWeight: 700,
          }}
        >
          Minh Khoa
        </div>
        <div style={{ fontSize: 9, opacity: 0.6 }}>~~~✦~~~</div>
        <div style={{ fontSize: 8, opacity: 0.5 }}>18.10.2025</div>
      </div>
    );
  }

  if (style === 'celestial') {
    return (
      <div
        className="relative flex h-full w-full flex-col items-center justify-center gap-2"
        style={{ color: accent }}
      >
        <span
          style={{
            position: 'absolute',
            top: 4,
            left: 8,
            fontSize: 10,
            opacity: 0.6,
          }}
        >
          ★
        </span>
        <span
          style={{
            position: 'absolute',
            top: 8,
            right: 12,
            fontSize: 7,
            opacity: 0.5,
          }}
        >
          ✦
        </span>
        <span
          style={{
            position: 'absolute',
            bottom: 8,
            left: 16,
            fontSize: 8,
            opacity: 0.5,
          }}
        >
          ☆
        </span>
        <span
          style={{
            position: 'absolute',
            bottom: 4,
            right: 8,
            fontSize: 6,
            opacity: 0.4,
          }}
        >
          ★
        </span>
        <div style={{ fontSize: 9, opacity: 0.6, letterSpacing: 2 }}>☽ ✦ ☾</div>
        <div
          style={{
            fontSize: 19,
            fontFamily: 'Georgia, serif',
            fontWeight: 700,
          }}
        >
          Lan Anh
        </div>
        <div style={{ fontSize: 10, opacity: 0.6, letterSpacing: 3 }}>
          · & ·
        </div>
        <div
          style={{
            fontSize: 19,
            fontFamily: 'Georgia, serif',
            fontWeight: 700,
          }}
        >
          Minh Khoa
        </div>
        <div style={{ fontSize: 8, opacity: 0.5 }}>18 · 10 · 2025</div>
      </div>
    );
  }

  if (style === 'floral') {
    return (
      <div
        className="relative flex h-full w-full flex-col items-center justify-center gap-2"
        style={{ color: accent }}
      >
        <span
          style={{
            position: 'absolute',
            top: 4,
            left: 6,
            fontSize: 14,
            opacity: 0.4,
          }}
        >
          ❀
        </span>
        <span
          style={{
            position: 'absolute',
            top: 4,
            right: 6,
            fontSize: 14,
            opacity: 0.4,
          }}
        >
          ❀
        </span>
        <span
          style={{
            position: 'absolute',
            bottom: 4,
            left: 6,
            fontSize: 14,
            opacity: 0.4,
          }}
        >
          ✿
        </span>
        <span
          style={{
            position: 'absolute',
            bottom: 4,
            right: 6,
            fontSize: 14,
            opacity: 0.4,
          }}
        >
          ✿
        </span>
        <div style={{ fontSize: 9, opacity: 0.55 }}>Trân trọng kính mời</div>
        <div
          style={{
            fontSize: 19,
            fontFamily: 'Georgia, serif',
            fontWeight: 700,
          }}
        >
          Lan Anh
        </div>
        <div
          style={{
            width: 40,
            height: 0.5,
            background: accent,
            margin: '2px 0',
          }}
        />
        <div
          style={{
            fontSize: 19,
            fontFamily: 'Georgia, serif',
            fontWeight: 700,
          }}
        >
          Minh Khoa
        </div>
        <div style={{ fontSize: 8, opacity: 0.5, marginTop: 2 }}>
          18 · 10 · 2025
        </div>
      </div>
    );
  }

  if (style === 'modern') {
    return (
      <div
        className="flex h-full w-full flex-col items-center justify-center gap-1"
        style={{ color: accent }}
      >
        <div
          style={{ width: 32, height: 3, background: accent, marginBottom: 8 }}
        />
        <div
          style={{
            fontSize: 8,
            letterSpacing: 4,
            opacity: 0.6,
            textTransform: 'uppercase',
          }}
        >
          Wedding
        </div>
        <div
          style={{
            fontSize: 19,
            fontFamily: 'Georgia, serif',
            fontWeight: 700,
            marginTop: 4,
          }}
        >
          Lan Anh
        </div>
        <div style={{ fontSize: 9, opacity: 0.5 }}>&amp;</div>
        <div
          style={{
            fontSize: 19,
            fontFamily: 'Georgia, serif',
            fontWeight: 700,
          }}
        >
          Minh Khoa
        </div>
        <div
          style={{
            width: 32,
            height: 1,
            background: accent,
            opacity: 0.4,
            marginTop: 8,
          }}
        />
        <div style={{ fontSize: 8, opacity: 0.5, marginTop: 4 }}>
          18.10.2025
        </div>
      </div>
    );
  }

  if (style === 'minimal') {
    return (
      <div
        className="flex h-full w-full flex-col items-center justify-center gap-2"
        style={{ color: accent }}
      >
        <div
          style={{
            fontSize: 19,
            fontFamily: 'Georgia, serif',
            fontWeight: 400,
          }}
        >
          Lan Anh
        </div>
        <div style={{ fontSize: 10, opacity: 0.4 }}>&amp;</div>
        <div
          style={{
            fontSize: 19,
            fontFamily: 'Georgia, serif',
            fontWeight: 400,
          }}
        >
          Minh Khoa
        </div>
        <div
          style={{
            width: 20,
            height: 0.5,
            background: accent,
            margin: '6px 0',
          }}
        />
        <div style={{ fontSize: 8, opacity: 0.45, letterSpacing: 2 }}>
          18 · 10 · 2025
        </div>
      </div>
    );
  }

  // Classic default
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-1.5"
      style={{ color: accent }}
    >
      <div style={{ fontSize: 9, opacity: 0.55, letterSpacing: 1 }}>
        Kính mời dự lễ thành hôn
      </div>
      <div
        style={{ fontSize: 19, fontFamily: 'Georgia, serif', fontWeight: 700 }}
      >
        Lan Anh
      </div>
      <div
        style={{ width: 40, height: 0.5, background: accent, margin: '2px 0' }}
      />
      <div
        style={{ fontSize: 19, fontFamily: 'Georgia, serif', fontWeight: 700 }}
      >
        Minh Khoa
      </div>
      <div style={{ fontSize: 9, opacity: 0.55, marginTop: 4 }}>
        18 tháng 10, 2025
      </div>
      <div style={{ fontSize: 8, opacity: 0.4 }}>Grand Palace Ballroom</div>
    </div>
  );
}
