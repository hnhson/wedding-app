export default function RsvpCardLoading() {
  return (
    <div className="animate-pulse">
      {/* Back nav */}
      <div className="mb-6 flex items-center gap-3">
        <div className="h-4 w-16 rounded bg-gray-200" />
        <div className="h-4 w-3 rounded bg-gray-100" />
        <div className="h-6 w-44 rounded-lg bg-gray-200" />
      </div>

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

      {/* Attending list */}
      <div className="mb-6">
        <div className="mb-3 h-5 w-32 rounded bg-gray-200" />
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`flex items-center justify-between px-5 py-3.5 ${i < 3 ? 'border-b' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gray-200" />
                <div>
                  <div className="h-4 w-28 rounded bg-gray-200" />
                  <div className="mt-1 h-3 w-36 rounded bg-gray-100" />
                </div>
              </div>
              <div className="h-7 w-16 rounded-full bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
