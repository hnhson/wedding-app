import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RegisterPage from './page'

// Mock Supabase browser client
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signUp: vi.fn().mockResolvedValue({ data: {}, error: null }),
    },
  })),
}))

describe('RegisterPage', () => {
  it('renders the registration form', () => {
    render(<RegisterPage />)
    expect(screen.getByLabelText(/tên/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mật khẩu/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /đăng ký/i })).toBeInTheDocument()
  })

  it('shows validation errors when submitting empty form', async () => {
    render(<RegisterPage />)
    await userEvent.click(screen.getByRole('button', { name: /đăng ký/i }))
    expect(await screen.findByText('Tên là bắt buộc')).toBeInTheDocument()
    expect(await screen.findByText('Email là bắt buộc')).toBeInTheDocument()
    expect(await screen.findByText('Mật khẩu là bắt buộc')).toBeInTheDocument()
  })

  it('shows success message after valid submission', async () => {
    render(<RegisterPage />)
    await userEvent.type(screen.getByLabelText(/tên/i), 'An Nguyen')
    await userEvent.type(screen.getByLabelText(/email/i), 'an@example.com')
    await userEvent.type(screen.getByLabelText(/mật khẩu/i), 'securepassword')
    await userEvent.click(screen.getByRole('button', { name: /đăng ký/i }))
    expect(await screen.findByText(/kiểm tra email/i)).toBeInTheDocument()
  })
})
