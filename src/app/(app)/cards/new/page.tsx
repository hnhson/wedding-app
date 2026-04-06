'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TEMPLATES } from '@/lib/templates/data';

export default function NewCardPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [partner1, setPartner1] = useState('');
  const [partner2, setPartner2] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [templateId, setTemplateId] = useState('classic');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        body: JSON.stringify({ partner1, partner2, weddingDate, templateId }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? 'Có lỗi xảy ra');
        return;
      }
      const card = await res.json();
      router.push(`/cards/${card.id}/edit`);
    } catch {
      setError('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  }

  if (step === 1) {
    return (
      <div className="mx-auto max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle>Tạo thiệp cưới mới</CardTitle>
            <CardDescription>
              Điền thông tin cơ bản của đôi uyên ương
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleStep1}>
            <CardContent className="space-y-4">
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="space-y-1">
                <Label htmlFor="partner1">Tên người 1</Label>
                <Input
                  id="partner1"
                  value={partner1}
                  onChange={(e) => setPartner1(e.target.value)}
                  placeholder="Nguyễn Văn An"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="partner2">Tên người 2</Label>
                <Input
                  id="partner2"
                  value={partner2}
                  onChange={(e) => setPartner2(e.target.value)}
                  placeholder="Trần Thị Bình"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="weddingDate">Ngày cưới</Label>
                <Input
                  id="weddingDate"
                  type="date"
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                Tiếp theo: Chọn template
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Chọn template</h1>
        <p className="mt-1 text-gray-600">
          Thiệp của <strong>{partner1}</strong> & <strong>{partner2}</strong> —{' '}
          {new Date(weddingDate).toLocaleDateString('vi-VN')}
        </p>
      </div>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        {TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => setTemplateId(template.id)}
            className={`rounded-lg border-2 p-4 text-left transition-colors ${
              templateId === template.id
                ? 'border-gray-900 bg-gray-50'
                : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            <div className="mb-2 flex h-24 items-center justify-center rounded bg-gradient-to-br from-gray-100 to-gray-200 text-sm text-gray-400">
              {template.layout}
            </div>
            <p className="font-medium text-gray-900">{template.name}</p>
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setStep(1)}>
          Quay lại
        </Button>
        <Button onClick={handleCreate} disabled={loading}>
          {loading ? 'Đang tạo...' : 'Tạo thiệp'}
        </Button>
      </div>
    </div>
  );
}
