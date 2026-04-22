export default function AccountLoading() {
  return (
    <div className="mx-auto max-w-lg animate-pulse">
      <div className="mb-8 h-7 w-28 rounded-lg bg-gray-200" />

      {/* Avatar section */}
      <div className="mb-6 rounded-lg border bg-white p-6">
        <div className="mb-4 h-4 w-32 rounded bg-gray-200" />
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gray-200" />
          <div className="h-8 w-28 rounded-lg bg-gray-100" />
        </div>
      </div>

      {/* Account info */}
      <div className="mb-6 rounded-lg border bg-white p-6">
        <div className="mb-4 h-4 w-40 rounded bg-gray-200" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-3.5 w-20 rounded bg-gray-100" />
              <div className="h-3.5 w-40 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>

      {/* Password section */}
      <div className="rounded-lg border bg-white p-6">
        <div className="mb-4 h-4 w-28 rounded bg-gray-200" />
        <div className="space-y-3">
          <div className="h-10 w-full rounded-lg bg-gray-100" />
          <div className="h-10 w-full rounded-lg bg-gray-100" />
          <div className="h-9 w-28 rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
