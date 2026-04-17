export default function CardWishesLoading() {
  return (
    <div className="animate-pulse">
      {/* Back nav */}
      <div className="mb-6 flex items-center gap-3">
        <div className="h-4 w-20 rounded bg-gray-200" />
        <div className="h-4 w-3 rounded bg-gray-100" />
        <div className="h-6 w-40 rounded-lg bg-gray-200" />
      </div>

      <div className="mb-6 h-3.5 w-24 rounded bg-gray-100" />

      {/* Wish cards */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gray-200" />
              <div>
                <div className="h-4 w-28 rounded bg-gray-200" />
                <div className="mt-1 h-3 w-36 rounded bg-gray-100" />
              </div>
            </div>
            <div className="mt-3 space-y-1.5">
              <div className="h-3.5 w-full rounded bg-gray-100" />
              <div className="h-3.5 w-5/6 rounded bg-gray-100" />
              <div className="h-3.5 w-2/3 rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
