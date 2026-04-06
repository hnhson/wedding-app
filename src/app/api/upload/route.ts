import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const filename = searchParams.get('filename')
  if (!filename)
    return NextResponse.json({ error: 'filename query param is required' }, { status: 400 })

  if (!request.body) return NextResponse.json({ error: 'No file body' }, { status: 400 })

  const blob = await put(`wedding/${user.id}/${Date.now()}-${filename}`, request.body, {
    access: 'public',
    contentType: request.headers.get('content-type') ?? 'image/jpeg',
  })

  return NextResponse.json({ url: blob.url })
}
