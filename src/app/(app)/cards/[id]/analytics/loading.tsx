export default function AnalyticsLoading() {
  return (
    <div className="animate-pulse">
      {/* Back nav */}
      <div className="mb-6 flex items-center gap-3">
        <div className="h-4 w-24 rounded bg-gray-200" />
        <div className="h-4 w-3 rounded bg-gray-100" />
        <div className="h-6 w-48 rounded-lg bg-gray-200" />
      </div>

      {/* Stat chips */}
      <div className="mb-8 flex flex-wrap gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-8 w-28 rounded-full bg-gray-200" />
        ))}
      </div>

      {/* Chart */}
      <div className="mb-6 rounded-2xl border bg-white p-5 shadow-sm">
        <div className="mb-4 h-4 w-32 rounded bg-gray-200" />
        <div className="flex h-40 items-end gap-1.5">
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-gray-100"
              style={{ height: `${20 + Math.sin(i) * 15 + 20}%` }}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-3 w-12 rounded bg-gray-100" />
          ))}
        </div>
      </div>

      {/* RSVP table */}
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="mb-4 h-4 w-24 rounded bg-gray-200" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-1">
              <div className="h-3.5 w-28 rounded bg-gray-200" />
              <div className="h-3.5 w-16 rounded bg-gray-100" />
              <div className="h-5 w-16 rounded-full bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
