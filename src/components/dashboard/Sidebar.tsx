'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Star,
  PenLine,
  Mail,
  Globe,
  MessageSquare,
  Gift,
  User,
  MessageCircle,
  LogOut,
  ClipboardList,
} from 'lucide-react';
import NewCardDialog from '@/components/dashboard/NewCardDialog';

const sections = [
  {
    label: 'HOME',
    items: [
      {
        href: '/dashboard',
        icon: LayoutDashboard,
        label: 'Tổng quan',
        exact: true,
      },
      { href: '/dashboard/plans', icon: Star, label: 'Gói dịch vụ của tôi' },
    ],
  },
  {
    label: 'THIẾT KẾ CỦA TÔI',
    items: [
      { href: '/dashboard/cards', icon: Mail, label: 'Thiệp online' },
      { href: '/dashboard/websites', icon: Globe, label: 'Website khác' },
    ],
  },
  {
    label: 'KHÁCH MỜI',
    items: [
      { href: '/dashboard/rsvp', icon: ClipboardList, label: 'Thống kê RSVP' },
      { href: '/dashboard/wishes', icon: MessageSquare, label: 'Lời chúc' },
      { href: '/dashboard/gifts', icon: Gift, label: 'Quà tặng' },
    ],
  },
  {
    label: 'TÀI KHOẢN',
    items: [
      { href: '/dashboard/account', icon: User, label: 'Thông tin cá nhân' },
    ],
  },
  {
    label: 'HỖ TRỢ',
    items: [
      {
        href: '/dashboard/feedback',
        icon: MessageCircle,
        label: 'Đóng góp ý kiến',
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <aside className="hidden w-56 flex-shrink-0 border-r bg-white lg:flex lg:flex-col">
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {sections.map((section) => (
          <div key={section.label} className="mb-4">
            <p className="mb-1 px-2 text-[10px] font-semibold tracking-widest text-gray-400">
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href, item.exact);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                        active
                          ? 'bg-blue-500 font-medium text-white'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon size={16} strokeWidth={active ? 2.5 : 1.8} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              {section.label === 'HOME' && (
                <li>
                  <NewCardDialog
                    trigger={
                      <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900">
                        <PenLine size={16} strokeWidth={1.8} />
                        Tạo thiết kế
                      </button>
                    }
                  />
                </li>
              )}
            </ul>
            <div className="mt-3 border-t" />
          </div>
        ))}
      </nav>

      {/* Sign out */}
      <div className="border-t px-3 py-3">
        <form action="/api/auth/signout" method="post">
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={16} strokeWidth={1.8} />
            Đăng xuất
          </button>
        </form>
      </div>
    </aside>
  );
}
