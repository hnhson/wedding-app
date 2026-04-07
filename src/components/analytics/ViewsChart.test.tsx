import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ViewsChart from './ViewsChart';
import type { DailyView } from '@/types/analytics';

describe('ViewsChart', () => {
  it('renders a bar for each day', () => {
    const days: DailyView[] = [
      { view_date: '2026-04-01', view_count: 3 },
      { view_date: '2026-04-02', view_count: 7 },
      { view_date: '2026-04-03', view_count: 1 },
    ];
    render(<ViewsChart days={days} />);
    expect(screen.getAllByTestId('views-bar')).toHaveLength(3);
  });

  it('shows date labels in MM-DD format', () => {
    const days: DailyView[] = [{ view_date: '2026-04-01', view_count: 5 }];
    render(<ViewsChart days={days} />);
    expect(screen.getByText('04-01')).toBeInTheDocument();
  });

  it('shows zero state when no data', () => {
    render(<ViewsChart days={[]} />);
    expect(screen.getByText(/chưa có lượt xem/i)).toBeInTheDocument();
  });

  it('shows view count above each bar', () => {
    const days: DailyView[] = [{ view_date: '2026-04-01', view_count: 42 }];
    render(<ViewsChart days={days} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });
});
