'use client';

import { useState } from 'react';
import PasswordInput from '@/components/ui/PasswordInput';
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
import {
  validateEmail,
  validatePassword,
  validateName,
} from '@/lib/validation';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});
  const [serverError, setServerError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (nameError || emailError || passwordError) {
      setErrors({
        name: nameError ?? undefined,
        email: emailError ?? undefined,
        password: passwordError ?? undefined,
      });
      return;
    }

    setErrors({});
    setServerError('');
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      setServerError(error.message);
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Kiểm tra email của bạn</CardTitle>
          <CardDescription>
            Chúng tôi đã gửi link xác thực đến <strong>{email}</strong>. Vui
            lòng kiểm tra hộp thư và nhấn vào link để hoàn tất đăng ký.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tạo tài khoản</CardTitle>
        <CardDescription>Bắt đầu tạo thiệp cưới của bạn</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {serverError && <p className="text-sm text-red-600">{serverError}</p>}
          <div className="space-y-1">
            <Label htmlFor="name">Tên</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nguyễn Văn An"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="an@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Mật khẩu</Label>
            <PasswordInput
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ít nhất 8 ký tự"
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </Button>
          <p className="text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Đăng nhập
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
