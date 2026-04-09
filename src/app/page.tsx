import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import Logo from '@/components/Logo';
import NavActions from '@/components/NavActions';

export const metadata = {
  title: 'Thiệp Cưới — Tạo thiệp cưới đẹp, chia sẻ dễ dàng',
  description:
    'Tạo thiệp cưới online đẹp mắt trong vài phút. Chia sẻ link, quét QR, nhận RSVP và quản lý khách mời dễ dàng.',
};

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      <div className="landing-root">
        {/* ── NAV ── */}
        <nav className="landing-nav">
          <a href="#hero" className="landing-logo-link">
            <Logo size={34} variant="dark" />
          </a>
          <div className="landing-nav-center">
            <a href="#features" className="landing-nav-link">Tính năng</a>
            <a href="#how-it-works" className="landing-nav-link">Cách hoạt động</a>
          </div>
          <div className="landing-nav-links">
            <NavActions
              user={
                user
                  ? {
                      email: user.email,
                      avatarUrl: user.user_metadata?.avatar_url as string | undefined,
                      initial: (user.email ?? 'U')[0].toUpperCase(),
                    }
                  : null
              }
            />
          </div>
        </nav>

        {/* ── HERO ── */}
        <section id="hero" className="landing-hero">
          {/* Decorative petals */}
          <span className="petal petal-1" aria-hidden="true" />
          <span className="petal petal-2" aria-hidden="true" />
          <span className="petal petal-3" aria-hidden="true" />
          <span className="petal petal-4" aria-hidden="true" />
          <span className="petal petal-5" aria-hidden="true" />

          <div className="hero-inner">
            {/* Left — text */}
            <div className="hero-copy">
              <p className="hero-eyebrow">✦ Thiệp cưới online</p>
              <h1 className="hero-title">
                Thiệp cưới đẹp,
                <br />
                <em>chia sẻ dễ dàng</em>
              </h1>
              <p className="hero-desc">
                Tạo thiệp cưới online chuyên nghiệp trong vài phút. Chia sẻ qua
                link hoặc QR code, nhận xác nhận tham dự và quản lý danh sách
                khách mời — tất cả ở một nơi.
              </p>
              <div className="hero-actions">
                {user ? (
                  <Link href="/cards/new" className="landing-btn-primary">
                    Tạo thiệp ngay
                  </Link>
                ) : (
                  <>
                    <Link href="/register" className="landing-btn-primary">
                      Tạo thiệp miễn phí
                    </Link>
                    <Link href="/login" className="landing-btn-ghost">
                      Đăng nhập
                    </Link>
                  </>
                )}
              </div>
              {!user && (
                <p className="hero-note">Miễn phí · Không cần thẻ tín dụng</p>
              )}
            </div>

            {/* Right — floating card mockup */}
            <div className="hero-card-wrap" aria-hidden="true">
              <div className="mock-card">
                <div className="mock-card-top">
                  <div className="mock-flowers">❀</div>
                  <p className="mock-invite">Trân trọng kính mời</p>
                  <h2 className="mock-names">Minh Anh &amp; Thu Hà</h2>
                  <p className="mock-date">15 · 06 · 2025</p>
                  <p className="mock-venue">Nhà hàng Hoa Viên, Hà Nội</p>
                </div>
                <div className="mock-card-bottom">
                  <div className="mock-rsvp-badge">RSVP</div>
                  <div className="mock-share-badge">Chia sẻ</div>
                </div>
              </div>
              {/* Shadow card behind */}
              <div className="mock-card-shadow" />
            </div>
          </div>

          {/* Scroll hint */}
          <div className="scroll-hint" aria-hidden="true">
            <span className="scroll-line" />
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" className="landing-features">
          <p className="section-eyebrow">Tính năng</p>
          <h2 className="section-title">Mọi thứ bạn cần cho ngày trọng đại</h2>

          <div className="features-grid">
            {[
              {
                icon: '✦',
                title: 'Mẫu thiệp đẹp',
                desc: 'Nhiều mẫu thiệp cưới tinh tế, dễ tuỳ chỉnh tên, ngày cưới, địa điểm và ảnh đôi.',
              },
              {
                icon: '↗',
                title: 'Chia sẻ tức thì',
                desc: 'Gửi link thiệp qua Zalo, Facebook, Messenger hoặc in mã QR dán lên thiệp giấy.',
              },
              {
                icon: '✓',
                title: 'Nhận RSVP online',
                desc: 'Khách mời xác nhận tham dự ngay trên thiệp — không cần gọi điện, không lo thất lạc.',
              },
              {
                icon: '♡',
                title: 'Sổ lưu bút',
                desc: 'Khách để lại lời chúc ngay trên thiệp. Lưu giữ kỷ niệm đẹp mãi mãi.',
              },
              {
                icon: '◎',
                title: 'Thống kê lượt xem',
                desc: 'Biết bao nhiêu người đã xem thiệp theo từng ngày — trực quan và rõ ràng.',
              },
              {
                icon: '◈',
                title: 'Quản lý khách mời',
                desc: 'Xem toàn bộ danh sách khách đã RSVP, số người tham dự và lời nhắn.',
              },
            ].map((f) => (
              <div key={f.title} className="feature-card">
                <span className="feature-icon">{f.icon}</span>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" className="landing-steps">
          <p className="section-eyebrow">Cách hoạt động</p>
          <h2 className="section-title">Chỉ 3 bước là xong</h2>

          <div className="steps-row">
            {[
              {
                n: '01',
                title: 'Tạo thiệp',
                desc: 'Chọn mẫu yêu thích, điền thông tin đám cưới và tuỳ chỉnh theo ý muốn.',
              },
              {
                n: '02',
                title: 'Chia sẻ',
                desc: 'Sao chép link hoặc tải mã QR và gửi tới tất cả khách mời của bạn.',
              },
              {
                n: '03',
                title: 'Theo dõi',
                desc: 'Xem ai đã xem thiệp, ai đã xác nhận tham dự và đọc lời chúc từ khách.',
              },
            ].map((s, i) => (
              <div key={s.n} className="step-item">
                <span className="step-num">{s.n}</span>
                {i < 2 && (
                  <span className="step-connector" aria-hidden="true" />
                )}
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section className="landing-cta">
          <span className="cta-decor" aria-hidden="true">
            ❀
          </span>
          <h2 className="cta-title">
            Sẵn sàng tạo thiệp cưới
            <br />
            <em>của riêng bạn?</em>
          </h2>
          <p className="cta-desc">
            Tham gia cùng hàng trăm cặp đôi đã dùng Thiệp Cưới cho ngày trọng
            đại của họ.
          </p>
          <Link
            href={user ? '/cards/new' : '/register'}
            className="landing-btn-primary landing-btn-lg"
          >
            Tạo thiệp ngay — Miễn phí
          </Link>
          <span className="cta-decor cta-decor-right" aria-hidden="true">
            ❀
          </span>
        </section>

        {/* ── FOOTER ── */}
        <footer className="landing-footer">
          <div className="footer-logo-wrap">
            <Logo size={32} variant="light" />
          </div>
          <p className="footer-tagline">Tạo thiệp cưới đẹp, chia sẻ dễ dàng</p>
          <p className="footer-copy">
            © {new Date().getFullYear()} Thiệp Cưới · Made with ♥ in Vietnam
          </p>
        </footer>
      </div>

      <style>{`
        /* ── Reset & base ── */
        .landing-root {
          font-family: 'DM Sans', sans-serif;
          background: #faf8f5;
          color: #1a1714;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* ── Smooth scroll ── */
        html { scroll-behavior: smooth; }

        /* ── Nav ── */
        .landing-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          padding: 1.1rem 2.5rem;
          background: rgba(250, 248, 245, 0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(26, 23, 20, 0.08);
        }
        .landing-logo-link {
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }
        .landing-avatar-link {
          display: inline-flex;
          align-items: center;
          border-radius: 50%;
          ring: 2px solid transparent;
          transition: box-shadow 0.2s;
          text-decoration: none;
        }
        .landing-avatar-link:hover {
          box-shadow: 0 0 0 3px rgba(201,169,110,0.5);
        }
        .landing-avatar-img {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
        }
        .landing-avatar-initial {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #1a1714;
          color: #faf8f5;
          font-size: 0.85rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .landing-nav-center {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .landing-nav-links {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          justify-content: flex-end;
        }
        .landing-nav-link {
          font-size: 0.875rem;
          font-weight: 400;
          color: #6b6460;
          text-decoration: none;
          transition: color 0.2s;
        }
        .landing-nav-link:hover { color: #1a1714; }
        .landing-btn-sm {
          font-size: 0.875rem;
          font-weight: 500;
          color: #faf8f5;
          background: #1a1714;
          text-decoration: none;
          padding: 0.55rem 1.25rem;
          border-radius: 100px;
          transition: opacity 0.2s;
        }
        .landing-btn-sm:hover { opacity: 0.85; }

        /* ── Hero ── */
        .landing-hero {
          position: relative;
          min-height: calc(100svh - 60px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 5rem 2.5rem 4rem;
          overflow: hidden;
        }

        /* Decorative petals */
        .petal {
          position: absolute;
          border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%;
          opacity: 0.12;
          pointer-events: none;
        }
        .petal-1 {
          width: 340px; height: 340px;
          background: #c9a96e;
          top: -80px; right: -60px;
          animation: floatPetal 12s ease-in-out infinite;
        }
        .petal-2 {
          width: 200px; height: 200px;
          background: #b5896a;
          bottom: 10%; left: -40px;
          animation: floatPetal 16s ease-in-out infinite reverse;
        }
        .petal-3 {
          width: 120px; height: 120px;
          background: #c9a96e;
          top: 30%; left: 20%;
          animation: floatPetal 10s ease-in-out infinite;
          opacity: 0.08;
        }
        .petal-4 {
          width: 80px; height: 80px;
          background: #8b6b4a;
          top: 60%; right: 30%;
          animation: floatPetal 14s ease-in-out infinite 2s;
          opacity: 0.07;
        }
        .petal-5 {
          width: 160px; height: 160px;
          background: #c9a96e;
          bottom: -40px; right: 20%;
          animation: floatPetal 18s ease-in-out infinite 4s;
          opacity: 0.09;
        }
        @keyframes floatPetal {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          33% { transform: translateY(-18px) rotate(5deg); }
          66% { transform: translateY(10px) rotate(-3deg); }
        }

        .hero-inner {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }
        .hero-copy { max-width: 520px; }
        .hero-eyebrow {
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #b5896a;
          margin-bottom: 1.25rem;
        }
        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.6rem, 5vw, 3.8rem);
          font-weight: 600;
          line-height: 1.15;
          color: #1a1714;
          margin-bottom: 1.5rem;
        }
        .hero-title em {
          font-style: italic;
          color: #b5896a;
        }
        .hero-desc {
          font-size: 1.05rem;
          font-weight: 300;
          line-height: 1.75;
          color: #5a5450;
          margin-bottom: 2.25rem;
          max-width: 440px;
        }
        .hero-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }
        .landing-btn-primary {
          display: inline-block;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          color: #faf8f5;
          background: #1a1714;
          text-decoration: none;
          padding: 0.9rem 2rem;
          border-radius: 100px;
          transition: all 0.25s;
          white-space: nowrap;
        }
        .landing-btn-primary:hover {
          background: #3a3430;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(26,23,20,0.18);
        }
        .landing-btn-ghost {
          display: inline-block;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 400;
          color: #5a5450;
          text-decoration: none;
          padding: 0.9rem 1.5rem;
          border-radius: 100px;
          border: 1px solid rgba(26,23,20,0.15);
          transition: all 0.2s;
        }
        .landing-btn-ghost:hover {
          border-color: rgba(26,23,20,0.4);
          color: #1a1714;
        }
        .landing-btn-lg {
          font-size: 1.05rem;
          padding: 1.1rem 2.5rem;
        }
        .hero-note {
          font-size: 0.8rem;
          color: #9e9590;
          font-weight: 300;
        }

        /* Card mockup */
        .hero-card-wrap {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .mock-card {
          position: relative;
          z-index: 2;
          background: #fff;
          border-radius: 16px;
          padding: 2.5rem 2rem;
          width: 280px;
          box-shadow: 0 24px 64px rgba(26,23,20,0.14), 0 4px 16px rgba(26,23,20,0.06);
          text-align: center;
          transform: rotate(2deg);
          animation: cardFloat 6s ease-in-out infinite;
        }
        @keyframes cardFloat {
          0%, 100% { transform: rotate(2deg) translateY(0); }
          50% { transform: rotate(2deg) translateY(-10px); }
        }
        .mock-card-shadow {
          position: absolute;
          z-index: 1;
          background: #e8ddd0;
          border-radius: 16px;
          width: 280px;
          height: 100%;
          top: 12px;
          left: 12px;
          transform: rotate(2deg);
        }
        .mock-flowers {
          font-size: 2rem;
          color: #c9a96e;
          margin-bottom: 0.75rem;
          letter-spacing: 0.3em;
        }
        .mock-invite {
          font-size: 0.7rem;
          font-weight: 300;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #9e9590;
          margin-bottom: 0.75rem;
        }
        .mock-names {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          font-weight: 600;
          color: #1a1714;
          line-height: 1.3;
          margin-bottom: 0.75rem;
        }
        .mock-date {
          font-size: 0.9rem;
          font-weight: 500;
          color: #b5896a;
          letter-spacing: 0.08em;
          margin-bottom: 0.3rem;
        }
        .mock-venue {
          font-size: 0.75rem;
          color: #9e9590;
          font-weight: 300;
          margin-bottom: 1.5rem;
        }
        .mock-card-bottom {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
        }
        .mock-rsvp-badge, .mock-share-badge {
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          padding: 0.3rem 0.75rem;
          border-radius: 100px;
          text-transform: uppercase;
        }
        .mock-rsvp-badge {
          background: #1a1714;
          color: #faf8f5;
        }
        .mock-share-badge {
          border: 1px solid rgba(26,23,20,0.2);
          color: #5a5450;
        }

        /* Scroll hint */
        .scroll-hint {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        .scroll-line {
          display: block;
          width: 1px;
          height: 48px;
          background: linear-gradient(to bottom, rgba(26,23,20,0.35), transparent);
          animation: scrollPulse 2s ease-in-out infinite;
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.2); }
        }

        /* ── Features ── */
        .landing-features {
          padding: 6rem 2.5rem;
          background: #fff;
          border-top: 1px solid rgba(26,23,20,0.06);
        }
        .section-eyebrow {
          text-align: center;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #b5896a;
          margin-bottom: 0.75rem;
        }
        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 3.5vw, 2.6rem);
          font-weight: 600;
          text-align: center;
          color: #1a1714;
          margin-bottom: 3.5rem;
        }
        .features-grid {
          max-width: 960px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        .feature-card {
          padding: 2rem 1.5rem;
          border-radius: 12px;
          border: 1px solid rgba(26,23,20,0.07);
          background: #faf8f5;
          transition: all 0.25s;
        }
        .feature-card:hover {
          border-color: rgba(181,137,106,0.35);
          transform: translateY(-3px);
          box-shadow: 0 8px 32px rgba(26,23,20,0.07);
        }
        .feature-icon {
          display: block;
          font-size: 1.4rem;
          color: #c9a96e;
          margin-bottom: 1rem;
        }
        .feature-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: #1a1714;
          margin-bottom: 0.6rem;
        }
        .feature-desc {
          font-size: 0.875rem;
          font-weight: 300;
          line-height: 1.7;
          color: #6b6460;
        }

        /* ── Steps ── */
        .landing-steps {
          padding: 6rem 2.5rem;
          background: #faf8f5;
        }
        .steps-row {
          max-width: 860px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          position: relative;
        }
        .step-item {
          text-align: center;
          padding: 0 2rem;
          position: relative;
        }
        .step-num {
          display: inline-block;
          font-family: 'Playfair Display', serif;
          font-size: 3rem;
          font-weight: 400;
          color: rgba(201,169,110,0.25);
          line-height: 1;
          margin-bottom: 1rem;
        }
        .step-connector {
          display: none;
        }
        .step-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;
          font-weight: 600;
          color: #1a1714;
          margin-bottom: 0.6rem;
        }
        .step-desc {
          font-size: 0.875rem;
          font-weight: 300;
          line-height: 1.7;
          color: #6b6460;
        }

        /* ── CTA ── */
        .landing-cta {
          position: relative;
          padding: 7rem 2.5rem;
          background: #1a1714;
          text-align: center;
          overflow: hidden;
        }
        .cta-decor {
          position: absolute;
          font-size: 8rem;
          color: rgba(201,169,110,0.12);
          top: 50%;
          left: 3rem;
          transform: translateY(-50%);
          pointer-events: none;
          user-select: none;
          font-family: serif;
        }
        .cta-decor-right {
          left: auto;
          right: 3rem;
        }
        .cta-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 600;
          color: #faf8f5;
          margin-bottom: 1.25rem;
          line-height: 1.25;
        }
        .cta-title em {
          font-style: italic;
          color: #c9a96e;
        }
        .cta-desc {
          font-size: 1rem;
          font-weight: 300;
          color: rgba(250,248,245,0.6);
          margin-bottom: 2.5rem;
          max-width: 440px;
          margin-left: auto;
          margin-right: auto;
        }
        .landing-cta .landing-btn-primary {
          background: #c9a96e;
          color: #1a1714;
        }
        .landing-cta .landing-btn-primary:hover {
          background: #dbbf85;
          box-shadow: 0 8px 32px rgba(201,169,110,0.3);
        }

        /* ── Footer ── */
        .landing-footer {
          padding: 3rem 2.5rem;
          background: #141210;
          text-align: center;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .footer-logo-wrap {
          display: inline-flex;
          justify-content: center;
          margin-bottom: 0.75rem;
          opacity: 0.85;
        }
        .footer-tagline {
          font-size: 0.8rem;
          color: rgba(250,248,245,0.3);
          font-weight: 300;
          margin-bottom: 1.5rem;
        }
        .footer-copy {
          font-size: 0.75rem;
          color: rgba(250,248,245,0.2);
          font-weight: 300;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .landing-nav { padding: 1rem 1.25rem; grid-template-columns: 1fr auto; }
          .landing-nav-center { display: none; }
          .landing-hero { padding: 3.5rem 1.25rem 5rem; min-height: auto; }
          .hero-inner {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          .hero-card-wrap { order: -1; }
          .mock-card { width: 240px; }
          .mock-card-shadow { width: 240px; }
          .landing-features { padding: 4rem 1.25rem; }
          .features-grid { grid-template-columns: 1fr; gap: 1rem; }
          .landing-steps { padding: 4rem 1.25rem; }
          .steps-row { grid-template-columns: 1fr; gap: 2.5rem; }
          .landing-cta { padding: 5rem 1.25rem; }
          .cta-decor { display: none; }
          .landing-footer { padding: 2rem 1.25rem; }
        }
        @media (max-width: 480px) {
          .hero-actions { flex-direction: column; align-items: flex-start; }
          .features-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
