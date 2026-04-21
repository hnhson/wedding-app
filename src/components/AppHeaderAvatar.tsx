'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { LogOut, User, LayoutDashboard } from 'lucide-react';

interface Props {
  avatarUrl?: string;
  email: string;
  initial: string;
}

export default function AppHeaderAvatar({ avatarUrl, email, initial }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        title={email}
        className="flex items-center gap-2.5 rounded-full py-1 pr-3 pl-1 transition-colors hover:bg-gray-100"
      >
        <span className="flex-shrink-0 overflow-hidden rounded-full ring-2 ring-transparent transition-all hover:ring-gray-300">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="h-7 w-7 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">
              {initial}
            </div>
          )}
        </span>
        <span className="hidden max-w-[160px] truncate text-sm text-gray-600 sm:block">
          {email}
        </span>
      </button>

      {open && (
        <div className="absolute top-[calc(100%+8px)] right-0 z-50 min-w-[200px] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
          <div className="border-b px-4 py-3">
            <p className="truncate text-xs text-gray-400">{email}</p>
          </div>

          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
          >
            <LayoutDashboard size={15} className="text-gray-400" />
            Tổng quan
          </Link>
          <Link
            href="/dashboard/account"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
          >
            <User size={15} className="text-gray-400" />
            Tài khoản
          </Link>

          <div className="border-t" />

          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut size={15} />
              Đăng xuất
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
