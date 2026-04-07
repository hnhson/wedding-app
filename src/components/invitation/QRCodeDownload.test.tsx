import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import QRCodeDownload from './QRCodeDownload';

vi.mock('qrcode', () => ({
  default: { toCanvas: vi.fn().mockResolvedValue(undefined) },
}));

describe('QRCodeDownload', () => {
  it('renders a canvas element', () => {
    render(
      <QRCodeDownload
        url="https://example.com/invitation/an-binh-2025"
        slug="an-binh-2025"
      />,
    );
    expect(document.querySelector('canvas')).toBeTruthy();
  });

  it('renders the download button', () => {
    render(
      <QRCodeDownload
        url="https://example.com/invitation/an-binh-2025"
        slug="an-binh-2025"
      />,
    );
    expect(
      screen.getByRole('button', { name: /tải qr code/i }),
    ).toBeInTheDocument();
  });
});
