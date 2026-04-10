import { NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

function getServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function POST(request: Request) {
  const body = await request.json();
  const { cardId, name, message } = body;

  if (!cardId || !name?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: 'cardId, name, message are required' },
      { status: 400 },
    );
  }

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from('wishes')
    .insert({ card_id: cardId, name: name.trim(), message: message.trim() })
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

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from('wishes')
    .select('id, name, message, created_at')
    .eq('card_id', cardId)
    .order('created_at', { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
