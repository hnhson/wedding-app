import { NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

function getServiceClient() {
  // Use service role key so anonymous guests can insert without RLS blocking
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function POST(request: Request) {
  const body = await request.json();
  const { cardId, name, email, attending, guestCount, message } = body;

  if (
    !cardId ||
    !name?.trim() ||
    attending === undefined ||
    attending === null
  ) {
    return NextResponse.json(
      { error: 'cardId, name, attending are required' },
      { status: 400 },
    );
  }

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from('rsvps')
    .insert({
      card_id: cardId,
      name: name.trim(),
      email: email?.trim() || null,
      attending,
      guest_count: attending ? Number(guestCount) || 1 : 0,
      message: message?.trim() || null,
    })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cardId = searchParams.get('cardId');
  if (!cardId) {
    return NextResponse.json({ error: 'cardId is required' }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('rsvps')
    .select('*')
    .eq('card_id', cardId)
    .order('created_at', { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
