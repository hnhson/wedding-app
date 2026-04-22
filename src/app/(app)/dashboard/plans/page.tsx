import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Miễn phí',
    price: '0đ',
    desc: 'Dành cho cá nhân',
    current: true,
    features: [
      'Tạo tối đa 3 thiệp cưới',
      'Chia sẻ qua link & QR code',
      'Nhận RSVP online',
      'Sổ lưu bút',
      'Thống kê lượt xem cơ bản',
    ],
  },
  {
    name: 'Pro',
    price: '199.000đ',
    period: '/ tháng',
    desc: 'Cho đôi uyên ương',
    current: false,
    soon: true,
    features: [
      'Thiệp không giới hạn',
      'Tên miền riêng (yourdomain.com)',
      'Xoá watermark',
      'Nhạc nền tùy chỉnh',
      'Thống kê chi tiết',
      'Hỗ trợ ưu tiên',
    ],
  },
];

export default function PlansPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold text-gray-900">
        Gói dịch vụ của tôi
      </h1>
      <p className="mb-8 text-gray-500">
        Bạn đang dùng gói{' '}
        <span className="font-medium text-gray-800">Miễn phí</span>.
      </p>

      <div className="grid max-w-2xl gap-6 sm:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl border p-6 ${
              plan.current
                ? 'border-blue-200 bg-blue-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {plan.name}
                </h2>
                <p className="text-sm text-gray-500">{plan.desc}</p>
              </div>
              {plan.current && (
                <span className="rounded-full bg-blue-500 px-2.5 py-0.5 text-xs font-medium text-white">
                  Hiện tại
                </span>
              )}
            </div>

            <p className="mb-6 text-3xl font-bold text-gray-900">
              {plan.price}
              {plan.period && (
                <span className="text-base font-normal text-gray-400">
                  {plan.period}
                </span>
              )}
            </p>

            <ul className="mb-6 space-y-2">
              {plan.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-sm text-gray-600"
                >
                  <Check
                    size={15}
                    className="mt-0.5 flex-shrink-0 text-green-500"
                  />
                  {f}
                </li>
              ))}
            </ul>

            {plan.soon ? (
              <button
                disabled
                className="w-full cursor-not-allowed rounded-xl bg-gray-100 py-2.5 text-sm font-medium text-gray-400"
              >
                Sắp ra mắt
              </button>
            ) : (
              <button
                disabled
                className="w-full rounded-xl border-2 border-blue-500 py-2.5 text-sm font-medium text-blue-600"
              >
                Đang sử dụng
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
