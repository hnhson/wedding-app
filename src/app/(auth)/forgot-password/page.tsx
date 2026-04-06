'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { validateEmail } from '@/lib/validation';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [serverError, setServerError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }

    setEmailError('');
    setServerError('');
    setLoading(true);

    const supabase = createClient();
    const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/settings`,
      },
    );

    setLoading(false);

    if (supabaseError) {
      setServerError(supabaseError.message);
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Đã gửi link đặt lại mật khẩu</CardTitle>
          <CardDescription>
            Kiểm tra email <strong>{email}</strong> và nhấn vào link để đặt mật
            khẩu mới. Link có hiệu lực trong 1 giờ.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/login" className="text-sm text-blue-600 hover:underline">
            Quay lại đăng nhập
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quên mật khẩu</CardTitle>
        <CardDescription>
          Nhập email của bạn — chúng tôi sẽ gửi link đặt lại mật khẩu
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {serverError && <p className="text-sm text-red-600">{serverError}</p>}
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="an@example.com"
            />
            {emailError && <p className="text-sm text-red-600">{emailError}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Đang gửi...' : 'Gửi link đặt lại mật khẩu'}
          </Button>
          <Link href="/login" className="text-sm text-blue-600 hover:underline">
            Quay lại đăng nhập
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
