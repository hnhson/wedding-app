import { ImageResponse } from 'next/og';
import { createClient } from '@supabase/supabase-js';

export const alt = 'Wedding Invitation';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data } = await supabase
    .from('cards')
    .select('config')
    .eq('slug', slug)
    .single();

  const config = data?.config;
  const partner1: string = config?.coupleNames?.partner1 ?? '';
  const partner2: string = config?.coupleNames?.partner2 ?? '';
  const weddingDate: string = config?.weddingDate
    ? new Date(config.weddingDate).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';
  const heroImage: string | null = config?.heroImage ?? null;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #FFF9F9 0%, #F7E7E9 100%)',
        fontFamily: 'serif',
        position: 'relative',
      }}
    >
      {heroImage && (
        <img
          src={heroImage}
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.15,
          }}
        />
      )}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <p
          style={{
            fontSize: 24,
            color: '#B76E79',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          Trân trọng kính mời
        </p>
        <p
          style={{
            fontSize: 80,
            fontWeight: 'bold',
            color: '#3A2520',
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          {partner1 || 'Cô Dâu'}
        </p>
        <p style={{ fontSize: 40, color: '#D4AF37', margin: 0 }}>&amp;</p>
        <p
          style={{
            fontSize: 80,
            fontWeight: 'bold',
            color: '#3A2520',
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          {partner2 || 'Chú Rể'}
        </p>
        {weddingDate && (
          <p
            style={{
              fontSize: 28,
              color: '#666',
              marginTop: '16px',
              margin: 0,
            }}
          >
            {weddingDate}
          </p>
        )}
      </div>
    </div>,
    { ...size },
  );
}
