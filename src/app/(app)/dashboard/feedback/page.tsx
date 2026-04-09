'use client';

import { useState } from 'react';
import { MessageCircle, Send, CheckCircle } from 'lucide-react';

export default function FeedbackPage() {
  const [type, setType] = useState('suggestion');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const types = [
    { value: 'suggestion', label: '💡 Góp ý tính năng' },
    { value: 'bug', label: '🐛 Báo lỗi' },
    { value: 'other', label: '💬 Khác' },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    // Simulate sending (no backend yet)
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <CheckCircle size={48} className="mb-4 text-green-500" />
        <h2 className="text-xl font-semibold text-gray-900">
          Cảm ơn bạn đã góp ý!
        </h2>
        <p className="mt-2 text-gray-500">
          Chúng tôi sẽ xem xét và cải thiện sản phẩm dựa trên phản hồi của bạn.
        </p>
        <button
          onClick={() => { setSent(false); setMessage(''); }}
          className="mt-6 rounded-full border border-gray-300 px-5 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          Gửi thêm ý kiến
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
          <MessageCircle size={20} className="text-blue-500" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Đóng góp ý kiến</h1>
          <p className="text-sm text-gray-400">
            Ý kiến của bạn giúp chúng tôi hoàn thiện hơn
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
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
            rows={5}
            placeholder="Chia sẻ ý kiến của bạn về Thiệp Cưới..."
            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-gray-400 focus:bg-white focus:ring-0"
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
    </div>
  );
}
