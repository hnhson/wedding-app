import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RSVPForm from './RSVPForm';

describe('RSVPForm', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders name field and attendance buttons', () => {
    render(<RSVPForm cardId="card-123" />);
    expect(screen.getByLabelText(/họ tên/i)).toBeInTheDocument();
    expect(screen.getByText(/tôi sẽ tham dự/i)).toBeInTheDocument();
    expect(screen.getByText(/tôi không thể đến/i)).toBeInTheDocument();
  });

  it('shows error when submitting without name or attendance', async () => {
    render(<RSVPForm cardId="card-123" />);
    fireEvent.click(screen.getByRole('button', { name: /^xác nhận$/i }));
    await waitFor(() => {
      expect(screen.getByText(/vui lòng điền tên/i)).toBeInTheDocument();
    });
  });

  it('shows guest count field only when attending is selected', () => {
    render(<RSVPForm cardId="card-123" />);
    expect(
      screen.queryByLabelText(/số người tham dự/i),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByText(/tôi sẽ tham dự/i));
    expect(screen.getByLabelText(/số người tham dự/i)).toBeInTheDocument();
  });

  it('shows success state after successful submission', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: '1', name: 'An', attending: true }),
      }),
    );
    render(<RSVPForm cardId="card-123" />);
    fireEvent.change(screen.getByLabelText(/họ tên/i), {
      target: { value: 'Nguyễn A' },
    });
    fireEvent.click(screen.getByText(/tôi sẽ tham dự/i));
    fireEvent.click(screen.getByRole('button', { name: /^xác nhận$/i }));
    await waitFor(() => {
      expect(screen.getByText(/cảm ơn bạn đã xác nhận/i)).toBeInTheDocument();
    });
  });
});
