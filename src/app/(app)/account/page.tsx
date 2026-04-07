import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ChangePasswordForm from '@/components/account/ChangePasswordForm';

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const createdAt = new Date(user.created_at).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-8 text-2xl font-semibold text-gray-900">Tài khoản</h1>

      {/* Account info */}
      <div className="mb-6 rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-gray-900">
          Thông tin tài khoản
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Email</span>
            <span className="text-sm font-medium text-gray-900">
              {user.email}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Ngày tạo</span>
            <span className="text-sm text-gray-700">{createdAt}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Trạng thái</span>
            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
              ✓ Đã xác nhận
            </span>
          </div>
        </div>
      </div>

      {/* Change password */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-gray-900">
          Đổi mật khẩu
        </h2>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
