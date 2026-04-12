'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { CardConfig, ScheduleItem } from '@/types/card';

interface Props {
  config: CardConfig;
  onChange: (patch: Partial<CardConfig>) => void;
}

export default function ContentPanel({ config, onChange }: Props) {
  const [newScheduleItem, setNewScheduleItem] = useState<ScheduleItem>({
    time: '',
    title: '',
    description: '',
  });

  const schedule = Array.isArray(config.schedule) ? config.schedule : [];
  const families = Array.isArray(config.families) ? config.families : [];

  // Local text state — avoids trim() stripping spaces while typing
  const [groomText, setGroomText] = useState(
    () => families.find((f) => f.side === 'groom')?.members.join('\n') ?? '',
  );
  const [brideText, setBrideText] = useState(
    () => families.find((f) => f.side === 'bride')?.members.join('\n') ?? '',
  );

  // Sync if config changes externally (e.g. card loaded)
  useEffect(() => {
    setGroomText(
      families.find((f) => f.side === 'groom')?.members.join('\n') ?? '',
    );
    setBrideText(
      families.find((f) => f.side === 'bride')?.members.join('\n') ?? '',
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.families]);

  function addScheduleItem() {
    if (!newScheduleItem.time || !newScheduleItem.title) return;
    onChange({ schedule: [...schedule, newScheduleItem] });
    setNewScheduleItem({ time: '', title: '', description: '' });
  }

  function removeScheduleItem(index: number) {
    onChange({ schedule: schedule.filter((_, i) => i !== index) });
  }

  // Only commit to config on blur — preserves spaces while typing
  function commitFamily(side: 'groom' | 'bride', text: string) {
    const existing = families.filter((f) => f.side !== side);
    const memberList = text
      .split('\n')
      .map((m) => m.trim())
      .filter(Boolean);
    onChange({ families: [...existing, { side, members: memberList }] });
  }

  return (
    <div className="space-y-6">
      {/* Love story */}
      <div className="space-y-1">
        <Label>Câu chuyện tình yêu</Label>
        <textarea
          value={config.loveStory}
          onChange={(e) => onChange({ loveStory: e.target.value })}
          placeholder="Kể câu chuyện của các bạn..."
          rows={5}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-gray-900 focus:outline-none"
        />
      </div>

      {/* Schedule */}
      <div>
        <Label className="mb-2 block">Lịch trình</Label>
        {schedule.map((item, i) => (
          <div
            key={i}
            className="mb-2 flex items-start gap-2 rounded border p-2 text-sm"
          >
            <div className="flex-1">
              <p className="font-medium">
                {item.time} — {item.title}
              </p>
              {item.description && (
                <p className="text-xs text-gray-500">{item.description}</p>
              )}
            </div>
            <button
              onClick={() => removeScheduleItem(i)}
              className="text-xs text-red-400 hover:text-red-600"
            >
              ✕
            </button>
          </div>
        ))}
        <div className="mt-3 space-y-2">
          <Input
            placeholder="Giờ (vd: 08:00)"
            value={newScheduleItem.time}
            onChange={(e) =>
              setNewScheduleItem((prev) => ({ ...prev, time: e.target.value }))
            }
          />
          <Input
            placeholder="Tên sự kiện"
            value={newScheduleItem.title}
            onChange={(e) =>
              setNewScheduleItem((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <Input
            placeholder="Mô tả (tùy chọn)"
            value={newScheduleItem.description}
            onChange={(e) =>
              setNewScheduleItem((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
          <Button
            size="sm"
            variant="outline"
            onClick={addScheduleItem}
            className="w-full"
          >
            + Thêm sự kiện
          </Button>
        </div>
      </div>

      {/* Families */}
      <div className="space-y-3">
        <Label>Gia đình nhà trai (mỗi người một dòng)</Label>
        <textarea
          value={groomText}
          onChange={(e) => setGroomText(e.target.value)}
          onBlur={(e) => commitFamily('groom', e.target.value)}
          rows={3}
          placeholder="Ông Nguyễn Văn A&#10;Bà Trần Thị B"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-gray-900 focus:outline-none"
        />
        <Label>Gia đình nhà gái (mỗi người một dòng)</Label>
        <textarea
          value={brideText}
          onChange={(e) => setBrideText(e.target.value)}
          onBlur={(e) => commitFamily('bride', e.target.value)}
          rows={3}
          placeholder="Ông Lê Văn C&#10;Bà Phạm Thị D"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-gray-900 focus:outline-none"
        />
      </div>
    </div>
  );
}
