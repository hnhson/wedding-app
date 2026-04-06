import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from './page'

const mockRouter = { push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => '/',
  redirect: vi.fn(),
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
    },
  })),
}))

describe('LoginPage', () => {
  it('renders email and password fields', () => {
    render(<LoginPage />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mật khẩu/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /đăng nhập/i })).toBeInTheDocument()
  })

  it('shows validation errors on empty submit', async () => {
    render(<LoginPage />)
    await userEvent.click(screen.getByRole('button', { name: /đăng nhập/i }))
    expect(await screen.findByText('Email là bắt buộc')).toBeInTheDocument()
    expect(await screen.findByText('Mật khẩu là bắt buộc')).toBeInTheDocument()
  })

  it('redirects to dashboard on successful login', async () => {
    render(<LoginPage />)
    await userEvent.type(screen.getByLabelText(/email/i), 'an@example.com')
    await userEvent.type(screen.getByLabelText(/mật khẩu/i), 'securepassword')
    await userEvent.click(screen.getByRole('button', { name: /đăng nhập/i }))
    await vi.waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard')
    })
  })
})
