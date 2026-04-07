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
      // Upload to Vercel Blob
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
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
    <div className="flex items-center gap-5">
      {/* Avatar display */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="relative flex-shrink-0 overflow-hidden rounded-full focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 focus:outline-none"
      >
        {preview ? (
          <img
            src={preview}
            alt="Avatar"
            className="h-20 w-20 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-900 text-2xl font-bold text-white">
            {initial}
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity hover:opacity-100">
          <span className="text-xs font-medium text-white">
            {loading ? '...' : 'Đổi ảnh'}
          </span>
        </div>
      </button>

      {/* Info */}
      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="text-sm font-medium text-gray-900 hover:underline disabled:opacity-50"
        >
          {loading ? 'Đang tải lên...' : 'Tải ảnh lên'}
        </button>
        <p className="mt-0.5 text-xs text-gray-400">JPG, PNG · Tối đa 2MB</p>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>

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
