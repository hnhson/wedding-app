export default function CardsLoading() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="h-7 w-32 rounded-lg bg-gray-200" />
          <div className="mt-2 h-3.5 w-24 rounded bg-gray-100" />
        </div>
        <div className="h-9 w-36 rounded-full bg-gray-200" />
      </div>

      {/* Cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col rounded-xl border bg-white shadow-sm"
          >
            <div className="border-b px-5 py-4">
              <div className="h-5 w-3/4 rounded bg-gray-200" />
              <div className="mt-2 h-3.5 w-1/2 rounded bg-gray-100" />
              <div className="mt-1.5 h-3 w-2/3 rounded bg-gray-100" />
            </div>
            <div className="flex divide-x border-b">
              <div className="flex-1 py-3 text-center">
                <div className="mx-auto h-6 w-8 rounded bg-gray-200" />
                <div className="mx-auto mt-1 h-3 w-14 rounded bg-gray-100" />
              </div>
              <div className="flex-1 py-3 text-center">
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
    </div>
  );
}
