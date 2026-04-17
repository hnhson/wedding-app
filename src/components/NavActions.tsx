'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const LoginModal = dynamic(() => import('./LoginModal'), { ssr: false });
const RegisterModal = dynamic(() => import('./RegisterModal'), { ssr: false });
const AvatarDropdown = dynamic(() => import('./AvatarDropdown'), {
  ssr: false,
});

type Modal = 'login' | 'register' | null;

interface Props {
  user: {
    email?: string;
    avatarUrl?: string;
    initial: string;
  } | null;
}

export default function NavActions({ user }: Props) {
  const [modal, setModal] = useState<Modal>(null);

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
        onClick={() => setModal('login')}
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
      <button
        onClick={() => setModal('register')}
        className="landing-btn-sm"
        style={{ fontFamily: 'inherit', border: 'none', cursor: 'pointer' }}
      >
        Bắt đầu miễn phí
      </button>

      {modal === 'login' && (
        <LoginModal
          onClose={() => setModal(null)}
          onSwitchToRegister={() => setModal('register')}
        />
      )}
      {modal === 'register' && (
        <RegisterModal
          onClose={() => setModal(null)}
          onSwitchToLogin={() => setModal('login')}
        />
      )}
    </>
  );
}
