import { Gift } from 'lucide-react';

export default function GiftsPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold text-gray-900">Quà tặng</h1>
      <p className="mb-8 text-sm text-gray-400">
        Quản lý danh sách quà tặng và đóng góp từ khách mời
      </p>

      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-24 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50">
          <Gift size={28} className="text-rose-400" />
        </div>
        <h2 className="text-lg font-medium text-gray-700">Sắp ra mắt</h2>
        <p className="mt-2 max-w-sm text-sm text-gray-400">
          Tính năng quản lý quà tặng, wishlist và nhận đóng góp trực tuyến đang
          được phát triển.
        </p>
        <span className="mt-6 rounded-full bg-amber-100 px-4 py-1.5 text-xs font-medium text-amber-700">
          Coming soon
        </span>
      </div>
    </div>
  );
}
