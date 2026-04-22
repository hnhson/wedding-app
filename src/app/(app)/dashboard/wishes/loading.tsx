export default function WishesLoading() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="mb-1 h-7 w-28 rounded-lg bg-gray-200" />
      <div className="mb-6 h-3.5 w-40 rounded bg-gray-100" />

      {/* Card rows */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl border bg-white px-5 py-4 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-gray-200" />
              <div>
                <div className="h-4 w-36 rounded bg-gray-200" />
                <div className="mt-1.5 h-3 w-24 rounded bg-gray-100" />
              </div>
            </div>
            <div className="h-5 w-8 rounded-full bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
