'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const LoginModal = dynamic(() => import('./LoginModal'), { ssr: false });

interface Props {
  isLoggedIn: boolean;
}

export default function HeroActions({ isLoggedIn }: Props) {
  const [showLogin, setShowLogin] = useState(false);

  if (isLoggedIn) {
    return (
      <Link href="/cards/new" className="landing-btn-primary">
        Tạo thiệp ngay
      </Link>
    );
  }

  return (
    <>
      <Link href="/register" className="landing-btn-primary">
        Tạo thiệp miễn phí
      </Link>
      <button
        onClick={() => setShowLogin(true)}
        className="landing-btn-ghost"
        style={{ fontFamily: 'inherit' }}
      >
        Đăng nhập
      </button>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}
