import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import GuestbookSection from './GuestbookSection'

describe('GuestbookSection', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    }))
  })

  it('renders name and message fields', () => {
    render(<GuestbookSection cardId="card-123" />)
    expect(screen.getByLabelText(/họ tên/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/lời chúc/i)).toBeInTheDocument()
  })

  it('shows error if fields are empty on submit', async () => {
    render(<GuestbookSection cardId="card-123" />)
    fireEvent.click(screen.getByRole('button', { name: /gửi lời chúc/i }))
    await waitFor(() => {
      expect(screen.getByText(/vui lòng điền đầy đủ/i)).toBeInTheDocument()
    })
  })

  it('shows success state after submission', async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // GET wishes on mount
      .mockResolvedValueOnce({                                              // POST wish
        ok: true,
        json: () => Promise.resolve({
          id: '1', name: 'Nguyễn A', message: 'Chúc mừng', created_at: new Date().toISOString(),
        }),
      })
    vi.stubGlobal('fetch', mockFetch)

    render(<GuestbookSection cardId="card-123" />)
    fireEvent.change(screen.getByLabelText(/họ tên/i), { target: { value: 'Nguyễn A' } })
    fireEvent.change(screen.getByLabelText(/lời chúc/i), { target: { value: 'Chúc mừng hạnh phúc' } })
    fireEvent.click(screen.getByRole('button', { name: /gửi lời chúc/i }))
    await waitFor(() => {
      expect(screen.getByText(/lời chúc của bạn đã được gửi/i)).toBeInTheDocument()
    })
  })

  it('renders existing wishes fetched on mount', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([
        { id: '1', name: 'Trần B', message: 'Hạnh phúc mãi mãi', created_at: '2025-06-01T00:00:00Z' },
      ]),
    }))
    render(<GuestbookSection cardId="card-123" />)
    await waitFor(() => {
      expect(screen.getByText('Trần B')).toBeInTheDocument()
      expect(screen.getByText('Hạnh phúc mãi mãi')).toBeInTheDocument()
    })
  })
})
