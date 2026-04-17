'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import NewCardDialog from '@/components/dashboard/NewCardDialog';

const LoginModal = dynamic(() => import('./LoginModal'), { ssr: false });
const RegisterModal = dynamic(() => import('./RegisterModal'), { ssr: false });

type Modal = 'login' | 'register' | null;

interface Props {
  isLoggedIn: boolean;
}

export default function HeroActions({ isLoggedIn }: Props) {
  const [modal, setModal] = useState<Modal>(null);

  if (isLoggedIn) {
    return (
      <NewCardDialog
        trigger={
          <button
            className="landing-btn-primary"
            style={{ fontFamily: 'inherit', border: 'none', cursor: 'pointer' }}
          >
            Tạo thiệp ngay
          </button>
        }
      />
    );
  }

  return (
    <>
      <button
        onClick={() => setModal('register')}
        className="landing-btn-primary"
        style={{ fontFamily: 'inherit', border: 'none', cursor: 'pointer' }}
      >
        Bắt đầu miễn phí
      </button>
      <button
        onClick={() => setModal('login')}
        className="landing-btn-ghost"
        style={{ fontFamily: 'inherit' }}
      >
        Đăng nhập
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
