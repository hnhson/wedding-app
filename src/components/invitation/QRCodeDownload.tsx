'use client';

import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface Props {
  url: string;
  slug: string;
}

export default function QRCodeDownload({ url, slug }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, url, { width: 200, margin: 2 });
  }, [url]);

  function handleDownload() {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `thiep-cuoi-${slug}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <canvas ref={canvasRef} />
      <button
        onClick={handleDownload}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
      >
        Tải QR Code
      </button>
    </div>
  );
}
