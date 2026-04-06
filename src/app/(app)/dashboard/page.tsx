import { createClient } from '@/lib/supabase/server';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-600">
            Xin chào, {user?.user_metadata?.full_name ?? user?.email}
          </p>
        </div>
        <Link href="/cards/new" className={buttonVariants()}>
          Tạo thiệp mới
        </Link>
      </div>
      <p className="text-gray-500">
        Bạn chưa có thiệp nào. Tạo thiệp đầu tiên!
      </p>
    </div>
  );
}
