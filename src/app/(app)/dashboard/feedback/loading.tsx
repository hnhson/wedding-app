export default function FeedbackLoading() {
  return (
    <div className="max-w-2xl animate-pulse space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gray-200" />
        <div>
          <div className="h-6 w-40 rounded-lg bg-gray-200" />
          <div className="mt-1.5 h-3.5 w-56 rounded bg-gray-100" />
        </div>
      </div>

      {/* Form skeleton */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 h-3.5 w-28 rounded bg-gray-200" />
        <div className="mb-5 flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-8 w-28 rounded-full bg-gray-100" />
          ))}
        </div>
        <div className="mb-2 h-3.5 w-20 rounded bg-gray-200" />
        <div className="mb-5 h-28 w-full rounded-xl bg-gray-100" />
        <div className="h-9 w-32 rounded-full bg-gray-200" />
      </div>
    </div>
  );
}
