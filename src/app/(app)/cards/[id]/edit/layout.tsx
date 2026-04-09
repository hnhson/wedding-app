// Editor cần full-width, không padding — override cards/layout.tsx
export default function EditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
