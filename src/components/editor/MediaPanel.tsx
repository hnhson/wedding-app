'use client'

import { useRef, useState } from 'react'
import { Label } from '@/components/ui/label'
import type { CardConfig } from '@/types/card'

interface Props {
  config: CardConfig
  onChange: (patch: Partial<CardConfig>) => void
  cardId: string
}

async function uploadFile(file: File): Promise<string> {
  const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
    method: 'POST',
    headers: { 'Content-Type': file.type },
    body: file,
  })
  if (!res.ok) throw new Error('Upload thất bại')
  const data = await res.json()
  return data.url as string
}

export default function MediaPanel({ config, onChange }: Props) {
  const heroInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const [heroUploading, setHeroUploading] = useState(false)
  const [galleryUploading, setGalleryUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleHeroUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setHeroUploading(true)
    setError('')
    try {
      const url = await uploadFile(file)
      onChange({ heroImage: url })
    } catch {
      setError('Lỗi upload ảnh chính')
    } finally {
      setHeroUploading(false)
    }
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    if (config.gallery.length + files.length > 12) {
      setError('Tối đa 12 ảnh trong gallery')
      return
    }
    setGalleryUploading(true)
    setError('')
    try {
      const urls = await Promise.all(files.map(uploadFile))
      onChange({ gallery: [...config.gallery, ...urls] })
    } catch {
      setError('Lỗi upload ảnh gallery')
    } finally {
      setGalleryUploading(false)
    }
  }

  function removeGalleryImage(index: number) {
    onChange({ gallery: config.gallery.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-6">
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Hero image */}
      <div>
        <Label className="mb-2 block">Ảnh chính</Label>
        {config.heroImage ? (
          <div className="relative">
            <img src={config.heroImage} alt="Hero" className="h-40 w-full rounded object-cover" />
            <button
              onClick={() => onChange({ heroImage: null })}
              className="absolute right-2 top-2 rounded-full bg-white px-2 py-0.5 text-xs text-red-600 shadow"
            >
              Xóa
            </button>
          </div>
        ) : (
          <button
            onClick={() => heroInputRef.current?.click()}
            disabled={heroUploading}
            className="flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-sm text-gray-500 hover:border-gray-400"
          >
            {heroUploading ? 'Đang upload...' : '+ Chọn ảnh chính'}
          </button>
        )}
        <input ref={heroInputRef} type="file" accept="image/*" className="hidden" onChange={handleHeroUpload} />
      </div>

      {/* Gallery */}
      <div>
        <Label className="mb-2 block">Gallery ({config.gallery.length}/12 ảnh)</Label>
        <div className="grid grid-cols-3 gap-2">
          {config.gallery.map((url, i) => (
            <div key={i} className="relative">
              <img src={url} alt="" className="h-20 w-full rounded object-cover" />
              <button
                onClick={() => removeGalleryImage(i)}
                className="absolute right-1 top-1 rounded-full bg-white px-1.5 py-0.5 text-xs text-red-600 shadow"
              >
                ✕
              </button>
            </div>
          ))}
          {config.gallery.length < 12 && (
            <button
              onClick={() => galleryInputRef.current?.click()}
              disabled={galleryUploading}
              className="flex h-20 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-xs text-gray-500 hover:border-gray-400"
            >
              {galleryUploading ? '...' : '+'}
            </button>
          )}
        </div>
        <input ref={galleryInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
      </div>
    </div>
  )
}
