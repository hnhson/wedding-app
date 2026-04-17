export default function DashboardLoading() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 h-3.5 w-16 rounded bg-gray-200" />
          <div className="h-7 w-40 rounded-lg bg-gray-200" />
        </div>
        <div className="h-9 w-36 rounded-full bg-gray-200" />
      </div>

      {/* Stat cards */}
      <section className="mb-10">
        <div className="mb-4 h-4 w-20 rounded bg-gray-200" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="h-5 w-5 rounded bg-gray-200" />
              <div className="mt-2 h-7 w-10 rounded bg-gray-200" />
              <div className="mt-1.5 h-3 w-full rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </section>

      {/* Cards list */}
      <section>
        <div className="mb-4 h-4 w-24 rounded bg-gray-200" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col rounded-xl border bg-white shadow-sm">
              <div className="border-b px-5 py-4">
                <div className="h-5 w-3/4 rounded bg-gray-200" />
                <div className="mt-2 h-3.5 w-1/2 rounded bg-gray-100" />
                <div className="mt-1.5 h-3 w-2/3 rounded bg-gray-100" />
              </div>
              <div className="flex divide-x border-b text-center">
                <div className="flex-1 py-3">
                  <div className="mx-auto h-6 w-8 rounded bg-gray-200" />
                  <div className="mx-auto mt-1 h-3 w-14 rounded bg-gray-100" />
                </div>
                <div className="flex-1 py-3">
                  <div className="mx-auto h-6 w-8 rounded bg-gray-200" />
                  <div className="mx-auto mt-1 h-3 w-10 rounded bg-gray-100" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 p-4">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="h-9 rounded-lg bg-gray-100" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
