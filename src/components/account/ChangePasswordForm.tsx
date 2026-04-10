'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import PasswordInput from '@/components/ui/PasswordInput';

export default function ChangePasswordForm() {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  function handleCancel() {
    setOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!currentPassword) {
      setError('Vui lòng nhập mật khẩu hiện tại');
      return;
    }
    if (newPassword.length < 8) {
      setError('Mật khẩu mới phải có ít nhất 8 ký tự');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    const supabase = createClient();

    // Verify current password by re-signing in
    const { data: userData } = await supabase.auth.getUser();
    const email = userData.user?.email ?? '';
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });

    if (signInErr) {
      setLoading(false);
      setError('Mật khẩu hiện tại không đúng');
      return;
    }

    // Update to new password
    const { error: updateErr } = await supabase.auth.updateUser({
      password: newPassword,
    });
    setLoading(false);

    if (updateErr) {
      setError(updateErr.message);
    } else {
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      // Close form after short delay
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
      }, 2000);
    }
  }

  if (!open) {
    return (
      <Button variant="outline" onClick={() => setOpen(true)}>
        Đổi mật khẩu
      </Button>
    );
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
        <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
        <PasswordInput
          id="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Nhập mật khẩu hiện tại"
          autoComplete="current-password"
        />
      </div>

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
        <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
        <PasswordInput
          id="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Nhập lại mật khẩu mới"
          autoComplete="new-password"
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Đang lưu...' : 'Xác nhận đổi mật khẩu'}
        </Button>
        <Button type="button" variant="ghost" onClick={handleCancel}>
          Hủy
        </Button>
      </div>
    </form>
  );
}
