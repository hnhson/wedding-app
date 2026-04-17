'use client';

import { useState } from 'react';
import {
  MessageCircle,
  Send,
  Clock,
  CheckCircle2,
  MessageSquareReply,
} from 'lucide-react';

interface FeedbackEntry {
  id: string;
  type: string;
  message: string;
  submittedAt: string;
  status: 'pending' | 'reviewed' | 'replied';
  reply?: string;
}

const STORAGE_KEY = 'wedding_app_feedback';

const TYPE_LABELS: Record<string, string> = {
  suggestion: '💡 Góp ý tính năng',
  bug: '🐛 Báo lỗi',
  other: '💬 Khác',
};

const STATUS_CONFIG = {
  pending: {
    label: 'Đang xem xét',
    icon: Clock,
    className: 'text-amber-600 bg-amber-50',
  },
  reviewed: {
    label: 'Đã tiếp nhận',
    icon: CheckCircle2,
    className: 'text-green-600 bg-green-50',
  },
  replied: {
    label: 'Đã phản hồi',
    icon: MessageSquareReply,
    className: 'text-blue-600 bg-blue-50',
  },
};

export default function FeedbackPage() {
  const [type, setType] = useState('suggestion');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [feedbacks, setFeedbacks] = useState<FeedbackEntry[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as FeedbackEntry[]) : [];
    } catch {
      return [];
    }
  });

  const types = [
    { value: 'suggestion', label: '💡 Góp ý tính năng' },
    { value: 'bug', label: '🐛 Báo lỗi' },
    { value: 'other', label: '💬 Khác' },
  ];

  function saveFeedbacks(list: FeedbackEntry[]) {
    setFeedbacks(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    const newEntry: FeedbackEntry = {
      id: Date.now().toString(),
      type,
      message: message.trim(),
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };

    saveFeedbacks([newEntry, ...feedbacks]);
    setLoading(false);
    setSuccess(true);
    setMessage('');

    setTimeout(() => setSuccess(false), 3000);
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div className="max-w-2xl space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
          <MessageCircle size={20} className="text-blue-500" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Đóng góp ý kiến
          </h1>
          <p className="text-sm text-gray-400">
            Ý kiến của bạn giúp chúng tôi hoàn thiện hơn
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
      >
        {/* Success banner */}
        {success && (
          <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
            <CheckCircle2 size={16} />
            Cảm ơn bạn! Ý kiến đã được ghi nhận.
          </div>
        )}

        {/* Type selector */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Loại phản hồi
          </label>
          <div className="flex flex-wrap gap-2">
            {types.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className={`rounded-full px-4 py-1.5 text-sm transition ${
                  type === t.value
                    ? 'bg-gray-900 text-white'
                    : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Nội dung
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Chia sẻ ý kiến của bạn về Thiệp Cưới..."
            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 transition outline-none focus:border-gray-400 focus:bg-white"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="flex items-center gap-2 rounded-full bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700 disabled:opacity-50"
        >
          <Send size={14} />
          {loading ? 'Đang gửi...' : 'Gửi phản hồi'}
        </button>
      </form>

      {/* Feedback history */}
      {feedbacks.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-gray-800">
            Ý kiến đã gửi ({feedbacks.length})
          </h2>

          <div className="space-y-3">
            {feedbacks.map((fb) => {
              const status = STATUS_CONFIG[fb.status];
              const StatusIcon = status.icon;
              return (
                <div
                  key={fb.id}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                >
                  {/* Top row */}
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {TYPE_LABELS[fb.type] ?? fb.type}
                      </span>
                      <span className="text-gray-200">·</span>
                      <span className="text-xs text-gray-400">
                        {formatDate(fb.submittedAt)}
                      </span>
                    </div>
                    <span
                      className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
                    >
                      <StatusIcon size={11} />
                      {status.label}
                    </span>
                  </div>

                  {/* Message */}
                  <p className="text-sm leading-relaxed text-gray-700">
                    {fb.message}
                  </p>

                  {/* Reply (if any) */}
                  {fb.reply && (
                    <div className="mt-4 rounded-xl border-l-2 border-blue-200 bg-blue-50 px-4 py-3">
                      <p className="mb-1 text-xs font-medium text-blue-600">
                        Phản hồi từ đội ngũ
                      </p>
                      <p className="text-sm text-blue-800">{fb.reply}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state for history */}
      {feedbacks.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-200 py-12 text-center text-gray-400">
          <MessageCircle size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Chưa có ý kiến nào được gửi</p>
        </div>
      )}
    </div>
  );
}
