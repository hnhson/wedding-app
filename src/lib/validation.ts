export function validateEmail(email: string): string | null {
  if (!email) return 'Email là bắt buộc';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email không hợp lệ';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Mật khẩu là bắt buộc';
  if (password.length < 8) return 'Mật khẩu phải có ít nhất 8 ký tự';
  return null;
}

export function validateName(name: string): string | null {
  if (!name || !name.trim()) return 'Tên là bắt buộc';
  return null;
}
