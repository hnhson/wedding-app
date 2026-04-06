import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import EditorShell from '@/components/editor/EditorShell';
import type { Card } from '@/types/card';

export default async function EditCardPage({
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

  return <EditorShell card={data as Card} />;
}
