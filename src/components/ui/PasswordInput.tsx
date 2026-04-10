'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export default function PasswordInput({ className, ...props }: Props) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={show ? 'text' : 'password'}
        className={cn(
          'border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 pr-9 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 transition-colors"
        tabIndex={-1}
        aria-label={show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}
