import Sidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="-mx-6 -my-8 flex" style={{ minHeight: 'calc(100vh - 57px)' }}>
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
}
