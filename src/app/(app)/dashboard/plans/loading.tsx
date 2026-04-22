export default function PlansLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-2 h-7 w-44 rounded-lg bg-gray-200" />
      <div className="mb-8 h-3.5 w-56 rounded bg-gray-100" />

      <div className="grid max-w-2xl gap-6 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <div className="h-5 w-24 rounded bg-gray-200" />
                <div className="mt-1.5 h-3.5 w-36 rounded bg-gray-100" />
              </div>
              <div className="h-6 w-16 rounded-full bg-gray-200" />
            </div>
            <div className="mb-6 h-8 w-20 rounded bg-gray-200" />
            <div className="mb-6 space-y-2.5">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-gray-200" />
                  <div className="h-3.5 w-40 rounded bg-gray-100" />
                </div>
              ))}
            </div>
            <div className="h-10 w-full rounded-xl bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
