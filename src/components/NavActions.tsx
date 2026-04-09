'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const LoginModal = dynamic(() => import('./LoginModal'), { ssr: false });
const AvatarDropdown = dynamic(() => import('./AvatarDropdown'), { ssr: false });

interface Props {
  user: {
    email?: string;
    avatarUrl?: string;
    initial: string;
  } | null;
}

export default function NavActions({ user }: Props) {
  const [showLogin, setShowLogin] = useState(false);

  if (user) {
    return (
      <AvatarDropdown
        avatarUrl={user.avatarUrl}
        email={user.email ?? ''}
        initial={user.initial}
      />
    );
  }

  return (
    <>
      <button
        onClick={() => setShowLogin(true)}
        className="landing-nav-link"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          fontFamily: 'inherit',
          fontSize: '0.875rem',
          fontWeight: 400,
          color: '#6b6460',
        }}
      >
        Đăng nhập
      </button>
      <Link href="/register" className="landing-btn-sm">
        Bắt đầu miễn phí
      </Link>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}
