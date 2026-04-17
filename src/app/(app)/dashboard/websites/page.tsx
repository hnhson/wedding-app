import { Globe } from 'lucide-react';

export default function WebsitesPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold text-gray-900">
        Website khác
      </h1>
      <p className="mb-8 text-sm text-gray-400">
        Tạo website riêng cho ngày cưới của bạn
      </p>

      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-24 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
          <Globe size={28} className="text-gray-400" />
        </div>
        <h2 className="text-lg font-medium text-gray-700">Sắp ra mắt</h2>
        <p className="mt-2 max-w-sm text-sm text-gray-400">
          Tính năng tạo website cưới với tên miền riêng đang được phát triển.
          Hãy theo dõi để không bỏ lỡ!
        </p>
        <span className="mt-6 rounded-full bg-amber-100 px-4 py-1.5 text-xs font-medium text-amber-700">
          Coming soon
        </span>
      </div>
    </div>
  );
}
