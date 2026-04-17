import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Footer from '@/components/Footer';
import Logo from '@/components/Logo';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const avatarUrl = user.user_metadata?.avatar_url as string | undefined;
  const initial = (user.email ?? 'U')[0].toUpperCase();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header — full width, no max-w constraint */}
      <header className="border-b bg-white px-6 py-2.5">
        <div className="flex items-center justify-between">
          <Link href="/" title="Trang chủ" className="flex-shrink-0">
            <Logo size={32} variant="dark" showText={false} />
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/account"
              title={user.email}
              className="flex items-center gap-2.5 rounded-full py-1 pr-3 pl-1 transition-colors hover:bg-gray-100"
            >
              <span className="flex-shrink-0 overflow-hidden rounded-full ring-2 ring-transparent transition-all hover:ring-gray-300">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">
                    {initial}
                  </div>
                )}
              </span>
              <span className="hidden max-w-[160px] truncate text-sm text-gray-600 sm:block">
                {user.email}
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Body — full width, children control their own layout */}
      <div className="flex flex-1">{children}</div>

      <Footer />
    </div>
  );
}
