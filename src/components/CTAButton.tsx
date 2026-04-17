'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import NewCardDialog from '@/components/dashboard/NewCardDialog';

const LoginModal = dynamic(() => import('./LoginModal'), { ssr: false });
const RegisterModal = dynamic(() => import('./RegisterModal'), { ssr: false });

type Modal = 'login' | 'register' | null;

interface Props {
  isLoggedIn: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function CTAButton({ isLoggedIn, className, children }: Props) {
  const [modal, setModal] = useState<Modal>(null);

  if (isLoggedIn) {
    return (
      <NewCardDialog
        trigger={
          <button
            className={className}
            style={{ fontFamily: 'inherit', border: 'none', cursor: 'pointer' }}
          >
            {children}
          </button>
        }
      />
    );
  }

  return (
    <>
      <button
        onClick={() => setModal('register')}
        className={className}
        style={{ fontFamily: 'inherit', border: 'none', cursor: 'pointer' }}
      >
        {children}
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
