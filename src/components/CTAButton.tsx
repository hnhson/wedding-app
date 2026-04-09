'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const LoginModal = dynamic(() => import('./LoginModal'), { ssr: false });

interface Props {
  isLoggedIn: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function CTAButton({ isLoggedIn, className, children }: Props) {
  const [showLogin, setShowLogin] = useState(false);

  if (isLoggedIn) {
    return (
      <Link href="/cards/new" className={className}>
        {children}
      </Link>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowLogin(true)}
        className={className}
        style={{ fontFamily: 'inherit', border: 'none', cursor: 'pointer' }}
      >
        {children}
      </button>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}
