'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TEMPLATES } from '@/lib/templates/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface Props {
  trigger?: React.ReactNode;
}

export default function NewCardDialog({ trigger }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [partner1, setPartner1] = useState('');
  const [partner2, setPartner2] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [weddingTime, setWeddingTime] = useState('');
  const [templateId, setTemplateId] = useState('classic');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function reset() {
    setStep(1);
    setPartner1('');
    setPartner2('');
    setWeddingDate('');
    setWeddingTime('');
    setTemplateId('classic');
    setError('');
    setLoading(false);
  }

  function handleOpen() {
    reset();
    setOpen(true);
  }

  function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    if (!partner1.trim() || !partner2.trim() || !weddingDate) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    setError('');
    setStep(2);
  }

  async function handleCreate() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partner1, partner2, weddingDate, weddingTime, templateId }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? 'Có lỗi xảy ra');
        return;
      }
      const card = (await res.json()) as { id: string };
      setOpen(false);
      router.push(`/cards/${card.id}/edit`);
    } catch {
      setError('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Trigger button */}
      <span onClick={handleOpen} style={{ cursor: 'pointer' }}>
        {trigger ?? (
          <button className="inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700">
            + Tạo thiệp mới
          </button>
        )}
      </span>

      <Dialog
        open={open}
        onOpenChange={(o) => {
          if (!o) reset();
          setOpen(o);
        }}
      >
        <DialogContent className={step === 2 ? 'sm:max-w-2xl' : 'sm:max-w-md'}>
          {/* ── Step 1: Thông tin cơ bản ── */}
          {step === 1 && (
            <>
              <DialogHeader>
                <DialogTitle>Tạo thiệp cưới mới</DialogTitle>
                <DialogDescription>
                  Điền thông tin cơ bản của đôi uyên ương
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleStep1} className="mt-2 space-y-4">
                {error && <p className="text-sm text-red-600">{error}</p>}

                <div className="space-y-1.5">
                  <Label htmlFor="nc-partner1">Tên cô dâu</Label>
                  <Input
                    id="nc-partner1"
                    value={partner1}
                    onChange={(e) => setPartner1(e.target.value)}
                    placeholder="Trần Thị Bình"
                    autoFocus
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="nc-partner2">Tên chú rể</Label>
                  <Input
                    id="nc-partner2"
                    value={partner2}
                    onChange={(e) => setPartner2(e.target.value)}
                    placeholder="Nguyễn Văn An"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="nc-date">Ngày cưới</Label>
                    <Input
                      id="nc-date"
                      type="date"
                      value={weddingDate}
                      onChange={(e) => setWeddingDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="nc-time">Giờ tổ chức</Label>
                    <Input
                      id="nc-time"
                      type="time"
                      value={weddingTime}
                      onChange={(e) => setWeddingTime(e.target.value)}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Tiếp theo: Chọn mẫu thiệp →
                </Button>
              </form>
            </>
          )}

          {/* ── Step 2: Chọn template ── */}
          {step === 2 && (
            <>
              <DialogHeader>
                <DialogTitle>Chọn mẫu thiệp</DialogTitle>
                <DialogDescription>
                  {partner1} &amp; {partner2} —{' '}
                  {new Date(weddingDate).toLocaleDateString('vi-VN')}
                </DialogDescription>
              </DialogHeader>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="mt-2 grid max-h-[55vh] grid-cols-3 gap-3 overflow-y-auto pr-1">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTemplateId(t.id)}
                    className={`rounded-xl border-2 p-3 text-left transition-colors ${
                      templateId === t.id
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <div className="mb-2 flex h-20 items-center justify-center rounded bg-gradient-to-br from-gray-100 to-gray-200 text-xs text-gray-400">
                      {t.layout}
                    </div>
                    <p className="text-xs font-medium text-gray-900">
                      {t.name}
                    </p>
                  </button>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  ← Quay lại
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Đang tạo...' : 'Tạo thiệp ✦'}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
