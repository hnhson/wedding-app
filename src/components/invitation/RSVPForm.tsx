'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  cardId: string;
}

export default function RSVPForm({ cardId }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [attending, setAttending] = useState<boolean | null>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || attending === null) {
      setError('Vui lòng điền tên và xác nhận tham dự');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId,
          name,
          email,
          attending,
          guestCount: attending ? guestCount : 0,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? 'Có lỗi xảy ra');
        return;
      }
      setSubmitted(true);
    } catch {
      setError('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg bg-green-50 p-6 text-center">
        <p className="text-lg font-semibold text-green-800">
          {attending
            ? '🎉 Cảm ơn bạn đã xác nhận tham dự!'
            : 'Cảm ơn bạn đã phản hồi!'}
        </p>
        <p className="mt-2 text-sm text-green-600">
          {attending
            ? 'Chúng tôi rất vui khi được gặp bạn!'
            : 'Chúng tôi rất tiếc khi bạn không thể tham dự.'}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="space-y-1">
        <Label htmlFor="rsvp-name">Họ tên *</Label>
        <Input
          id="rsvp-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nguyễn Văn A"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="rsvp-email">Email (để nhận xác nhận)</Label>
        <Input
          id="rsvp-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label>Bạn có tham dự không? *</Label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setAttending(true)}
            className={`flex-1 rounded-md border py-2 text-sm font-medium transition-colors ${
              attending === true
                ? 'border-green-600 bg-green-50 text-green-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            ✓ Tôi sẽ tham dự
          </button>
          <button
            type="button"
            onClick={() => setAttending(false)}
            className={`flex-1 rounded-md border py-2 text-sm font-medium transition-colors ${
              attending === false
                ? 'border-red-400 bg-red-50 text-red-600'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            ✗ Tôi không thể đến
          </button>
        </div>
      </div>

      {attending && (
        <div className="space-y-1">
          <Label htmlFor="rsvp-guests">Số người tham dự (bao gồm bạn)</Label>
          <Input
            id="rsvp-guests"
            type="number"
            min={1}
            max={10}
            value={guestCount}
            onChange={(e) => setGuestCount(Number(e.target.value))}
          />
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Đang gửi...' : 'Xác nhận'}
      </Button>
    </form>
  );
}
