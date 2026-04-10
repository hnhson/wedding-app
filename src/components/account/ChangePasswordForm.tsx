'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import PasswordInput from '@/components/ui/PasswordInput';

function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const backdropRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!currentPassword) {
      setError('Vui lòng nhập mật khẩu hiện tại');
      return;
    }
    if (newPassword.length < 8) {
      setError('Mật khẩu mới phải có ít nhất 8 ký tự');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { data: userData } = await supabase.auth.getUser();
    const email = userData.user?.email ?? '';
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });

    if (signInErr) {
      setLoading(false);
      setError('Mật khẩu hiện tại không đúng');
      return;
    }

    const { error: updateErr } = await supabase.auth.updateUser({
      password: newPassword,
    });
    setLoading(false);

    if (updateErr) {
      setError(updateErr.message);
    } else {
      setSuccess(true);
      setTimeout(() => onClose(), 2000);
    }
  }

  return createPortal(
    <>
      <div
        ref={backdropRef}
        onClick={(e) => {
          if (e.target === backdropRef.current) onClose();
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Đổi mật khẩu"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          background: 'rgba(26,23,20,0.5)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          animation: 'cpFadeIn 0.18s ease',
        }}
      >
        <div
          style={{
            position: 'relative',
            background: '#fff',
            borderRadius: '20px',
            padding: '2.5rem 2.25rem 2rem',
            width: '100%',
            maxWidth: '420px',
            boxShadow: '0 24px 64px rgba(26,23,20,0.22)',
            animation: 'cpSlideUp 0.2s ease',
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Đóng"
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              border: 'none',
              background: '#f3f0ec',
              color: '#6b6460',
              fontSize: '0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>

          <div
            style={{
              fontSize: '1.4rem',
              color: '#c9a96e',
              textAlign: 'center',
              marginBottom: '1rem',
            }}
          >
            ✦
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#1a1714',
              textAlign: 'center',
              marginBottom: '0.25rem',
            }}
          >
            Đổi mật khẩu
          </h2>
          <p
            style={{
              fontSize: '0.875rem',
              color: '#9e9590',
              textAlign: 'center',
              marginBottom: '1.75rem',
              fontWeight: 300,
            }}
          >
            Nhập mật khẩu hiện tại để xác nhận
          </p>

          {success ? (
            <div
              style={{
                textAlign: 'center',
                padding: '1.5rem 0',
                color: '#16a34a',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✓</div>
              <p style={{ fontWeight: 500 }}>Đổi mật khẩu thành công!</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              {error && (
                <p
                  style={{
                    fontSize: '0.82rem',
                    color: '#e05555',
                    background: '#fff5f5',
                    border: '1px solid #ffd0d0',
                    borderRadius: '8px',
                    padding: '0.6rem 0.75rem',
                    margin: 0,
                  }}
                >
                  {error}
                </p>
              )}

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                }}
              >
                <Label htmlFor="cp-current">Mật khẩu hiện tại</Label>
                <PasswordInput
                  id="cp-current"
                  ref={firstInputRef}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Nhập mật khẩu hiện tại"
                  autoComplete="current-password"
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                }}
              >
                <Label htmlFor="cp-new">Mật khẩu mới</Label>
                <PasswordInput
                  id="cp-new"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Ít nhất 8 ký tự"
                  autoComplete="new-password"
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                }}
              >
                <Label htmlFor="cp-confirm">Xác nhận mật khẩu mới</Label>
                <PasswordInput
                  id="cp-confirm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  background: '#1a1714',
                  color: '#faf8f5',
                  border: 'none',
                  borderRadius: '100px',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  marginTop: '0.25rem',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                }}
              >
                {loading ? 'Đang xử lý...' : 'Xác nhận đổi mật khẩu'}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @keyframes cpFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes cpSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>,
    document.body,
  );
}

export default function ChangePasswordForm() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Đổi mật khẩu
      </Button>
      {open && <ChangePasswordModal onClose={() => setOpen(false)} />}
    </>
  );
}
