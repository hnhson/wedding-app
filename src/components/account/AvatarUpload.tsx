'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface Props {
  currentUrl?: string;
  email: string;
}

export default function AvatarUpload({ currentUrl, email }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(currentUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const initial = (email ?? 'U')[0].toUpperCase();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file ảnh');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Ảnh không được vượt quá 2MB');
      return;
    }

    setError('');
    setLoading(true);

    // Preview locally
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    try {
      // Upload to Vercel Blob (raw body + filename query param)
      const res = await fetch(
        `/api/upload?filename=${encodeURIComponent(file.name)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': file.type },
          body: file,
        },
      );
      if (!res.ok) throw new Error('Upload thất bại');
      const { url } = await res.json();

      // Save to Supabase user metadata
      const supabase = createClient();
      const { error: err } = await supabase.auth.updateUser({
        data: { avatar_url: url },
      });
      if (err) throw new Error(err.message);

      setPreview(url);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      setPreview(currentUrl);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Avatar display */}
      <div className="relative flex-shrink-0">
        {preview ? (
          <img
            src={preview}
            alt="Avatar"
            className="h-24 w-24 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-900 text-2xl font-bold text-white">
            {initial}
          </div>
        )}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
            <span className="text-xs font-medium text-white">Đang tải...</span>
          </div>
        )}
      </div>

      {/* Button below avatar */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-50"
      >
        {loading ? 'Đang tải lên...' : 'Thay đổi ảnh'}
      </button>

      {error && <p className="text-xs text-red-600">{error}</p>}
      <p className="text-xs text-gray-400">JPG, PNG · Tối đa 2MB</p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
