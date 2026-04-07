'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Wish } from '@/types/rsvp'

interface Props {
  cardId: string
}

export default function GuestbookSection({ cardId }: Props) {
  const [wishes, setWishes] = useState<Wish[]>([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/wishes?cardId=${cardId}`)
      .then(r => r.json())
      .then((data: Wish[]) => setWishes(data))
      .catch(() => {})
  }, [cardId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !message.trim()) {
      setError('Vui lòng điền đầy đủ họ tên và lời chúc')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId, name, message }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Có lỗi xảy ra')
        return
      }
      const newWish = (await res.json()) as Wish
      setWishes(prev => [newWish, ...prev])
      setSubmitted(true)
      setName('')
      setMessage('')
    } catch {
      setError('Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Submission form */}
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="space-y-1">
            <Label htmlFor="wish-name">Họ tên *</Label>
            <Input
              id="wish-name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nguyễn Văn A"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="wish-message">Lời chúc *</Label>
            <textarea
              id="wish-message"
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={4}
              placeholder="Chúc mừng hạnh phúc..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Đang gửi...' : 'Gửi lời chúc'}
          </Button>
        </form>
      ) : (
        <div className="rounded-lg bg-green-50 p-4 text-center">
          <p className="text-sm font-medium text-green-800">
            ✓ Lời chúc của bạn đã được gửi!
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-2 text-xs text-green-600 hover:underline"
          >
            Gửi thêm
          </button>
        </div>
      )}

      {/* Wishes list */}
      {wishes.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            {wishes.length} lời chúc
          </h3>
          {wishes.map(wish => (
            <div key={wish.id} className="rounded-lg border bg-white p-4">
              <p className="text-sm font-semibold text-gray-900">{wish.name}</p>
              <p className="mt-1 text-sm text-gray-700">{wish.message}</p>
              <p className="mt-2 text-xs text-gray-400">
                {new Date(wish.created_at).toLocaleDateString('vi-VN')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
