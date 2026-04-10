'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import PasswordInput from '@/components/ui/PasswordInput';

export default function ChangePasswordForm() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (newPassword.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.updateUser({
      password: newPassword,
    });
    setLoading(false);

    if (err) {
      setError(err.message);
    } else {
      setSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          ✓ Đổi mật khẩu thành công!
        </p>
      )}

      <div className="space-y-1">
        <Label htmlFor="new-password">Mật khẩu mới</Label>
        <PasswordInput
          id="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Ít nhất 8 ký tự"
          autoComplete="new-password"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
        <PasswordInput
          id="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Nhập lại mật khẩu mới"
          autoComplete="new-password"
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Đang lưu...' : 'Đổi mật khẩu'}
      </Button>
    </form>
  );
}
