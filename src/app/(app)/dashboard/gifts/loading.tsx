export default function GiftsLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-2 h-7 w-36 rounded-lg bg-gray-200" />
      <div className="mb-8 h-3.5 w-48 rounded bg-gray-100" />
      <div className="flex h-64 w-full items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-gray-200" />
          <div className="mx-auto h-4 w-32 rounded bg-gray-200" />
          <div className="mx-auto mt-2 h-3 w-44 rounded bg-gray-100" />
        </div>
      </div>
    </div>
  );
}
