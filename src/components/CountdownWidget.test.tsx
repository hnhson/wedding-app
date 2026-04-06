import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CountdownWidget from './CountdownWidget'

describe('CountdownWidget', () => {
  it('shows countdown for future date', () => {
    const futureDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    render(<CountdownWidget weddingDate={futureDate} />)
    expect(screen.getByText(/ngày/i)).toBeInTheDocument()
  })

  it('shows "ngày hạnh phúc" for past date', () => {
    render(<CountdownWidget weddingDate="2020-01-01" />)
    expect(screen.getByText(/ngày hạnh phúc/i)).toBeInTheDocument()
  })

  it('shows nothing for empty date', () => {
    const { container } = render(<CountdownWidget weddingDate="" />)
    expect(container.firstChild).toBeNull()
  })
})
