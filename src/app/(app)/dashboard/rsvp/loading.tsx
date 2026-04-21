export default function RsvpLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-1 h-7 w-40 rounded-lg bg-gray-200" />
      <div className="mb-6 h-3.5 w-48 rounded bg-gray-100" />

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border bg-white p-4 text-center shadow-sm"
          >
            <div className="mx-auto h-7 w-10 rounded bg-gray-200" />
            <div className="mx-auto mt-2 h-3 w-16 rounded bg-gray-100" />
          </div>
        ))}
      </div>

      {/* Card rows */}
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl border bg-white px-5 py-4 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-gray-200" />
              <div>
                <div className="h-4 w-36 rounded bg-gray-200" />
                <div className="mt-1.5 h-3 w-44 rounded bg-gray-100" />
              </div>
            </div>
            <div className="h-5 w-8 rounded-full bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
