import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ForgotPasswordPage from './page';

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      resetPasswordForEmail: vi.fn().mockResolvedValue({ error: null }),
    },
  })),
}));

describe('ForgotPasswordPage', () => {
  it('renders email input and submit button', () => {
    render(<ForgotPasswordPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /gửi link/i }),
    ).toBeInTheDocument();
  });

  it('shows error for empty email', async () => {
    render(<ForgotPasswordPage />);
    await userEvent.click(screen.getByRole('button', { name: /gửi link/i }));
    expect(await screen.findByText('Email là bắt buộc')).toBeInTheDocument();
  });

  it('shows confirmation message after valid submit', async () => {
    render(<ForgotPasswordPage />);
    await userEvent.type(screen.getByLabelText(/email/i), 'an@example.com');
    await userEvent.click(screen.getByRole('button', { name: /gửi link/i }));
    expect(await screen.findByText(/đã gửi/i)).toBeInTheDocument();
  });
});
