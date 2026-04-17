import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateBaseSlug, appendRandomSuffix } from '@/lib/slug';
import { DEFAULT_CARD_CONFIG } from '@/lib/templates/data';

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { partner1, partner2, weddingDate, weddingTime, templateId } = await request.json();

  if (!partner1 || !partner2 || !weddingDate || !templateId) {
    return NextResponse.json(
      { error: 'partner1, partner2, weddingDate, templateId are required' },
      { status: 400 },
    );
  }

  const year = new Date(weddingDate).getFullYear();
  const baseSlug = generateBaseSlug(partner1, partner2, year);

  let slug = baseSlug;
  let card = null;
  let attempts = 0;

  while (!card && attempts < 5) {
    const { data, error } = await supabase
      .from('cards')
      .insert({
        user_id: user.id,
        slug,
        config: {
          ...DEFAULT_CARD_CONFIG,
          templateId,
          coupleNames: { partner1, partner2 },
          weddingDate,
          weddingTime: weddingTime ?? '',
        },
      })
      .select()
      .single();

    if (error?.code === '23505') {
      slug = appendRandomSuffix(baseSlug);
      attempts++;
    } else if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      card = data;
    }
  }

  if (!card) {
    return NextResponse.json(
      { error: 'Failed to generate unique slug' },
      { status: 500 },
    );
  }

  return NextResponse.json(card, { status: 201 });
}
