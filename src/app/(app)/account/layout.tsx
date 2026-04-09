export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full px-6 py-8">
      <div className="mx-auto max-w-lg">{children}</div>
    </div>
  );
}
