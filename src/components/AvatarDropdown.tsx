'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Props {
  avatarUrl?: string;
  email: string;
  initial: string;
}

const menuItems = [
  { href: '/dashboard', icon: '◎', label: 'Tổng quan' },
  { href: '/dashboard', icon: '✦', label: 'Thiệp của tôi' },
  { href: '/dashboard/account', icon: '◈', label: 'Quản lý tài khoản' },
];

export default function AvatarDropdown({ avatarUrl, email, initial }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
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
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex' }}>
      {/* Avatar button */}
      <button
        onClick={() => setOpen((v) => !v)}
        title={email}
        aria-haspopup="true"
        aria-expanded={open}
        className="avatar-trigger"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="landing-avatar-img" />
        ) : (
          <div className="landing-avatar-initial">{initial}</div>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="avatar-dropdown" role="menu">
          {/* User info */}
          <div className="avatar-dropdown-header">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="dropdown-avatar-img" />
            ) : (
              <div className="dropdown-avatar-initial">{initial}</div>
            )}
            <span className="dropdown-email">{email}</span>
          </div>

          <div className="avatar-dropdown-divider" />

          {/* Menu items */}
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              role="menuitem"
              className="avatar-dropdown-item"
              onClick={() => setOpen(false)}
            >
              <span className="dropdown-item-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}

          <div className="avatar-dropdown-divider" />

          {/* Sign out */}
          <form action="/api/auth/signout" method="post">
            <button type="submit" role="menuitem" className="avatar-dropdown-item avatar-dropdown-signout">
              <span className="dropdown-item-icon">→</span>
              Đăng xuất
            </button>
          </form>
        </div>
      )}

      <style>{`
        .avatar-trigger {
          display: inline-flex;
          align-items: center;
          border-radius: 50%;
          border: none;
          padding: 0;
          cursor: pointer;
          background: transparent;
          transition: box-shadow 0.2s;
        }
        .avatar-trigger:hover,
        .avatar-trigger[aria-expanded="true"] {
          box-shadow: 0 0 0 3px rgba(201,169,110,0.5);
        }
        .avatar-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          min-width: 220px;
          background: #fff;
          border: 1px solid rgba(26,23,20,0.09);
          border-radius: 14px;
          box-shadow: 0 8px 32px rgba(26,23,20,0.12), 0 2px 8px rgba(26,23,20,0.06);
          z-index: 100;
          overflow: hidden;
          animation: dropIn 0.15s ease;
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .avatar-dropdown-header {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.875rem 1rem;
        }
        .dropdown-avatar-img {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }
        .dropdown-avatar-initial {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #1a1714;
          color: #faf8f5;
          font-size: 0.8rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .dropdown-email {
          font-size: 0.78rem;
          color: #6b6460;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 150px;
        }
        .avatar-dropdown-divider {
          height: 1px;
          background: rgba(26,23,20,0.07);
          margin: 0;
        }
        .avatar-dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.7rem 1rem;
          font-size: 0.875rem;
          color: #1a1714;
          text-decoration: none;
          background: transparent;
          border: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          transition: background 0.15s;
          font-family: inherit;
        }
        .avatar-dropdown-item:hover {
          background: #faf8f5;
        }
        .avatar-dropdown-signout {
          color: #b04040;
        }
        .avatar-dropdown-signout:hover {
          background: #fff5f5;
        }
        .dropdown-item-icon {
          font-size: 0.8rem;
          color: #c9a96e;
          width: 16px;
          text-align: center;
          flex-shrink: 0;
        }
        .avatar-dropdown-signout .dropdown-item-icon {
          color: #b04040;
        }
      `}</style>
    </div>
  );
}
