export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-white py-6">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
          <p className="text-sm text-gray-400">
            © {year}{' '}
            <span className="font-medium text-gray-600">Thiệp Cưới</span> · Tạo
            thiệp cưới đẹp, chia sẻ dễ dàng
          </p>
          <p className="text-xs text-gray-300">Made with ♥ in Vietnam</p>
        </div>
      </div>
    </footer>
  );
}
