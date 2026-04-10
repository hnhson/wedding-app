'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { validateEmail, validatePassword } from '@/lib/validation';

interface Props {
  onClose: () => void;
}

export default function LoginModal({ onClose }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  // Focus email on open
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    if (emailError || passwordError) {
      setErrors({
        email: emailError ?? undefined,
        password: passwordError ?? undefined,
      });
      return;
    }
    setErrors({});
    setServerError('');
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setServerError('Email hoặc mật khẩu không đúng');
      return;
    }
    router.refresh();
    router.push('/dashboard');
  }

  const content = (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="modal-backdrop"
        onClick={(e) => {
          if (e.target === backdropRef.current) onClose();
        }}
        aria-modal="true"
        role="dialog"
        aria-label="Đăng nhập"
      >
        {/* Box */}
        <div className="modal-box">
          {/* Close button */}
          <button className="modal-close" onClick={onClose} aria-label="Đóng">
            ✕
          </button>

          {/* Logo mark */}
          <div className="modal-logo">✦</div>

          <h2 className="modal-title">Đăng nhập</h2>
          <p className="modal-sub">Chào mừng trở lại</p>

          <form onSubmit={handleSubmit} className="modal-form">
            {serverError && <p className="modal-error-server">{serverError}</p>}

            <div className="modal-field">
              <label htmlFor="m-email" className="modal-label">
                Email
              </label>
              <input
                ref={emailRef}
                id="m-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="an@example.com"
                className={`modal-input ${errors.email ? 'modal-input-err' : ''}`}
              />
              {errors.email && <p className="modal-error">{errors.email}</p>}
            </div>

            <div className="modal-field">
              <div className="modal-label-row">
                <label htmlFor="m-password" className="modal-label">
                  Mật khẩu
                </label>
                <Link
                  href="/forgot-password"
                  className="modal-forgot"
                  onClick={onClose}
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="m-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`modal-input ${errors.password ? 'modal-input-err' : ''}`}
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#9e9590',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p className="modal-error">{errors.password}</p>
              )}
            </div>

            <button type="submit" disabled={loading} className="modal-btn">
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <p className="modal-register">
            Chưa có tài khoản?{' '}
            <Link
              href="/register"
              className="modal-register-link"
              onClick={onClose}
            >
              Đăng ký miễn phí
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: rgba(26, 23, 20, 0.55);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: fadeIn 0.18s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .modal-box {
          position: relative;
          background: #fff;
          border-radius: 20px;
          padding: 2.5rem 2.25rem 2rem;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 24px 64px rgba(26,23,20,0.22);
          animation: slideUp 0.2s ease;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: none;
          background: #f3f0ec;
          color: #6b6460;
          font-size: 0.75rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
        }
        .modal-close:hover { background: #e8e3dd; color: #1a1714; }
        .modal-logo {
          font-size: 1.4rem;
          color: #c9a96e;
          text-align: center;
          margin-bottom: 1rem;
          letter-spacing: 0.2em;
        }
        .modal-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.6rem;
          font-weight: 600;
          color: #1a1714;
          text-align: center;
          margin-bottom: 0.3rem;
        }
        .modal-sub {
          font-size: 0.875rem;
          color: #9e9590;
          text-align: center;
          margin-bottom: 1.75rem;
          font-weight: 300;
        }
        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }
        .modal-field {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .modal-label {
          font-size: 0.8rem;
          font-weight: 500;
          color: #3a3430;
        }
        .modal-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .modal-forgot {
          font-size: 0.75rem;
          color: #b5896a;
          text-decoration: none;
        }
        .modal-forgot:hover { text-decoration: underline; }
        .modal-input {
          width: 100%;
          padding: 0.7rem 0.9rem;
          border: 1px solid rgba(26,23,20,0.15);
          border-radius: 10px;
          font-size: 0.9rem;
          color: #1a1714;
          background: #faf8f5;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          font-family: inherit;
          box-sizing: border-box;
        }
        .modal-input:focus {
          border-color: #c9a96e;
          box-shadow: 0 0 0 3px rgba(201,169,110,0.15);
          background: #fff;
        }
        .modal-input-err { border-color: #e05555; }
        .modal-error {
          font-size: 0.75rem;
          color: #e05555;
          margin: 0;
        }
        .modal-error-server {
          font-size: 0.82rem;
          color: #e05555;
          background: #fff5f5;
          border: 1px solid #ffd0d0;
          border-radius: 8px;
          padding: 0.6rem 0.75rem;
          margin: 0;
        }
        .modal-btn {
          width: 100%;
          padding: 0.85rem;
          background: #1a1714;
          color: #faf8f5;
          border: none;
          border-radius: 100px;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
          margin-top: 0.25rem;
        }
        .modal-btn:hover:not(:disabled) {
          background: #3a3430;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(26,23,20,0.18);
        }
        .modal-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .modal-register {
          text-align: center;
          font-size: 0.82rem;
          color: #9e9590;
          margin: 0;
        }
        .modal-register-link {
          color: #b5896a;
          text-decoration: none;
          font-weight: 500;
        }
        .modal-register-link:hover { text-decoration: underline; }
      `}</style>
    </>
  );

  return createPortal(content, document.body);
}
