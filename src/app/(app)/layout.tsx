import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Footer from '@/components/Footer';
import Logo from '@/components/Logo';
import AppHeaderAvatar from '@/components/AppHeaderAvatar';

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

          <AppHeaderAvatar
            avatarUrl={avatarUrl}
            email={user.email ?? ''}
            initial={initial}
          />
        </div>
      </header>

      {/* Body — full width, children control their own layout */}
      <div className="flex flex-1">{children}</div>

      <Footer />
    </div>
  );
}
