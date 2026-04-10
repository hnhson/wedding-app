'use client';

import { useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { PlusCircle } from 'lucide-react';
import type { CardConfig } from '@/types/card';

interface Props {
  config: CardConfig;
  onChange: (patch: Partial<CardConfig>) => void;
  cardId: string;
  onAddToCanvas?: (url: string) => void;
}

async function uploadFile(file: File): Promise<string> {
  const res = await fetch(
    `/api/upload?filename=${encodeURIComponent(file.name)}`,
    { method: 'POST', headers: { 'Content-Type': file.type }, body: file },
  );
  if (!res.ok) throw new Error('Upload thất bại');
  const data = await res.json();
  return data.url as string;
}

export default function MediaPanel({ config, onChange, onAddToCanvas }: Props) {
  const heroInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const canvasInputRef = useRef<HTMLInputElement>(null);
  const [heroUploading, setHeroUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [canvasUploading, setCanvasUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleHeroUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroUploading(true);
    setError('');
    try {
      onChange({ heroImage: await uploadFile(file) });
    } catch {
      setError('Lỗi upload ảnh chính');
    } finally {
      setHeroUploading(false);
    }
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    if (config.gallery.length + files.length > 12) {
      setError('Tối đa 12 ảnh trong gallery');
      return;
    }
    setGalleryUploading(true);
    setError('');
    try {
      const urls = await Promise.all(files.map(uploadFile));
      onChange({ gallery: [...config.gallery, ...urls] });
      // Auto-insert each uploaded image as a draggable overlay element
      urls.forEach((url) => onAddToCanvas?.(url));
    } catch {
      setError('Lỗi upload ảnh gallery');
    } finally {
      setGalleryUploading(false);
      e.target.value = '';
    }
  }

  async function handleCanvasUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCanvasUploading(true);
    setError('');
    try {
      const url = await uploadFile(file);
      onAddToCanvas?.(url);
    } catch {
      setError('Lỗi upload ảnh');
    } finally {
      setCanvasUploading(false);
      e.target.value = '';
    }
  }

  function removeGalleryImage(index: number) {
    onChange({ gallery: config.gallery.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-6">
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
          {error}
        </p>
      )}

      {/* ── Chèn ảnh vào thiệp ── */}
      {onAddToCanvas && (
        <div className="rounded-xl border-2 border-dashed border-blue-200 bg-blue-50 p-4">
          <p className="mb-1 text-xs font-semibold text-blue-700">
            Chèn ảnh vào thiệp
          </p>
          <p className="mb-3 text-[11px] leading-relaxed text-blue-500">
            Ảnh sẽ xuất hiện trên thiệp — kéo để di chuyển, kéo góc để thay đổi
            kích thước
          </p>
          <button
            onClick={() => canvasInputRef.current?.click()}
            disabled={canvasUploading}
            className="mx-auto flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
          >
            <PlusCircle size={13} />
            {canvasUploading ? 'Đang upload...' : 'Tải ảnh lên & chèn'}
          </button>
          <input
            ref={canvasInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCanvasUpload}
          />

          {/* Quick-add từ gallery */}
          {config.gallery.length > 0 && (
            <div className="mt-3">
              <p className="mb-2 text-center text-[10px] text-blue-400">
                Hoặc chọn từ gallery bên dưới
              </p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {config.gallery.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => onAddToCanvas(url)}
                    className="group relative overflow-hidden rounded-lg border-2 border-transparent transition-all hover:border-blue-400"
                    title="Thêm vào thiệp"
                  >
                    <img src={url} alt="" className="h-12 w-12 object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-blue-600/60 opacity-0 transition-opacity group-hover:opacity-100">
                      <PlusCircle size={16} className="text-white" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Ảnh chính ── */}
      <div>
        <Label className="mb-2 block">Ảnh chính (nền thiệp)</Label>
        {config.heroImage ? (
          <div className="relative">
            <img
              src={config.heroImage}
              alt="Hero"
              className="h-40 w-full rounded-lg object-cover"
            />
            <div className="absolute top-2 right-2 flex gap-1.5">
              {onAddToCanvas && (
                <button
                  onClick={() => onAddToCanvas(config.heroImage!)}
                  className="rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white shadow hover:bg-blue-700"
                >
                  + Chèn vào thiệp
                </button>
              )}
              <button
                onClick={() => onChange({ heroImage: null })}
                className="rounded-full bg-white px-2 py-0.5 text-xs text-red-600 shadow"
              >
                Xóa
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => heroInputRef.current?.click()}
            disabled={heroUploading}
            className="flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-sm text-gray-400 transition-colors hover:border-gray-300 hover:text-gray-600"
          >
            {heroUploading ? 'Đang upload...' : '+ Chọn ảnh chính'}
          </button>
        )}
        <input
          ref={heroInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleHeroUpload}
        />
      </div>

      {/* ── Gallery ── */}
      <div>
        <Label className="mb-2 block">
          Gallery ({config.gallery.length}/12 ảnh)
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {config.gallery.map((url, i) => (
            <div key={i} className="group relative">
              <img
                src={url}
                alt=""
                className="h-20 w-full rounded-lg object-cover"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-lg bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                {onAddToCanvas && (
                  <button
                    onClick={() => onAddToCanvas(url)}
                    className="rounded-full bg-blue-500 px-2 py-0.5 text-[10px] text-white hover:bg-blue-600"
                  >
                    + Chèn
                  </button>
                )}
                <button
                  onClick={() => removeGalleryImage(i)}
                  className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] text-white hover:bg-red-600"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
          {config.gallery.length < 12 && (
            <button
              onClick={() => galleryInputRef.current?.click()}
              disabled={galleryUploading}
              className="flex h-20 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-xs text-gray-400 transition-colors hover:border-gray-300"
            >
              {galleryUploading ? '...' : '+'}
            </button>
          )}
        </div>
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleGalleryUpload}
        />
      </div>
    </div>
  );
}
